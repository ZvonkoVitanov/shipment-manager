import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, Link, router} from '@inertiajs/react';
import {useState} from 'react';
import Pagination from "@/Components/Pagination.jsx";

export default function Shipments({shipments, clients, filters, statuses, totals}) {
    const [data, setData] = useState({
        client_id: filters.client_id || '',
        status: filters.status || '',
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
        city: filters.city || '',
    });

    function applyFilters(e) {
        e.preventDefault();

        router.get(route('admin.reports.shipments'), data, {
            preserveState: true,
            replace: true,
        });
    }

    function exportCsv() {
        const params = new URLSearchParams();

        Object.entries(data).forEach(([key, value]) => {
            if (value) {
                params.append(key, value);
            }
        });

        window.location.href =
            route('admin.reports.shipments.export-csv') + '?' + params.toString();
    }

    const totalShipments = totals.total_shipments;
    const totalRansom = Number(totals.total_ransom || 0);
    const deliveredCount = totals.delivered_count;
    const returnedCount = totals.returned_count;

    return (
        <AuthenticatedLayout>
            <Head title="Admin Shipment Reports"/>

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Admin Shipment Reports
                        </h1>

                        <p className="mt-1 text-sm text-gray-600">
                            Filter shipments across all clients and export report data.
                        </p>
                    </div>

                    <form
                        onSubmit={applyFilters}
                        className="rounded-lg bg-white p-6 shadow-sm"
                    >
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Client
                                </label>

                                <select
                                    value={data.client_id}
                                    onChange={(e) =>
                                        setData({...data, client_id: e.target.value})
                                    }
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm"
                                >
                                    <option value="">All clients</option>

                                    {clients.map((client) => (
                                        <option key={client.id} value={client.id}>
                                            {client.company_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Status
                                </label>

                                <select
                                    value={data.status}
                                    onChange={(e) =>
                                        setData({...data, status: e.target.value})
                                    }
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

                            <Input
                                label="Date From"
                                type="date"
                                value={data.date_from}
                                onChange={(e) =>
                                    setData({...data, date_from: e.target.value})
                                }
                            />

                            <Input
                                label="Date To"
                                type="date"
                                value={data.date_to}
                                onChange={(e) =>
                                    setData({...data, date_to: e.target.value})
                                }
                            />

                            <Input
                                label="City"
                                value={data.city}
                                onChange={(e) =>
                                    setData({...data, city: e.target.value})
                                }
                            />
                        </div>

                        <div className="mt-6 flex flex-wrap justify-end gap-3">
                            <Link
                                href={route('admin.reports.shipments')}
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

                            <button
                                type="button"
                                onClick={exportCsv}
                                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
                            >
                                Export CSV
                            </button>
                        </div>
                    </form>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                        <Stat label="Total Shipments" value={totalShipments}/>
                        <Stat label="Delivered" value={deliveredCount}/>
                        <Stat label="Returned" value={returnedCount}/>
                        <Stat label="Total Ransom" value={`${totalRansom.toFixed(2)} MKD`}/>
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <TableHead>Client</TableHead>
                                    <TableHead>Barcode</TableHead>
                                    <TableHead>Recipient</TableHead>
                                    <TableHead>City</TableHead>
                                    <TableHead>Phone</TableHead>
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
                                            <TableCell>{shipment.client?.company_name}</TableCell>
                                            <TableCell strong>{shipment.barcode}</TableCell>
                                            <TableCell>{shipment.recipient_name}</TableCell>
                                            <TableCell>{shipment.recipient_city}</TableCell>
                                            <TableCell>{shipment.recipient_phone}</TableCell>
                                            <TableCell>{shipment.ransom_amount} MKD</TableCell>
                                            <TableCell>{formatText(shipment.latest_status)}</TableCell>
                                            <TableCell>
                                                {new Date(shipment.created_at).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <Link
                                                    href={route('admin.shipments.show', shipment.id)}
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
                                            No shipments found for selected filters.
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <Pagination links={shipments.links}/>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function Input({label, type = 'text', value, onChange}) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">
                {label}
            </label>

            <input
                type={type}
                value={value}
                onChange={onChange}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm"
            />
        </div>
    );
}

function Stat({label, value}) {
    return (
        <div className="rounded-lg bg-white p-4 shadow-sm">
            <p className="text-xs font-bold uppercase text-gray-500">
                {label}
            </p>

            <p className="mt-1 text-xl font-bold text-gray-900">
                {value}
            </p>
        </div>
    );
}

function TableHead({children}) {
    return (
        <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
            {children}
        </th>
    );
}

function TableCell({children, strong = false}) {
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
