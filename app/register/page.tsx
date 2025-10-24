import { RegisterForm } from "@/components/auth/RegisterForm";
import Link from "next/link";

export const metadata = { title: "Inscription — EventShot" };

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex bg-gray-50">
      {/* Left Side - Hero Section */}
      <div
        className="hidden lg:flex lg:w-1/3 relative text-white p-12 flex-col justify-between bg-cover bg-center"
        style={{
          backgroundImage: `url("https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1471")`,
        }}
      >
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-black/20 to-black/50"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between h-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#6366f1] rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <span className="text-xl font-bold">EventShot</span>
          </div>

          {/* Quote */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold leading-tight text-gray-100!">
                &quot;Gérer mes événements photo n&apos;a jamais été aussi
                simple.&quot;
              </h2>
            </div>
            <div className="space-y-1">
              <p className="font-semibold">Thomas Dubois</p>
              <p className="text-gray-300 text-sm">Photographe Événementiel</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 bg-[#6366f1] rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <span className="text-2xl font-bold text-[#1a1a1a]">EventShot</span>
          </div>

          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-[#1a1a1a]">
              Créer un compte
            </h1>
            <p className="text-gray-600">
              Commencez à gérer vos événements photo dès aujourd&apos;hui
            </p>
          </div>

          {/* Register Form */}
          <RegisterForm />

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-50 text-gray-500">OR</span>
            </div>
          </div>

          {/* Log In Link */}
          <p className="text-center text-sm text-gray-600">
            Vous avez déjà un compte ?{" "}
            <Link
              href="/login"
              className="text-[#6366f1] font-semibold hover:text-[#4f46e5] transition-colors"
            >
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
