import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata = { title: "Inscription — EventShots Pro" };

export default function RegisterPage() {
  return (
    <main className="min-h-[80dvh] flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Créer un compte</h1>
          <p className="text-sm text-zinc-500">
            Rejoignez EventShots Pro en tant que photographe
          </p>
        </div>
        <RegisterForm />
      </div>
    </main>
  );
}
