import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">新規登録</h1>
          <p className="mt-2 text-gray-600">
            アカウントを作成してVirtual Schoolに参加しましょう
          </p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
