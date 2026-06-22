import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { PageTransition } from '../components/layout/PageTransition';

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address").min(1, "Email is required"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPassword() {
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        setIsSuccess(true);
        resolve(true);
      }, 1000);
    });
  };

  return (
    <PageTransition>
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50 min-h-[80vh]">
        <div className="bg-white p-6 sm:p-10 md:p-14 border border-slate-100 shadow-sm w-full max-w-md my-12">
          <h1 className="text-3xl font-serif font-bold tracking-tight text-slate-950 mb-2 uppercase text-center">Forgot Password</h1>
          {!isSuccess ? (
            <>
              <p className="text-slate-500 mb-8 text-sm text-center tracking-wide">Enter your email address and we'll send you a link to reset your password.</p>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block text-[11px] font-bold text-slate-900 mb-2 uppercase tracking-widest">Email Address</label>
                  <input {...register('email')} className="w-full px-4 py-3 bg-transparent border border-slate-200 rounded-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all placeholder-slate-300" placeholder="hello@example.com" />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
                
                <Button type="submit" size="lg" className="w-full rounded-none tracking-widest uppercase text-xs h-14 !mt-10" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            </>
          ) : (
             <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="font-serif text-xl font-bold mb-3 uppercase tracking-tight">Check Your Inbox</h3>
                <p className="text-sm text-slate-500 text-center mb-8">We've sent a password reset link to your email address. It will expire in 1 hour.</p>
             </div>
          )}

          <div className="mt-10 text-center border-t border-slate-100 pt-8">
            <p className="text-sm text-slate-500">
              Wait, I remember my password! <Link to="/login" className="text-slate-900 font-medium hover:text-slate-600 underline underline-offset-4 ml-2">Back to Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
