import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ shipment }) {
    const { data, setData, put, processing, errors } = useForm({
        recipient_name: shipment.recipient_name || '',
        recipient_address: shipment.recipient_address || '',
        recipient_city: shipment.recipient_city || '',
        delivery_post_office: shipment.delivery_post_office || '',
        recipient_phone: shipment.recipient_phone || '',

        ransom_amount: shipment.ransom_amount || '',
        invoice_number: shipment.invoice_number || '',
        weight: shipment.weight || '',

        delivery_type: shipment.delivery_type || 'home',
        pickup_type: shipment.pickup_type || 'post_office',
        pickup_location: shipment.pickup_location || '',

        note: shipment.note || '',
    });

    function submit(e) {
        e.preventDefault();

        put(route('admin.shipments.update', shipment.id));
    }

    return (
        <AuthenticatedLayout>
            <Head title={`Edit Shipment ${shipment.barcode}`} />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Link
                            href={route('admin.shipments.show', shipment.id)}
                            className="text-sm font-semibold text-blue-600 hover:text-blue-800"
                        >
                            ← Back to shipment
                        </Link>

                        <h1 className="mt-4 text-2xl font-bold text-gray-900">
                            Edit Shipment Details
                        </h1>

                        <p className="mt-1 text-sm text-gray-600">
                            Super admin can correct shipment information in case of an error.
                        </p>
                    </div>

                    <div className="mb-6 rounded-lg bg-yellow-50 p-4 text-sm text-yellow-800">
                        You are editing shipment <strong>{shipment.barcode}</strong>. This should only be used for correcting mistakes.
                    </div>

                    <form
                        onSubmit={submit}
                        className="space-y-6 bg-white p-6 shadow-sm sm:rounded-lg"
                    >
                        <section>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Recipient Information
                            </h2>

                            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                                <Input
                                    label="Recipient Name"
                                    value={data.recipient_name}
                                    error={errors.recipient_name}
                                    onChange={(e) => setData('recipient_name', e.target.value)}
                                />

                                <Input
                                    label="Recipient Phone"
                                    value={data.recipient_phone}
                                    error={errors.recipient_phone}
                                    onChange={(e) => setData('recipient_phone', e.target.value)}
                                />

                                <Input
                                    label="Recipient Address"
                                    value={data.recipient_address}
                                    error={errors.recipient_address}
                                    onChange={(e) => setData('recipient_address', e.target.value)}
                                />

                                <Input
                                    label="Recipient City"
                                    value={data.recipient_city}
                                    error={errors.recipient_city}
                                    onChange={(e) => setData('recipient_city', e.target.value)}
                                />

                                <Input
                                    label="Delivery Post Office"
                                    value={data.delivery_post_office}
                                    error={errors.delivery_post_office}
                                    onChange={(e) => setData('delivery_post_office', e.target.value)}
                                />
                            </div>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Shipment Information
                            </h2>

                            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                                <Input
                                    label="Ransom Amount"
                                    type="number"
                                    value={data.ransom_amount}
                                    error={errors.ransom_amount}
                                    onChange={(e) => setData('ransom_amount', e.target.value)}
                                />

                                <Input
                                    label="Invoice Number"
                                    value={data.invoice_number}
                                    error={errors.invoice_number}
                                    onChange={(e) => setData('invoice_number', e.target.value)}
                                />

                                <Input
                                    label="Weight"
                                    type="number"
                                    step="0.01"
                                    value={data.weight}
                                    error={errors.weight}
                                    onChange={(e) => setData('weight', e.target.value)}
                                />

                                <Select
                                    label="Delivery Type"
                                    value={data.delivery_type}
                                    error={errors.delivery_type}
                                    onChange={(e) => setData('delivery_type', e.target.value)}
                                    options={[
                                        { value: 'home', label: 'Home Delivery' },
                                        { value: 'post_office', label: 'Post Office Pickup' },
                                    ]}
                                />

                                <Select
                                    label="Pickup Type"
                                    value={data.pickup_type}
                                    error={errors.pickup_type}
                                    onChange={(e) => setData('pickup_type', e.target.value)}
                                    options={[
                                        { value: 'post_office', label: 'Post Office' },
                                        { value: 'address', label: 'Address' },
                                    ]}
                                />

                                <Input
                                    label="Pickup Location"
                                    value={data.pickup_location}
                                    error={errors.pickup_location}
                                    onChange={(e) => setData('pickup_location', e.target.value)}
                                />
                            </div>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Note
                            </h2>

                            <textarea
                                value={data.note}
                                onChange={(e) => setData('note', e.target.value)}
                                rows="4"
                                className="mt-4 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />

                            {errors.note && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.note}
                                </p>
                            )}
                        </section>

                        <div className="flex items-center justify-end gap-3">
                            <Link
                                href={route('admin.shipments.show', shipment.id)}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function Input({ label, type = 'text', step, value, onChange, error }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">
                {label}
            </label>

            <input
                type={type}
                step={step}
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

function Select({ label, value, onChange, error, options }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">
                {label}
            </label>

            <select
                value={value}
                onChange={onChange}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            {error && (
                <p className="mt-1 text-sm text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}
