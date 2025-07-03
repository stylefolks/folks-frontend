import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Toaster, toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useMeta } from '@/lib/meta';
import { API_BASE } from '@/lib/auth';

interface FormValues {
  email: string;
  password: string;
  nickname: string;
  profileImage?: string;
  intro?: string;
  isAgreeTerms: boolean;
  isAgreePrivacy: boolean;
}

export default function SignupPage() {
  const navigate = useNavigate();
  useMeta({ title: 'Sign Up - Stylefolks' });
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<FormValues>({ mode: 'onChange' });
  const profilePreview = watch('profileImage');
  const agreeTerms = watch('isAgreeTerms');
  const agreePrivacy = watch('isAgreePrivacy');

  const onSubmit = async (data: FormValues) => {
    try {
      const { isAgreeTerms, isAgreePrivacy, ...payload } = data;
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Sign up failed');
      }
      navigate('/login');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign up failed';
      toast.error(message);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setValue('profileImage', undefined);
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setValue('profileImage', reader.result as string, { shouldValidate: false });
    };
    reader.readAsDataURL(file);
  };

  const canSubmit = isValid && agreeTerms && agreePrivacy;

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md p-10 space-y-4">
        <div className="my-6 text-center space-y-1">
          <h1 className="text-4xl font-bold">Folks</h1>
          <p className="text-sm text-gray-400">Make culture</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            placeholder="Email address"
            type="email"
            className={cn('rounded-md border py-2 px-3 w-full', errors.email && 'border-red-500')}
            {...register('email', { required: true, pattern: /.+@.+\..+/ })}
          />
          <Input
            placeholder="Password"
            type="password"
            className={cn('rounded-md border py-2 px-3 w-full', errors.password && 'border-red-500')}
            {...register('password', { required: true, minLength: 6 })}
          />
          <Input
            placeholder="Nickname"
            className={cn('rounded-md border py-2 px-3 w-full', errors.nickname && 'border-red-500')}
            {...register('nickname', { required: true, minLength: 2, maxLength: 20 })}
          />
          <div>
            <label className="block text-sm mb-1">Profile image (optional)</label>
            <label className="w-12 h-12 border rounded-md flex justify-center items-center text-sm cursor-pointer">
              {profilePreview ? (
                <img src={profilePreview} className="w-12 h-12 object-cover rounded-md" />
              ) : (
                'Upload'
              )}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>
          <Textarea
            placeholder="One-line introduction"
            className={cn('rounded-md border py-2 px-3 w-full', errors.intro && 'border-red-500')}
            {...register('intro', { maxLength: 100 })}
          />
          <label className="flex items-center gap-2 text-sm mb-2">
            <input type="checkbox" {...register('isAgreeTerms', { required: true })} />
            <span>
              Agree to Terms of Service{' '}
              <Link to="#" className="underline text-gray-400">
                View details
              </Link>
            </span>
          </label>
          <label className="flex items-center gap-2 text-sm mb-2">
            <input type="checkbox" {...register('isAgreePrivacy', { required: true })} />
            <span>
              Agree to Privacy Policy{' '}
              <Link to="#" className="underline text-gray-400">
                View details
              </Link>
            </span>
          </label>
          <Button
            type="submit"
            disabled={!canSubmit}
            className="bg-black text-white py-2 w-full rounded-xl disabled:opacity-30"
          >
            Sign Up
          </Button>
        </form>
        <p className="text-center text-sm">
          Already have an account?{' '}
          <Link to="/login" className="underline">
            Login
          </Link>
        </p>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}
