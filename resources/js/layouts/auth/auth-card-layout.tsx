import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { home } from '@/routes';

export default function AuthCardLayout({
    children,
    title,
    description,
}: PropsWithChildren<{
    name?: string;
    title?: string;
    description?: string;
}>) {
    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 overflow-hidden bg-white p-6 md:p-10 dark:bg-black">
            {/* Background reactive elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-neutral-50 dark:bg-neutral-950" />
                <div className="absolute top-0 left-0 h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[120px] animate-pulse" />
                <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[120px] animate-pulse delay-700" />
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
            </div>

            <div className="relative z-10 flex w-full max-w-md flex-col gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <Link
                    href={home()}
                    className="flex items-center gap-3 self-center transition-transform hover:scale-105"
                >
                    <div className="group relative">
                        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 opacity-25 blur-lg transition duration-1000 group-hover:opacity-100 group-hover:duration-200" />
                        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 dark:bg-zinc-900 dark:ring-white/10">
                            <AppLogoIcon className="size-10 fill-indigo-600" />
                        </div>
                    </div>
                </Link>

                <div className="overflow-hidden rounded-3xl border border-white/20 bg-white/40 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] backdrop-blur-3xl dark:border-white/5 dark:bg-white/[0.02]">
                    <div className="flex flex-col space-y-2 px-10 pt-10 pb-2 text-center">
                        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white leading-none pb-1">{title}</h1>
                        <p className="text-base text-neutral-500 dark:text-neutral-400">{description}</p>
                    </div>
                    <div className="px-10 py-8">
                        {children}
                    </div>
                </div>

                <p className="px-8 text-center text-xs text-neutral-400 leading-relaxed tracking-wide">
                    By continuing, you agree to our{' '}
                    <a href="#" className="font-semibold underline underline-offset-4 hover:text-neutral-900 dark:hover:text-white transition-colors">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" className="font-semibold underline underline-offset-4 hover:text-neutral-900 dark:hover:text-white transition-colors">Privacy Policy</a>
                </p>
            </div>
        </div>
    );
}
