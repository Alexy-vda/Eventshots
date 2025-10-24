import { LoginForm } from "@/components/auth/LoginForm";
import Link from "next/link";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";

export const metadata = { title: "Connexion — EventShot" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-cream">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl font-bold mb-2 text-navy">
            📸 EventShot
          </h1>
          <p className="text-lg text-navy/70">Bienvenue !</p>
        </div>

        <Card>
          <CardHeader>
            <h2 className="font-serif text-2xl font-bold text-navy">
              Connexion
            </h2>
            <p className="text-sm text-navy/60 mt-1">
              Connectez-vous à votre compte
            </p>
          </CardHeader>

          <CardBody>
            {params.registered && (
              <div className="mb-6 bg-sage/10 border-2 border-sage/40 text-sage px-4 py-3 rounded-lg text-sm flex items-center space-x-2">
                <span className="text-xl">✅</span>
                <span className="font-medium">
                  Compte créé avec succès ! Vous pouvez maintenant vous
                  connecter.
                </span>
              </div>
            )}

            <LoginForm />

            <p className="text-center text-sm text-navy/70 mt-6">
              Pas encore de compte ?{" "}
              <Link
                href="/register"
                className="text-terracotta font-semibold hover:text-terracotta/80 transition-colors"
              >
                Créer un compte
              </Link>
            </p>
          </CardBody>
        </Card>

        <p className="text-center text-sm text-navy/60 mt-6">
          Compte démo :{" "}
          <code className="bg-white/50 border border-sage/20 px-2 py-1 rounded">
            demo@acme.io
          </code>{" "}
          /{" "}
          <code className="bg-white/50 border border-sage/20 px-2 py-1 rounded">
            pass1234
          </code>
        </p>
      </div>
    </main>
  );
}
