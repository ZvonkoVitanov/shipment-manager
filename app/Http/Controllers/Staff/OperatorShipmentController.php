<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Shipment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OperatorShipmentController extends Controller
{
    public function available(Request $request)
    {
        $query = Shipment::with(['client', 'operator'])
            ->whereNull('operator_id')
            ->whereNotIn('latest_status', [
                Shipment::STATUS_DELIVERED,
                Shipment::STATUS_RETURNED,
                Shipment::STATUS_CANCELLED,
            ]);

        if ($request->filled('search')) {
            $search = $request->search;

            $query->where(function ($q) use ($search) {
                $q->where('barcode', 'like', "%{$search}%")
                    ->orWhere('recipient_name', 'like', "%{$search}%")
                    ->orWhere('recipient_phone', 'like', "%{$search}%");
            });
        }

        if ($request->filled('city')) {
            $query->where('recipient_city', 'like', "%{$request->city}%");
        }

        if ($request->filled('status')) {
            $query->where('latest_status', $request->status);
        }

        $shipments = $query
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Staff/Shipments/Available', [
            'shipments' => $shipments,
            'filters' => [
                'search' => $request->search,
                'city' => $request->city,
                'status' => $request->status,
            ],
            'statuses' => [
                Shipment::STATUS_CREATED,
                Shipment::STATUS_PICKED_UP,
                Shipment::STATUS_IN_TRANSIT,
                Shipment::STATUS_OUT_FOR_DELIVERY,
            ],
        ]);
    }

    public function mine(Request $request)
    {
        $query = Shipment::with(['client', 'operator'])
            ->where('operator_id', auth()->id());

        if ($request->filled('search')) {
            $search = $request->search;

            $query->where(function ($q) use ($search) {
                $q->where('barcode', 'like', "%{$search}%")
                    ->orWhere('recipient_name', 'like', "%{$search}%")
                    ->orWhere('recipient_phone', 'like', "%{$search}%");
            });
        }

        if ($request->filled('city')) {
            $query->where('recipient_city', 'like', "%{$request->city}%");
        }

        if ($request->filled('status')) {
            $query->where('latest_status', $request->status);
        }

        $shipments = $query
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Staff/Shipments/Mine', [
            'shipments' => $shipments,
            'filters' => [
                'search' => $request->search,
                'city' => $request->city,
                'status' => $request->status,
            ],
            'statuses' => [
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
        $user = auth()->user();

        if (
            ! $user->isSuperAdmin() &&
            $shipment->operator_id !== $user->id
        ) {
            abort(403);
        }

        $shipment->load([
            'client',
            'operator',
            'statusHistories.changedBy',
        ]);

        return Inertia::render('Staff/Shipments/Show', [
            'shipment' => $shipment,
            'statuses' => auth()->user()->isSuperAdmin()
                ? [
                    Shipment::STATUS_PICKED_UP,
                    Shipment::STATUS_IN_TRANSIT,
                    Shipment::STATUS_OUT_FOR_DELIVERY,
                    Shipment::STATUS_DELIVERED,
                    Shipment::STATUS_RETURNED,
                    Shipment::STATUS_CANCELLED,
                ]
                : Shipment::allowedNextStatuses($shipment->latest_status),
        ]);
    }

    public function take(Shipment $shipment)
    {
        $user = auth()->user();

        if (! $user->isOperator() && ! $user->isSuperAdmin()) {
            abort(403);
        }

        if ($shipment->operator_id !== null) {
            return back()->with('error', 'This shipment is already assigned.');
        }

        if (in_array($shipment->latest_status, [
            Shipment::STATUS_DELIVERED,
            Shipment::STATUS_RETURNED,
            Shipment::STATUS_CANCELLED,
        ])) {
            return back()->with('error', 'This shipment is already finished.');
        }

        $shipment->update([
            'operator_id' => $user->id,
            'assigned_at' => now(),
            'latest_status' => Shipment::STATUS_PICKED_UP,
        ]);

        $shipment->statusHistories()->create([
            'changed_by_user_id' => $user->id,
            'status' => Shipment::STATUS_PICKED_UP,
            'changed_at' => now(),
            'note' => 'Shipment taken by operator.',
        ]);

        return redirect()
            ->route('staff.shipments.mine')
            ->with('success', 'Shipment assigned to you successfully.');
    }

    public function updateStatus(Request $request, Shipment $shipment)
    {
        $user = auth()->user();

        if (
            ! $user->isSuperAdmin() &&
            $shipment->operator_id !== $user->id
        ) {
            abort(403);
        }

        $validated = $request->validate([
            'status' => [
                'required',
                'in:picked_up,in_transit,out_for_delivery,delivered,returned,cancelled',
            ],
            'delivery_code' => ['nullable', 'string', 'size:6'],
            'note' => ['nullable', 'string'],
        ]);

        if (! $user->isSuperAdmin()) {
            $allowedNextStatuses = Shipment::allowedNextStatuses($shipment->latest_status);

            if (! in_array($validated['status'], $allowedNextStatuses)) {
                return back()->withErrors([
                    'status' => 'This status change is not allowed.',
                ]);
            }
        }

        if ($validated['status'] === Shipment::STATUS_DELIVERED) {
            if (($validated['delivery_code'] ?? null) !== $shipment->delivery_code) {
                return back()->withErrors([
                    'delivery_code' => 'Invalid delivery confirmation code.',
                ]);
            }
        }

        $shipment->update([
            'latest_status' => $validated['status'],
            'delivered_verified_at' => $validated['status'] === Shipment::STATUS_DELIVERED
                ? now()
                : $shipment->delivered_verified_at,
        ]);

        $shipment->statusHistories()->create([
            'changed_by_user_id' => $user->id,
            'status' => $validated['status'],
            'changed_at' => now(),
            'note' => $validated['note'] ?? null,
        ]);

        return redirect()
            ->route('staff.shipments.show', $shipment)
            ->with('success', 'Shipment status updated successfully.');
    }
}
