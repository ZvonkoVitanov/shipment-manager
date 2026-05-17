import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ groupedShipment }) {
    return (
        <AuthenticatedLayout>
            <Head title="Grouped Shipment" />

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
                            Grouped Shipment #{groupedShipment.id}
                        </h1>

                        <p className="mt-1 text-sm text-gray-600">
                            Combined delivery for shipments with the same recipient and pickup location.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                        <Stat label="Recipient" value={groupedShipment.recipient_name} />
                        <Stat label="Phone" value={groupedShipment.recipient_phone} />
                        <Stat label="Shipments" value={groupedShipment.total_shipments} />
                        <Stat label="Status" value={formatText(groupedShipment.status)} />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                        <Stat label="Before Discount" value={`${groupedShipment.total_price_before_discount} MKD`} />
                        <Stat label="Discount %" value={`${groupedShipment.discount_percentage}%`} />
                        <Stat label="Discount Amount" value={`${groupedShipment.total_discount} MKD`} />
                        <Stat label="After Discount" value={`${groupedShipment.total_price_after_discount} MKD`} />
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <TableHead>Barcode</TableHead>
                                <TableHead>Recipient</TableHead>
                                <TableHead>City</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Ransom</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Action</TableHead>
                            </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200 bg-white">
                            {groupedShipment.shipments.map((shipment) => (
                                <tr key={shipment.id}>
                                    <TableCell strong>{shipment.barcode}</TableCell>
                                    <TableCell>{shipment.recipient_name}</TableCell>
                                    <TableCell>{shipment.recipient_city}</TableCell>
                                    <TableCell>{shipment.recipient_phone}</TableCell>
                                    <TableCell>{shipment.ransom_amount} MKD</TableCell>
                                    <TableCell>{formatText(shipment.latest_status)}</TableCell>
                                    <TableCell>
                                        <Link
                                            href={route('client.shipments.show', shipment.id)}
                                            className="text-sm font-semibold text-blue-600 hover:text-blue-800"
                                        >
                                            View
                                        </Link>
                                    </TableCell>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function Stat({ label, value }) {
    return (
        <div className="rounded-lg bg-white p-4 shadow-sm">
            <p className="text-xs font-bold uppercase text-gray-500">
                {label}
            </p>
            <p className="mt-1 font-semibold text-gray-900">
                {value || '-'}
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
