import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart } from 'lucide-react';
import { useEffect, useState } from 'react';

type PurchaseItem = {
    id: string;
    total: string;
    status: string;
    cart_id: number;
    address_id: number;
    receipt: string | null;
    created_at: string;
    updated_at: string;
};

export function SectionCards() {
    const [items, setItems] = useState<PurchaseItem[]>([]);
    const [pendingInvoiceCount, setPendingInvoiceCount] = useState(0);

    useEffect(() => {
        fetch('/api/purchase', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setItems(data);
                setPendingInvoiceCount(data.filter((item: PurchaseItem) => item.status === 'pending').length);
            })
            .catch((err) => {
                console.error('Gagal mengambil data keranjang:', err);
            });
    }, []);

    return (
        <div className="flex flex-col gap-6 px-4 lg:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
                <Card className="flex-1">
                    <CardHeader className="mt-2">
                        <CardDescription className="font-bold">Total pengguna</CardDescription>
                        <CardTitle className="text-2xl font-semibold text-[#f59e0b] tabular-nums">{pendingInvoiceCount}</CardTitle>
                    </CardHeader>
                    <CardFooter className="mb-2 flex-col items-start gap-1.5 text-sm">
                        <div className="text-muted-foreground">Visitors for the last 6 months</div>
                    </CardFooter>
                </Card>

                <Card className="flex-1">
                    <CardHeader className="mt-2">
                        <CardDescription className="font-bold">Total produk terjual</CardDescription>
                        <CardTitle className="text-2xl font-semibold text-[#f59e0b] tabular-nums">{items.length}</CardTitle>
                    </CardHeader>
                    <CardFooter className="mb-2 flex-col items-start gap-1.5 text-sm">
                        <div className="text-muted-foreground">Acquisition needs attention</div>
                    </CardFooter>
                </Card>
            </div>

            <Card>
                <CardHeader className="mt-2">
                    <CardTitle className="text-[#f59e0b]">Grafik Pengguna</CardTitle>
                    <CardDescription>Statistik pengguna per bulan</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <LineChart></LineChart>
                </CardContent>
            </Card>
        </div>
    );
}
