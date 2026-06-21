<?php

namespace App\Mail;

use App\Models\Shipment;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ShipmentDeliveryCodeMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Shipment $shipment)
    {
    }

    public function build()
    {
        return $this->subject('Shipment tracking and delivery confirmation code')
            ->view('emails.shipment-delivery-code');
    }
}
