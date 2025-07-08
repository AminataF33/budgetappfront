import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import connectDB from "@/lib/db" // ✅ à créer si pas encore fait
import User from "@/models/User" // ✅ modèle Mongoose

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { email, password } = await request.json()

    const user = await User.findOne({ email })

    if (!user) {
      return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 })
    }

    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 })
    }

    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" },
    )

    const { password: _, ...userWithoutPassword } = user.toObject()

    const response = NextResponse.json({
      success: true,
      message: "Connexion réussie",
      user: userWithoutPassword,
      token,
    })

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
