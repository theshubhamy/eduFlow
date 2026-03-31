import AuthSplitLayout from '@/layouts/auth/auth-split-layout';
import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';

export default function Register() {
    return (
        <AuthSplitLayout
            title="Institutional Onboarding"
            description="Join our global network of digitally-empowered schools"
        >
            <Head title="Register" />
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-5">
                            <div className="grid gap-2">
                                <Label htmlFor="name" className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Administrator Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Full name"
                                    className="h-12 rounded-xl border-neutral-200 bg-neutral-50/50 px-4 transition-all focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-white/5 dark:focus:bg-zinc-900"
                                />
                                <InputError
                                    message={errors.name}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="admin@school.app"
                                    className="h-12 rounded-xl border-neutral-200 bg-neutral-50/50 px-4 transition-all focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-white/5 dark:focus:bg-zinc-900"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password" className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Password</Label>
                                <PasswordInput
                                    id="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="••••••••"
                                    className="h-12 rounded-xl border-neutral-200 bg-neutral-50/50 px-4 transition-all focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-white/5 dark:focus:bg-zinc-900"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation" className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                                    Confirm password
                                </Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="••••••••"
                                    className="h-12 rounded-xl border-neutral-200 bg-neutral-50/50 px-4 transition-all focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-white/5 dark:focus:bg-zinc-900"
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="mt-4 relative h-12 w-full overflow-hidden rounded-xl bg-indigo-600 font-bold text-white transition-all hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-500/25 active:scale-[0.98] disabled:opacity-70"
                                tabIndex={5}
                                data-test="register-user-button"
                            >
                                {processing ? (
                                    <Spinner className="h-5 w-5 animate-spin" />
                                ) : (
                                    "Create Institution Account"
                                )}
                            </Button>
                        </div>
                        <div className="mt-6 text-center text-sm text-neutral-500 dark:text-neutral-400 font-medium">
                            Already a member?{' '}
                            <TextLink href={login()} className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors" tabIndex={6}>
                                Sign in
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </AuthSplitLayout>
    );
}
