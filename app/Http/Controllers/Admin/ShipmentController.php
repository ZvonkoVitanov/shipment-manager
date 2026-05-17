<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Shipment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShipmentController extends Controller
{
    public function index()
    {
        $shipments = Shipment::with('client.user')
            ->latest()
            ->get();

        return Inertia::render('Admin/Shipments/Index', [
            'shipments' => $shipments,
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
