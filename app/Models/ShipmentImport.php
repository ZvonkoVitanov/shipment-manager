<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShipmentImport extends Model
{
    protected $fillable = [
        'client_id',
        'file_name',
        'status',
        'total_rows',
        'valid_rows',
        'invalid_rows',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function rows()
    {
        return $this->hasMany(ShipmentImportRow::class);
    }

    public function shipments()
    {
        return $this->hasMany(Shipment::class);
    }
}
