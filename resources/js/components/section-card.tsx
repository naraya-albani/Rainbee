import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

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
    const [chartData, setChartData] = useState<any[]>([]);
    const [claimedInvoiceCount, setClaimedInvoiceCount] = useState(0);

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
                const claimedInvoices = data.filter((item: PurchaseItem) => item.status === 'claimed');

                setPendingInvoiceCount(data.filter((item: PurchaseItem) => item.status === 'pending').length);

                setClaimedInvoiceCount(data.filter((item: PurchaseItem) => item.status === 'claimed').length);

                //hari ini
                const today = new Date();
                //hari lalu
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(today.getDate() - 6);

                //7 hari terakhir
                const grouped: Record<string, number> = {};
                claimedInvoices.forEach((item: PurchaseItem) => {
                    const date = new Date(item.created_at);
                    // Filter hanya invoice dalam 7 hari terakhir
                    if (date >= sevenDaysAgo && date <= today) {
                        const day = date.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
                        if (!grouped[day]) {
                            grouped[day] = 0;
                        }
                        grouped[day] += 1;
                    }
                });
                // Buat array tanggal 7 hari terakhir
                const daysArr: string[] = [];
                for (let i = 0; i < 7; i++) {
                    const d = new Date(sevenDaysAgo);
                    d.setDate(sevenDaysAgo.getDate() + i);
                    daysArr.push(d.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }));
                }

                const chartArr = daysArr.map((day) => ({
                    day,
                    claimed: grouped[day] || 0,
                }));

                setChartData(chartArr);
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
                        <CardDescription className="font-bold">Menunggu Konfirmasi</CardDescription>
                        <CardTitle className="text-2xl font-semibold text-[#f59e0b] tabular-nums">{pendingInvoiceCount}</CardTitle>
                    </CardHeader>
                    <CardFooter className="mb-2 flex-col items-start gap-1.5 text-sm">
                        <div className="text-muted-foreground">Seluruh pesanan menunggu konfirmasi</div>
                    </CardFooter>
                </Card>

                <Card className="flex-1">
                    <CardHeader className="mt-2">
                        <CardDescription className="font-bold">Total produk terjual</CardDescription>
                        <CardTitle className="text-2xl font-semibold text-[#f59e0b] tabular-nums">{claimedInvoiceCount}</CardTitle>
                    </CardHeader>
                    <CardFooter className="mb-2 flex-col items-start gap-1.5 text-sm">
                        <div className="text-muted-foreground">Total produk yang sudah terjual</div>
                    </CardFooter>
                </Card>
            </div>

            <Card>
                <CardHeader className="mt-2">
                    <CardTitle className="text-[#f59e0b]">Grafik Penjualan</CardTitle>
                    <CardDescription>Statistik Penjualan selama satu minggu</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={chartData}>
                                <XAxis dataKey="day" />
                                <YAxis domain={[0, 'dataMax + 1']} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="claimed" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Produk terjual" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
