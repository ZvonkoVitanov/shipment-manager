import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useMemo } from 'react';

export default function Create({ shipments }) {
    const { flash } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        shipment_ids: [],
        discount_percentage: 0,
    });

    const selectedShipments = useMemo(() => {
        return shipments.filter((shipment) =>
            data.shipment_ids.includes(shipment.id)
        );
    }, [shipments, data.shipment_ids]);

    const totalBeforeDiscount = selectedShipments.reduce(
        (sum, shipment) => sum + Number(shipment.ransom_amount || 0),
        0
    );

    const totalDiscount =
        totalBeforeDiscount * (Number(data.discount_percentage || 0) / 100);

    const totalAfterDiscount = totalBeforeDiscount - totalDiscount;

    function toggleShipment(id) {
        if (data.shipment_ids.includes(id)) {
            setData(
                'shipment_ids',
                data.shipment_ids.filter((shipmentId) => shipmentId !== id)
            );
        } else {
            setData('shipment_ids', [...data.shipment_ids, id]);
        }
    }

    function submit(e) {
        e.preventDefault();

        post(route('client.grouped-shipments.store'));
    }

    return (
        <AuthenticatedLayout>
            <Head title="Create Grouped Shipment" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div>
                        <Link
                            href={route('client.grouped-shipments.index')}
                            className="text-sm font-semibold text-blue-600 hover:text-blue-800"
                        >
                            ← Back to grouped shipments
                        </Link>

                        <h1 className="mt-4 text-2xl font-bold text-gray-900">
                            Create Grouped Shipment
                        </h1>

                        <p className="mt-1 text-sm text-gray-600">
                            Select multiple shipments with the same recipient phone and pickup location.
                        </p>
                    </div>

                    {flash?.error && (
                        <div className="rounded-lg bg-red-100 p-4 text-sm text-red-700">
                            {flash.error}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6">
                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                                <Stat label="Selected" value={selectedShipments.length} />
                                <Stat label="Before Discount" value={`${totalBeforeDiscount.toFixed(2)} MKD`} />
                                <Stat label="Discount" value={`${totalDiscount.toFixed(2)} MKD`} />
                                <Stat label="After Discount" value={`${totalAfterDiscount.toFixed(2)} MKD`} />
                            </div>

                            <div className="mt-6 max-w-xs">
                                <label className="block text-sm font-medium text-gray-700">
                                    Discount Percentage
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.01"
                                    value={data.discount_percentage}
                                    onChange={(e) =>
                                        setData('discount_percentage', e.target.value)
                                    }
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />

                                {errors.discount_percentage && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.discount_percentage}
                                    </p>
                                )}
                            </div>

                            {errors.shipment_ids && (
                                <p className="mt-4 text-sm text-red-600">
                                    {errors.shipment_ids}
                                </p>
                            )}
                        </div>

                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <TableHead>Select</TableHead>
                                        <TableHead>Barcode</TableHead>
                                        <TableHead>Recipient</TableHead>
                                        <TableHead>Phone</TableHead>
                                        <TableHead>Pickup Location</TableHead>
                                        <TableHead>City</TableHead>
                                        <TableHead>Ransom</TableHead>
                                        <TableHead>Status</TableHead>
                                    </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-200 bg-white">
                                    {shipments.length > 0 ? (
                                        shipments.map((shipment) => (
                                            <tr key={shipment.id}>
                                                <TableCell>
                                                    <input
                                                        type="checkbox"
                                                        checked={data.shipment_ids.includes(shipment.id)}
                                                        onChange={() => toggleShipment(shipment.id)}
                                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                </TableCell>
                                                <TableCell strong>{shipment.barcode}</TableCell>
                                                <TableCell>{shipment.recipient_name}</TableCell>
                                                <TableCell>{shipment.recipient_phone}</TableCell>
                                                <TableCell>{shipment.pickup_location}</TableCell>
                                                <TableCell>{shipment.recipient_city}</TableCell>
                                                <TableCell>{shipment.ransom_amount} MKD</TableCell>
                                                <TableCell>{formatText(shipment.latest_status)}</TableCell>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="8"
                                                className="px-6 py-8 text-center text-sm text-gray-500"
                                            >
                                                No available shipments for grouping.
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                Create Grouped Shipment
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function Stat({ label, value }) {
    return (
        <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-xs font-bold uppercase text-gray-500">
                {label}
            </p>
            <p className="mt-1 font-semibold text-gray-900">
                {value}
            </p>
        </div>
    );
}

function TableHead({ children }) {
    return (
        <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
            {children}
        </th>
    );
}

function TableCell({ children, strong = false }) {
    return (
        <td
            className={`whitespace-nowrap px-6 py-4 text-sm ${
                strong ? 'font-medium text-gray-900' : 'text-gray-600'
            }`}
        >
            {children || '-'}
        </td>
    );
}

function formatText(value) {
    if (!value) return '-';

    return value
        .replaceAll('_', ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
}
