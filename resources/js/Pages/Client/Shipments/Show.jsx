import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ shipment }) {
    return (
        <AuthenticatedLayout>
            <Head title={`Shipment ${shipment.barcode}`} />

            <div className="py-12">
                <div className="mx-auto max-w-5xl space-y-6 sm:px-6 lg:px-8">
                    <div>
                        <Link
                            href={route('client.shipments.index')}
                            className="text-sm font-semibold text-blue-600 hover:text-blue-800"
                        >
                            ← Back to shipments
                        </Link>

                        <h1 className="mt-4 text-2xl font-bold text-gray-900">
                            Shipment {shipment.barcode}
                        </h1>

                        <p className="mt-1 text-sm text-gray-600">
                            Track this shipment and view delivery details.
                        </p>
                        <Link
                            href={route('client.shipments.label', shipment.id)}
                            className="mt-4 inline-flex rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
                        >
                            Print Address Label
                        </Link>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    Current Status
                                </p>

                                <p className="mt-1 text-xl font-bold text-gray-900">
                                    {formatText(shipment.latest_status)}
                                </p>
                            </div>

                            <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700">
                                {formatText(shipment.latest_status)}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Recipient Details
                            </h2>

                            <div className="mt-4 space-y-3 text-sm">
                                <Detail label="Recipient" value={shipment.recipient_name} />
                                <Detail label="Phone" value={shipment.recipient_phone} />
                                <Detail label="Address" value={shipment.recipient_address} />
                                <Detail label="City" value={shipment.recipient_city} />
                                <Detail label="Post Office" value={shipment.delivery_post_office} />
                            </div>
                        </div>

                        <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Shipment Details
                            </h2>

                            <div className="mt-4 space-y-3 text-sm">
                                <Detail label="Barcode" value={shipment.barcode} />
                                <Detail label="Weight" value={shipment.weight} />
                                <Detail label="Ransom Amount" value={`${shipment.ransom_amount} MKD`} />
                                <Detail label="Invoice Number" value={shipment.invoice_number} />
                                <Detail label="Delivery Type" value={formatText(shipment.delivery_type)} />
                                <Detail label="Pickup Type" value={formatText(shipment.pickup_type)} />
                                <Detail label="Pickup Location" value={shipment.pickup_location} />
                                <Detail label="Note" value={shipment.note} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Tracking History
                        </h2>

                        <div className="mt-6 space-y-4">
                            {shipment.status_histories.length > 0 ? (
                                shipment.status_histories.map((history, index) => (
                                    <div key={history.id} className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className="h-4 w-4 rounded-full bg-blue-600" />

                                            {index !== shipment.status_histories.length - 1 && (
                                                <div className="mt-1 h-full w-px bg-gray-300" />
                                            )}
                                        </div>

                                        <div className="pb-6">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <p className="font-semibold text-gray-900">
                                                    {formatText(history.status)}
                                                </p>

                                                <p className="text-sm text-gray-500">
                                                    {new Date(history.changed_at).toLocaleString()}
                                                </p>
                                            </div>

                                            <p className="mt-1 text-sm text-gray-600">
                                                Updated by: {history.changed_by?.name || 'System'}
                                            </p>

                                            {history.note && (
                                                <p className="mt-2 text-sm text-gray-700">
                                                    {history.note}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">
                                    No tracking history available.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function Detail({ label, value }) {
    return (
        <div className="flex justify-between gap-4 border-b border-gray-100 pb-2">
            <span className="font-medium text-gray-700">{label}</span>
            <span className="text-right text-gray-600">{value || '-'}</span>
        </div>
    );
}

function formatText(value) {
    if (!value) return '-';

    return value
        .replaceAll('_', ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
}
