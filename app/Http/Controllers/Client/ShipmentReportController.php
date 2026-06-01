<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Shipment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ShipmentReportController extends Controller
{
    public function index(Request $request)
    {
        $client = auth()->user()->client;

        $query = $client->shipments()
            ->latest();

        if ($request->filled('status')) {
            $query->where('latest_status', $request->status);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        if ($request->filled('city')) {
            $query->where('recipient_city', 'like', '%' . $request->city . '%');
        }

        $totalsQuery = clone $query;

        $totals = [
            'total_shipments' => (clone $totalsQuery)->count(),
            'total_ransom' => (clone $totalsQuery)->sum('ransom_amount'),
        ];

        $shipments = $query
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Client/Reports/Shipments', [
            'shipments' => $shipments,
            'filters' => [
                'status' => $request->status,
                'date_from' => $request->date_from,
                'date_to' => $request->date_to,
                'city' => $request->city,
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
            'totals' => $totals,
        ]);
    }

    public function exportCsv(Request $request): StreamedResponse
    {
        $client = auth()->user()->client;

        $query = $client->shipments()
            ->latest();

        if ($request->filled('status')) {
            $query->where('latest_status', $request->status);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        if ($request->filled('city')) {
            $query->where('recipient_city', 'like', '%' . $request->city . '%');
        }

        $shipments = $query->get();

        $fileName = 'shipment_report_' . now()->format('Y_m_d_H_i_s') . '.csv';

        return response()->streamDownload(function () use ($shipments) {
            $handle = fopen('php://output', 'w');

            fputcsv($handle, [
                'Barcode',
                'Recipient',
                'Address',
                'City',
                'Phone',
                'Weight',
                'Ransom Amount',
                'Invoice Number',
                'Delivery Type',
                'Pickup Type',
                'Status',
                'Created At',
            ]);

            foreach ($shipments as $shipment) {
                fputcsv($handle, [
                    $shipment->barcode,
                    $shipment->recipient_name,
                    $shipment->recipient_address,
                    $shipment->recipient_city,
                    $shipment->recipient_phone,
                    $shipment->weight,
                    $shipment->ransom_amount,
                    $shipment->invoice_number,
                    $shipment->delivery_type,
                    $shipment->pickup_type,
                    $shipment->latest_status,
                    $shipment->created_at,
                ]);
            }

            fclose($handle);
        }, $fileName);
    }
}
