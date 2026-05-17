<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Shipment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShipmentController extends Controller
{
    public function index()
    {
        $client = auth()->user()->client;

        $shipments = $client->shipments()
            ->latest()
            ->get();

        return Inertia::render('Client/Shipments/Index', [
            'shipments' => $shipments,
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

            'recipient_name' => $validated['recipient_name'],
            'recipient_address' => $validated['recipient_address'],
            'recipient_city' => $validated['recipient_city'],
            'delivery_post_office' => $validated['delivery_post_office'] ?? null,
            'recipient_phone' => $validated['recipient_phone'],

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
}
