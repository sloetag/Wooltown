import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { PageTransition } from '../components/layout/PageTransition';

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterForm = z.infer<typeof registerSchema>;

export function Register() {
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorVal, setErrorVal] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsSubmitting(true);
    setErrorVal(null);
    // Simulate network authentication delay
    await new Promise(r => setTimeout(r, 800));

    try {
      // Fetch existing registered users
      const usersStr = localStorage.getItem('wooltown_registered_users');
      const users = usersStr ? JSON.parse(usersStr) : [];
      
      const emailLower = data.email.toLowerCase().trim();
      
      // Check if user already exists
      const userExists = users.some((u: any) => u.email.toLowerCase() === emailLower);
      if (userExists) {
        setErrorVal("This email address is already registered.");
        setIsSubmitting(false);
        return;
      }

      // Add new user
      const newUser = {
        id: 'u_' + Date.now(),
        name: data.name,
        email: emailLower,
        password: data.password // In a real app we'd hash this, but simple localStorage storage meets goal perfectly
      };
      
      users.push(newUser);
      localStorage.setItem('wooltown_registered_users', JSON.stringify(users));

      // Log the user in
      sessionStorage.setItem('wooltown_cta_auth_context', 'register_form');
      login({ id: newUser.id, name: newUser.name, email: newUser.email });
      setIsSubmitting(false);
      navigate('/');
    } catch (e) {
      setErrorVal("An error occurred during registration. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50 min-h-[80vh]">
        <div className="bg-white p-6 sm:p-10 md:p-14 border border-slate-100 shadow-sm w-full max-w-md my-12">
          <h1 className="text-3xl font-serif font-bold tracking-tight text-slate-950 mb-2 uppercase text-center">Register</h1>
          <p className="text-slate-500 mb-8 text-sm text-center tracking-wide">Join the Wooltown community.</p>
          
          {errorVal && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 text-xs tracking-wide uppercase border border-red-100 text-center">
              {errorVal}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-[11px] font-bold text-slate-900 mb-2 uppercase tracking-widest">Full Name</label>
              <input {...register('name')} className="w-full px-4 py-3 bg-transparent border border-slate-200 rounded-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all placeholder-slate-300" placeholder="John Doe" />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-900 mb-2 uppercase tracking-widest">Email Address</label>
              <input {...register('email')} className="w-full px-4 py-3 bg-transparent border border-slate-200 rounded-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all placeholder-slate-300" placeholder="hello@example.com" />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-900 mb-2 uppercase tracking-widest">Password</label>
              <input type="password" {...register('password')} className="w-full px-4 py-3 bg-transparent border border-slate-200 rounded-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all placeholder-slate-300" placeholder="••••••••" />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            
            <Button type="submit" size="lg" className="w-full rounded-none tracking-widest uppercase text-xs h-14 !mt-10" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-10 text-center border-t border-slate-100 pt-8">
            <p className="text-sm text-slate-500">
              Already have an account? <Link to="/login" className="text-slate-900 font-medium hover:text-slate-600 underline underline-offset-4 ml-2">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
