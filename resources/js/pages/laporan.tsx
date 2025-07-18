import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Invoice, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { DialogClose } from '@radix-ui/react-dialog';
import { PenBox } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';
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

export default function Laporan({ invoice }: Prop) {
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice>();
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleApprove = async () => {
    if (!selectedInvoice) return;
    try {
        await axios.post(
            `/purchase/${selectedInvoice.id}`,
            { status: 'approved' },
            { headers: { 'Content-Type': 'application/json' } }
        );
        toast.success('Status berhasil diubah menjadi approved');
        setDialogOpen(false);
        // Optional: reload halaman atau fetch ulang data invoice
        window.location.reload();
    } catch  (err) {
        console.error('Gagal mengubah status'+err);
    }
};
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
                            <TableHead className="w-[100px]">No Invoice</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Total</TableHead>

                            <TableHead className="flex justify-center">Detail</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoice.map((invoice) => (
                            <TableRow key={invoice.id}>
                                <TableCell className="font-medium">{invoice.id}</TableCell>
                                <TableCell>{invoice.status}</TableCell>

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
                                                                    <CardTitle>Pembayaran</CardTitle>
                                                                </CardHeader>
                                                                <CardContent className="mb-2 space-y-2">
                                                                    <div>
                                                                        <span className="font-semibold">Bank:</span>
                                                                        <p>BCA</p>
                                                                    </div>
                                                                    <div>
                                                                        <span className="font-semibold">No Rekening:</span>
                                                                        <p>02397489289748</p>
                                                                    </div>
                                                                    <div>
                                                                        <span className="font-semibold">Atas Nama:</span>
                                                                        <p>Rainbee</p>
                                                                    </div>
                                                                    <p className="font-black">
                                                                        Mohon konfirmasi setelah melakukan pembayaran. Terima kasih telah berbelanja
                                                                        di TokoKami!
                                                                    </p>
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
                                                    <DialogClose asChild>
                                                        <Button variant="outline">Batal</Button>
                                                    </DialogClose>
                                                    <Button type="button" onClick={handleApprove}>Konfirmsi Pembayaran</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </form>
                                    </Dialog>
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
