import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import Pagination from "@/Components/Pagination.jsx";

export default function Index({ operators }) {
    const { flash } = usePage().props;

    return (
        <AuthenticatedLayout>
            <Head title="Operators" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Operators
                            </h1>
                            <p className="mt-1 text-sm text-gray-600">
                                Manage delivery operators who take shipments and update statuses.
                            </p>
                        </div>

                        <Link
                            href={route('admin.operators.create')}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            Create Operator
                        </Link>
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
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Created</TableHead>
                            </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200 bg-white">
                            {operators.data.length > 0 ? (
                                operators.data.map((operator) => (
                                    <tr key={operator.id}>
                                        <TableCell strong>{operator.name}</TableCell>
                                        <TableCell>{operator.email}</TableCell>
                                        <TableCell>{operator.role}</TableCell>
                                        <TableCell>
                                            {new Date(operator.created_at).toLocaleDateString()}
                                        </TableCell>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="px-6 py-8 text-center text-sm text-gray-500"
                                    >
                                        No operators created yet.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                    <Pagination links={operators.links} />
                </div>
            </div>
        </AuthenticatedLayout>
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
