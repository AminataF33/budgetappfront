import { type NextRequest, NextResponse } from "next/server"
import Database from "better-sqlite3"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { join } from "path"

const db = new Database(join(process.cwd(), "database.db"))

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Trouver l'utilisateur
    const user = db
      .prepare(`
      SELECT id, firstName, lastName, email, phone, password, city, profession, createdAt
      FROM users WHERE email = ?
    `)
      .get(email)

    if (!user) {
      return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 })
    }

    // Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 })
    }

    // Générer un token JWT
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || "your-secret-key", {
      expiresIn: "7d",
    })

    // Supprimer le mot de passe des données retournées
    const { password: _, ...userWithoutPassword } = user

    const response = NextResponse.json({
      success: true,
      message: "Connexion réussie",
      user: userWithoutPassword,
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
    console.error("Erreur lors de la connexion:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
