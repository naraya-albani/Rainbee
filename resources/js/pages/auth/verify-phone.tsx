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
};

export default function VerifyPhone() {
    const { data, post, processing, setData, errors } = useForm<Required<VerifyPhoneForm>>({
        otp: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <AuthLayout title="Verifikasi Nomor HP" description="Please verify your phone number by clicking on the link we just emailed to you.">
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
