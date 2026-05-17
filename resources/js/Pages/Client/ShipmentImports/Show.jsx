import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

export default function Show({ importRecord }) {
    const { flash } = usePage().props;

    function confirmImport() {
        if (!confirm('Are you sure you want to create shipments from this import?')) {
            return;
        }

        router.post(route('client.imports.confirm', importRecord.id));
    }

    const canConfirm =
        importRecord.status === 'preview' &&
        importRecord.invalid_rows === 0 &&
        importRecord.valid_rows > 0;

    return (
        <AuthenticatedLayout>
            <Head title={`Import ${importRecord.file_name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div>
                        <Link
                            href={route('client.imports.index')}
                            className="text-sm font-semibold text-blue-600 hover:text-blue-800"
                        >
                            ← Back to imports
                        </Link>

                        <h1 className="mt-4 text-2xl font-bold text-gray-900">
                            Import Preview
                        </h1>

                        <p className="mt-1 text-sm text-gray-600">
                            Review the uploaded rows before creating shipments.
                        </p>
                    </div>

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

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                        <Stat label="File" value={importRecord.file_name} />
                        <Stat label="Status" value={formatText(importRecord.status)} />
                        <Stat label="Valid Rows" value={importRecord.valid_rows} />
                        <Stat label="Invalid Rows" value={importRecord.invalid_rows} />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={confirmImport}
                            disabled={!canConfirm}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Confirm Import
                        </button>
                    </div>

                    {importRecord.invalid_rows > 0 && (
                        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
                            This import has invalid rows. Fix the Excel file and upload it again.
                        </div>
                    )}

                    {importRecord.status === 'confirmed' && (
                        <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700">
                            This import has already been confirmed and shipments were created.
                        </div>
                    )}

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <TableHead>Row</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Recipient</TableHead>
                                    <TableHead>Address</TableHead>
                                    <TableHead>City</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Weight</TableHead>
                                    <TableHead>Delivery</TableHead>
                                    <TableHead>Pickup</TableHead>
                                    <TableHead>Errors</TableHead>
                                </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200 bg-white">
                                {importRecord.rows.map((row) => (
                                    <tr
                                        key={row.id}
                                        className={row.is_valid ? '' : 'bg-red-50'}
                                    >
                                        <TableCell>{row.row_number}</TableCell>
                                        <TableCell>
                                            {row.is_valid ? (
                                                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                                        Valid
                                                    </span>
                                            ) : (
                                                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                                                        Invalid
                                                    </span>
                                            )}
                                        </TableCell>
                                        <TableCell>{row.data.recipient_name}</TableCell>
                                        <TableCell>{row.data.recipient_address}</TableCell>
                                        <TableCell>{row.data.recipient_city}</TableCell>
                                        <TableCell>{row.data.recipient_phone}</TableCell>
                                        <TableCell>{row.data.weight}</TableCell>
                                        <TableCell>{row.data.delivery_type}</TableCell>
                                        <TableCell>{row.data.pickup_type}</TableCell>
                                        <TableCell>
                                            {row.errors ? (
                                                <ErrorList errors={row.errors} />
                                            ) : (
                                                '-'
                                            )}
                                        </TableCell>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
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

function TableCell({ children }) {
    return (
        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
            {children || '-'}
        </td>
    );
}

function ErrorList({ errors }) {
    return (
        <div className="space-y-1 text-xs text-red-700">
            {Object.entries(errors).map(([field, messages]) => (
                <div key={field}>
                    <span className="font-semibold">{field}:</span>{' '}
                    {messages.join(', ')}
                </div>
            ))}
        </div>
    );
}

function formatText(value) {
    if (!value) return '-';

    return value
        .replaceAll('_', ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
}
