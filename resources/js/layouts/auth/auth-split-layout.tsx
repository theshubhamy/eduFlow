import { Link, usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name } = usePage().props;

    return (
        <div className="relative grid min-h-svh grid-cols-2 w-full">
            <div className="relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r">
                <div className="absolute inset-0 bg-zinc-900" />
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-600 opacity-90" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />

                <Link
                    href={home()}
                    className="relative z-20 flex items-center text-xl font-bold tracking-tight"
                >
                    <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md ring-1 ring-white/20">
                        <AppLogoIcon className="size-6 fill-current text-white" />
                    </div>
                    {name}
                </Link>

                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-4">
                        <p className="text-lg font-medium leading-relaxed">
                            &ldquo;EduFlow has completely transformed how we manage our academic records and financial tracking. It's the future of school administration.&rdquo;
                        </p>
                        <footer className="text-sm font-medium opacity-80">
                            Dr. Sarah Jenkins &mdash; Principal, Riverside Academy
                        </footer>
                    </blockquote>
                </div>
            </div>
            <div className="flex flex-col items-center justify-center p-6 md:p-10">
                <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[400px]">
                    <div className="flex flex-col items-center gap-4 lg:hidden">
                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-2 font-medium"
                        >
                            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-200 dark:shadow-none">
                                <AppLogoIcon className="size-7 fill-current text-white" />
                            </div>
                        </Link>
                    </div>
                    <div className="flex flex-col gap-3 text-center lg:text-left">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
                        <p className="text-balance text-muted-foreground">
                            {description}
                        </p>
                    </div>
                    <div className="grid gap-6">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
