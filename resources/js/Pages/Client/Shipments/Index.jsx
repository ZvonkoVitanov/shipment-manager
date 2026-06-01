import Pagination from '@/Components/Pagination';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ shipments, filters, statuses }) {
    const { flash } = usePage().props;

    const [data, setData] = useState({
        search: filters.search || '',
        status: filters.status || '',
        city: filters.city || '',
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
    });

    function applyFilters(e) {
        e.preventDefault();

        router.get(route('client.shipments.index'), data, {
            preserveState: true,
            replace: true,
        });
    }

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

                    <form
                        onSubmit={applyFilters}
                        className="mb-6 rounded-lg bg-white p-6 shadow-sm"
                    >
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
                            <Input
                                label="Search"
                                value={data.search}
                                onChange={(e) => setData({ ...data, search: e.target.value })}
                                placeholder="Barcode, recipient, phone..."
                            />

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Status
                                </label>

                                <select
                                    value={data.status}
                                    onChange={(e) => setData({ ...data, status: e.target.value })}
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm"
                                >
                                    <option value="">All statuses</option>

                                    {statuses.map((status) => (
                                        <option key={status} value={status}>
                                            {formatStatus(status)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <Input
                                label="City"
                                value={data.city}
                                onChange={(e) => setData({ ...data, city: e.target.value })}
                                placeholder="Skopje..."
                            />

                            <Input
                                label="Date From"
                                type="date"
                                value={data.date_from}
                                onChange={(e) => setData({ ...data, date_from: e.target.value })}
                            />

                            <Input
                                label="Date To"
                                type="date"
                                value={data.date_to}
                                onChange={(e) => setData({ ...data, date_to: e.target.value })}
                            />
                        </div>

                        <div className="mt-4 flex justify-end gap-3">
                            <Link
                                href={route('client.shipments.index')}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                            >
                                Clear
                            </Link>

                            <button
                                type="submit"
                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </form>
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
                            {shipments.data.length > 0 ? (
                                shipments.data.map((shipment) => (
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
                    <Pagination links={shipments.links} />
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

function Input({ label, type = 'text', value, onChange, placeholder = '' }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">
                {label}
            </label>

            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm"
            />
        </div>
    );
}
