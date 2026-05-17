<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    protected $fillable = [
        'user_id',
        'company_name',
        'contact_person',
        'contact_email',
        'contact_phone',
        'company_address',
        'warehouse_location',
        'default_pickup_location',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function shipments()
    {
        return $this->hasMany(Shipment::class);
    }
    public function shipmentImports()
    {
        return $this->hasMany(ShipmentImport::class);
    }
    public function groupedShipments()
    {
        return $this->hasMany(GroupedShipment::class);
    }
}
