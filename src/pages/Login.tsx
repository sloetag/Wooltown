import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { PageTransition } from '../components/layout/PageTransition';

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export function Login() {
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorVal, setErrorVal] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginForm) => {
    setIsSubmitting(true);
    setErrorVal(null);
    // Simulate network authentication delay
    await new Promise(r => setTimeout(r, 800));

    try {
      const emailLower = data.email.toLowerCase().trim();
      
      // Load stored users
      const usersStr = localStorage.getItem('wooltown_registered_users');
      const users = usersStr ? JSON.parse(usersStr) : [];
      
      // Look up target user or check for default demo user
      let matchedUser = users.find((u: any) => u.email.toLowerCase() === emailLower);
      
      // Support a convenient default demo login as well
      if (!matchedUser && emailLower === 'demo@example.com' && data.password === 'password') {
        matchedUser = { id: 'u_demo', name: 'Demo User', email: 'demo@example.com', password: 'password' };
      }
      if (!matchedUser && emailLower === 'alex.johnson@example.com' && data.password === 'password123') {
        matchedUser = { id: 'u_1', name: 'Alex Johnson', email: 'alex.johnson@example.com', password: 'password123' };
      }

      if (matchedUser) {
        if (matchedUser.password === data.password) {
          sessionStorage.setItem('wooltown_cta_auth_context', 'login_form');
          login({ id: matchedUser.id, name: matchedUser.name, email: matchedUser.email });
          setIsSubmitting(false);
          navigate(-1);
          return;
        }
      }

      setErrorVal("Invalid email or password. Please check your credentials.");
      setIsSubmitting(false);
    } catch (e) {
      setErrorVal("An error occurred during sign in. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50 min-h-[80vh]">
        <div className="bg-white p-6 sm:p-10 md:p-14 border border-slate-100 shadow-sm w-full max-w-md my-12">
          <h1 className="text-3xl font-serif font-bold tracking-tight text-slate-950 mb-2 uppercase text-center">Sign In</h1>
          <p className="text-slate-500 mb-8 text-sm text-center tracking-wide">Welcome back to Wooltown.</p>
          
          {errorVal && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 text-xs tracking-wide uppercase border border-red-100 text-center">
              {errorVal}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-[11px] font-bold text-slate-900 mb-2 uppercase tracking-widest">Email Address</label>
              <input {...register('email')} className="w-full px-4 py-3 bg-transparent border border-slate-200 rounded-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all placeholder-slate-300" placeholder="hello@example.com" />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[11px] font-bold text-slate-900 uppercase tracking-widest">Password</label>
                <Link to="/forgot-password" className="text-[11px] text-slate-500 hover:text-slate-900 underline uppercase tracking-widest">Forgot Password?</Link>
              </div>
              <input type="password" {...register('password')} className="w-full px-4 py-3 bg-transparent border border-slate-200 rounded-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all placeholder-slate-300" placeholder="••••••••" />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            
            <Button type="submit" size="lg" className="w-full rounded-none tracking-widest uppercase text-xs h-14 !mt-10" disabled={isSubmitting}>
              {isSubmitting ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-10 text-center border-t border-slate-100 pt-8">
            <p className="text-sm text-slate-500">
              New to Wooltown? <Link to="/register" className="text-slate-900 font-medium hover:text-slate-600 underline underline-offset-4 ml-2">Create Account</Link>
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
