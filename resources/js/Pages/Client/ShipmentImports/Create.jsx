import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        file: null,
    });

    function submit(e) {
        e.preventDefault();

        post(route('client.imports.preview'), {
            forceFormData: true,
        });
    }

    return (
        <AuthenticatedLayout>
            <Head title="Upload Excel Import" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Link
                            href={route('client.imports.index')}
                            className="text-sm font-semibold text-blue-600 hover:text-blue-800"
                        >
                            ← Back to imports
                        </Link>

                        <h1 className="mt-4 text-2xl font-bold text-gray-900">
                            Upload Excel File
                        </h1>

                        <p className="mt-1 text-sm text-gray-600">
                            Upload an Excel file with shipment data. The system will validate it before creating shipments.
                        </p>
                    </div>

                    <form
                        onSubmit={submit}
                        className="space-y-6 bg-white p-6 shadow-sm sm:rounded-lg"
                    >
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Excel File
                            </label>

                            <input
                                type="file"
                                accept=".xlsx,.xls,.csv"
                                onChange={(e) => setData('file', e.target.files[0])}
                                className="mt-1 block w-full rounded-lg border border-gray-300 p-2 text-sm shadow-sm"
                            />

                            {errors.file && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.file}
                                </p>
                            )}
                        </div>

                        <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-700">
                            <p className="font-semibold">Required columns:</p>

                            <p className="mt-2 font-mono text-xs">
                                recipient_name, recipient_address, recipient_city,
                                delivery_post_office, recipient_phone, ransom_amount,
                                invoice_number, weight, delivery_type, pickup_type,
                                pickup_location, note
                            </p>

                            <p className="mt-3">
                                Allowed values:
                            </p>

                            <ul className="mt-1 list-inside list-disc">
                                <li><strong>delivery_type:</strong> home or post_office</li>
                                <li><strong>pickup_type:</strong> post_office or address</li>
                            </ul>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                Upload and Preview
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
