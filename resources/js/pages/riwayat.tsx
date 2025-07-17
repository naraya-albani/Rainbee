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
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PenBox, SlashIcon, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function Riwayat() {
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
                        <TableRow>
                            <TableCell className="font-medium">No Invoice</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Produk</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell className="flex justify-center space-x-2">
                                <Dialog>
                                    <form>
                                        <DialogTrigger asChild>
                                            <Button variant={'outline'}>
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
                                                                <p>nama pelanggan</p>
                                                                <div>
                                                                    <span className="font-semibold">Alamat Pengiriman:</span>
                                                                    <p>jember, 1112030, 1112, 11 12345</p>
                                                                </div>
                                                                <div>
                                                                    <span className="font-semibold">Nomor Telefon:</span>
                                                                    <p>02397489289748</p>
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
                                                                        <TableRow>
                                                                            <TableCell>Item 1</TableCell>
                                                                            <TableCell>2</TableCell>
                                                                            <TableCell>$100</TableCell>
                                                                            <TableCell>$200</TableCell>
                                                                        </TableRow>
                                                                        <TableRow>
                                                                            <TableCell>Item 2</TableCell>
                                                                            <TableCell>1</TableCell>
                                                                            <TableCell>$150</TableCell>
                                                                            <TableCell>$150</TableCell>
                                                                        </TableRow>
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
                                                                    Mohon konfirmasi setelah melakukan pembayaran. Terima kasih telah berbelanja di
                                                                    TokoKami!
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
                                                                    <div className="ml-auto">$385.00</div>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    </main>
                                                </div>

                                                {/* kanan */}
                                                <div className="flex w-full flex-col items-center gap-3 lg:w-1/2">
                                                    <Label>Upload bukti pembayaran</Label>
                                                    <input type="file" accept="image/*" onChange={handleImageChange} />
                                                    {preview && <img src={preview} alt="Preview" className="h-48 w-48 rounded object-contain" />}
                                                    <Button type="button" onClick={handleRemoveImage} className="mt-2 w-full" variant="destructive">
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
                                    </form>
                                </Dialog>
                                <Dialog>
                                    <form>
                                        <DialogTrigger asChild>
                                            <Button className="bg-red-500 text-white hover:bg-red-600">
                                                <Trash2></Trash2>
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px]">
                                            <DialogHeader>
                                                <DialogTitle>Batalkan Pesanan</DialogTitle>
                                                <DialogDescription>Yakin untuk membatalkan pesnan?.</DialogDescription>
                                            </DialogHeader>
                                            <DialogFooter>
                                                <DialogClose asChild>
                                                    <Button variant="outline">tidak</Button>
                                                </DialogClose>
                                                <Button className="bg-red-500 text-white hover:bg-red-600" type="submit">
                                                    ya
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </form>
                                </Dialog>
                              
                            </TableCell>
                        </TableRow>
                    </TableBody>
                    <TableFooter></TableFooter>
                </Table>
            </div>
        </div>
    );
}
