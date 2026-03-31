import { usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name } = usePage().props;

    return (
        <div className="relative flex min-h-svh w-full flex-col overflow-hidden bg-white lg:flex-row dark:bg-black">
            <div className="mx-auto flex w-full flex-col justify-center gap-10  animate-in fade-in slide-in-from-right-8 duration-700">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">{title}</h1>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                        {description}
                    </p>
                </div>

                <div className="grid gap-6 text-sm">
                    {children}
                </div>

                <p className="px-8 text-center text-sm text-neutral-400 leading-relaxed">
                    By continuing, you agree to our{' '}
                    <a href="#" className="underline underline-offset-4 hover:text-neutral-900 dark:hover:text-white transition-colors">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" className="underline underline-offset-4 hover:text-neutral-900 dark:hover:text-white transition-colors">Privacy Policy</a>
                </p>
            </div>
        </div>
    );
}
