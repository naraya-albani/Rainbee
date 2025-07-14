import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { PlusIcon } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tambah produk',
        href: '/produk',
    },
];

const invoices = [
    {
        namaProduk: 'madu',
        deskripsi: 'madu murni',
        variant: '200 ml',
        stok: '100',
    },
];

export default function Addproduk() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Addproduk" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                <h2>tambah produk</h2>
                <Button>
                    <PlusIcon></PlusIcon>
                    tambah produk
                </Button>
                </div>
                <Table>
                    <TableCaption>Semua produk Rainbee</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Nama Produk</TableHead>
                            <TableHead>Deskripsi</TableHead>
                            <TableHead>Variant</TableHead>
                            <TableHead className="text-leftt">Stok</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoices.map((invoice) => (
                            <TableRow key={invoice.namaProduk}>
                                <TableCell className="font-medium">{invoice.namaProduk}</TableCell>
                                <TableCell>{invoice.deskripsi}</TableCell>
                                <TableCell>{invoice.variant}</TableCell>
                                <TableCell className="text-left">{invoice.stok}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow></TableRow>
                    </TableFooter>
                </Table>
            </div>
        </AppLayout>
    );
}
