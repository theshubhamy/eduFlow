import AuthCardLayout from '@/layouts/auth/auth-card-layout';
import { Form, Head } from '@inertiajs/react';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { logout } from '@/routes';
import { send } from '@/routes/verification';

export default function VerifyEmail({ status }: { status?: string }) {
    return (
        <AuthCardLayout 
            title="Verify your email" 
            description="We've sent a verification link to your email address. Please click it to confirm your account."
        >
            <Head title="Email verification" />

            {status === 'verification-link-sent' && (
                <div className="mb-6 rounded-xl bg-emerald-50 p-4 text-center text-sm font-medium text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
                    A fresh verification link has been sent to your email address.
                </div>
            )}

            <Form {...send.form()} className="space-y-6 text-center">
                {({ processing }) => (
                    <div className="grid gap-5">
                        <Button 
                            disabled={processing} 
                            className="h-11 rounded-xl bg-indigo-600 font-semibold text-white transition-all hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:hover:shadow-none"
                        >
                            {processing && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
                            Resend verification email
                        </Button>

                        <div className="text-center text-sm text-zinc-600 dark:text-zinc-400">
                            Wrong email address?{' '}
                            <TextLink href={logout()} className="font-semibold text-indigo-600 hover:text-indigo-500">
                                Log out and try again
                            </TextLink>
                        </div>
                    </div>
                )}
            </Form>
        </AuthCardLayout>
    );
}

VerifyEmail.layout = {
    title: 'Verify email',
    description:
        'Please verify your email address by clicking on the link we just emailed to you.',
};
