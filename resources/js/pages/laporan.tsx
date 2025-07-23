import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Invoice, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { PenBox, SendIcon, Trash } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Laporan',
        href: '/laporan',
    },
];

type Prop = {
    invoice: Invoice[];
};

export default function Laporan({ invoice }: Prop) {
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice>();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredInvoices = statusFilter === 'all' ? invoice : invoice.filter((invoice) => invoice.status === statusFilter);

    const sortedInvoices = [...filteredInvoices].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const handleApprove = async () => {
        if (!selectedInvoice) return;
        try {
            await axios.post(`/purchase/${selectedInvoice.id}`, { status: 'approved' }, { headers: { 'Content-Type': 'application/json' } });
            toast.success('Status berhasil diubah menjadi approved');
            setDialogOpen(false);
            window.location.reload();
        } catch (err) {
            console.error('Gagal mengubah status' + err);
        }
    };

    const handleSending = async () => {
        if (!selectedInvoice) return;
        try {
            await axios.post(`/purchase/${selectedInvoice.id}`, { status: 'sending' }, { headers: { 'Content-Type': 'application/json' } });
            toast.success('Barang telah dikirim');
            setDialogOpen(false);
            window.location.reload();
        } catch (err) {
            console.error('Gagal mengubah status' + err);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Laporan</h2>
                    <Select onValueChange={(value) => setStatusFilter(value)}>
                        <SelectTrigger className="w-[180px] bg-[#f59e0b] text-white [&>span]:text-white [&>span]:opacity-100 [&>svg]:text-white">
                            <SelectValue placeholder="Filter Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="all">Semua</SelectItem>

                                <SelectItem value="pending">Menunggu Pembayaran</SelectItem>
                                <SelectItem value="waiting">Menunggu Konfirmasi</SelectItem>
                                <SelectItem value="approved">Disetujui</SelectItem>
                                <SelectItem value="sending">Dikirim</SelectItem>
                                <SelectItem value="claimed">Selesai</SelectItem>
                                <SelectItem value="canceled">Dibatalkan</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <Table>
                    <TableCaption>Seluruh Invoice yang masuk.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">No Invoice</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead className="flex justify-center">Detail</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedInvoices.map((invoice) => (
                            <TableRow key={invoice.id}>
                                <TableCell className="font-medium">{invoice.id}</TableCell>
                                <TableCell>
                                    {invoice.status === 'pending'
                                        ? 'Menunggu Pembayaran'
                                        : invoice.status === 'waiting'
                                          ? 'Menunggu Konfirmasi'
                                          : invoice.status === 'approved'
                                            ? 'Disetujui'
                                            : invoice.status === 'sending'
                                              ? 'Dikirim'
                                              : invoice.status === 'claimed'
                                                ? 'Diterima'
                                                : invoice.status === 'canceled'
                                                  ? 'Dibatalkan'
                                                  : invoice.status}
                                </TableCell>

                                <TableCell>{invoice.total}</TableCell>
                                <TableCell className="flex justify-center space-x-2">
                                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                                        <form>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => {
                                                        setSelectedInvoice(invoice);
                                                        setDialogOpen(true);
                                                    }}
                                                >
                                                    <PenBox></PenBox>
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="flex max-h-screen flex-col sm:max-w-[1080px]">
                                                <DialogHeader>
                                                    <DialogTitle>Detail Pesanan</DialogTitle>
                                                    <DialogDescription>Cek data sebelum konfirmasi</DialogDescription>
                                                </DialogHeader>
                                                {/* kiri */}
                                                <div className="flex flex-1 flex-col gap-6 overflow-y-auto pt-4 lg:flex-row">
                                                    <div className="flex w-full flex-col items-center gap-3 lg:w-1/2">
                                                        <main className="flex-1 space-y-6 overflow-y-auto p-6">
                                                            <Card>
                                                                <CardHeader className="mt-2">
                                                                    <CardTitle>Detail Pelanggan</CardTitle>
                                                                </CardHeader>
                                                                <CardContent className="mb-2 space-y-2">
                                                                    <p>{selectedInvoice?.cart?.user?.name ?? '-'}</p>
                                                                    <p>
                                                                        Tanggal{' '}
                                                                        {new Date(invoice.created_at).toLocaleString('id-ID', {
                                                                            day: 'numeric',
                                                                            month: 'long',
                                                                            year: 'numeric',
                                                                            hour: '2-digit',
                                                                            minute: '2-digit',
                                                                            timeZone: 'Asia/Jakarta',
                                                                            hour12: false,
                                                                        })}
                                                                    </p>
                                                                    <div>
                                                                        <span className="font-semibold">Alamat Pengiriman:</span>
                                                                        <p>
                                                                            {selectedInvoice?.address?.address_line ?? '-'},{' '}
                                                                            {selectedInvoice?.address?.district ?? '-'},{' '}
                                                                            {selectedInvoice?.address?.city ?? '-'},{' '}
                                                                            {selectedInvoice?.address?.state ?? '-'}{' '}
                                                                            {selectedInvoice?.address?.postal_code ?? '-'}
                                                                        </p>
                                                                    </div>
                                                                    <div>
                                                                        <span className="font-semibold">Nomor Telefon:</span>
                                                                        <p>{selectedInvoice?.address?.phone_number ?? '-'}</p>
                                                                    </div>
                                                                </CardContent>
                                                            </Card>

                                                            <Card>
                                                                <CardHeader className="mt-2">
                                                                    <CardTitle>Produk Madu</CardTitle>
                                                                </CardHeader>
                                                                <CardContent className="mb-2">
                                                                    <Table>
                                                                        <TableHeader>
                                                                            <TableRow>
                                                                                <TableHead>Nama Madu</TableHead>
                                                                                <TableHead>Jumlah barang</TableHead>
                                                                                <TableHead>Harga Madu</TableHead>
                                                                                <TableHead>Total</TableHead>
                                                                            </TableRow>
                                                                        </TableHeader>
                                                                        <TableBody>
                                                                            {selectedInvoice?.cart?.details.map((item, idx) => (
                                                                                <TableRow key={idx}>
                                                                                    <TableCell>{item.product.name}</TableCell>
                                                                                    <TableCell>{item.quantity}</TableCell>
                                                                                    <TableCell>
                                                                                        Rp{new Intl.NumberFormat('id-ID').format(item.product.price)}
                                                                                    </TableCell>
                                                                                    <TableCell>
                                                                                        Rp{new Intl.NumberFormat('id-ID').format(item.price)}
                                                                                    </TableCell>
                                                                                </TableRow>
                                                                            ))}
                                                                        </TableBody>
                                                                    </Table>
                                                                </CardContent>
                                                            </Card>

                                                            <Card>
                                                                <CardHeader className="mt-2">
                                                                    <CardTitle>Total Pembelian</CardTitle>
                                                                </CardHeader>
                                                                <CardContent className="mb-2 grid gap-2">
                                                                    <Separator />
                                                                    <div className="flex items-center font-medium">
                                                                        <div>Total</div>
                                                                        <div className="ml-auto">
                                                                            Rp{selectedInvoice?.total?.toLocaleString('id-ID') ?? '0'}
                                                                        </div>
                                                                    </div>
                                                                </CardContent>
                                                            </Card>
                                                        </main>
                                                    </div>
                                                    {/* kanan */}

                                                    <div className="flex h-full w-full items-center justify-center lg:w-1/2">
                                                        {selectedInvoice?.receipt && (
                                                            <img
                                                                src={`/storage/${selectedInvoice.receipt}`}
                                                                alt="Bukti Pembayaran"
                                                                className="mt-4 h-auto w-full rounded-lg object-cover"
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                                <DialogFooter className="border-t pt-4">
                                                    {(selectedInvoice?.status === 'pending' || selectedInvoice?.status === 'waiting') && (
                                                        <Button type="button" onClick={handleApprove}>
                                                            Konfirmasi Pembayaran
                                                        </Button>
                                                    )}
                                                </DialogFooter>
                                            </DialogContent>
                                        </form>
                                    </Dialog>
                                    {invoice.status === 'approved' && (
                                        <Button
                                            variant="default"
                                            onClick={async () => {
                                                setSelectedInvoice(invoice);
                                                await handleSending();
                                            }}
                                        >
                                            <SendIcon></SendIcon>
                                        </Button>
                                    )}
                                    {(invoice.status === 'waiting' || invoice.status === 'pending') && (
                                        <Button
                                            variant="default"
                                            className="bg-red-500 text-white hover:bg-red-600"
                                            onClick={async () => {
                                                await axios.post(
                                                    `/purchase/${invoice.id}`,
                                                    { status: 'canceled' },
                                                    {
                                                        headers: { 'Content-Type': 'application/json' },
                                                    },
                                                );
                                                toast.error('Pesanan dibatalkan');
                                                window.location.reload();
                                            }}
                                        >
                                            <Trash />
                                        </Button>
                                    )}
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
