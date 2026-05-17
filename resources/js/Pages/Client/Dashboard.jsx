import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout>
            <Head title="Client Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                        <h1 className="text-2xl font-bold">Client Dashboard</h1>

                        <p className="mt-2 text-gray-600">
                            Create shipments, import Excel files, print labels, and track delivery statuses.
                        </p>

                        <div className="mt-4 flex gap-3">
                            <Link
                                href={route('client.shipments.index')}
                                className="inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                            >
                                View Shipments
                            </Link>
                            <Link
                                href={route('client.imports.index')}
                                className="inline-flex rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
                            >
                                Import Excel
                            </Link>
                            <Link
                                href={route('client.grouped-shipments.index')}
                                className="inline-flex rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700"
                            >
                                Grouped Shipments
                            </Link>
                            <Link
                                href={route('client.reports.shipments')}
                                className="inline-flex rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                            >
                                Reports
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
