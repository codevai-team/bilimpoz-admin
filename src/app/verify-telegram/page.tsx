import TelegramVerificationForm from '@/components/auth/TelegramVerificationForm';

export default function VerifyTelegramPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{backgroundColor: '#0b0b0b'}}>
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Bilimpoz Admin
          </h1>
          <p className="text-gray-400 mt-2">Подтверждение входа</p>
        </div>
        <TelegramVerificationForm />
      </div>
    </div>
  );
}
