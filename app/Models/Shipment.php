<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Shipment extends Model
{
    public const STATUS_CREATED = 'created';
    public const STATUS_PICKED_UP = 'picked_up';
    public const STATUS_IN_TRANSIT = 'in_transit';
    public const STATUS_OUT_FOR_DELIVERY = 'out_for_delivery';
    public const STATUS_DELIVERED = 'delivered';
    public const STATUS_RETURNED = 'returned';
    public const STATUS_CANCELLED = 'cancelled';

    public const DELIVERY_HOME = 'home';
    public const DELIVERY_POST_OFFICE = 'post_office';

    public const PICKUP_POST_OFFICE = 'post_office';
    public const PICKUP_ADDRESS = 'address';

    protected $fillable = [
        'client_id',
        'barcode',
        'recipient_name',
        'recipient_address',
        'recipient_city',
        'delivery_post_office',
        'recipient_phone',
        'ransom_amount',
        'invoice_number',
        'weight',
        'delivery_type',
        'pickup_type',
        'pickup_location',
        'note',
        'latest_status',
        'payment_method',
        'postman_code',
        'counter_code',
        'is_locked',
        'shipment_import_id',
        'grouped_shipment_id',
    ];

    protected $casts = [
        'ransom_amount' => 'decimal:2',
        'weight' => 'decimal:2',
        'is_locked' => 'boolean',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function statusHistories()
    {
        return $this->hasMany(ShipmentStatusHistory::class);
    }

    public function import()
    {
        return $this->belongsTo(ShipmentImport::class, 'shipment_import_id');
    }

    public function groupedShipment()
    {
        return $this->belongsTo(GroupedShipment::class);
    }
}
