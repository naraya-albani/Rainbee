import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type RegisterForm = {
    name: string;
    phone: string;
    otp: string;
};

export default function Register() {
    const { data, setData, post, processing, errors } = useForm<Required<RegisterForm>>({
        name: '',
        phone: '',
        otp: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <AuthLayout title="Create an account" description="Enter your details below to create your account">
            <Head title="Register" />
            <InputError message={errors.otp} className="mt-2" />
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nama</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="phone">No. HP</Label>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ marginRight: '8px', fontWeight: 'bold' }}>+62</span>
                            <Input
                                id="phone"
                                type="tel"
                                maxLength={13}
                                required
                                tabIndex={2}
                                autoComplete="cc-number"
                                value={data.phone}
                                onChange={(e) => {
                                    // Hapus semua karakter yang bukan digit
                                    const numericValue = e.target.value.replace(/\D/g, '');

                                    // Pastikan panjangnya tidak melebihi 13 digit (karena +62 sudah ada)
                                    if (numericValue.length <= 13) {
                                        // 15 (max total) - 2 (62) = 13
                                        setData('phone', numericValue);
                                    }
                                }}
                                disabled={processing}
                                placeholder="8xxxxxxxxx"
                            />
                        </div>
                        <InputError message={errors.phone} />
                    </div>

                    <Button type="submit" className="mt-2 w-full" tabIndex={5} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Create account
                    </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <TextLink href={route('login')} tabIndex={6}>
                        Log in
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
