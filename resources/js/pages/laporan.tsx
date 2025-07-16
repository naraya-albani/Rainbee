import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { PenBox } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Laporan',
        href: '/laporan',
    },
];

type PurchaseItem = {
    id: string;
    total: string;
    status: string;
    cart_id: number;
    address_id: number;
    receipt: string | null;
    created_at: string;
    updated_at: string;
};

export default function Laporan() {
    const [invoices, setInvoices] = useState<PurchaseItem[]>([]);

    useEffect(() => {
        fetch('/api/purchase', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setInvoices(data);
            })
            .catch((err) => {
                console.error('Gagal mengambil data keranjang:', err);
            });
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Laporan</h2>
                    <Select>
                        <SelectTrigger className="w-[180px] bg-[#f59e0b] text-white [&>span]:text-white [&>span]:opacity-100 [&>svg]:text-white">
                            <SelectValue placeholder="Filter" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="pending">Menunggu konfirmasi</SelectItem>
                                <SelectItem value="approved">Disetujui</SelectItem>
                                <SelectItem value="claimed">Diterima</SelectItem>
                                <SelectItem value="cancelled">Dibatalkan</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <Table>
                    <TableCaption>A list of your recent invoices.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Pembeli</TableHead>
                            <TableHead>Barang</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead className="flex justify-center">Detail</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoices.map((invoice) => (
                            <TableRow key={invoice.id}>
                                <TableCell className="font-medium">{invoice.id}</TableCell>
                                <TableCell>{invoice.status}</TableCell>
                                <TableCell>{invoice.status}</TableCell>
                                <TableCell>{invoice.total}</TableCell>
                                <TableCell className="flex justify-center space-x-2">
                                    <Button variant="outline">
                                        <PenBox></PenBox>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter></TableFooter>
                </Table>
            </div>
        </AppLayout>
    );
}
