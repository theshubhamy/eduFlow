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
        <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 overflow-hidden bg-background p-6 md:p-10">
            {/* Background decorative elements */}
            <div className="absolute top-0 -left-4 h-72 w-72 animate-pulse rounded-full bg-indigo-400 opacity-20 blur-3xl" />
            <div className="absolute bottom-0 -right-4 h-72 w-72 animate-pulse rounded-full bg-violet-400 opacity-20 blur-3xl delay-700" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />

            <div className="relative flex w-full max-w-md flex-col gap-8">
                <Link
                    href={home()}
                    className="flex items-center gap-3 self-center transition-transform hover:scale-105"
                >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-200 dark:shadow-none">
                        <AppLogoIcon className="size-7 fill-current text-white" />
                    </div>
                </Link>

                <Card className="overflow-hidden border-white/20 bg-white/70 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/70">
                    <CardHeader className="px-10 pt-10 pb-2 text-center">
                        <CardTitle className="text-3xl font-bold tracking-tight">{title}</CardTitle>
                        <CardDescription className="text-base text-muted-foreground">{description}</CardDescription>
                    </CardHeader>
                    <CardContent className="px-10 py-8">
                        {children}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
