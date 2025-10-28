import Link from "next/link";

export const revalidate = false;

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <section className="relative bg-white overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=2000')",
            }}
          />

          <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/50 to-black/70" />

          <div className="absolute inset-0 bg-white/5" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24 relative z-10 w-full">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm font-medium text-white mb-6">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              PHOTO EVENTS
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white! leading-tight drop-shadow-2xl">
              La plateforme professionnelle
              <br />
              pour photographes indépendants
            </h1>

            <p className="text-lg sm:text-xl mb-10 text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
              Gérez vos événements, partagez vos photos avec vos clients et
              développez votre activité de photographe professionnel en toute
              simplicité.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4 mb-16">
              <Link
                href="/register"
                className="px-8 py-4 bg-white text-[#1a1a1a] rounded-lg font-medium text-base hover:bg-white/90 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
              >
                Démarrer gratuitement
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg font-medium text-base hover:bg-white/20 transition-all border border-white/30"
              >
                Se connecter
              </Link>
            </div>

            <div className="mt-16">
              <p className="text-sm text-white/70 mb-6 font-medium">
                Utilisé par plus de 100 photographes indépendants en France
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-[#666] mb-6">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            25 FEATURES
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#1a1a1a]">
            Tous les outils dont vous avez besoin
            <br />
            pour gérer votre activité
          </h2>
          <p className="text-lg text-[#666] max-w-2xl mx-auto">
            Concentrez-vous sur votre art : la photographie. Nous nous occupons
            de la logistique, du partage et de la gestion de vos galeries
            événementielles.
          </p>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100">
            <div className="flex flex-col sm:flex-row items-start justify-between mb-6 gap-4">
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-bold mb-2 text-[#1a1a1a]">
                  Gestion des événements
                </h3>
                <p className="text-sm md:text-base text-[#666]">
                  Créez et organisez vos mariages, baptêmes, anniversaires et
                  shootings en quelques clics. Chaque événement dispose de sa
                  propre galerie privée.
                </p>
              </div>
              <Link
                href="/dashboard"
                className="text-sm text-[#6366f1] font-medium whitespace-nowrap self-start sm:self-auto"
              >
                Accès libre →
              </Link>
            </div>

            <div className="bg-[#fafafa] rounded-lg p-4 space-y-3">
              <div className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
                <div className="relative h-32 bg-linear-to-br from-[#6366f1] to-[#8b5cf6]">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519741497674-611481863552?w=400')] bg-cover bg-center" />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="font-semibold text-white text-sm">
                      Mariage Sophie & Marc
                    </p>
                    <p className="text-xs text-white/90">
                      24 octobre 2025 • 156 photos
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
                <div className="relative h-32 bg-linear-to-br from-[#ec4899] to-[#f43f5e]">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-white/40"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="font-semibold text-white text-sm">
                      Baptême Lucas
                    </p>
                    <p className="text-xs text-white/90">
                      20 octobre 2025 • En attente de photos
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100">
            <div className="mb-6">
              <h3 className="text-xl md:text-2xl font-bold mb-2 text-[#1a1a1a]">
                Partage simple et sécurisé
              </h3>
              <p className="text-sm md:text-base text-[#666]">
                Un lien unique par événement pour permettre à vos clients
                d&apos;accéder et télécharger leurs photos en haute qualité.
                Protection par code d&apos;accès disponible.
              </p>
            </div>

            <div className="bg-[#fafafa] rounded-lg p-4 md:p-6 space-y-4">
              <div className="bg-white p-3 md:p-4 rounded-lg border-2 border-dashed border-gray-300">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <svg
                    className="w-5 h-5 text-[#6366f1] shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[#999] mb-1">Lien de partage</p>
                    <p className="text-sm font-mono text-[#1a1a1a] truncate">
                      eventshot.com/e/mariage-s...
                    </p>
                  </div>
                  <button className="px-3 py-1 bg-[#1a1a1a] text-white text-xs rounded-md hover:bg-[#2d2d2d] transition-colors whitespace-nowrap self-start sm:self-auto">
                    Copier
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <svg
                  className="w-5 h-5 text-[#22c55e]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <span className="text-[#666]">
                  Protégé par code d&apos;accès
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <svg
                  className="w-5 h-5 text-[#22c55e]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                <span className="text-[#666]">
                  Téléchargement haute qualité
                </span>
              </div>
            </div>
          </div>

          <div className="bg-linear-to-br from-[#6366f1] to-[#8b5cf6] rounded-2xl p-8 text-white md:col-span-2">
            <div className="text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-6">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                BIENTÔT DISPONIBLE
              </div>
              <h3 className="text-3xl font-bold mb-4">
                De nouvelles fonctionnalités arrivent
              </h3>
              <p className="text-white/90 text-lg mb-6">
                Nous travaillons sur de nombreuses améliorations : retouche
                automatique, albums clients personnalisés, facturation intégrée,
                signature de contrats et bien plus encore...
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <span className="px-4 py-2 bg-white/10 rounded-full text-sm">
                  ✨ Retouche IA
                </span>
                <span className="px-4 py-2 bg-white/10 rounded-full text-sm">
                  📄 Contrats
                </span>
                <span className="px-4 py-2 bg-white/10 rounded-full text-sm">
                  💰 Facturation
                </span>
                <span className="px-4 py-2 bg-white/10 rounded-full text-sm">
                  📱 App mobile
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative bg-white overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2000')",
            }}
          />

          <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/60 to-black/70" />

          <div className="absolute inset-0 bg-white/5" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <svg
            className="w-12 h-12 mx-auto mb-8 text-white drop-shadow-lg"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>

          <blockquote className="text-2xl md:text-3xl font-medium text-white mb-8 leading-relaxed drop-shadow-2xl">
            &quot;Depuis que j&apos;utilise EventShot, je gagne un temps fou
            dans la gestion de mes mariages. Mes clients adorent pouvoir accéder
            à leurs photos facilement. C&apos;est devenu un outil indispensable
            pour mon activité de photographe indépendant.&quot;
          </blockquote>

          <div className="flex items-center justify-center gap-4">
            <div className="flex -space-x-2">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#6366f1] to-[#8b5cf6] border-2 border-white/50" />
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#f59e0b] to-[#eab308] border-2 border-white/50" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-white drop-shadow-lg">
                Sophie Martin
              </p>
              <p className="text-sm text-white/90 drop-shadow-lg">
                Photographe mariage & événementiel
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="text-5xl md:text-6xl font-bold text-[#1a1a1a] mb-2">
                2025
              </div>
              <p className="text-lg text-[#666]">Année de création</p>
            </div>
            <div>
              <div className="text-5xl md:text-6xl font-bold text-[#1a1a1a] mb-2">
                50K+
              </div>
              <p className="text-lg text-[#666]">Photos partagées</p>
            </div>
            <div>
              <div className="text-5xl md:text-6xl font-bold text-[#1a1a1a] mb-2">
                100+
              </div>
              <p className="text-lg text-[#666]">Photographes actifs</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#1a1a1a] text-white/70 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-white text-lg font-bold">EventShot</span>
              </div>
              <p className="text-sm mb-4">Alexy Van Den Abele</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/register"
                  className="px-6 py-3 bg-white text-[#1a1a1a] rounded-lg font-medium text-base hover:bg-gray-100 transition-colors whitespace-nowrap"
                >
                  Démarrer
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
