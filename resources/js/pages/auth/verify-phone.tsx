// Components
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import AuthLayout from '@/layouts/auth-layout';

type VerifyPhoneForm = {
    otp: string;
    phone: string;
    name: string | null;
    remember: boolean | null;
};

type Props = {
    phone: string;
    name: string | null;
    remember: boolean | null;
};

export default function VerifyPhone({ phone, name, remember }: Props) {
    const { data, post, processing, setData, errors } = useForm<VerifyPhoneForm>({
        otp: '',
        phone,
        name,
        remember,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <AuthLayout title="Verifikasi Nomor HP" description="Masukkan kode OTP yang telah dikirimkan ke nomor HP Anda.">
            <Head title="Verifikasi Nomor HP" />

            <form onSubmit={submit} className="space-y-6 text-center">
                <InputError message={errors.otp} className="mt-2" />
                <InputOTP
                    id="otp"
                    value={data.otp}
                    onChange={(e) => setData('otp', e.replace(/\D/g, ''))}
                    maxLength={4}
                    autoFocus
                    containerClassName="justify-center"
                    required
                    disabled={processing}
                >
                    <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                    </InputOTPGroup>
                </InputOTP>

                <input type="hidden" name="phone" value={data.phone} />
                <input type="hidden" name="name" value={data.name ?? ''} />
                <input type="hidden" name="remember" value={data.remember ? '1' : ''} />

                <Button type="submit" disabled={processing} variant="secondary">
                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                    Kirim OTP
                </Button>

                <TextLink href={route('login')} className="mx-auto block text-sm">
                    Log out
                </TextLink>
            </form>
        </AuthLayout>
    );
}
