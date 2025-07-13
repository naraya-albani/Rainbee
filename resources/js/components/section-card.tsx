import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart } from 'lucide-react';

export function SectionCards() {
    return (
        <div className="flex flex-col gap-6 px-4 lg:px-6">

            <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
                <Card className="flex-1">
                    <CardHeader className="mt-2">
                        <CardDescription className='font-bold'>Total pengguna</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums text-[#f59e0b]">9999 akun</CardTitle>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1.5 text-sm mb-2">
                        <div className="text-muted-foreground">Visitors for the last 6 months</div>
                    </CardFooter>
                </Card>

                <Card className="flex-1">
                    <CardHeader className='mt-2'>
                        <CardDescription className='font-bold '>Total produk terjual</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums text-[#f59e0b]">1,234</CardTitle>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1.5 text-sm mb-2">
                        <div className="text-muted-foreground">Acquisition needs attention</div>
                    </CardFooter>
                </Card>
            </div>


            <Card>
                <CardHeader className='mt-2'>
                    <CardTitle className='text-[#f59e0b]'>Grafik Pengguna</CardTitle>
                    <CardDescription>Statistik pengguna per bulan</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <LineChart></LineChart>
                </CardContent>
            </Card>
        </div>
    );
}
