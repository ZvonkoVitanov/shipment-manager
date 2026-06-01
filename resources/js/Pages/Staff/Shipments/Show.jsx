import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

export default function Show({ shipment, statuses }) {
    const { flash } = usePage().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        status: shipment.latest_status,
        delivery_code:'',
        note: '',
    });

    function submit(e) {
        e.preventDefault();

        post(route('staff.shipments.update-status', shipment.id), {
            onSuccess: () => reset('note', 'delivery_code'),
        });
    }
    const isFinalStatus = ['delivered', 'returned', 'cancelled'].includes(
        shipment.latest_status
    );

    return (
        <AuthenticatedLayout>
            <Head title={`Shipment ${shipment.barcode}`} />

            <div className="py-12">
                <div className="mx-auto max-w-5xl space-y-6 sm:px-6 lg:px-8">
                    <div>
                        <Link
                            href={route('staff.shipments.mine')}
                            className="text-sm font-semibold text-blue-600 hover:text-blue-800"
                        >
                            ← Back to my shipments
                        </Link>

                        <h1 className="mt-4 text-2xl font-bold text-gray-900">
                            Shipment {shipment.barcode}
                        </h1>

                        <p className="mt-1 text-sm text-gray-600">
                            Update delivery status for your assigned shipment.
                        </p>
                    </div>

                    {flash?.success && (
                        <div className="rounded-lg bg-green-100 p-4 text-sm text-green-700">
                            {flash.success}
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Shipment Details
                            </h2>

                            <div className="mt-4 space-y-3 text-sm">
                                <Detail label="Client" value={shipment.client?.company_name} />
                                <Detail label="Recipient" value={shipment.recipient_name} />
                                <Detail label="Phone" value={shipment.recipient_phone} />
                                <Detail label="Address" value={shipment.recipient_address} />
                                <Detail label="City" value={shipment.recipient_city} />
                                <Detail label="Current Status" value={formatText(shipment.latest_status)} />
                                <Detail label="Assigned At" value={shipment.assigned_at ? new Date(shipment.assigned_at).toLocaleString() : '-'} />
                                <Detail
                                    label="Delivered Verified At"
                                    value={
                                        shipment.delivered_verified_at
                                            ? new Date(shipment.delivered_verified_at).toLocaleString()
                                            : '-'
                                    }
                                />
                            </div>
                        </div>

                        <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Update Status
                            </h2>


                            {isFinalStatus ? (
                                <div className="mt-4 rounded-lg bg-gray-100 p-4 text-sm text-gray-700">
                                    This shipment is finalized. Its status can no longer be changed.
                                </div>
                            ) : (
                                <form onSubmit={submit} className="mt-4 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Status
                                        </label>

                                        <select
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        >
                                            {statuses.map((status) => (
                                                <option key={status} value={status}>
                                                    {formatText(status)}
                                                </option>
                                            ))}
                                        </select>

                                        {data.status === 'delivered' && (
                                            <div className={'mt-2'}>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Delivery Confirmation Code
                                                </label>

                                                <input
                                                    type="text"
                                                    maxLength="6"
                                                    value={data.delivery_code}
                                                    onChange={(e) => setData('delivery_code', e.target.value)}
                                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                    placeholder="Enter 6-digit code"
                                                />

                                                {errors.delivery_code && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {errors.delivery_code}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                        {errors.status && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.status}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Note
                                        </label>

                                        <textarea
                                            value={data.note}
                                            onChange={(e) => setData('note', e.target.value)}
                                            rows="3"
                                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="Optional note..."
                                        />

                                        {errors.note && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.note}
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        Update Status
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                    <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Status History
                        </h2>

                        <div className="mt-4 space-y-4">
                            {shipment.status_histories.length > 0 ? (
                                shipment.status_histories.map((history) => (
                                    <div
                                        key={history.id}
                                        className="rounded-lg border border-gray-200 p-4"
                                    >
                                        <div className="flex items-center justify-between">
                                            <p className="font-semibold text-gray-900">
                                                {formatText(history.status)}
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                {new Date(history.changed_at).toLocaleString()}
                                            </p>
                                        </div>

                                        <p className="mt-1 text-sm text-gray-600">
                                            Changed by: {history.changed_by?.name || 'System'}
                                        </p>

                                        {history.note && (
                                            <p className="mt-2 text-sm text-gray-700">
                                                {history.note}
                                            </p>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">
                                    No status history available.
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
