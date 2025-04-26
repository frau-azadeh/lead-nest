// src/pages/LoginPage.tsx

import LoginForm from '../components/forms/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">ورود به پنل</h2>
        <LoginForm />
      </div>
    </div>
  );
}
