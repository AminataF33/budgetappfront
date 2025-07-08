import { type NextRequest, NextResponse } from "next/server"
import Database from "better-sqlite3"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { join } from "path"

const db = new Database(join(process.cwd(), "database.db"))

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, password, city, profession } = body

    // Vérifier si l'utilisateur existe déjà
    const existingUser = db.prepare("SELECT id FROM users WHERE email = ?").get(email)

    if (existingUser) {
      return NextResponse.json({ error: "Un compte avec cet email existe déjà" }, { status: 400 })
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insérer le nouvel utilisateur
    const insertUser = db.prepare(`
      INSERT INTO users (firstName, lastName, email, phone, password, city, profession)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)

    const result = insertUser.run(firstName, lastName, email, phone, hashedPassword, city, profession)
    const userId = result.lastInsertRowid

    // Créer des comptes par défaut
    const insertAccount = db.prepare(`
      INSERT INTO accounts (userId, name, bank, type, balance) VALUES (?, ?, ?, ?, ?)
    `)

    const defaultAccounts = [
      [userId, "Compte Principal", "BOA", "checking", 0],
      [userId, "Épargne", "SGBS", "savings", 0],
    ]

    defaultAccounts.forEach((account) => {
      insertAccount.run(...account)
    })

    // Générer un token JWT
    const token = jwt.sign({ userId, email }, process.env.JWT_SECRET || "your-secret-key", { expiresIn: "7d" })

    // Récupérer les données utilisateur (sans le mot de passe)
    const user = db
      .prepare(`
      SELECT id, firstName, lastName, email, phone, city, profession, createdAt
      FROM users WHERE id = ?
    `)
      .get(userId)

    const response = NextResponse.json({
      success: true,
      message: "Compte créé avec succès",
      user,
      token,
    })

    // Définir le cookie avec le token
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 jours
    })

    return response
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
