import { type NextRequest, NextResponse } from "next/server"
import Database from "better-sqlite3"
import { join } from "path"
import { requireAuth } from "@/lib/auth"

const db = new Database(join(process.cwd(), "database.db"))

export const GET = requireAuth(async (request: NextRequest, user) => {
  try {
    const budgets = db
      .prepare(`
      SELECT 
        b.id, 
        b.amount as budget, 
        b.period,
        b.startDate,
        b.endDate,
        c.name as category, 
        c.color,
        COALESCE(SUM(CASE WHEN t.amount < 0 THEN ABS(t.amount) ELSE 0 END), 0) as spent
      FROM budgets b
      JOIN categories c ON b.categoryId = c.id
      LEFT JOIN transactions t ON t.categoryId = b.categoryId 
        AND t.userId = b.userId 
        AND t.date >= b.startDate 
        AND t.date <= b.endDate
      WHERE b.userId = ?
      GROUP BY b.id, b.amount, b.period, c.name, c.color, b.startDate, b.endDate
      ORDER BY c.name
    `)
      .all(user.id)

    return NextResponse.json({
      success: true,
      data: budgets,
    })
  } catch (error) {
    console.error("Erreur budgets:", error)
    return NextResponse.json({ error: "Erreur lors du chargement des budgets" }, { status: 500 })
  }
})

export const POST = requireAuth(async (request: NextRequest, user) => {
  try {
    const body = await request.json()
    const { categoryId, amount, period, startDate, endDate } = body

    const insertBudget = db.prepare(`
      INSERT INTO budgets (userId, categoryId, amount, period, startDate, endDate)
      VALUES (?, ?, ?, ?, ?, ?)
    `)

    const result = insertBudget.run(user.id, categoryId, amount, period, startDate, endDate)

    return NextResponse.json({
      success: true,
      message: "Budget créé avec succès",
      budgetId: result.lastInsertRowid,
    })
  } catch (error) {
    console.error("Erreur création budget:", error)
    return NextResponse.json({ error: "Erreur lors de la création du budget" }, { status: 500 })
  }
})
