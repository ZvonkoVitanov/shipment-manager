<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Shipment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Mail\ShipmentDeliveryCodeMail;
use Illuminate\Support\Facades\Mail;

class ShipmentController extends Controller
{
    public function index(Request $request)
    {
        $client = auth()->user()->client;

        $query = $client->shipments()
            ->latest();

        if ($request->filled('search')) {
            $search = $request->search;

            $query->where(function ($q) use ($search) {
                $q->where('barcode', 'like', "%{$search}%")
                    ->orWhere('recipient_name', 'like', "%{$search}%")
                    ->orWhere('recipient_phone', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('latest_status', $request->status);
        }

        if ($request->filled('city')) {
            $query->where('recipient_city', 'like', '%' . $request->city . '%');
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $shipments = $query
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Client/Shipments/Index', [
            'shipments' => $shipments,
            'filters' => [
                'search' => $request->search,
                'status' => $request->status,
                'city' => $request->city,
                'date_from' => $request->date_from,
                'date_to' => $request->date_to,
            ],
            'statuses' => [
                Shipment::STATUS_CREATED,
                Shipment::STATUS_PICKED_UP,
                Shipment::STATUS_IN_TRANSIT,
                Shipment::STATUS_OUT_FOR_DELIVERY,
                Shipment::STATUS_DELIVERED,
                Shipment::STATUS_RETURNED,
                Shipment::STATUS_CANCELLED,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Client/Shipments/Create');
    }

    public function store(Request $request)
    {
        $client = auth()->user()->client;

        $validated = $request->validate([
            'recipient_name' => ['required', 'string', 'max:255'],
            'recipient_address' => ['required', 'string', 'max:255'],
            'recipient_city' => ['required', 'string', 'max:255'],
            'delivery_post_office' => ['nullable', 'string', 'max:255'],
            'recipient_phone' => ['required', 'string', 'max:255'],
            'recipient_email' => ['nullable', 'email', 'max:255'],

            'ransom_amount' => ['nullable', 'numeric', 'min:0'],
            'invoice_number' => ['nullable', 'string', 'max:255'],
            'weight' => ['nullable', 'numeric', 'min:0'],

            'delivery_type' => ['required', 'in:home,post_office'],
            'pickup_type' => ['required', 'in:post_office,address'],
            'pickup_location' => ['nullable', 'string', 'max:255'],

            'note' => ['nullable', 'string'],
        ]);


        $shipment = Shipment::create([
            'client_id' => $client->id,
            'barcode' => $this->generateBarcode(),
            'delivery_code' => $this->generateDeliveryCode(),

            'recipient_name' => $validated['recipient_name'],
            'recipient_address' => $validated['recipient_address'],
            'recipient_city' => $validated['recipient_city'],
            'delivery_post_office' => $validated['delivery_post_office'] ?? null,
            'recipient_phone' => $validated['recipient_phone'],
            'recipient_email' => $validated['recipient_email'] ?? null,

            'ransom_amount' => $validated['ransom_amount'] ?? 0,
            'invoice_number' => $validated['invoice_number'] ?? null,
            'weight' => $validated['weight'] ?? null,

            'delivery_type' => $validated['delivery_type'],
            'pickup_type' => $validated['pickup_type'],
            'pickup_location' => $validated['pickup_location'] ?? null,

            'note' => $validated['note'] ?? null,
            'latest_status' => Shipment::STATUS_CREATED,
            'is_locked' => false,
        ]);

        $shipment->statusHistories()->create([
            'changed_by_user_id' => auth()->id(),
            'status' => Shipment::STATUS_CREATED,
            'changed_at' => now(),
            'note' => 'Shipment created by client.',
        ]);

        if ($shipment->recipient_email) {
            Mail::to($shipment->recipient_email)
                ->send(new ShipmentDeliveryCodeMail($shipment));
        }

        return redirect()
            ->route('client.shipments.index')
            ->with('success', 'Shipment created successfully.');
    }

    public function show(Shipment $shipment)
    {
        $client = auth()->user()->client;

        if ($shipment->client_id !== $client->id) {
            abort(403);
        }

        $shipment->load([
            'statusHistories.changedBy',
        ]);

        return Inertia::render('Client/Shipments/Show', [
            'shipment' => $shipment,
        ]);
    }

    public function label(Shipment $shipment)
    {
        $client = auth()->user()->client;

        if ($shipment->client_id !== $client->id) {
            abort(403);
        }

        $shipment->load('client');

        return Inertia::render('Client/Shipments/Label', [
            'shipment' => $shipment,
        ]);
    }
    private function generateBarcode(): string
    {
        $nextId = Shipment::max('id') + 1;

        return 'MKP-' . now()->year . '-' . str_pad($nextId, 6, '0', STR_PAD_LEFT);
    }
    private function generateDeliveryCode(): string
    {
        return (string) random_int(100000, 999999);
    }
}
