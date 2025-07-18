import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Invoice } from '@/types';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';

type Prop = {
    invoice: Invoice;
};

export default function Purchase({ invoice }: Prop) {
    const [preview, setPreview] = useState<string | null>(null);

    const { put, data, setData, processing } = useForm<{
        receipt: File | null;
    }>({
        receipt: null,
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('receipt', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.receipt) {
            alert('Mohon pilih gambar terlebih dahulu.');
            return;
        }

        const formData = new FormData();
        formData.append('receipt', data.receipt);

        try {
            await axios.post(route('purchase.update', invoice.id), formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('Berhasil mengunggah bukti');
        } catch (error) {
            console.error('Upload gagal:', error);
            alert('Gagal mengunggah bukti');
        }
    };

    return (
        <div className="flex h-screen flex-col">
            <header className="sticky top-0 z-10 flex items-center justify-between border-b p-6">
                <h1 className="text-2xl font-bold text-[#f59e0b]">RAINBEE.</h1>
                <div>
                    <h2 className="text-xl font-semibold">Invoice #INV001</h2>
                    <p className="text-gray-500">Tanggal: 12/12/2023</p>
                </div>
            </header>

            <div className="scrollbar-hide flex flex-1 overflow-hidden">
                <main className="flex-1 space-y-6 overflow-y-auto p-6">
                    <Card>
                        <CardHeader className="mt-2">
                            <CardTitle>Detail Pelanggan</CardTitle>
                        </CardHeader>
                        <CardContent className="mb-2 space-y-2">
                            <p>{invoice.cart.user.name}</p>
                            <div>
                                <span className="font-semibold">Alamat Pengiriman:</span>
                                <p>
                                    {invoice.address.address_line}, {invoice.address.district}, {invoice.address.city}, {invoice.address.state}{' '}
                                    {invoice.address.postal_code}
                                </p>
                            </div>
                            <div>
                                <span className="font-semibold">Nomor Telefon:</span>
                                <p>{invoice.address.phone_number}</p>
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
                                    {invoice.cart.details.map((item, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell>{item.product.name}</TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                            <TableCell>Rp{new Intl.NumberFormat('id-ID').format(item.product.price)}</TableCell>
                                            <TableCell>Rp{new Intl.NumberFormat('id-ID').format(item.price)}</TableCell>
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
                            <p className="font-black">Mohon konfirmasi setelah melakukan pembayaran. Terima kasih telah berbelanja di TokoKami!</p>
                        </CardContent>
                    </Card>
                </main>

                <div className="fixed bottom-0 flex w-full flex-row items-center justify-start gap-2 border-t p-6 md:static md:w-1/4 md:flex-col md:border-t-0 md:border-l">
                    <div className="flex w-full flex-col gap-4">
                        <Card>
                            <CardHeader className="mt-2">
                                <CardTitle>Total Pembelian</CardTitle>
                            </CardHeader>
                            <CardContent className="mb-2 grid gap-2">
                                <Separator />
                                <div className="flex items-center font-medium">
                                    <div>Total</div>
                                    <div className="ml-auto">Rp{new Intl.NumberFormat('id-ID').format(invoice.total)}</div>
                                </div>
                            </CardContent>
                        </Card>
                        <Dialog>
                            <div className="w-full">
                                <DialogTrigger asChild className="w-full">
                                    <Button className="w-full">Bayar</Button>
                                </DialogTrigger>
                            </div>
                            <DialogContent className="max-h-screen">
                                <DialogHeader>
                                    <DialogTitle>Bukti Pembayaran</DialogTitle>
                                    <DialogDescription>Kirim Bukti Pembayaran disini.</DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleSubmit}>
                                    <div className="flex flex-1 flex-col gap-6 overflow-y-auto pt-4 lg:flex-row">
                                        <div className="flex w-full flex-col items-center gap-3">
                                            <Label className="text-lg font-semibold">Upload Bukti Pembayaran</Label>
                                            <input type="file" name="receipt" accept="image/*" onChange={handleImageChange} />
                                            {preview && <img src={preview} alt="Preview" className="h-48 w-48 rounded object-cover" />}
                                            <Button type="submit" disabled={processing}>
                                                Kirim Gambar
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <Button variant="outline" className="w-full">
                        Batal
                    </Button>
                </div>
            </div>
        </div>
    );
}
