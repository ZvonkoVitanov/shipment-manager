<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShipmentStatusHistory extends Model
{
    protected $fillable = [
        'shipment_id',
        'changed_by_user_id',
        'status',
        'changed_at',
        'note',
    ];

    protected $casts = [
        'changed_at' => 'datetime',
    ];

    public function shipment()
    {
        return $this->belongsTo(Shipment::class);
    }

    public function changedBy()
    {
        return $this->belongsTo(User::class, 'changed_by_user_id');
    }
}
