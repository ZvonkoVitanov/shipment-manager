import { Link } from '@inertiajs/react';

export default function Pagination({ links }) {
    if (!links || links.length <= 3) {
        return null;
    }

    return (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {links.map((link, index) => (
                <Link
                    key={index}
                    href={link.url || '#'}
                    preserveScroll
                    preserveState
                    className={[
                        'rounded-lg px-3 py-2 text-sm font-medium',
                        link.active
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50',
                        !link.url ? 'pointer-events-none opacity-50' : '',
                    ].join(' ')}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ))}
        </div>
    );
}
