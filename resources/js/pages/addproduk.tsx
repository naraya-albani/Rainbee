import { Button } from '@/components/ui/button';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

import { Head } from '@inertiajs/react';

import axios from 'axios';
import { PenBox, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tambah produk',
        href: '/produk',
    },
];

type Product = {
    id: number;
    name: string;
    description: string;
    size: string;
    price: number;
    stock: number;
    image: string;
};

export default function Addproduk() {
    //input produk
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [size, setSize] = useState('');
    const [stock, setStock] = useState('');
    const [price, setPrice] = useState('');

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

    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        axios
            .get('/api/product', { withCredentials: true })
            .then((response) => {
                setProducts(response.data);
            })
            .catch((error) => {
                console.error('Gagal mengambil data produk:', error);
            });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('size', size);
        formData.append('stock', stock);
        formData.append('price', price);
        if (image) {
            formData.append('image', image);
        }

        try {
            const res = await axios.post('/api/product', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });

            console.log('Produk ditambahkan:', res.data);

            // reset form
            setName('');
            setDescription('');
            setSize('');
            setStock('');
            setPrice('');
            setImage(null);
            setPreview(null);

            // refresh produk
            const refreshed = await axios.get('/api/product');
            setProducts(refreshed.data);
        } catch (err) {
            console.error('Gagal menambahkan produk:', err);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Addproduk" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h2>tambah produk</h2>
                    <Dialog>
                        <form onSubmit={handleSubmit}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus></Plus>
                                    Tambahkan Produk
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[1080px] max-h-screen flex flex-col">
                                <DialogHeader>
                                    <DialogTitle>Tambah Produk</DialogTitle>
                                    <DialogDescription>Masukkan Detail produk disini.</DialogDescription>
                                </DialogHeader>
                                <div className="flex flex-col gap-6 pt-4 lg:flex-row overflow-y-auto flex-1">
                                    <div className="flex w-full flex-col items-center gap-3 lg:w-1/2">
                                        <Label>Gambar</Label>
                                        <input type="file" accept="image/*" onChange={handleImageChange} />
                                        {preview && <img src={preview} alt="Preview" className="h-48 w-48 rounded object-cover" />}
                                        <Button type="button" onClick={handleRemoveImage} className="mt-2 w-full" variant="destructive">
                                            Hapus Gambar
                                        </Button>
                                    </div>
                                    <div className="grid w-full gap-4 lg:w-1/2">
                                        <div>
                                            <Label className="font-bold">Nama produk</Label>
                                            <Input placeholder="Masukkan nama produk" value={name} onChange={(e) => setName(e.target.value)} />
                                            <Label className="font-bold">Deskripsi</Label>
                                            <Input
                                                placeholder="Masukkan Deskripsi"
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                            />
                                            <Label className="font-bold">Variant</Label>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="number"
                                                    name="variant"
                                                    placeholder="Masukkan variant"
                                                    className="w-full"
                                                    value={size}
                                                    onChange={(e) => setSize(e.target.value)}
                                                />
                                                <span className="text-sm text-muted-foreground">ml</span>
                                            </div>
                                            <Label className="font-bold">Stok</Label>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="number"
                                                    name="variant"
                                                    placeholder="Masukkan variant"
                                                    className="w-full"
                                                    value={stock}
                                                    onChange={(e) => setStock(e.target.value)}
                                                />
                                            </div>
                                            <Label className="font-bold">Harga</Label>
                                            <Input
                                                type="number"
                                                name="price"
                                                placeholder="Masukkan harga"
                                                className="w-full"
                                                value={price}
                                                onChange={(e) => setPrice(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter className='border-t pt-4'>
                                    <DialogClose asChild>
                                        <Button variant="outline">Cancel</Button>
                                    </DialogClose>
                                    <Button type="submit">Save changes</Button>
                                </DialogFooter>
                            </DialogContent>
                        </form>
                    </Dialog>
                </div>
                <Table>
                    <TableCaption>Semua produk Rainbee</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nama Produk</TableHead>
                            <TableHead>Deskripsi</TableHead>
                            <TableHead>Variant</TableHead>
                            <TableHead>Stok</TableHead>
                            <TableHead>Edit</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell className="font-medium whitespace-normal break-words max-w-xs">{product.name}</TableCell>
                                <TableCell className="whitespace-normal break-words max-w-xs">{product.description}</TableCell>
                                <TableCell>{product.size} ml</TableCell>
                                <TableCell className="text-left">{product.stock}</TableCell>

                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" className="w-full">
                                            <PenBox></PenBox>
                                        </Button>
                                        <Button className="w-full bg-red-500 text-white hover:bg-red-600">
                                            <Trash2></Trash2>
                                        </Button>
                                    </div>
                                </TableCell>
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
