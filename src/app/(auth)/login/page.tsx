'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string(),
});

export default function Login() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
    // TODO: Implement login logic
  };

  return (
    <main className="h-full w-full flex items-center justify-center px-2">
      <div className="md:p-6 p-4 rounded-3xl bg-white/80 shadow-xl light saturate-[2] backdrop-blur-lg w-full max-w-lg" style={{ colorScheme: 'light' }}>
        <h1 className="font-semibold mb-6">Login to continue</h1>
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="flex-col gap-2 py-0 border-b-0">
                  <FormLabel className="sr-only">Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter your password" {...field} className="py-3 rounded-full border-accent/20 px-4" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full mt-2 rounded-full bg-accent/10 py-2.5 h-auto" variant="secondary">
              Login
            </Button>
          </form>
        </Form>
        <div className="text-center">
          <Link href="/forgot-password" className="mt-4 text-foreground/80 inline-block text-sm underline">
            Forgot Password?
          </Link>
        </div>
      </div>
    </main>
  );
}
