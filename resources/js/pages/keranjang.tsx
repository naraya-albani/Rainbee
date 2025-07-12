import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';

const cartItems = [
    {
        id: 1,
        title: 'Madu murni',
        image: '/bg-web.jpg',
        price: 67150,
        quantity: 1,
    },
    {
        id: 2,
        title: 'Madu murni',
        image: '/bg-web.jpg',
        price: 1500000,
        quantity: 1,
    },
];

export default function Keranjang() {
    const [items, setItems] = useState(cartItems);
    return (
        <div className="grid min-h-screen grid-cols-1 gap-6 bg-gray-100 p-6 md:grid-cols-3">

            <div className="space-y-4 md:col-span-2">
                <header className='text-3xl font-bold text-[#f59e0b] '>Keranjang</header>

                <Card>
                    <CardContent className="flex items-center space-x-3 py-4">
                        <Checkbox />
                        <span className="font-medium">Pilih Semua ({items.length})</span>
                    </CardContent>
                </Card>

                {items.map((item) => (
                    <Card key={item.id} className="relative">
                        <CardContent className="flex items-start gap-4 py-4">
                            <Checkbox />
                            <img src={item.image} alt={item.title} className="h-20 w-20 rounded object-cover" />
                            <div className="flex-1">
                                <p className="text-lg">{item.title}</p>
                                <p className='text-sm'>200 ml</p>
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
                            <span>Rp.99.9.999.9</span>
                            <span className="font-semibold">-</span>

                        </div>

                        <Button className="w-full">Beli</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
