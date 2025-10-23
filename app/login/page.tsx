import { LoginForm } from "@/components/auth/LoginForm";
import Link from "next/link";

export const metadata = { title: "Connexion — EventShots Pro" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="min-h-[80dvh] flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Se connecter</h1>
          <p className="text-sm text-zinc-500">
            Utilise <code>demo@acme.io</code> / <code>pass1234</code>
          </p>
        </div>

        {params.registered && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">
            ✅ Compte créé avec succès ! Vous pouvez maintenant vous connecter.
          </div>
        )}

        <LoginForm />

        <p className="text-center text-sm text-zinc-600">
          Pas encore de compte ?{" "}
          <Link
            href="/register"
            className="text-black font-medium hover:underline"
          >
            S&apos;inscrire
          </Link>
        </p>
      </div>
    </main>
  );
}
