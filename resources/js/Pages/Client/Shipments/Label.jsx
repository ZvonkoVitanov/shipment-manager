import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import Barcode from 'react-barcode';
import { QRCodeSVG } from 'qrcode.react';

export default function Label({ shipment }) {
    function printLabel() {
        window.print();
    }

    return (
        <>
            <Head title={`Label ${shipment.barcode}`} />

            <div className="py-12 print:py-0">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8 print:max-w-none print:px-0">
                    <div className="mb-6 flex items-center justify-between print:hidden">
                        <div>
                            <Link
                                href={route('client.shipments.show', shipment.id)}
                                className="text-sm font-semibold text-blue-600 hover:text-blue-800"
                            >
                                ← Back to shipment
                            </Link>

                            <h1 className="mt-4 text-2xl font-bold text-gray-900">
                                Address Label
                            </h1>

                            <p className="mt-1 text-sm text-gray-600">
                                Print this label and attach it to the package.
                            </p>
                        </div>

                        <Link
                            href={route('tracking.show', shipment.barcode)}
                            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
                        >
                            Public Shipment Tracking
                        </Link>

                        <button
                            type="button"
                            onClick={printLabel}
                            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
                        >
                            Print Label
                        </button>
                    </div>

                    <div className="bg-white p-8 shadow-sm sm:rounded-lg print:shadow-none print:rounded-none">
                        <div className="mx-auto w-[420px] border-2 border-gray-900 p-5 print:w-full">
                            <div className="border-b-2 border-gray-900 pb-3 text-center">
                                <h2 className="text-xl font-black tracking-wide">
                                    A.D. POSTA
                                </h2>
                                <p className="text-xs font-semibold uppercase tracking-wider">
                                    Shipment Address Label
                                </p>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs font-bold uppercase text-gray-500">
                                        Barcode
                                    </p>

                                    <div className="mt-1 flex h-20 items-center justify-center border border-gray-900 bg-white p-1">
                                        <Barcode
                                            value={shipment.barcode}
                                            format="CODE128"
                                            width={1.5}
                                            height={45}
                                            displayValue={false}
                                            margin={0}
                                        />
                                    </div>

                                    <p className="mt-1 text-center font-mono text-sm font-bold">
                                        {shipment.barcode}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-bold uppercase text-gray-500">
                                        QR Code
                                    </p>

                                    <div className="mt-1 flex h-20 items-center justify-center border border-gray-900 bg-white p-1">
                                        <QRCodeSVG
                                            value={route('tracking.show', shipment.barcode)}
                                            size={70}
                                            level="M"
                                        />
                                    </div>

                                    <p className="mt-1 text-center text-xs text-gray-600">
                                        Scan for tracking
                                    </p>
                                </div>
                            </div>

                            <div className="mt-5 border-t border-gray-300 pt-4">
                                <p className="text-xs font-bold uppercase text-gray-500">
                                    Recipient
                                </p>

                                <p className="mt-1 text-lg font-bold text-gray-900">
                                    {shipment.recipient_name}
                                </p>

                                <p className="text-sm text-gray-800">
                                    {shipment.recipient_address}
                                </p>

                                <p className="text-sm text-gray-800">
                                    {shipment.recipient_city}
                                    {shipment.delivery_post_office
                                        ? `, ${shipment.delivery_post_office}`
                                        : ''}
                                </p>

                                <p className="mt-1 text-sm font-semibold text-gray-900">
                                    Tel: {shipment.recipient_phone}
                                </p>
                            </div>

                            <div className="mt-5 border-t border-gray-300 pt-4">
                                <p className="text-xs font-bold uppercase text-gray-500">
                                    Sender / Client
                                </p>

                                <p className="mt-1 text-sm font-bold text-gray-900">
                                    {shipment.client?.company_name}
                                </p>

                                <p className="text-sm text-gray-800">
                                    Pickup: {shipment.pickup_location || shipment.client?.default_pickup_location || '-'}
                                </p>
                            </div>

                            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-gray-300 pt-4 text-sm">
                                <Info label="Weight" value={shipment.weight ? `${shipment.weight} kg` : '-'} />
                                <Info label="Delivery" value={formatText(shipment.delivery_type)} />
                                <Info label="Pickup Type" value={formatText(shipment.pickup_type)} />
                                <Info label="Invoice" value={shipment.invoice_number || '-'} />
                                <Info label="Ransom" value={`${shipment.ransom_amount} MKD`} />
                                <Info label="Status" value={formatText(shipment.latest_status)} />
                            </div>

                            <div className="mt-5 border-t border-gray-300 pt-4 text-center">
                                <p className="text-xs font-bold uppercase text-gray-500">
                                    Delivery Confirmation Code
                                </p>

                                <p className="mt-1 font-mono text-2xl font-black tracking-widest text-gray-900">
                                    {shipment.delivery_code}
                                </p>

                                <p className="mt-1 text-[10px] text-gray-500">
                                    Recipient gives this code to the operator upon delivery.
                                </p>
                            </div>

                            {shipment.note && (
                                <div className="mt-5 border-t border-gray-300 pt-4">
                                    <p className="text-xs font-bold uppercase text-gray-500">
                                        Note
                                    </p>

                                    <p className="mt-1 text-sm text-gray-800">
                                        {shipment.note}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function Info({ label, value }) {
    return (
        <div>
            <p className="text-xs font-bold uppercase text-gray-500">
                {label}
            </p>
            <p className="font-semibold text-gray-900">
                {value}
            </p>
        </div>
    );
}

function formatText(value) {
    if (!value) return '-';

    return value
        .replaceAll('_', ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
}
