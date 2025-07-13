import { SectionCards } from '@/components/section-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tambah produk',
        href: '/produk',
    },
];

export default function Addproduk() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Addproduk" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">

                <h2>tambah produk</h2>
            </div>
        </AppLayout>
    );
}
