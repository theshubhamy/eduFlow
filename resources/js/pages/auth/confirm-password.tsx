import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/password/confirm';

export default function ConfirmPassword() {
    return (
        <>
            <Head title="Confirm password" />

            <Form {...store.form()} resetOnSuccess={['password']}>
                {({ processing, errors }) => (
                    <div className="grid gap-6">
                        <div className="grid gap-2 text-left">
                            <Label htmlFor="password">Password</Label>
                            <PasswordInput
                                id="password"
                                name="password"
                                placeholder="••••••••"
                                autoComplete="current-password"
                                autoFocus
                                className="h-11 rounded-xl"
                            />

                            <InputError message={errors.password} />
                        </div>

                        <Button
                            className="h-11 rounded-xl bg-indigo-600 font-semibold text-white transition-all hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:hover:shadow-none"
                            disabled={processing}
                            data-test="confirm-password-button"
                        >
                            {processing && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
                            Confirm password
                        </Button>
                    </div>
                )}
            </Form>
        </>
    );
}

ConfirmPassword.layout = {
    title: 'Confirm your password',
    description:
        'This is a secure area of the application. Please confirm your password before continuing.',
};
