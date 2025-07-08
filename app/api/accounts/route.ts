import { type NextRequest, NextResponse } from "next/server"
import Database from "better-sqlite3"
import { join } from "path"
import { requireAuth } from "@/lib/auth"

const db = new Database(join(process.cwd(), "database.db"))

export const GET = requireAuth(async (request: NextRequest, user) => {
  try {
    const accounts = db
      .prepare(`
      SELECT id, name, bank, type, balance, createdAt
      FROM accounts 
      WHERE userId = ?
      ORDER BY name
    `)
      .all(user.id)

    return NextResponse.json({
      success: true,
      data: accounts,
    })
  } catch (error) {
    console.error("Erreur comptes:", error)
    return NextResponse.json({ error: "Erreur lors du chargement des comptes" }, { status: 500 })
  }
})

export const POST = requireAuth(async (request: NextRequest, user) => {
  try {
    const body = await request.json()
    const { name, bank, type, balance = 0 } = body

    const insertAccount = db.prepare(`
      INSERT INTO accounts (userId, name, bank, type, balance)
      VALUES (?, ?, ?, ?, ?)
    `)

    const result = insertAccount.run(user.id, name, bank, type, balance)

    return NextResponse.json({
      success: true,
      message: "Compte créé avec succès",
      accountId: result.lastInsertRowid,
    })
  } catch (error) {
    console.error("Erreur création compte:", error)
    return NextResponse.json({ error: "Erreur lors de la création du compte" }, { status: 500 })
  }
})
