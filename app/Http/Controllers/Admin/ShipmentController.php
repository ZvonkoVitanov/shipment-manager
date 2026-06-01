<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Shipment;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShipmentController extends Controller
{
    public function index(Request $request)
    {
        $query = Shipment::with(['client.user', 'operator'])
            ->latest();

        if ($request->filled('search')) {
            $search = $request->search;

            $query->where(function ($q) use ($search) {
                $q->where('barcode', 'like', "%{$search}%")
                    ->orWhere('recipient_name', 'like', "%{$search}%")
                    ->orWhere('recipient_phone', 'like', "%{$search}%");
            });
        }

        if ($request->filled('client_id')) {
            $query->where('client_id', $request->client_id);
        }

        if ($request->filled('operator_id')) {
            if ($request->operator_id === 'unassigned') {
                $query->whereNull('operator_id');
            } else {
                $query->where('operator_id', $request->operator_id);
            }
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

        $clients = Client::orderBy('company_name')
            ->get(['id', 'company_name']);

        $operators = User::where('role', User::ROLE_OPERATOR)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Admin/Shipments/Index', [
            'shipments' => $shipments,
            'clients' => $clients,
            'operators' => $operators,
            'filters' => [
                'search' => $request->search,
                'client_id' => $request->client_id,
                'operator_id' => $request->operator_id,
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

    public function show(Shipment $shipment)
    {
        $shipment->load([
            'client.user',
            'statusHistories.changedBy',
        ]);

        return Inertia::render('Admin/Shipments/Show', [
            'shipment' => $shipment,
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

    public function edit(Shipment $shipment)
    {
        $shipment->load(['client', 'operator']);

        return Inertia::render('Admin/Shipments/Edit', [
            'shipment' => $shipment,
        ]);
    }

    public function update(Request $request, Shipment $shipment)
    {
        if (! auth()->user()->isSuperAdmin()) {
            abort(403);
        }

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

        $shipment->update([
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
        ]);

        return redirect()
            ->route('admin.shipments.show', $shipment)
            ->with('success', 'Shipment details updated successfully.');
    }

    public function updateStatus(Request $request, Shipment $shipment)
    {
        $validated = $request->validate([
            'status' => [
                'required',
                'in:created,picked_up,in_transit,out_for_delivery,delivered,returned,cancelled',
            ],
            'note' => ['nullable', 'string'],
        ]);

        $shipment->update([
            'latest_status' => $validated['status'],
        ]);

        $shipment->statusHistories()->create([
            'changed_by_user_id' => auth()->id(),
            'status' => $validated['status'],
            'changed_at' => now(),
            'note' => $validated['note'] ?? null,
        ]);

        return redirect()
            ->route('admin.shipments.show', $shipment)
            ->with('success', 'Shipment status updated successfully.');
    }
}
