import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Auth } from '@/types';
import { SlashIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

type CartItem = {
    product_id: number;
    product_name: string;
    image: string;
    size: number;
    quantity: number;
    price: number;
    total: number;
};

interface Province {
    id: string;
    name: string;
}

interface Regency {
    id: string;
    province_id: string;
    name: string;
}
interface District {
    id: string;
    regency_id: string;
    name: string;
}

export default function Keranjang({ user }: Auth) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [subtotal, setSubtotal] = useState<number>(0);
    const [cartId, setCartId] = useState('');
    const [alamatLengkap, setAlamatLengkap] = useState('');
    const [provinsi, setProvinsi] = useState<Province[]>([]);
    const [kabupaten, setKabupaten] = useState<Regency[]>([]);
    const [kecamatan, setKecamatan] = useState<District[]>([]);
    const [selectedProvinsi, setSelectedProvinsi] = useState('');
    const [selectedProvinsiName, setSelectedProvinsiName] = useState('');
    const [selectedKabupaten, setSelectedKabupaten] = useState('');
    const [selectedKabupatenName, setSelectedKabupatenName] = useState('');
    const [selectedKecamatan, setSelectedKecamatan] = useState('');
    const [selectedKecamatanName, setSelectedKecamatanName] = useState('');
    const [kodePos, setKodePos] = useState('');
    const [nomorTelepon, setNomorTelepon] = useState(user.phone || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetch('/api/cart/' + user.id, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setCartId(data.cart_id);
                setItems(data.details);
                setSubtotal(data.subtotal);
            })
            .catch((err) => {
                console.error('Gagal mengambil data keranjang:', err);
            });
    }, []);

    const toTitleCaseSmart = (str: string) => {
        const exceptions: Record<string, string> = {
            dki: 'DKI',
            diy: 'DIY',
            'kab.': 'Kab.',
            kota: 'Kota',
            'adm.': 'Adm.',
            kepulauan: 'Kepulauan',
            daerah: 'Daerah',
            istimewa: 'Istimewa',
            yogyakarta: 'Yogyakarta',
            aceh: 'Aceh',
        };

        return str
            .toLowerCase()
            .split(' ')
            .map((word) => exceptions[word] || word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        try {
            const res = await fetch('/api/purchase', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phone: user.phone,
                    cart_id: cartId,
                    total: subtotal,
                    address: {
                        address_line: alamatLengkap,
                        district: toTitleCaseSmart(selectedKecamatanName),
                        city: toTitleCaseSmart(selectedKabupatenName),
                        state: toTitleCaseSmart(selectedProvinsiName),
                        postal_code: kodePos,
                        phone_number: nomorTelepon,
                    },
                }),
            });

            const data = await res.json();

            if (res.ok) {
                alert('Pemesanan berhasil dibuat');
            } else {
                alert(data.message || 'Gagal membuat pesanan');
            }
        } catch (error) {
            console.error(error);
            alert('Terjadi kesalahan saat membuat invoice' + error);
        } finally {
            setIsSubmitting(false);
        }
    };

    //data provinsi
    useEffect(() => {
        fetch('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json')
            .then((res) => res.json())
            .then((data) => {
                setProvinsi(data);
            })
            .catch((err) => console.error('Gagal fetch provinsi:', err));
    }, []);

    //data kabupaten
    useEffect(() => {
        if (selectedProvinsi) {
            fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selectedProvinsi}.json`)
                .then((response) => response.json())
                .then((data) => {
                    setKabupaten(data);
                    setSelectedKabupaten(''); // Reset selected kabupaten when province changes
                    setKecamatan([]); // Clear kecamatan options as well
                    setSelectedKecamatan(''); // Reset selected kecamatan
                })
                .catch((err) => console.error('Gagal fetch kabupaten:', err));
        } else {
            setKabupaten([]); // Clear kabupaten if no province is selected
            setSelectedKabupaten('');
            setKecamatan([]); // Clear kecamatan options as well
            setSelectedKecamatan(''); // Reset selected kecamatan
        }
    }, [selectedProvinsi]);

    //data kecamatan
    useEffect(() => {
        if (selectedKabupaten) {
            fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${selectedKabupaten}.json`)
                .then((res) => res.json())
                .then((data) => {
                    setKecamatan(data);
                    setSelectedKecamatan(''); // Reset selected kecamatan when regency changes
                })
                .catch((err) => console.error('Gagal fetch kecamatan:', err));
        } else {
            setKecamatan([]); // Clear kecamatan if no regency is selected
            setSelectedKecamatan('');
        }
    }, [selectedKabupaten]);

    return (
        <div className="grid min-h-screen grid-cols-1 gap-6 p-6 md:grid-cols-3">
            <div className="space-y-4 md:col-span-2">
                <header className="text-3xl font-bold text-[#f59e0b]">Keranjang</header>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Welcome</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator>
                            <SlashIcon />
                        </BreadcrumbSeparator>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/keranjang">keranjang</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>


                {items.length === 0 ? (
                    <Card>
                        <CardContent className="py-6 text-center text-gray-500">Keranjang kosong.</CardContent>
                    </Card>
                ) : (
                    items.map((item) => (
                        <Card key={item.product_id} className="relative">
                            <CardContent className="flex items-start gap-4 py-4">
                                <Checkbox />
                                <img src={`/storage/${item.image}`} alt={item.product_name} className="h-20 w-20 rounded object-cover" />
                                <div className="flex-1">
                                    <p className="text-lg">{item.product_name}</p>
                                    <p className="text-sm">{item.size} ml</p>
                                    <div className="mt-2">
                                        <p className="text-lg font-bold text-[#f59e0b]">
                                            Rp{new Intl.NumberFormat('id-ID').format(Number(item.price))}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* total belanja */}
            <div>
                <Card className="sticky top-6">
                    <CardContent className="space-y-4 p-4">
                        <h2 className="text-lg font-semibold">Ringkasan belanja</h2>
                        <div className="flex justify-between text-sm">
                            <span>Total</span>
                            <span>Rp{new Intl.NumberFormat('id-ID').format(subtotal)}</span>
                        </div>

                        <Dialog>
                            <DialogTrigger asChild>
                                <Button>Beli Sekarang</Button>
                            </DialogTrigger>
                            <DialogContent className="flex max-h-screen flex-col sm:max-w-[1080px]">
                                <form onSubmit={handleSubmit}>
                                    <DialogHeader>
                                        <DialogTitle>Konfirmasi Pemesanan</DialogTitle>
                                        <DialogDescription>Jangan lupa cek kembali pesanan Anda sebelum melakukan pembayaran</DialogDescription>
                                    </DialogHeader>
                                    <div className="flex flex-1 flex-col gap-6 overflow-y-auto pt-4 lg:flex-row">
                                        <div className="flex w-full flex-col items-start gap-3 lg:w-1/2">
                                            <h1>Alamat</h1>
                                            <Label className="font-bold">Masukkan alamatmu</Label>
                                            <Input
                                                placeholder="Alamat lengkap"
                                                value={alamatLengkap}
                                                onChange={(e) => setAlamatLengkap(e.target.value)}
                                            />
                                            <Label className="font-bold">Provinsi</Label>
                                            <select
                                                className="w-full rounded border p-2"
                                                value={selectedProvinsi}
                                                onChange={(e) => {
                                                    const id = e.target.value;
                                                    setSelectedProvinsi(id);
                                                    const provinsiTerpilih = provinsi.find((p) => p.id === id);
                                                    setSelectedProvinsiName(provinsiTerpilih?.name || '');
                                                }}
                                            >
                                                <option value="">Pilih Provinsi</option>
                                                {provinsi.map((province) => (
                                                    <option key={province.id} value={province.id}>
                                                        {province.name}
                                                    </option>
                                                ))}
                                            </select>

                                            <Label className="font-bold">Kab/Kota</Label>
                                            <select
                                                className="w-full rounded border p-2"
                                                value={selectedKabupaten}
                                                onChange={(e) => {
                                                    const id = e.target.value;
                                                    setSelectedKabupaten(id);
                                                    const kabTerpilih = kabupaten.find((k) => k.id === id);
                                                    setSelectedKabupatenName(kabTerpilih?.name || '');
                                                }}
                                                disabled={!selectedProvinsi}
                                            >
                                                <option value="">Pilih Kab/Kota</option>
                                                {kabupaten.map((regency) => (
                                                    <option key={regency.id} value={regency.id}>
                                                        {regency.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <Label className="font-bold">Kecamatan</Label>
                                            <select
                                                className="w-full rounded border p-2"
                                                value={selectedKecamatan}
                                                onChange={(e) => {
                                                    const id = e.target.value;
                                                    setSelectedKecamatan(id);
                                                    const kecTerpilih = kecamatan.find((k) => k.id === id);
                                                    setSelectedKecamatanName(kecTerpilih?.name || '');
                                                }}
                                                disabled={!selectedKabupaten} // Disable until a regency is selected
                                            >
                                                <option value="">Pilih Kecamatan</option>
                                                {kecamatan.map((district) => (
                                                    <option key={district.id} value={district.id}>
                                                        {district.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <Label className="font-bold">Masukkan kode posmu</Label>
                                            <Input
                                                placeholder="Kode pos"
                                                value={kodePos}
                                                onChange={(e) => {
                                                    const numericValue = e.target.value.replace(/\D/g, '');

                                                    if (numericValue.length <= 5) {
                                                        setKodePos(numericValue);
                                                    }
                                                }}
                                            />
                                            <Label className="font-bold">Masukkan nomor telepon</Label>
                                            <Input
                                                placeholder="Nomor telepon"
                                                value={nomorTelepon}
                                                onChange={(e) => {
                                                    const numericValue = e.target.value.replace(/\D/g, '');

                                                    if (numericValue.length <= 15) {
                                                        setNomorTelepon(numericValue);
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div className="grid w-full gap-4 lg:w-1/2">
                                            {items.map((item) => (
                                                <Card key={item.product_id} className="relative">
                                                    <CardContent className="flex items-start gap-4 py-4">
                                                        <Checkbox />
                                                        <img
                                                            src={`/storage/${item.image}`}
                                                            alt={item.product_name}
                                                            className="h-20 w-20 rounded object-cover"
                                                        />
                                                        <div className="flex-1">
                                                            <p className="text-lg">{item.product_name}</p>
                                                            <p className="text-sm">{item.size} ml</p>
                                                            <div className="mt-2">
                                                                <p className="text-lg font-bold text-[#f59e0b]">
                                                                    Rp{new Intl.NumberFormat('id-ID').format(item.price)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="outline">Batal</Button>
                                        </DialogClose>
                                        <Button type="submit" disabled={isSubmitting}>
                                            Lakukan pembayaran
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
