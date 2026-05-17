<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShipmentImportRow extends Model
{
    protected $fillable = [
        'shipment_import_id',
        'row_number',
        'data',
        'errors',
        'is_valid',
    ];

    protected $casts = [
        'data' => 'array',
        'errors' => 'array',
        'is_valid' => 'boolean',
    ];

    public function import()
    {
        return $this->belongsTo(ShipmentImport::class, 'shipment_import_id');
    }
}
