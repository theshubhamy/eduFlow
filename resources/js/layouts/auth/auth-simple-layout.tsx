import { Link } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-neutral-50 p-6 md:p-10 dark:bg-black">
            <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col items-center gap-1 text-center">
                        <Link
                            href={home()}
                            className="group flex flex-col items-center gap-3 font-medium transition-transform hover:scale-105"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-xl ring-1 ring-black/5 transition-shadow group-hover:shadow-2xl dark:bg-zinc-900 dark:ring-white/10">
                                <AppLogoIcon className="size-10 fill-indigo-600 transition-colors group-hover:fill-indigo-500" />
                            </div>
                        </Link>

                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">{title}</h1>
                            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                                {description}
                            </p>
                        </div>
                    </div>
                    <div className="grid gap-6">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
