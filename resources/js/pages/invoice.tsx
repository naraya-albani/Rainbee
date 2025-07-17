import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useState } from 'react';




export default function Component() {

    const [image, setImage] = useState<File | null>(null);
        const [preview, setPreview] = useState<string | null>(null);

        const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
                setImage(file);
                setPreview(URL.createObjectURL(file));
            }
        };
       


    return (
        <div className="flex h-screen flex-col">
            <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-white p-6">
                <h1 className="text-2xl font-bold text-[#f59e0b]">RAINBEE.</h1>
                <div>
                    <h2 className="text-xl font-semibold">Invoice #INV001</h2>
                    <p className="text-gray-500">Tanggal: 12/12/2023</p>
                </div>
            </header>

            <div className="scrollbar-hide flex flex-1 overflow-hidden">
                <main className="flex-1 space-y-6 overflow-y-auto p-6">
                    <Card>
                        <CardHeader className='mt-2'>
                            <CardTitle>Detail Pelanggan</CardTitle>

                        </CardHeader>
                        <CardContent className="space-y-2 mb-2">
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
                        <CardHeader className='mt-2'>
                            <CardTitle>Produk Madu</CardTitle>
                        </CardHeader>
                        <CardContent className='mb-2'>
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
                        <CardHeader className='mt-2'>
                            <CardTitle>Pembayaran</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 mb-2">
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

                    <Card>
                        <CardHeader className='mt-2'>
                            <CardTitle>Total Pembelian</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-2 mb-2">
                            <Separator />
                            <div className="flex items-center font-medium">
                                <div>Total</div>
                                <div className="ml-auto">$385.00</div>
                            </div>
                        </CardContent>
                    </Card>
                </main>

                <div className="md:flex-col flex flex-row w-full items-center justify-start gap-2 border-t md:border-l md:border-t-0 bg-white p-6 md:w-1/4 fixed bottom-0 md:static">
                <div className="flex flex-col gap-4 w-full">
                    <Dialog>
                        <form >
                            <div className='w-full'>
                            <DialogTrigger asChild className='w-full'>
                                <Button className='w-full'>
                                    Bayar
                                </Button>
                            </DialogTrigger>
                            </div>
                            <DialogContent className=" max-h-screen ">
                                <DialogHeader>
                                    <DialogTitle>Bukti Pembayaran</DialogTitle>
                                    <DialogDescription>Kirim Bukti Pembayaran disini.</DialogDescription>
                                </DialogHeader>
                                <div className="flex flex-col gap-6 pt-4 lg:flex-row overflow-y-auto flex-1">
                                    <div className="flex w-full flex-col items-center gap-3 ">
                                        <Label className="text-lg font-semibold">Upload Bukti Pembayaran</Label>
                                        <input type="file" accept="image/*" onChange={handleImageChange} />
                                        {preview && <img src={preview} alt="Preview" className="h-48 w-48 rounded object-cover" />}
                                        <Button >
                                            Kirim Gambar
                                        </Button>
                                    </div>

                                </div>

                            </DialogContent>

                        </form>
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
