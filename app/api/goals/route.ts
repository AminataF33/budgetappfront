import { type NextRequest, NextResponse } from "next/server"
import Database from "better-sqlite3"
import { join } from "path"
import { requireAuth } from "@/lib/auth"

const db = new Database(join(process.cwd(), "database.db"))

export const GET = requireAuth(async (request: NextRequest, user) => {
  try {
    const goals = db
      .prepare(`
      SELECT id, title, description, targetAmount, currentAmount, deadline, category, createdAt
      FROM goals 
      WHERE userId = ?
      ORDER BY deadline ASC
    `)
      .all(user.id)

    return NextResponse.json({
      success: true,
      data: goals,
    })
  } catch (error) {
    console.error("Erreur objectifs:", error)
    return NextResponse.json({ error: "Erreur lors du chargement des objectifs" }, { status: 500 })
  }
})

export const POST = requireAuth(async (request: NextRequest, user) => {
  try {
    const body = await request.json()
    const { title, description, targetAmount, deadline, category } = body

    const insertGoal = db.prepare(`
      INSERT INTO goals (userId, title, description, targetAmount, deadline, category)
      VALUES (?, ?, ?, ?, ?, ?)
    `)

    const result = insertGoal.run(user.id, title, description, targetAmount, deadline, category)

    return NextResponse.json({
      success: true,
      message: "Objectif créé avec succès",
      goalId: result.lastInsertRowid,
    })
  } catch (error) {
    console.error("Erreur création objectif:", error)
    return NextResponse.json({ error: "Erreur lors de la création de l'objectif" }, { status: 500 })
  }
})
