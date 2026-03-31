import AuthSimpleLayout from '@/layouts/auth/auth-simple-layout';
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
        <AuthSimpleLayout
            title="Account Recovery"
            description="Enter your institutional email to receive specialized reset instructions"
        >
            <Head title="Forgot password" />

            {status && (
                <div className="mb-6 rounded-xl bg-blue-50/50 p-4 text-center text-sm font-semibold text-blue-600 backdrop-blur-sm dark:bg-blue-950/20 dark:text-blue-400">
                    {status}
                </div>
            )}

            <div className="space-y-8">
                <Form {...email.form()}>
                    {({ processing, errors }) => (
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="off"
                                    autoFocus
                                    placeholder="admin@school.app"
                                    className="h-12 rounded-xl border-neutral-200 bg-neutral-50/50 px-4 transition-all focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-white/5 dark:focus:bg-zinc-900"
                                />

                                <InputError message={errors.email} />
                            </div>

                            <Button
                                className="relative h-12 w-full overflow-hidden rounded-xl bg-indigo-600 font-bold text-white transition-all hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-500/25 active:scale-[0.98] disabled:opacity-70"
                                disabled={processing}
                                data-test="email-password-reset-link-button"
                            >
                                {processing ? (
                                    <LoaderCircle className="h-5 w-5 animate-spin" />
                                ) : (
                                    "Dispatch Recovery Link"
                                )}
                            </Button>
                        </div>
                    )}
                </Form>

                <div className="text-center text-sm text-neutral-500 dark:text-neutral-400 font-medium pt-2">
                    Remembered your access?{' '}
                    <TextLink href={login()} className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors">
                        Return to Sign In
                    </TextLink>
                </div>
            </div>
        </AuthSimpleLayout>
    );
}

ForgotPassword.layout = {
    title: 'Forgot password',
    description: 'Enter your email to receive a password reset link',
};
