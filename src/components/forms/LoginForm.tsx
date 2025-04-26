// src/components/forms/LoginForm.tsx

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { toast } from 'react-hot-toast';
import { supabase } from '../../lib/supabaseClient';
import { fetchUserProfile } from '../../features/auth/authSlice';
import { Button, Input } from '../../components/ui';

const loginSchema = z.object({
  email: z.string().email('ایمیل معتبر نیست'),
  password: z.string().min(6, 'رمز عبور باید حداقل ۶ کاراکتر باشد'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    try {
      const profile = await dispatch(fetchUserProfile()).unwrap();
      toast.success('ورود موفقیت‌آمیز بود!');

      // بر اساس نقش هدایت می‌کنیم
      switch (profile.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'marketing':
          navigate('/leads');
          break;
        case 'sales':
          navigate('/sales');
          break;
        case 'purchase':
          navigate('/purchase');
          break;
        default:
          navigate('/unauthorized');
          break;
      }
    } catch (err) {
      toast.error('مشکلی در دریافت اطلاعات کاربر پیش آمد.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
      <Input
        label="ایمیل"
        type="email"
        {...register('email')}
        error={errors.email?.message}
      />
      <Input
        label="رمز عبور"
        type="password"
        {...register('password')}
        error={errors.password?.message}
      />
      <Button type="submit" isLoading={isSubmitting} className="w-full">
        ورود
      </Button>
    </form>
  );
}
