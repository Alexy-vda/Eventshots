// Script de test pour vérifier l'API d'événements
// Exécuter avec: node --loader ts-node/esm test-events.mjs

const BASE_URL = "http://localhost:3001";

async function testLogin() {
  console.log("🔐 Test de connexion...");

  const response = await fetch(`${BASE_URL}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "alexy.vda@outlook.fr",
      password: "password123", // Changez avec votre mot de passe
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("❌ Erreur de connexion:", data);
    return null;
  }

  console.log("✅ Connexion réussie!");
  console.log("Token:", data.token?.substring(0, 20) + "...");
  return data.token;
}

async function testCreateEvent(token) {
  console.log("\n📝 Test de création d'événement...");

  const eventData = {
    title: "Test Event - " + new Date().toLocaleString(),
    description: "Événement de test créé automatiquement",
    date: new Date().toISOString(),
    location: "Paris, France",
  };

  const response = await fetch(`${BASE_URL}/api/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(eventData),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("❌ Erreur de création:", data);
    return null;
  }

  console.log("✅ Événement créé avec succès!");
  console.log("ID:", data.event.id);
  console.log("Slug:", data.event.slug);
  console.log("Lien de partage:", data.event.shareLink);
  return data.event;
}

async function testGetEvents(token) {
  console.log("\n📋 Test de récupération des événements...");

  const response = await fetch(`${BASE_URL}/api/events`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("❌ Erreur de récupération:", data);
    return;
  }

  console.log(`✅ ${data.events.length} événement(s) trouvé(s):`);
  data.events.forEach((event, index) => {
    console.log(`\n${index + 1}. ${event.title}`);
    console.log(`   Date: ${new Date(event.date).toLocaleString()}`);
    console.log(`   Slug: ${event.slug}`);
    console.log(`   Lien public: ${BASE_URL}/events/${event.slug}`);
  });
}

async function runTests() {
  console.log("🚀 Démarrage des tests API...\n");

  try {
    const token = await testLogin();
    if (!token) {
      console.error("\n❌ Impossible de continuer sans token");
      return;
    }

    const event = await testCreateEvent(token);
    if (!event) {
      console.error("\n❌ Impossible de créer un événement");
    }

    await testGetEvents(token);

    console.log("\n✅ Tous les tests terminés!");
  } catch (error) {
    console.error("\n❌ Erreur lors des tests:", error.message);
  }
}

runTests();
