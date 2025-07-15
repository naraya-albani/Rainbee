import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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

export default function Keranjang({ user }: Auth) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [subtotal, setSubtotal] = useState<number>(0);

    useEffect(() => {
        fetch('/api/cart/' + user.id, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setItems(data.details);
                setSubtotal(data.subtotal);
            })
            .catch((err) => {
                console.error('Gagal mengambil data keranjang:', err);
            });
    }, []);

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
                            <BreadcrumbLink href="/">keranjang</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <Card>
                    <CardContent className="flex items-center space-x-3 py-4">
                        <Checkbox />
                        <span className="font-medium">Pilih Semua ({items.length})</span>
                    </CardContent>
                </Card>

                {items.map((item) => (
                    <Card key={item.product_id} className="relative">
                        <CardContent className="flex items-start gap-4 py-4">
                            <Checkbox />
                            <img src={item.image} alt={item.product_name} className="h-20 w-20 rounded object-cover" />
                            <div className="flex-1">
                                <p className="text-lg">{item.product_name}</p>
                                <p className="text-sm">{item.size} ml</p>
                                <div className="mt-2">
                                    <p className="text-lg font-bold text-black">Rp{item.price.toLocaleString()}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* total belanja */}
            <div>
                <Card className="sticky top-6">
                    <CardContent className="space-y-4 p-4">
                        <h2 className="text-lg font-semibold">Ringkasan belanja</h2>
                        <div className="flex justify-between text-sm">
                            <span>Total</span>
                            <span>Rp{new Intl.NumberFormat('id-ID').format(subtotal)}</span>
                            <span className="font-semibold">-</span>
                        </div>

                        <Button className="w-full">Beli</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
