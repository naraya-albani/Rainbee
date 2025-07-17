// Components
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

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

    const [countdown, setCountdown] = useState<number>(300);
    const [canResend, setCanResend] = useState<boolean>(false);

    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        } else {
            setCanResend(true);
        }

        return () => clearTimeout(timer);
    }, [countdown]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    const handleResend = () => {
        post(route('verification.send'));
        setCountdown(300);
        setCanResend(false);
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

                <div className="mt-4 text-sm">
                    {canResend ? (
                        <Button type="button" onClick={handleResend} className="hover:underline">
                            Kirim ulang kode
                        </Button>
                    ) : (
                        <span className="text-gray-500">Kirim ulang dalam {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, '0')} menit</span>
                    )}
                </div>

                <TextLink href={route('login')} className="mx-auto block text-sm">
                    Log out
                </TextLink>
            </form>
        </AuthLayout>
    );
}
