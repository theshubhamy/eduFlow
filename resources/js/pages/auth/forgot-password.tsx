import AuthCardLayout from '@/layouts/auth/auth-card-layout';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login } from '@/routes';
import { email } from '@/routes/password';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <AuthCardLayout 
            title="Forgot password?" 
            description="No worries! Enter your email and we'll send you a reset link"
        >
            <Head title="Forgot password" />

            {status && (
                <div className="mb-4 rounded-xl bg-emerald-50 p-4 text-center text-sm font-medium text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
                    {status}
                </div>
            )}

            <div className="space-y-6">
                <Form {...email.form()}>
                    {({ processing, errors }) => (
                        <div className="grid gap-5">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="off"
                                    autoFocus
                                    placeholder="email@example.com"
                                    className="h-11 rounded-xl"
                                />

                                <InputError message={errors.email} />
                            </div>

                            <Button
                                className="h-11 rounded-xl bg-indigo-600 font-semibold text-white transition-all hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:hover:shadow-none"
                                disabled={processing}
                                data-test="email-password-reset-link-button"
                            >
                                {processing && (
                                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Send reset link
                            </Button>
                        </div>
                    )}
                </Form>

                <div className="text-center text-sm text-zinc-600 dark:text-zinc-400">
                    Remember your password?{' '}
                    <TextLink href={login()} className="font-semibold text-indigo-600 hover:text-indigo-500">
                        Back to sign in
                    </TextLink>
                </div>
            </div>
        </AuthCardLayout>
    );
}

ForgotPassword.layout = {
    title: 'Forgot password',
    description: 'Enter your email to receive a password reset link',
};
