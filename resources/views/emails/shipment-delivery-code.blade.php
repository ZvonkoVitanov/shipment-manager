<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Shipment Tracking</title>
</head>
<body style="font-family: Arial, sans-serif; color: #111827;">
<h2>Your shipment has been created</h2>

<p>Hello {{ $shipment->recipient_name }},</p>

<p>Your shipment is registered in the delivery system.</p>

<p>
    <strong>Tracking link:</strong><br>
    <a href="{{ route('tracking.show', $shipment->barcode) }}">
        {{ route('tracking.show', $shipment->barcode) }}
    </a>
</p>

<p>
    <strong>Delivery confirmation code:</strong><br>
    <span style="font-size: 28px; font-weight: bold; letter-spacing: 5px;">
            {{ $shipment->delivery_code }}
        </span>
</p>

<p>
    Give this code only to the delivery operator when you receive the package.
</p>

<p style="font-size: 12px; color: #6b7280;">
    If you did not expect this shipment, please ignore this email.
</p>
</body>
</html>
