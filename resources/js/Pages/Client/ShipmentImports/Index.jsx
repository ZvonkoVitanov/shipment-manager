import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Index({ imports }) {
    const { flash } = usePage().props;

    return (
        <AuthenticatedLayout>
            <Head title="Shipment Imports" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Shipment Imports
                            </h1>
                            <p className="mt-1 text-sm text-gray-600">
                                Upload Excel files and create shipments in bulk.
                            </p>
                        </div>

                        <Link
                            href={route('client.imports.create')}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            Upload Excel
                        </Link>
                    </div>

                    {flash?.success && (
                        <div className="mb-4 rounded-lg bg-green-100 p-4 text-sm text-green-700">
                            {flash.success}
                        </div>
                    )}

                    {flash?.error && (
                        <div className="mb-4 rounded-lg bg-red-100 p-4 text-sm text-red-700">
                            {flash.error}
                        </div>
                    )}

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <TableHead>File</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Total Rows</TableHead>
                                <TableHead>Valid</TableHead>
                                <TableHead>Invalid</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead>Action</TableHead>
                            </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200 bg-white">
                            {imports.length > 0 ? (
                                imports.map((importRecord) => (
                                    <tr key={importRecord.id}>
                                        <TableCell strong>{importRecord.file_name}</TableCell>
                                        <TableCell>{formatText(importRecord.status)}</TableCell>
                                        <TableCell>{importRecord.total_rows}</TableCell>
                                        <TableCell>{importRecord.valid_rows}</TableCell>
                                        <TableCell>{importRecord.invalid_rows}</TableCell>
                                        <TableCell>
                                            {new Date(importRecord.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <Link
                                                href={route('client.imports.show', importRecord.id)}
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
                                        colSpan="7"
                                        className="px-6 py-8 text-center text-sm text-gray-500"
                                    >
                                        No imports created yet.
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

function formatText(value) {
    if (!value) return '-';

    return value
        .replaceAll('_', ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
}
