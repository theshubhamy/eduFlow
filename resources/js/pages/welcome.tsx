import { Head, Link, usePage } from '@inertiajs/react';
import { login, register, dashboard as schoolDashboard } from '@/routes';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    CheckCircle2,
    CreditCard,
    Users,
    Bell,
    ShieldCheck,
    LayoutDashboard,
    ArrowRight,
    GraduationCap
} from 'lucide-react';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage().props;
    const dashboardUrl = schoolDashboard().url;

    const features = [
        {
            title: "Smart Admissions",
            description: "Digital onboarding and document management for student records.",
            icon: Users,
            color: "text-blue-600"
        },
        {
            title: "Attendance tracking",
            description: "Real-time presence monitoring with automated parent alerts.",
            icon: CheckCircle2,
            color: "text-green-600"
        },
        {
            title: "Fee Management",
            description: "Flexible periodicity (Monthly/Term/Annual) and PDF receipts.",
            icon: CreditCard,
            color: "text-purple-600"
        },
        {
            title: "Multi-Channel Alerts",
            description: "Instant notifications via Email, SMS, and WhatsApp placeholders.",
            icon: Bell,
            color: "text-orange-600"
        }
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-black selection:bg-blue-100 dark:selection:bg-blue-900/30 transition-colors duration-300">
            <Head>
                <title>EduFlow - Unified School Management SaaS</title>
                <meta name="description" content="Premium multi-tenant school management platform for modern education." />
            </Head>

            {/* Navigation */}
            <nav className="sticky top-0 z-50 w-full border-b border-gray-100 dark:border-white/10 bg-white/80 dark:bg-black/80 backdrop-blur-md">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 group cursor-pointer">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                            <GraduationCap className="text-white w-6 h-6" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                            EduFlow
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        {auth.user ? (
                            <Button asChild variant="secondary" className="rounded-full px-6">
                                <Link href={dashboardUrl}>
                                    Dashboard <LayoutDashboard className="ml-2 w-4 h-4" />
                                </Link>
                            </Button>
                        ) : (
                            <>
                                <Link href={login()} className="text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                                    Admin Login
                                </Link>
                                {canRegister && (
                                    <Button asChild className="rounded-full px-6 bg-blue-600 hover:bg-blue-700 text-white border-none shadow-lg shadow-blue-500/25">
                                        <Link href={register()}>Register School</Link>
                                    </Button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-16 lg:pt-24 pb-12 lg:pb-32">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-semibold border border-blue-100 dark:border-blue-500/20">
                                <ShieldCheck className="w-4 h-4" /> Cloud-Native Multi-Tenant SaaS
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.1]">
                                Empower Your School <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                                    With Smart Logic.
                                </span>
                            </h1>
                            <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-lg leading-relaxed">
                                EduFlow is a world-class platform designed to centrally manage every institutional process—from digital admissions to automated parent notifications and fee collection.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Button size="lg" asChild className="rounded-full px-8 h-12 bg-blue-600 hover:bg-blue-700 text-lg">
                                    <Link href={register()}>Get Started Free <ArrowRight className="ml-2 w-5 h-5" /></Link>
                                </Button>
                                <Button size="lg" variant="outline" asChild className="rounded-full px-8 h-12 border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 text-lg">
                                    <a href="#features">Explore Modules</a>
                                </Button>
                            </div>
                        </div>

                        <div className="relative animate-in fade-in slide-in-from-right-8 duration-1000">
                            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 blur-3xl opacity-50 dark:opacity-20 rounded-[3rem]"></div>
                            <img
                                src="/images/hero.png"
                                alt="EduFlow Dashboard Preview"
                                className="relative z-10 w-full h-auto rounded-3xl shadow-2xl border border-gray-100 dark:border-white/10"
                            />
                        </div>
                    </div>
                </div>

                {/* Background Decor */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[1000px] h-[1000px] bg-blue-50/50 dark:bg-blue-900/5 rounded-full blur-3xl -z-10"></div>
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-50/50 dark:bg-indigo-900/5 rounded-full blur-3xl -z-10"></div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-gray-50 dark:bg-[#050505] transition-colors duration-300">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">Complete Institutional Control</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400">Our modular system allows you to pick and choose the tools your school needs to succeed.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, idx) => (
                            <Card key={idx} className="border-none shadow-xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-[#111111] dark:border dark:border-white/5 overflow-hidden group hover:-translate-y-2 transition-all duration-300">
                                <CardHeader>
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gray-50 dark:bg-white/5 ${feature.color} mb-4 group-hover:scale-110 transition-transform`}>
                                        <feature.icon className="w-6 h-6" />
                                    </div>
                                    <CardTitle className="text-xl dark:text-white">{feature.title}</CardTitle>
                                    <CardDescription className="dark:text-gray-400 leading-relaxed pt-2">
                                        {feature.description}
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative">
                <div className="container mx-auto px-4">
                    <div className="bg-blue-600 rounded-[3rem] p-8 lg:p-20 text-center space-y-8 shadow-2xl shadow-blue-500/40 relative overflow-hidden">
                        {/* Inner Decor */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                        <h2 className="text-3xl lg:text-5xl font-bold text-white relative z-10 leading-tight">
                            Ready to transform your school network <br className="hidden lg:block" /> with digital logic?
                        </h2>
                        <p className="text-blue-100 text-lg max-w-2xl mx-auto relative z-10">
                            Join hundreds of schools delivering premium education experiences through our modern management platform.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 relative z-10">
                            <Button size="lg" asChild className="bg-white text-blue-600 hover:bg-gray-100 rounded-full px-10 h-14 text-lg font-bold">
                                <Link href={register()}>Register Your School</Link>
                            </Button>
                            <Button size="lg" variant="outline" asChild className="border-white/30 text-white hover:bg-white/10 rounded-full px-10 h-14 text-lg">
                                <Link href={login()}>Admin Portal</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-gray-100 dark:border-white/10 text-center">
                <div className="container mx-auto px-4 space-y-6">
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <GraduationCap className="text-white w-4 h-4" />
                        </div>
                        <span className="text-lg font-bold dark:text-white">EduFlow</span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto">
                        &copy; {new Date().getFullYear()} EduFlow School Management SaaS. Built with premium Laravel & React logic for institutional excellence.
                    </p>
                    <div className="flex justify-center gap-6 text-sm font-medium text-gray-500 dark:text-gray-400">
                        <a href="#" className="hover:text-blue-600 transition-colors">Documentation</a>
                        <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
                        <a href="#" className="hover:text-blue-600 transition-colors">Terms</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
