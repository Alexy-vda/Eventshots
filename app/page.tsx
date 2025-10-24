// app/page.tsx
import Link from "next/link";

export const revalidate = false;

export default function Home() {
  return (
    <main className="min-h-screen bg-cream">
      {/* Hero Section */}
      <section className="relative bg-navy text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-32">
          <div className="text-center">
            <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 animate-fade-in">
              📸 EventShot
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-3 sm:mb-4 text-gold max-w-3xl mx-auto px-2 font-medium">
              L&apos;outil professionnel pour les photographes d&apos;événements
            </p>
            <p className="text-base sm:text-lg md:text-xl mb-8 sm:mb-12 text-cream/90 max-w-2xl mx-auto px-2">
              Créez, gérez et partagez vos galeries photo en toute simplicité.
              Offrez une expérience premium à vos clients.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Link
                href="/register"
                className="px-6 sm:px-8 py-3 sm:py-4 bg-terracotta text-white rounded-lg font-bold text-base sm:text-lg hover:bg-terracotta/90 transition-all hover:scale-[1.02] shadow-lg"
              >
                🚀 Commencer gratuitement
              </Link>
              <Link
                href="/login"
                className="px-6 sm:px-8 py-3 sm:py-4 bg-sage text-white border-2 border-sage rounded-lg font-bold text-base sm:text-lg hover:bg-sage/90 transition-all"
              >
                🔑 Se connecter
              </Link>
            </div>
          </div>
        </div>
        {/* Vague décorative */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-auto">
            <path
              fill="#f4f1de"
              d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-center mb-4 text-navy">
            Pourquoi choisir EventShot ?
          </h2>
          <p className="text-xl text-center text-navy/70 mb-16 max-w-2xl mx-auto">
            Une solution complète pour gérer vos photos d&apos;événements
            professionnellement
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-cream/50 p-8 rounded-lg border-2 border-sage/20 hover:border-sage/40 hover:shadow-xl transition-all">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold mb-3 text-navy">
                Upload ultra-rapide
              </h3>
              <p className="text-navy/70">
                Uploadez vos photos par glisser-déposer. Notre infrastructure
                optimisée garantit des transferts rapides même pour des
                centaines de photos.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-cream/50 p-8 rounded-lg border-2 border-sage/20 hover:border-sage/40 hover:shadow-xl transition-all">
              <div className="text-5xl mb-4">🌐</div>
              <h3 className="text-2xl font-bold mb-3 text-navy">
                Galeries publiques
              </h3>
              <p className="text-navy/70">
                Créez des galeries publiques accessibles via un simple lien. Vos
                invités peuvent consulter et télécharger les photos facilement.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-cream/50 p-8 rounded-lg border-2 border-sage/20 hover:border-sage/40 hover:shadow-xl transition-all">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-2xl font-bold mb-3 text-navy">
                Sécurité garantie
              </h3>
              <p className="text-navy/70">
                Vos photos sont stockées de manière sécurisée. Vous contrôlez
                qui peut voir, télécharger ou supprimer vos contenus.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-cream">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-center mb-4 text-navy">
            Comment ça marche ?
          </h2>
          <p className="text-xl text-center text-navy/70 mb-16 max-w-2xl mx-auto">
            Trois étapes simples pour partager vos souvenirs
          </p>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-sage/20 border-2 border-sage rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl font-bold text-sage">1</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-navy">
                Créez votre événement
              </h3>
              <p className="text-navy/70">
                Inscrivez-vous et créez un événement en quelques secondes.
                Donnez-lui un nom et une description.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-terracotta/20 border-2 border-terracotta rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl font-bold text-terracotta">2</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-navy">
                Uploadez vos photos
              </h3>
              <p className="text-navy/70">
                Glissez-déposez vos photos depuis votre appareil. Notre système
                s&apos;occupe du reste !
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gold/30 border-2 border-gold rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl font-bold text-navy">3</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-navy">
                Partagez le lien
              </h3>
              <p className="text-navy/70">
                Partagez le lien public de votre galerie avec vos invités. Ils
                peuvent voir et télécharger les photos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-terracotta text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
            Prêt à professionnaliser vos services ?
          </h2>
          <p className="text-xl mb-10 text-cream/90">
            Rejoignez les photographes professionnels qui utilisent EventShot
            pour offrir une expérience premium à leurs clients.
          </p>
          <Link
            href="/register"
            className="inline-block px-10 py-5 bg-white text-terracotta rounded-lg font-bold text-xl hover:bg-cream hover:scale-[1.02] transition-all shadow-2xl"
          >
            🎉 Commencer maintenant
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy text-cream/80 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-white font-serif text-xl font-bold mb-4">
                📸 EventShot
              </h3>
              <p className="text-cream/60">
                La plateforme moderne pour partager vos photos
                d&apos;événements.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Navigation</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/events" className="hover:text-gold transition">
                    Événements
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-gold transition">
                    Connexion
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-gold transition">
                    S&apos;inscrire
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Légal</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-gold transition">
                    Conditions d&apos;utilisation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gold transition">
                    Politique de confidentialité
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t-2 border-sage/30 pt-8 text-center">
            <p className="text-cream/50">
              © {new Date().getFullYear()} EventShot. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
