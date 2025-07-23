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
import { Rating, RatingButton } from '@/components/ui/rating';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ImageVideoUploader } from '@/components/upfile';
import AppLayout from '@/layouts/app-layout';
import { Invoice, BreadcrumbItem as TypeBreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import axios from 'axios';
import { Ban, SlashIcon, SquareArrowOutUpRight, Star } from 'lucide-react';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

type Prop = {
    invoices: Invoice[];
};

const breadcrumbs: TypeBreadcrumbItem[] = [
    {
        title: 'Riwayat Pemesanan',
        href: '/riwayat',
    },
];

export default function Riwayat({ invoices }: Prop) {
    const [preview, setPreview] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

    const filteredInvoices = statusFilter && statusFilter !== 'all' ? invoices.filter((invoice) => invoice.status === statusFilter) : invoices;
    const [open, setOpen] = useState(false);

    const { data, setData, errors } = useForm<{
        receipt: File | null;
    }>({
        receipt: null,
    });

    const handleSubmit = async (e: React.FormEvent, id: string) => {
        e.preventDefault();

        const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement;
        const action = submitter?.value;

        if (action === 'upload') {
            if (!data.receipt) {
                toast.warning('Mohon unggah bukti pembayaran atau hubungi admin.');
                return;
            }

            const formData = new FormData();
            formData.append('receipt', data.receipt);

            try {
                await axios.post(route('purchase.update', id), formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                toast.success('Berhasil mengunggah bukti');
                router.visit('/riwayat');
            } catch (error) {
                console.error('Upload gagal:', error);
            }
        } else if (action === 'claimed') {
            const formData = new FormData();
            formData.append('status', action);

            try {
                await axios.post(route('purchase.update', id), formData);
                toast.success('Terima kasih telah membeli produk kami');
                router.visit('/riwayat');
            } catch (error) {
                console.error('Upload gagal:', error);
            }
        }
    };

    const handleCancel = async (e: React.FormEvent, id: string) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('status', 'canceled');

        try {
            await axios.post(route('purchase.update', id), formData);
            toast.success('Berhasil dibatalkan pemesanannya');
            router.visit('/riwayat');
        } catch (error) {
            console.error('Upload gagal:', error);
            alert('Gagal dibatalkan pemesanannya');
        }
    };

    const handleRemoveImage = () => {
        setData((prev) => ({ ...prev, receipt: null }));
    };

    const onDrop = (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setData('receipt', acceptedFiles[0]); // hanya ambil satu file
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpg', '.jpeg', '.png'],
        },
        maxSize: 2 * 1024 * 1024, // 2MB
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Riwayat Pemesanan" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="space-y-4 md:col-span-2">
                    <header className="text-3xl font-bold text-[#f59e0b]">Riwayat Pemesanan</header>
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
                        <Select onValueChange={(value) => setStatusFilter(value === 'all' ? undefined : value)}>
                            <SelectTrigger className="w-[180px] bg-[#f59e0b] text-white [&>span]:text-white [&>span]:opacity-100 [&>svg]:text-white">
                                <SelectValue placeholder="Filter" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    <SelectItem value="pending">Menunggu Pembayaran</SelectItem>
                                    <SelectItem value="waiting">Menunggu Konfirmasi</SelectItem>
                                    <SelectItem value="approved">Disetujui</SelectItem>
                                    <SelectItem value="sending">Dalam Perjalanan</SelectItem>
                                    <SelectItem value="claimed">Selesai</SelectItem>
                                    <SelectItem value="rejected">Dikembalikan</SelectItem>
                                    <SelectItem value="canceled">Ditolak</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="w-full overflow-x-auto">
                        <div className="min-w-[900px]">
                            <Table className="min-w-[900px]">
                                <TableCaption>Seluruh Pesanan anda.</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">Waktu</TableHead>
                                        <TableHead>Produk</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead className="text-center">Detail</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredInvoices.map((invoice) => {
                                        const attachments: string[] = (() => {
                                            if (!invoice.attachment) return [];
                                            if (Array.isArray(invoice.attachment)) return invoice.attachment;
                                            try {
                                                return JSON.parse(invoice.attachment);
                                            } catch (e) {
                                                console.error('Failed to parse attachment JSON:', e);
                                                return [];
                                            }
                                        })();

                                        return (
                                            <TableRow key={invoice.id}>
                                                <TableCell className="font-medium">
                                                    {new Date(invoice.created_at).toLocaleString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        timeZone: 'Asia/Jakarta',
                                                        hour12: false,
                                                    })}
                                                </TableCell>
                                                <TableCell>
                                                    <ul className="space-y-1">
                                                        {invoice.cart.details.map((item, idx) => (
                                                            <li key={idx}>
                                                                {item.product.name} x {item.quantity}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </TableCell>
                                                <TableCell>
                                                    {invoice.status === 'pending'
                                                        ? 'Menunggu Pembayaran'
                                                        : invoice.status === 'waiting'
                                                          ? 'Menunggu Konfirmasi'
                                                          : invoice.status === 'approved'
                                                            ? 'Disetujui'
                                                            : invoice.status === 'sending'
                                                              ? 'Dalam Perjalanan'
                                                              : invoice.status === 'claimed'
                                                                ? 'Selesai'
                                                                : invoice.status === 'canceled'
                                                                  ? 'Dibatalkan'
                                                                  : invoice.status === 'rejected'
                                                                    ? 'Ditolak'
                                                                    : invoice.status}
                                                </TableCell>
                                                <TableCell>Rp{new Intl.NumberFormat('id-ID').format(invoice.total)}</TableCell>

                                                <TableCell className="flex justify-center space-x-2">
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button variant="outline" onClick={() => setPreview(null)}>
                                                                <SquareArrowOutUpRight />
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[1080px]">
                                                            <form onSubmit={(e) => handleSubmit(e, invoice.id)}>
                                                                <DialogHeader>
                                                                    <DialogTitle>Detail Pesanan</DialogTitle>
                                                                    <DialogDescription>No. Invoice: {invoice.id}</DialogDescription>
                                                                </DialogHeader>
                                                                <div className="flex flex-1 flex-col gap-6 overflow-y-auto pt-4 lg:flex-row">
                                                                    {/* KIRI */}
                                                                    <div className="flex w-full flex-col items-center gap-3 lg:w-1/2">
                                                                        <main className="flex-1 space-y-6 overflow-y-auto">
                                                                            <Card className="py-4">
                                                                                <CardHeader className="mt-2">
                                                                                    <CardTitle>Detail</CardTitle>
                                                                                </CardHeader>
                                                                                <CardContent className="mb-2 space-y-2">
                                                                                    <div>
                                                                                        <span className="font-semibold">Waktu Pemesanan</span>
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
                                                                                    </div>
                                                                                    <div>
                                                                                        <span className="font-semibold">Nama Pengirim</span>
                                                                                        <p>{invoice.cart.user.name}</p>
                                                                                    </div>
                                                                                    <div>
                                                                                        <span className="font-semibold">Alamat Pengiriman</span>
                                                                                        <p>
                                                                                            {invoice.address.address_line}, {invoice.address.district}
                                                                                            , {invoice.address.city}, {invoice.address.state}{' '}
                                                                                            {invoice.address.postal_code}
                                                                                        </p>
                                                                                    </div>
                                                                                    <div>
                                                                                        <span className="font-semibold">Nomor Telepon</span>
                                                                                        <p>{invoice.address.phone_number}</p>
                                                                                    </div>
                                                                                </CardContent>
                                                                            </Card>

                                                                            <Card className="py-4">
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
                                                                                                        Rp
                                                                                                        {new Intl.NumberFormat('id-ID').format(
                                                                                                            item.product.price,
                                                                                                        )}
                                                                                                    </TableCell>
                                                                                                    <TableCell>
                                                                                                        Rp
                                                                                                        {new Intl.NumberFormat('id-ID').format(
                                                                                                            item.price,
                                                                                                        )}
                                                                                                    </TableCell>
                                                                                                </TableRow>
                                                                                            ))}
                                                                                        </TableBody>
                                                                                    </Table>
                                                                                </CardContent>
                                                                            </Card>

                                                                            {invoice.status === 'pending' && (
                                                                                <Card className="py-4">
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
                                                                                            Mohon konfirmasi setelah melakukan pembayaran. Terima
                                                                                            kasih telah berbelanja di Rainbee!
                                                                                        </p>
                                                                                    </CardContent>
                                                                                </Card>
                                                                            )}

                                                                            <Card className="py-4">
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
                                                                    {invoice.status === 'pending' && (
                                                                        <div className="flex w-full flex-col items-center gap-3">
                                                                            <Card className="py-4">
                                                                                <CardHeader className="mt-2">
                                                                                    <CardTitle>Unggah Bukti Pembayaran</CardTitle>
                                                                                </CardHeader>
                                                                                <CardContent className="mb-2 space-y-2">
                                                                                    {data.receipt === null && (
                                                                                        <div
                                                                                            {...getRootProps()}
                                                                                            className="cursor-pointer rounded-md border-2 border-dashed border-[#f59e0b] p-6 text-center transition hover:bg-blue-50"
                                                                                        >
                                                                                            <input {...getInputProps()} />
                                                                                            {isDragActive ? (
                                                                                                <p>Drop file di sini...</p>
                                                                                            ) : (
                                                                                                <p>Drag & drop atau klik untuk memilih dokumen</p>
                                                                                            )}
                                                                                            <p className="mt-1 text-sm text-muted-foreground">
                                                                                                Format: .jpg, .png, .jpeg
                                                                                                <br />
                                                                                                (maks. ukuran 1 MB)
                                                                                            </p>
                                                                                        </div>
                                                                                    )}

                                                                                    {data.receipt && (
                                                                                        <>
                                                                                            <img
                                                                                                src={URL.createObjectURL(data.receipt)}
                                                                                                alt={data.receipt.name}
                                                                                                className="w-full rounded object-cover"
                                                                                            />
                                                                                            <Button
                                                                                                onClick={handleRemoveImage}
                                                                                                className="mt-2 w-full"
                                                                                                variant="destructive"
                                                                                            >
                                                                                                Hapus Gambar
                                                                                            </Button>
                                                                                        </>
                                                                                    )}
                                                                                </CardContent>
                                                                            </Card>
                                                                        </div>
                                                                    )}

                                                                    {invoice.status === 'waiting' && (
                                                                        <div className="flex flex-col gap-3 max-md:items-center">
                                                                            <Card className="py-4">
                                                                                <CardHeader className="mt-2">
                                                                                    <CardTitle>Bukti Pembayaran</CardTitle>
                                                                                </CardHeader>
                                                                                <CardContent className="mb-2 space-y-2">
                                                                                    <img
                                                                                        src={`/storage/${invoice.receipt}`}
                                                                                        alt=""
                                                                                        className="w-48 rounded object-contain"
                                                                                    />
                                                                                </CardContent>
                                                                            </Card>
                                                                        </div>
                                                                    )}

                                                                    {invoice.status === 'approved' && invoice.receipt && (
                                                                        <div className="flex flex-col gap-3 max-md:items-center">
                                                                            <Card className="py-4">
                                                                                <CardHeader className="mt-2">
                                                                                    <CardTitle>Bukti Pembayaran</CardTitle>
                                                                                </CardHeader>
                                                                                <CardContent className="mb-2 space-y-2">
                                                                                    <img
                                                                                        src={`/storage/${invoice.receipt}`}
                                                                                        alt=""
                                                                                        className="w-48 rounded object-contain"
                                                                                    />
                                                                                </CardContent>
                                                                            </Card>
                                                                        </div>
                                                                    )}

                                                                    {(invoice.status === 'rejected' ||
                                                                        invoice.status === 'claimed' ||
                                                                        invoice.status === 'sending') && (
                                                                        <div className="flex flex-col gap-3 max-md:items-center">
                                                                            {(invoice.rating !== null || invoice.rating !== 0) &&
                                                                                invoice.attachment !== null &&
                                                                                invoice.comment !== null && (
                                                                                    <Card className="py-4">
                                                                                        <CardHeader className="mt-2">
                                                                                            <CardTitle>Testimoni</CardTitle>
                                                                                        </CardHeader>
                                                                                        <CardContent className="mb-2 space-y-2">
                                                                                            <div className="flex flex-col">
                                                                                                <span className="font-semibold">Rating</span>
                                                                                                <Rating
                                                                                                    defaultValue={invoice.rating ?? undefined}
                                                                                                    readOnly
                                                                                                >
                                                                                                    {Array.from({ length: 5 }).map((_, index) => (
                                                                                                        <RatingButton key={index} />
                                                                                                    ))}
                                                                                                </Rating>
                                                                                            </div>
                                                                                            <div>
                                                                                                <span className="font-semibold">Komentar</span>
                                                                                                <p>{invoice.comment}</p>
                                                                                            </div>
                                                                                            <div>
                                                                                                <span className="font-semibold">Lampiran</span>
                                                                                                <div className="flex flex-wrap gap-2">
                                                                                                    {attachments.map((url: string, index: number) => (
                                                                                                        <img
                                                                                                            key={index}
                                                                                                            src={`/storage/${url}`}
                                                                                                            alt={`Lampiran ${index + 1}`}
                                                                                                            width={150}
                                                                                                            height={150}
                                                                                                            className="rounded-md border object-cover"
                                                                                                        />
                                                                                                    ))}
                                                                                                </div>
                                                                                            </div>
                                                                                        </CardContent>
                                                                                    </Card>
                                                                                )}
                                                                            <Card className="py-4">
                                                                                <CardHeader className="mt-2">
                                                                                    <CardTitle>Bukti Pembayaran</CardTitle>
                                                                                </CardHeader>
                                                                                <CardContent className="mb-2 space-y-2">
                                                                                    <img
                                                                                        src={`/storage/${invoice.receipt}`}
                                                                                        alt=""
                                                                                        className="w-48 rounded object-contain"
                                                                                    />
                                                                                </CardContent>
                                                                            </Card>
                                                                        </div>
                                                                    )}

                                                                    {/* {invoice.status === 'sending' && (
                                                                        <div className="flex w-full flex-col items-center gap-3 lg:w-1/2">
                                                                            <Dialog open={open} onOpenChange={setOpen}>
                                                                                <DialogTrigger asChild>
                                                                                    <Button
                                                                                        variant="link"
                                                                                        className="p-0 text-blue-600 hover:underline"
                                                                                        onClick={() => setOpen(true)}
                                                                                    >
                                                                                        Lihat Bukti Pembayaran
                                                                                    </Button>
                                                                                </DialogTrigger>
                                                                                <DialogContent className="max-w-4xl">
                                                                                    <DialogHeader>
                                                                                        <DialogTitle>Bukti Pembayaran</DialogTitle>
                                                                                    </DialogHeader>
                                                                                    <div className="h-[500px] w-full overflow-hidden rounded border">
                                                                                        <TransformWrapper>
                                                                                            <TransformComponent>
                                                                                                <img
                                                                                                    src={`/storage/${invoice.receipt}`}
                                                                                                    alt="Bukti Pembayaran"
                                                                                                    className="mx-auto max-h-full max-w-full object-contain"
                                                                                                />
                                                                                            </TransformComponent>
                                                                                        </TransformWrapper>
                                                                                    </div>
                                                                                </DialogContent>
                                                                            </Dialog>
                                                                        </div>
                                                                    )} */}
                                                                </div>
                                                                <DialogFooter className="border-t pt-4">
                                                                    <DialogClose asChild>
                                                                        <Button variant="outline">Tutup</Button>
                                                                    </DialogClose>
                                                                    {invoice.status === 'sending' && (
                                                                        <>
                                                                            <Dialog>
                                                                                <DialogTrigger>
                                                                                    <Button variant={'destructive'}>Komplain</Button>
                                                                                </DialogTrigger>
                                                                                <DialogContent>
                                                                                    <DialogTitle>Komplain</DialogTitle>
                                                                                    <ImageVideoUploader id={invoice.id} status="rejected" />
                                                                                </DialogContent>
                                                                            </Dialog>
                                                                            <Button type="submit" name="action" value="claimed">
                                                                                Barang Diterima
                                                                            </Button>
                                                                        </>
                                                                    )}
                                                                    {invoice.status === 'pending' && (
                                                                        <Button type="submit" name="action" value="upload">
                                                                            Kirim Bukti
                                                                        </Button>
                                                                    )}
                                                                </DialogFooter>
                                                            </form>
                                                        </DialogContent>
                                                    </Dialog>

                                                    {invoice.status === 'pending' && (
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button className="bg-red-500 text-white hover:bg-red-600">
                                                                    <Ban />
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent className="sm:max-w-[425px]">
                                                                <form onSubmit={(e) => handleCancel(e, invoice.id)}>
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
                                                                </form>
                                                            </DialogContent>
                                                        </Dialog>
                                                    )}

                                                    {invoice.status === 'claimed' && (invoice.rating === null || invoice.rating === 0) && (
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button>
                                                                    <Star />
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent>
                                                                <DialogTitle>Ulas Pesanan</DialogTitle>
                                                                <ImageVideoUploader id={invoice.id} status="claimed" />
                                                            </DialogContent>
                                                        </Dialog>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>

                                <TableFooter></TableFooter>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
