import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, Link} from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout>
            <Head title="Admin Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                        <p className="mt-2 text-gray-600">
                            Manage clients, shipments, imports, and reports.
                        </p>
                        <div className="mt-4 flex gap-3">
                            <Link
                                href={route('admin.clients.index')}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                            >
                                Manage Clients
                            </Link>

                            <Link
                                href={route('admin.shipments.index')}
                                className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-900"
                            >
                                View Shipments
                            </Link>
                            <Link
                                href={route('admin.reports.shipments')}
                                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                            >
                                Shipment Reports
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
