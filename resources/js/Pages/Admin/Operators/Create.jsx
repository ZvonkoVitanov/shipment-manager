import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
    });

    function submit(e) {
        e.preventDefault();

        post(route('admin.operators.store'));
    }

    return (
        <AuthenticatedLayout>
            <Head title="Create Operator" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Link
                            href={route('admin.operators.index')}
                            className="text-sm font-semibold text-blue-600 hover:text-blue-800"
                        >
                            ← Back to operators
                        </Link>

                        <h1 className="mt-4 text-2xl font-bold text-gray-900">
                            Create Operator
                        </h1>

                        <p className="mt-1 text-sm text-gray-600">
                            Create a delivery operator account.
                        </p>
                    </div>

                    <form
                        onSubmit={submit}
                        className="space-y-6 bg-white p-6 shadow-sm sm:rounded-lg"
                    >
                        <Input
                            label="Name"
                            value={data.name}
                            error={errors.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />

                        <Input
                            label="Email"
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

                        <div className="flex justify-end gap-3">
                            <Link
                                href={route('admin.operators.index')}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                Create Operator
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
