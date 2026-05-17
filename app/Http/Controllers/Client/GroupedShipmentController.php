<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\GroupedShipment;
use App\Models\Shipment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class GroupedShipmentController extends Controller
{
    public function index()
    {
        $client = auth()->user()->client;

        $groupedShipments = $client->groupedShipments()
            ->withCount('shipments')
            ->latest()
            ->get();

        return Inertia::render('Client/GroupedShipments/Index', [
            'groupedShipments' => $groupedShipments,
        ]);
    }

    public function create()
    {
        $client = auth()->user()->client;

        $shipments = $client->shipments()
            ->whereNull('grouped_shipment_id')
            ->whereNotIn('latest_status', [
                Shipment::STATUS_DELIVERED,
                Shipment::STATUS_RETURNED,
                Shipment::STATUS_CANCELLED,
            ])
            ->latest()
            ->get();

        return Inertia::render('Client/GroupedShipments/Create', [
            'shipments' => $shipments,
        ]);
    }

    public function store(Request $request)
    {
        $client = auth()->user()->client;

        $validated = $request->validate([
            'shipment_ids' => ['required', 'array', 'min:2'],
            'shipment_ids.*' => ['required', 'integer', 'exists:shipments,id'],
            'discount_percentage' => ['required', 'numeric', 'min:0', 'max:100'],
        ]);

        $shipments = Shipment::whereIn('id', $validated['shipment_ids'])
            ->where('client_id', $client->id)
            ->whereNull('grouped_shipment_id')
            ->get();

        if ($shipments->count() !== count($validated['shipment_ids'])) {
            return back()->with('error', 'Some selected shipments are invalid or already grouped.');
        }

        $firstShipment = $shipments->first();

        $sameRecipientPhone = $shipments->every(
            fn ($shipment) => $shipment->recipient_phone === $firstShipment->recipient_phone
        );

        $samePickupLocation = $shipments->every(
            fn ($shipment) => $shipment->pickup_location === $firstShipment->pickup_location
        );

        if (! $sameRecipientPhone || ! $samePickupLocation) {
            return back()->with('error', 'Grouped shipments must have the same recipient phone and pickup location.');
        }

        $discountPercentage = (float) $validated['discount_percentage'];

        /**
         * For now we use ransom_amount as the calculation base.
         * Later, when you add real delivery prices, replace this with shipment delivery price.
         */
        $totalBeforeDiscount = $shipments->sum('ransom_amount');
        $totalDiscount = $totalBeforeDiscount * ($discountPercentage / 100);
        $totalAfterDiscount = $totalBeforeDiscount - $totalDiscount;

        DB::transaction(function () use (
            $client,
            $shipments,
            $firstShipment,
            $discountPercentage,
            $totalBeforeDiscount,
            $totalDiscount,
            $totalAfterDiscount
        ) {
            $groupedShipment = GroupedShipment::create([
                'client_id' => $client->id,
                'recipient_name' => $firstShipment->recipient_name,
                'recipient_phone' => $firstShipment->recipient_phone,
                'pickup_location' => $firstShipment->pickup_location,
                'total_shipments' => $shipments->count(),
                'discount_percentage' => $discountPercentage,
                'total_price_before_discount' => $totalBeforeDiscount,
                'total_discount' => $totalDiscount,
                'total_price_after_discount' => $totalAfterDiscount,
                'status' => GroupedShipment::STATUS_CREATED,
            ]);

            Shipment::whereIn('id', $shipments->pluck('id'))
                ->update([
                    'grouped_shipment_id' => $groupedShipment->id,
                ]);
        });

        return redirect()
            ->route('client.grouped-shipments.index')
            ->with('success', 'Grouped shipment created successfully.');
    }

    public function show(GroupedShipment $groupedShipment)
    {
        $client = auth()->user()->client;

        if ($groupedShipment->client_id !== $client->id) {
            abort(403);
        }

        $groupedShipment->load('shipments');

        return Inertia::render('Client/GroupedShipments/Show', [
            'groupedShipment' => $groupedShipment,
        ]);
    }
}
