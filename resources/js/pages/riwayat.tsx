import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Invoice } from '@/types';
import { PenBox, SlashIcon, Trash2 } from 'lucide-react';
import { useState } from 'react';

type Prop = {
    invoices: Invoice[];
};

export default function Riwayat({ invoices }: Prop) {
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };
    const handleRemoveImage = () => {
        setImage(null);
        setPreview(null);
    };

    return (
        <div className="grid min-h-screen gap-6 p-6">
            <div className="space-y-4 md:col-span-2">
                <header className="text-3xl font-bold text-[#f59e0b]">Riwayat Pembelian</header>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Welcome</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator>
                            <SlashIcon />
                        </BreadcrumbSeparator>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/riwayat">Riwayat</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="items-right flex justify-end">
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
                    <TableCaption>Seluruh Pesanan anda.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">No Invoice</TableHead>
                            <TableHead>Produk</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead className="text-center">Detail</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoices.map((invoice) => (
                            <TableRow key={invoice.id}>
                                <TableCell className="font-medium">{invoice.id}</TableCell>

                                {/* Nama produk, bisa lebih dari satu */}
                                <TableCell>
                                    <ul className="space-y-1">
                                        {invoice.cart.details.map((item, idx) => (
                                            <li key={idx}>
                                                {item.product.name} x {item.quantity}
                                            </li>
                                        ))}
                                    </ul>
                                </TableCell>

                                <TableCell>{invoice.status}</TableCell>
                                <TableCell>Rp{new Intl.NumberFormat('id-ID').format(invoice.total)}</TableCell>

                                {/* Tombol Detail & Batalkan */}
                                <TableCell className="flex justify-center space-x-2">
                                    {/* === Dialog Detail Pesanan === */}
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline">
                                                <PenBox />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="flex max-h-screen flex-col sm:max-w-[1080px]">
                                            <DialogHeader>
                                                <DialogTitle>Detail Pesanan</DialogTitle>
                                                <DialogDescription>No Invoice: {invoice.id}</DialogDescription>
                                            </DialogHeader>
                                            <div className="flex flex-1 flex-col gap-6 overflow-y-auto pt-4 lg:flex-row">
                                                {/* KIRI */}
                                                <div className="flex w-full flex-col items-center gap-3 lg:w-1/2">
                                                    <main className="flex-1 space-y-6 overflow-y-auto p-6">
                                                        {/* Pelanggan */}
                                                        <Card>
                                                            <CardHeader className="mt-2">
                                                                <CardTitle>Detail Pelanggan</CardTitle>
                                                            </CardHeader>
                                                            <CardContent className="mb-2 space-y-2">
                                                                <p>{invoice.cart.user.name}</p>
                                                                <div>
                                                                    <span className="font-semibold">Alamat Pengiriman:</span>
                                                                    <p>
                                                                        {invoice.address.address_line}, {invoice.address.district},{' '}
                                                                        {invoice.address.city}, {invoice.address.state} {invoice.address.postal_code}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <span className="font-semibold">Nomor Telepon:</span>
                                                                    <p>{invoice.address.phone_number}</p>
                                                                </div>
                                                            </CardContent>
                                                        </Card>

                                                        {/* Produk */}
                                                        <Card>
                                                            <CardHeader className="mt-2">
                                                                <CardTitle>Produk</CardTitle>
                                                            </CardHeader>
                                                            <CardContent className="mb-2">
                                                                <Table>
                                                                    <TableHeader>
                                                                        <TableRow>
                                                                            <TableHead>Nama</TableHead>
                                                                            <TableHead>Jumlah</TableHead>
                                                                            <TableHead>Harga</TableHead>
                                                                            <TableHead>Total</TableHead>
                                                                        </TableRow>
                                                                    </TableHeader>
                                                                    <TableBody>
                                                                        {invoice.cart.details.map((item, idx) => (
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

                                                        {/* Total */}
                                                        <Card>
                                                            <CardHeader>
                                                                <CardTitle>Total Pembelian</CardTitle>
                                                            </CardHeader>
                                                            <CardContent>
                                                                <div className="flex items-center font-medium">
                                                                    <div>Total</div>
                                                                    <div className="ml-auto">
                                                                        Rp{new Intl.NumberFormat('id-ID').format(invoice.total)}
                                                                    </div>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    </main>
                                                </div>

                                                {/* KANAN */}
                                                <div className="flex w-full flex-col items-center gap-3 lg:w-1/2">
                                                    <Label>Upload Bukti Pembayaran</Label>
                                                    <input type="file" accept="image/*" onChange={handleImageChange} />
                                                    {preview && <img src={preview} className="h-48 w-48 rounded object-contain" />}
                                                    <Button onClick={handleRemoveImage} className="mt-2 w-full" variant="destructive">
                                                        Hapus Gambar
                                                    </Button>
                                                </div>
                                            </div>
                                            <DialogFooter className="border-t pt-4">
                                                <DialogClose asChild>
                                                    <Button variant="outline">Cancel</Button>
                                                </DialogClose>
                                                <Button type="submit">Save changes</Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>

                                    {/* === Dialog Batalkan Pesanan === */}
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button className="bg-red-500 text-white hover:bg-red-600">
                                                <Trash2 />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px]">
                                            <DialogHeader>
                                                <DialogTitle>Batalkan Pesanan</DialogTitle>
                                                <DialogDescription>Yakin ingin membatalkan pesanan ini?</DialogDescription>
                                            </DialogHeader>
                                            <DialogFooter>
                                                <DialogClose asChild>
                                                    <Button variant="outline">Tidak</Button>
                                                </DialogClose>
                                                <Button className="bg-red-500 text-white hover:bg-red-600" type="submit">
                                                    Ya
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>

                    <TableFooter></TableFooter>
                </Table>
            </div>
        </div>
    );
}
