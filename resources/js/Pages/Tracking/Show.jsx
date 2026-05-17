import { Head } from '@inertiajs/react';

export default function Show({ shipment }) {
    return (
        <>
            <Head title={`Tracking ${shipment.barcode}`} />

            <div className="min-h-screen bg-gray-100 py-10">
                <div className="mx-auto max-w-3xl px-4">
                    <div className="mb-6 text-center">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Shipment Tracking
                        </h1>

                        <p className="mt-2 text-sm text-gray-600">
                            Track the current delivery status of your shipment.
                        </p>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <div className="flex flex-col gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    Barcode
                                </p>

                                <p className="mt-1 font-mono text-xl font-bold text-gray-900">
                                    {shipment.barcode}
                                </p>
                            </div>

                            <div className="self-start rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white sm:self-center">
                                {formatText(shipment.latest_status)}
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Detail label="Recipient" value={shipment.recipient_name} />
                            <Detail label="City" value={shipment.recipient_city} />
                            <Detail label="Delivery Type" value={formatText(shipment.delivery_type)} />
                            <Detail label="Sender" value={shipment.client?.company_name} />
                        </div>
                    </div>

                    <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
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

                    <p className="mt-6 text-center text-xs text-gray-500">
                        This page only shows basic shipment tracking information.
                    </p>
                </div>
            </div>
        </>
    );
}

function Detail({ label, value }) {
    return (
        <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-xs font-bold uppercase text-gray-500">
                {label}
            </p>

            <p className="mt-1 font-semibold text-gray-900">
                {value || '-'}
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
