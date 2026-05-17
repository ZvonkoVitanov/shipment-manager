<?php

namespace App\Http\Controllers;

use App\Models\Shipment;
use Inertia\Inertia;

class TrackingController extends Controller
{
    public function show(string $barcode)
    {
        $shipment = Shipment::with([
            'statusHistories.changedBy',
            'client',
        ])
            ->where('barcode', $barcode)
            ->firstOrFail();

        return Inertia::render('Tracking/Show', [
            'shipment' => $shipment,
        ]);
    }
}
