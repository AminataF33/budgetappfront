import Database from "better-sqlite3"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Créer la base de données
const db = new Database(join(__dirname, "../database.db"))

console.log("🗄️ Ajout de données de démonstration...")

// Récupérer l'utilisateur démo
const demoUser = db.prepare("SELECT id FROM users WHERE email = ?").get("demo@monbudget.sn")

if (demoUser) {
  const userId = demoUser.id

  // Récupérer les comptes
  const accounts = db.prepare("SELECT id, name FROM accounts WHERE userId = ?").all(userId)
  const categories = db.prepare("SELECT id, name, type FROM categories").all()

  // Ajouter des transactions de démonstration
  const insertTransaction = db.prepare(`
    INSERT INTO transactions (userId, accountId, categoryId, description, amount, date, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)

  const demoTransactions = [
    // Revenus
    [
      userId,
      accounts[0].id,
      categories.find((c) => c.name === "Salaire").id,
      "Salaire Janvier 2024",
      1400000,
      "2024-01-01",
      "Salaire mensuel",
    ],
    [
      userId,
      accounts[0].id,
      categories.find((c) => c.name === "Freelance").id,
      "Projet web client",
      350000,
      "2024-01-15",
      "Développement site web",
    ],

    // Dépenses
    [
      userId,
      accounts[0].id,
      categories.find((c) => c.name === "Logement").id,
      "Loyer Janvier",
      -600000,
      "2024-01-01",
      "Loyer mensuel",
    ],
    [
      userId,
      accounts[0].id,
      categories.find((c) => c.name === "Alimentation").id,
      "Auchan Almadies",
      -45600,
      "2024-01-02",
      "Courses hebdomadaires",
    ],
    [
      userId,
      accounts[0].id,
      categories.find((c) => c.name === "Transport").id,
      "Essence Total",
      -32650,
      "2024-01-03",
      "Plein d'essence",
    ],
    [
      userId,
      accounts[0].id,
      categories.find((c) => c.name === "Santé").id,
      "Pharmacie Point E",
      -28500,
      "2024-01-04",
      "Médicaments",
    ],
    [
      userId,
      accounts[0].id,
      categories.find((c) => c.name === "Loisirs").id,
      "Canal+ Sénégal",
      -15990,
      "2024-01-05",
      "Abonnement TV",
    ],
    [
      userId,
      accounts[0].id,
      categories.find((c) => c.name === "Alimentation").id,
      "Restaurant Teranga",
      -35000,
      "2024-01-06",
      "Dîner famille",
    ],
    [
      userId,
      accounts[0].id,
      categories.find((c) => c.name === "Transport").id,
      "Taxi Dakar",
      -8500,
      "2024-01-07",
      "Transport urbain",
    ],
    [
      userId,
      accounts[0].id,
      categories.find((c) => c.name === "Vêtements").id,
      "Sandaga Market",
      -65000,
      "2024-01-08",
      "Vêtements traditionnels",
    ],
    [
      userId,
      accounts[1].id,
      categories.find((c) => c.name === "Épargne").id,
      "Virement épargne",
      -250000,
      "2024-01-10",
      "Épargne mensuelle",
    ],

    // Mois précédents pour les analyses
    [
      userId,
      accounts[0].id,
      categories.find((c) => c.name === "Salaire").id,
      "Salaire Décembre 2023",
      1400000,
      "2023-12-01",
      "Salaire mensuel",
    ],
    [
      userId,
      accounts[0].id,
      categories.find((c) => c.name === "Logement").id,
      "Loyer Décembre",
      -600000,
      "2023-12-01",
      "Loyer mensuel",
    ],
    [
      userId,
      accounts[0].id,
      categories.find((c) => c.name === "Alimentation").id,
      "Courses diverses",
      -180000,
      "2023-12-15",
      "Courses du mois",
    ],
    [
      userId,
      accounts[0].id,
      categories.find((c) => c.name === "Transport").id,
      "Transport décembre",
      -95000,
      "2023-12-20",
      "Transport mensuel",
    ],
  ]

  demoTransactions.forEach((transaction) => {
    insertTransaction.run(...transaction)
  })

  // Ajouter des budgets de démonstration
  const insertBudget = db.prepare(`
    INSERT INTO budgets (userId, categoryId, amount, period, startDate, endDate)
    VALUES (?, ?, ?, ?, ?, ?)
  `)

  const currentDate = new Date()
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

  const demoBudgets = [
    [
      userId,
      categories.find((c) => c.name === "Alimentation").id,
      300000,
      "monthly",
      startOfMonth.toISOString().split("T")[0],
      endOfMonth.toISOString().split("T")[0],
    ],
    [
      userId,
      categories.find((c) => c.name === "Transport").id,
      100000,
      "monthly",
      startOfMonth.toISOString().split("T")[0],
      endOfMonth.toISOString().split("T")[0],
    ],
    [
      userId,
      categories.find((c) => c.name === "Loisirs").id,
      125000,
      "monthly",
      startOfMonth.toISOString().split("T")[0],
      endOfMonth.toISOString().split("T")[0],
    ],
    [
      userId,
      categories.find((c) => c.name === "Logement").id,
      600000,
      "monthly",
      startOfMonth.toISOString().split("T")[0],
      endOfMonth.toISOString().split("T")[0],
    ],
    [
      userId,
      categories.find((c) => c.name === "Santé").id,
      75000,
      "monthly",
      startOfMonth.toISOString().split("T")[0],
      endOfMonth.toISOString().split("T")[0],
    ],
    [
      userId,
      categories.find((c) => c.name === "Vêtements").id,
      100000,
      "monthly",
      startOfMonth.toISOString().split("T")[0],
      endOfMonth.toISOString().split("T")[0],
    ],
  ]

  demoBudgets.forEach((budget) => {
    insertBudget.run(...budget)
  })

  // Ajouter des objectifs de démonstration
  const insertGoal = db.prepare(`
    INSERT INTO goals (userId, title, description, targetAmount, currentAmount, deadline, category)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)

  const demoGoals = [
    [
      userId,
      "Fonds d'urgence",
      "Constituer un fonds d'urgence de 6 mois de salaire",
      8400000,
      4375000,
      "2024-12-31",
      "Sécurité",
    ],
    [
      userId,
      "Achat appartement",
      "Épargner pour l'apport d'un appartement à Dakar",
      25000000,
      6250000,
      "2025-06-30",
      "Immobilier",
    ],
    [
      userId,
      "Nouvelle voiture",
      "Acquérir une voiture fiable pour les déplacements",
      12500000,
      9375000,
      "2024-08-15",
      "Transport",
    ],
    [
      userId,
      "Pèlerinage à la Mecque",
      "Réaliser le pèlerinage spirituel à la Mecque",
      2000000,
      1400000,
      "2024-09-01",
      "Voyage",
    ],
    [
      userId,
      "Formation professionnelle",
      "Investir dans le développement de carrière",
      1500000,
      1500000,
      "2024-03-01",
      "Éducation",
    ],
  ]

  demoGoals.forEach((goal) => {
    insertGoal.run(...goal)
  })

  console.log("✅ Données de démonstration ajoutées avec succès !")
} else {
  console.log("❌ Utilisateur de démonstration non trouvé")
}

db.close()
console.log("🎉 Script terminé !")
