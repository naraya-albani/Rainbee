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
import { toast } from 'sonner';

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
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editProduct, setEditProduct] = useState<Product | null>(null);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');

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
            toast.success('Produk berhasil ditambahkan');
            setAddDialogOpen(false);
        } catch (err) {
            console.error('Gagal menambahkan produk:', err);
        }
    };

    const handleEditClick = (product: Product) => {
        setEditProduct(product);
        setEditDialogOpen(true);
        setName(product.name);
        setDescription(product.description);
        setSize(product.size.toString());
        setStock(product.stock.toString());
        setPrice(product.price.toString());
        setPreview(product.image ? `/storage/${product.image}` : null);
        setImage(null);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editProduct) return;

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('size', size);
        formData.append('stock', stock);
        formData.append('price', price);
        if (image) {
            formData.append('image', image);
        }
        if (!image && !preview) {
            formData.append('remove_image', '1');
        }
        formData.append('_method', 'PUT');

        try {
            await axios.post(route('produk.update', editProduct.id), formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true,
            });
            setEditDialogOpen(false);
            setEditProduct(null);
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

            toast.success('Produk berhasil diperbarui');
        } catch (err) {
            console.error('Gagal update produk:', err);
        }
    };

    const resetForm = () => {
        setName('');
        setDescription('');
        setSize('');
        setStock('');
        setPrice('');
        setPreview(null);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Addproduk" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Tambah Produk</h2>
                    <Dialog
                        open={addDialogOpen}
                        onOpenChange={(isOpen) => {
                            setAddDialogOpen(isOpen);
                            if (!isOpen) {
                                resetForm();
                            }
                        }}
                    >
                        <DialogTrigger asChild>
                            <Button>
                                <Plus />
                                Tambahkan Produk
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="flex max-h-screen flex-col sm:max-w-[1080px]">
                            <form onSubmit={handleSubmit}>
                                <DialogHeader>
                                    <DialogTitle>Tambah Produk</DialogTitle>
                                    <DialogDescription>Masukkan Detail produk disini.</DialogDescription>
                                </DialogHeader>
                                <div className="flex flex-1 flex-col gap-6 overflow-y-auto pt-4 lg:flex-row">
                                    <div className="flex w-full flex-col items-center gap-3 lg:w-1/2">
                                        <Label>Gambar</Label>
                                        {!preview && <input type="file" accept="image/*" onChange={handleImageChange} />}
                                        {preview && (
                                            <div className="flex flex-col items-center gap-2">
                                                <img src={preview} alt="Preview" className="h-48 w-48 rounded object-cover" />
                                                <Button type="button" onClick={handleRemoveImage} className="mt-2 w-full" variant="destructive">
                                                    Hapus Gambar
                                                </Button>
                                            </div>
                                        )}
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
                                <DialogFooter className="border-t pt-4">
                                    <DialogClose asChild>
                                        <Button variant="outline">Cancel</Button>
                                    </DialogClose>
                                    <Button type="submit">Save changes</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                    <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                        <DialogContent className="flex max-h-screen flex-col sm:max-w-[1080px]">
                            <form onSubmit={handleUpdate}>
                                <DialogHeader>
                                    <DialogTitle>Edit Produk</DialogTitle>
                                    <DialogDescription>Ubah detail produk di sini.</DialogDescription>
                                </DialogHeader>
                                <div className="flex flex-1 flex-col gap-6 overflow-y-auto pt-4 lg:flex-row">
                                    <div className="flex w-full flex-col items-center gap-3 lg:w-1/2">
                                        <Label>Gambar</Label>
                                        {!preview && <input type="file" accept="image/*" onChange={handleImageChange} />}
                                        {preview && (
                                            <div className="flex flex-col items-center gap-2">
                                                <img src={preview} alt="Preview" className="h-48 w-48 rounded object-cover" />
                                                <Button type="button" onClick={handleRemoveImage} className="mt-2 w-full" variant="destructive">
                                                    Hapus Gambar
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="grid w-full gap-4 lg:w-1/2">
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
                                <DialogFooter className="border-t pt-4">
                                    <DialogClose asChild>
                                        <Button variant="outline">Cancel</Button>
                                    </DialogClose>
                                    <Button type="submit">Update Produk</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
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
                            <TableHead className="text-center">Edit</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell className="max-w-xs font-medium break-words whitespace-normal">{product.name}</TableCell>
                                <TableCell className="max-w-xs break-words whitespace-normal">{product.description}</TableCell>
                                <TableCell>{product.size} ml</TableCell>
                                <TableCell className="text-left">{product.stock}</TableCell>

                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" className="w-full" onClick={() => handleEditClick(product)}>
                                            <PenBox></PenBox>
                                        </Button>
                                        <Button
                                            className="w-full bg-red-500 text-white hover:bg-red-600"
                                            onClick={() => {
                                                toast('Yakin ingin menghapus produk ini?', {
                                                    action: {
                                                        label: 'Hapus',
                                                        onClick: async () => {
                                                            try {
                                                                await axios.delete(route('produk.destroy', product.id), {
                                                                    withCredentials: true,
                                                                });
                                                                toast.success('Produk berhasil dihapus');
                                                                // Refresh data setelah delete
                                                                const refreshed = await axios.get('/api/product', { withCredentials: true });
                                                                setProducts(refreshed.data);
                                                            } catch (err) {
                                                                toast.error('Gagal menghapus produk');
                                                                console.error('Gagal menghapus produk:', err);
                                                            }
                                                        },
                                                    },
                                                });
                                            }}
                                        >
                                            <Trash2 />
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
