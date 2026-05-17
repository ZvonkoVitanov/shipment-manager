import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Index({ shipments }) {
    const { flash } = usePage().props;

    return (
        <AuthenticatedLayout>
            <Head title="Shipments" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Shipments
                            </h1>
                            <p className="mt-1 text-sm text-gray-600">
                                View and manage your created shipments.
                            </p>
                        </div>

                     <div className="flex space-x-4">
                         <Link
                             href={route('client.shipments.create')}
                             className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                         >
                             Create Shipment
                         </Link>
                         <Link
                             href={route('client.imports.index')}
                             className="inline-flex rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
                         >
                             Import Excel
                         </Link>
                     </div>
                    </div>

                    {flash?.success && (
                        <div className="mb-4 rounded-lg bg-green-100 p-4 text-sm text-green-700">
                            {flash.success}
                        </div>
                    )}

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <TableHead>Barcode</TableHead>
                                <TableHead>Recipient</TableHead>
                                <TableHead>City</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Weight</TableHead>
                                <TableHead>Ransom</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead>Action</TableHead>
                            </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200 bg-white">
                            {shipments.length > 0 ? (
                                shipments.map((shipment) => (
                                    <tr key={shipment.id}>
                                        <TableCell strong>
                                            {shipment.barcode}
                                        </TableCell>
                                        <TableCell>
                                            {shipment.recipient_name}
                                        </TableCell>
                                        <TableCell>
                                            {shipment.recipient_city}
                                        </TableCell>
                                        <TableCell>
                                            {shipment.recipient_phone}
                                        </TableCell>
                                        <TableCell>
                                            {shipment.weight ?? '-'}
                                        </TableCell>
                                        <TableCell>
                                            {shipment.ransom_amount} MKD
                                        </TableCell>
                                        <TableCell>
                                                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                                                    {formatStatus(shipment.latest_status)}
                                                </span>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(shipment.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <Link
                                                href={route('client.shipments.show', shipment.id)}
                                                className="text-sm font-semibold text-blue-600 hover:text-blue-800"
                                            >
                                                View
                                            </Link>
                                        </TableCell>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="9"
                                        className="px-6 py-8 text-center text-sm text-gray-500"
                                    >
                                        No shipments created yet.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function TableHead({ children }) {
    return (
        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
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
            {children}
        </td>
    );
}

function formatStatus(status) {
    return status
        .replaceAll('_', ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
}
