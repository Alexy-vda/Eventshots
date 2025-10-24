import { RegisterForm } from "@/components/auth/RegisterForm";
import Link from "next/link";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";

export const metadata = { title: "Inscription — EventShot" };

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-cream">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl font-bold mb-2 text-navy">
            📸 EventShot
          </h1>
          <p className="text-lg text-navy/70">Rejoignez-nous !</p>
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold text-gray-900">
              Créer un compte
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Commencez à partager vos photos d&apos;événements
            </p>
          </CardHeader>

          <CardBody>
            <RegisterForm />

            <p className="text-center text-sm text-gray-600 mt-6">
              Déjà un compte ?{" "}
              <Link
                href="/login"
                className="text-blue-600 font-medium hover:text-purple-600 transition-colors"
              >
                Se connecter
              </Link>
            </p>
          </CardBody>
        </Card>
      </div>
    </main>
  );
}
