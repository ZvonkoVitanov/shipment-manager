<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\ShipmentImport;
use App\Models\ShipmentImportRow;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use App\Models\Shipment;
use Illuminate\Support\Facades\DB;

class ShipmentImportController extends Controller
{
    public function index()
    {
        $client = auth()->user()->client;

        $imports = $client->shipmentImports()
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Client/ShipmentImports/Index', [
            'imports' => $imports,
        ]);
    }

    public function create()
    {
        return Inertia::render('Client/ShipmentImports/Create');
    }

    public function preview(Request $request)
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:xlsx,xls,csv'],
        ]);

        $client = auth()->user()->client;

        $file = $request->file('file');

        $rows = Excel::toArray([], $file)[0];

        $header = array_map(
            fn ($value) => strtolower(trim((string) $value)),
            $rows[0] ?? []
        );

        $dataRows = array_slice($rows, 1);

        $shipmentImport = ShipmentImport::create([
            'client_id' => $client->id,
            'file_name' => $file->getClientOriginalName(),
            'status' => 'preview',
        ]);

        $totalRows = 0;
        $validRows = 0;
        $invalidRows = 0;

        foreach ($dataRows as $index => $row) {
            if ($this->isEmptyRow($row)) {
                continue;
            }

            $rowData = $this->mapRow($header, $row);
            $errors = $this->validateRow($rowData);

            $isValid = empty($errors);

            ShipmentImportRow::create([
                'shipment_import_id' => $shipmentImport->id,
                'row_number' => $index + 2,
                'data' => $rowData,
                'errors' => $errors ?: null,
                'is_valid' => $isValid,
            ]);

            $totalRows++;

            if ($isValid) {
                $validRows++;
            } else {
                $invalidRows++;
            }
        }

        $shipmentImport->update([
            'total_rows' => $totalRows,
            'valid_rows' => $validRows,
            'invalid_rows' => $invalidRows,
        ]);

        return redirect()->route('client.imports.show', $shipmentImport);
    }

    private function mapRow(array $header, array $row): array
    {
        $mapped = [];

        foreach ($header as $index => $columnName) {
            $mapped[$columnName] = $row[$index] ?? null;
        }

        return $mapped;
    }

    private function validateRow(array $data): array
    {
        $validator = Validator::make($data, [
            'recipient_name' => ['required', 'string', 'max:255'],
            'recipient_address' => ['required', 'string', 'max:255'],
            'recipient_city' => ['required', 'string', 'max:255'],
            'recipient_phone' => ['required'],
            'ransom_amount' => ['nullable', 'numeric', 'min:0'],
            'invoice_number' => ['nullable', 'string', 'max:255'],
            'weight' => ['nullable', 'numeric', 'min:0'],
            'delivery_type' => ['required', 'in:home,post_office'],
            'pickup_type' => ['required', 'in:post_office,address'],
            'pickup_location' => ['nullable', 'string', 'max:255'],
            'note' => ['nullable', 'string'],
        ]);

        return $validator->errors()->toArray();
    }

    public function show(ShipmentImport $import)
    {
        $client = auth()->user()->client;

        if ($import->client_id !== $client->id) {
            abort(403);
        }

        $import->load('rows');

        return Inertia::render('Client/ShipmentImports/Show', [
            'importRecord' => $import,
        ]);
    }

    public function confirm(ShipmentImport $import)
    {
        $client = auth()->user()->client;

        if ($import->client_id !== $client->id) {
            abort(403);
        }

        if ($import->status !== 'preview') {
            return redirect()
                ->route('client.imports.show', $import)
                ->with('error', 'This import has already been processed.');
        }

        if ($import->invalid_rows > 0) {
            return redirect()
                ->route('client.imports.show', $import)
                ->with('error', 'Cannot confirm import while there are invalid rows.');
        }

        DB::transaction(function () use ($import, $client) {
            $validRows = $import->rows()
                ->where('is_valid', true)
                ->get();

            foreach ($validRows as $row) {
                $data = $row->data;

                $shipment = Shipment::create([
                    'client_id' => $client->id,
                    'shipment_import_id' => $import->id,
                    'barcode' => $this->generateBarcode(),
                    'delivery_code' => $this->generateDeliveryCode(),

                    'recipient_name' => $data['recipient_name'],
                    'recipient_address' => $data['recipient_address'],
                    'recipient_city' => $data['recipient_city'],
                    'delivery_post_office' => $data['delivery_post_office'] ?? null,
                    'recipient_phone' => $data['recipient_phone'],

                    'ransom_amount' => $data['ransom_amount'] ?? 0,
                    'invoice_number' => $data['invoice_number'] ?? null,
                    'weight' => $data['weight'] ?? null,

                    'delivery_type' => $data['delivery_type'],
                    'pickup_type' => $data['pickup_type'],
                    'pickup_location' => $data['pickup_location'] ?? null,

                    'note' => $data['note'] ?? null,
                    'latest_status' => Shipment::STATUS_CREATED,
                    'is_locked' => true,
                ]);

                $shipment->statusHistories()->create([
                    'changed_by_user_id' => auth()->id(),
                    'status' => Shipment::STATUS_CREATED,
                    'changed_at' => now(),
                    'note' => 'Shipment created from Excel import.',
                ]);
            }

            $import->update([
                'status' => 'confirmed',
            ]);
        });

        return redirect()
            ->route('client.shipments.index')
            ->with('success', 'Import confirmed and shipments created successfully.');
    }
    private function isEmptyRow(array $row): bool
    {
        foreach ($row as $cell) {
            if ($cell !== null && trim((string) $cell) !== '') {
                return false;
            }
        }

        return true;
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
