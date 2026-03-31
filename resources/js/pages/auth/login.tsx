import AuthSplitLayout from '@/layouts/auth/auth-split-layout';
import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    return (
        <AuthSplitLayout
            title="Professional Access"
            description="Enter your credentials to manage your institutional dashboard"
        >
            <Head title="Log in" />

            <div className="grid gap-6">
                <Form
                    {...store.form()}
                    resetOnSuccess={['password']}
                    className="flex flex-col gap-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="email" className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Email address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        placeholder="admin@school.app"
                                        className="h-12 rounded-xl border-neutral-200 bg-neutral-50/50 px-4 transition-all focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-white/5 dark:focus:bg-zinc-900"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password" className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Password</Label>
                                        {canResetPassword && (
                                            <TextLink
                                                href={request()}
                                                className="ml-auto text-xs font-bold text-indigo-600 hover:text-indigo-500 transition-colors"
                                                tabIndex={5}
                                            >
                                                Forgot password?
                                            </TextLink>
                                        )}
                                    </div>
                                    <PasswordInput
                                        id="password"
                                        name="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                        className="h-12 rounded-xl border-neutral-200 bg-neutral-50/50 px-4 transition-all focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-white/5 dark:focus:bg-zinc-900"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="flex items-center space-x-3">
                                    <Checkbox
                                        id="remember"
                                        name="remember"
                                        tabIndex={3}
                                        className="size-5 rounded-md border-neutral-300 text-indigo-600 ring-offset-background focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-indigo-600 data-[state=checked]:text-white"
                                    />
                                    <Label htmlFor="remember" className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                                        Remember this session
                                    </Label>
                                </div>

                                <Button
                                    type="submit"
                                    className="relative h-12 w-full overflow-hidden rounded-xl bg-indigo-600 font-bold text-white transition-all hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-500/25 active:scale-[0.98] disabled:opacity-70"
                                    tabIndex={4}
                                    disabled={processing}
                                    data-test="login-button"
                                >
                                    {processing ? (
                                        <Spinner className="h-5 w-5 animate-spin" />
                                    ) : (
                                        "Sign into Dashboard"
                                    )}
                                </Button>
                            </div>

                            {canRegister && (
                                <div className="mt-6 text-center text-sm text-neutral-500 dark:text-neutral-400 font-medium">
                                    New to our network?{' '}
                                    <TextLink href={register()} className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors" tabIndex={5}>
                                        Register Institution
                                    </TextLink>
                                </div>
                            )}
                        </>
                    )}
                </Form>

                {status && (
                    <div className="rounded-xl bg-blue-50/50 p-4 text-center text-sm font-semibold text-blue-600 backdrop-blur-sm dark:bg-blue-950/20 dark:text-blue-400">
                        {status}
                    </div>
                )}
            </div>
        </AuthSplitLayout>
    );
}
