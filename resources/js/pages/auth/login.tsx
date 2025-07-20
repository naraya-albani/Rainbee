import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type LoginForm = {
    phone: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status }: LoginProps) {
    const { data, setData, post, processing, errors } = useForm<Required<LoginForm>>({
        phone: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <AuthLayout title="Selamat datang di Rainbee" description="Masukkan nomor HP untuk melanjutkan">
            <Head title="Login" />

            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="phone">Nomor HP</Label>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ marginRight: '8px', fontWeight: 'bold' }}>+62</span>
                            <Input
                                id="phone"
                                type="tel"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="tel"
                                value={data.phone}
                                onChange={(e) => {
                                    const numericValue = e.target.value.replace(/\D/g, '');

                                    if (numericValue.length <= 13) {
                                        setData('phone', numericValue);
                                    }
                                }}
                                placeholder="8xxxxxxxxxx"
                            />
                        </div>
                        <InputError message={errors.phone && 'Nomor HP belum terdaftar atau tidak sesuai format'} />
                    </div>

                    <Button type="submit" className="mt-4 w-full" tabIndex={3} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Masuk
                    </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                    Belum punya akun?{' '}
                    <TextLink href={route('register')} tabIndex={4}>
                        Daftar
                    </TextLink>
                </div>
            </form>

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
        </AuthLayout>
    );
}
