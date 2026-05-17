<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GroupedShipment extends Model
{
    public const STATUS_CREATED = 'created';
    public const STATUS_CONFIRMED = 'confirmed';
    public const STATUS_CANCELLED = 'cancelled';

    protected $fillable = [
        'client_id',
        'recipient_name',
        'recipient_phone',
        'pickup_location',
        'total_shipments',
        'discount_percentage',
        'total_price_before_discount',
        'total_discount',
        'total_price_after_discount',
        'status',
    ];

    protected $casts = [
        'discount_percentage' => 'decimal:2',
        'total_price_before_discount' => 'decimal:2',
        'total_discount' => 'decimal:2',
        'total_price_after_discount' => 'decimal:2',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function shipments()
    {
        return $this->hasMany(Shipment::class);
    }
}
