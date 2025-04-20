'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import Link from 'next/link';
import { CheckCircle2Icon } from 'lucide-react';

const emailSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
});

type Step = 'email' | 'otp' | 'success';

export default function ForgotPassword() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (data: z.infer<typeof emailSchema>) => {
    setEmail(data.email);
    // Simulate sending OTP
    setStep('otp');
  };

  const handleOTPChange = (value: string) => {
    setOtp(value);
  };

  const handleOTPSubmit = () => {
    // Simulate OTP verification
    console.log('OTP submitted:', otp);
    setStep('success');
  };

  return (
    <main className="h-full w-full flex items-center justify-center px-2">
      <div className="md:p-6 p-4 rounded-3xl bg-white/80 shadow-xl light saturate-[2] backdrop-blur-lg w-full max-w-lg" style={{ colorScheme: 'light' }}>
        <h1 className="font-semibold mb-6">Reset Password</h1>

        {step === 'email' && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex-col gap-2 py-0 border-b-0">
                    <FormLabel className="sr-only">Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email" {...field} className="py-3 rounded-full border-accent/20 px-4" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full mt-2 rounded-full bg-accent/10 py-2.5 h-auto" variant="secondary">
                Send Reset Code
              </Button>
            </form>
          </Form>
        )}

        {step === 'otp' && (
          <div className="space-y-4">
            <p className="text-sm text-foreground/80">We sent a verification code to {email}</p>
            <InputOTP maxLength={6} onChange={handleOTPChange}>
              <InputOTPGroup className="gap-2 justify-between w-full">
                {[...Array(6)].map((_, i) => (
                  <InputOTPSlot key={i} index={i} className="border-accent/20 h-12 w-12 border rounded-xl first:rounded-l-xl last:rounded-r-xl" />
                ))}
              </InputOTPGroup>
            </InputOTP>
            <div className="flex gap-2">
              <Button onClick={() => setStep('email')} className="flex-1 rounded-full bg-accent/5 py-2.5 h-auto" variant="secondary">
                Back
              </Button>
              <Button onClick={handleOTPSubmit} className="flex-1 rounded-full border-accent/20 bg-transparent py-2.5 h-auto" variant="outline" disabled={otp.length !== 6}>
                Submit
              </Button>
            </div>
          </div>
        )}

        {step === 'success' ? (
          <div className="space-y-4 text-center">
            <div className="flex items-center flex-col space-y-3">
              <div>
                <CheckCircle2Icon className="size-8" />
              </div>
              <p className="text-foreground/80 pb-2 font-semibold">Your password has been successfully reset!</p>
            </div>
            <Link href="/login">
              <Button className="w-full mt-2 rounded-full bg-accent/10 py-2.5 h-auto" variant="secondary">
                Back to Login
              </Button>
            </Link>
          </div>
        ) : (
          <div className="text-center">
            <Link href="/login" className="mt-4 text-foreground/80 inline-block text-sm underline">
              Back to login
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
