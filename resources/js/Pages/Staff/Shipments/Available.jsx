import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Pagination from "@/Components/Pagination.jsx";
export default function Available({ shipments, filters, statuses }) {
    const { flash } = usePage().props;

    function takeShipment(id) {
        if (!confirm('Take this shipment?')) return;

        router.post(route('staff.shipments.take', id));
    }

    const [data, setData] = useState({
        search: filters.search || '',
        city: filters.city || '',
        status: filters.status || '',
    });

    function applyFilters(e) {
        e.preventDefault();

        router.get(route('staff.shipments.available'), data, {
            preserveState: true,
            replace: true,
        });
    }
    return (
        <AuthenticatedLayout>
            <Head title="Available Shipments" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <Header />

                    {flash?.success && (
                        <div className="rounded-lg bg-green-100 p-4 text-sm text-green-700">
                            {flash.success}
                        </div>
                    )}

                    {flash?.error && (
                        <div className="rounded-lg bg-red-100 p-4 text-sm text-red-700">
                            {flash.error}
                        </div>
                    )}
                    <form
                        onSubmit={applyFilters}
                        className="rounded-lg bg-white p-6 shadow-sm"
                    >
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <Input
                                label="Search"
                                value={data.search}
                                onChange={(e) => setData({ ...data, search: e.target.value })}
                                placeholder="Barcode, recipient, phone..."
                            />

                            <Input
                                label="City"
                                value={data.city}
                                onChange={(e) => setData({ ...data, city: e.target.value })}
                                placeholder="Skopje..."
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
                                            {formatText(status)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="mt-4 flex justify-end gap-3">
                            <Link
                                href={route('staff.shipments.available')}
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
                    <ShipmentTable
                        shipments={shipments}
                        emptyText="No available shipments."
                        action={(shipment) => (
                            <button
                                type="button"
                                onClick={() => takeShipment(shipment.id)}
                                className="text-sm font-semibold text-blue-600 hover:text-blue-800"
                            >
                                Take Shipment
                            </button>
                        )}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function Header() {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Available Shipments
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                    Take unassigned shipments and update their delivery status.
                </p>
            </div>

            <Link
                href={route('staff.shipments.mine')}
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
            >
                My Shipments
            </Link>
        </div>
    );
}

function ShipmentTable({ shipments, emptyText, action }) {
    return (
        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <TableHead>Barcode</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Recipient</TableHead>
                        <TableHead>City</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Pickup</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                    </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 bg-white">
                    {shipments.length > 0 ? (
                        shipments.map((shipment) => (
                            <tr key={shipment.id}>
                                <TableCell strong>{shipment.barcode}</TableCell>
                                <TableCell>{shipment.client?.company_name}</TableCell>
                                <TableCell>{shipment.recipient_name}</TableCell>
                                <TableCell>{shipment.recipient_city}</TableCell>
                                <TableCell>{shipment.recipient_phone}</TableCell>
                                <TableCell>{shipment.pickup_location}</TableCell>
                                <TableCell>{formatText(shipment.latest_status)}</TableCell>
                                <TableCell>{action(shipment)}</TableCell>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan="8"
                                className="px-6 py-8 text-center text-sm text-gray-500"
                            >
                                {emptyText}
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
            <Pagination links={shipments.links} />
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

function Input({ label, value, onChange, placeholder = '' }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">
                {label}
            </label>

            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm"
            />
        </div>
    );
}
