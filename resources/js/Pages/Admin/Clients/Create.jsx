import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        company_name: '',
        email: '',
        password: '',
        contact_person: '',
        contact_email: '',
        contact_phone: '',
        company_address: '',
        warehouse_location: '',
        default_pickup_location: '',
    });

    function submit(e) {
        e.preventDefault();
        post(route('admin.clients.store'));
    }

    return (
        <AuthenticatedLayout>
            <Head title="Create Client" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Create Client
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Create a business client and its login account.
                        </p>
                    </div>

                    <form
                        onSubmit={submit}
                        className="space-y-6 bg-white p-6 shadow-sm sm:rounded-lg"
                    >
                        <section>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Login Information
                            </h2>

                            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                                <Input
                                    label="Company Name"
                                    value={data.company_name}
                                    error={errors.company_name}
                                    onChange={(e) => setData('company_name', e.target.value)}
                                />

                                <Input
                                    label="Login Email"
                                    type="email"
                                    value={data.email}
                                    error={errors.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                />

                                <Input
                                    label="Initial Password"
                                    type="password"
                                    value={data.password}
                                    error={errors.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                            </div>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Contact Information
                            </h2>

                            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                                <Input
                                    label="Contact Person"
                                    value={data.contact_person}
                                    error={errors.contact_person}
                                    onChange={(e) => setData('contact_person', e.target.value)}
                                />

                                <Input
                                    label="Contact Email"
                                    type="email"
                                    value={data.contact_email}
                                    error={errors.contact_email}
                                    onChange={(e) => setData('contact_email', e.target.value)}
                                />

                                <Input
                                    label="Contact Phone"
                                    value={data.contact_phone}
                                    error={errors.contact_phone}
                                    onChange={(e) => setData('contact_phone', e.target.value)}
                                />

                                <Input
                                    label="Company Address"
                                    value={data.company_address}
                                    error={errors.company_address}
                                    onChange={(e) => setData('company_address', e.target.value)}
                                />
                            </div>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Operational Information
                            </h2>

                            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                                <Input
                                    label="Warehouse Location"
                                    value={data.warehouse_location}
                                    error={errors.warehouse_location}
                                    onChange={(e) => setData('warehouse_location', e.target.value)}
                                />

                                <Input
                                    label="Default Pickup Location"
                                    value={data.default_pickup_location}
                                    error={errors.default_pickup_location}
                                    onChange={(e) => setData('default_pickup_location', e.target.value)}
                                />
                            </div>
                        </section>

                        <div className="flex items-center justify-end gap-3">
                            <Link
                                href={route('admin.clients.index')}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                Create Client
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function Input({ label, type = 'text', value, onChange, error }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">
                {label}
            </label>

            <input
                type={type}
                value={value}
                onChange={onChange}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />

            {error && (
                <p className="mt-1 text-sm text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}
