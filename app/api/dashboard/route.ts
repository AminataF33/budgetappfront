import { type NextRequest, NextResponse } from "next/server"
import Database from "better-sqlite3"
import { join } from "path"
import { requireAuth } from "@/lib/auth"

const db = new Database(join(process.cwd(), "database.db"))

export const GET = requireAuth(async (request: NextRequest, user) => {
  try {
    // Récupérer les comptes
    const accounts = db
      .prepare(`
      SELECT id, name, bank, type, balance
      FROM accounts WHERE userId = ?
    `)
      .all(user.id)

    // Récupérer les transactions récentes
    const recentTransactions = db
      .prepare(`
      SELECT 
        t.id, t.description, t.amount, t.date, t.notes,
        c.name as category,
        a.name as account
      FROM transactions t
      JOIN categories c ON t.categoryId = c.id
      JOIN accounts a ON t.accountId = a.id
      WHERE t.userId = ?
      ORDER BY t.date DESC, t.createdAt DESC
      LIMIT 10
    `)
      .all(user.id)

    // Récupérer les budgets
    const budgets = db
      .prepare(`
      SELECT 
        b.id, b.amount as budgetAmount, b.period,
        c.name as category, c.color,
        COALESCE(SUM(CASE WHEN t.amount < 0 THEN ABS(t.amount) ELSE 0 END), 0) as spent
      FROM budgets b
      JOIN categories c ON b.categoryId = c.id
      LEFT JOIN transactions t ON t.categoryId = b.categoryId 
        AND t.userId = b.userId 
        AND t.date >= b.startDate 
        AND t.date <= b.endDate
      WHERE b.userId = ?
      GROUP BY b.id, b.amount, b.period, c.name, c.color
    `)
      .all(user.id)

    // Récupérer les objectifs
    const goals = db
      .prepare(`
      SELECT id, title, description, targetAmount, currentAmount, deadline, category
      FROM goals WHERE userId = ?
      ORDER BY deadline ASC
    `)
      .all(user.id)

    // Calculer les statistiques
    const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0)
    const monthlyExpenses = recentTransactions
      .filter((t) => t.amount < 0 && new Date(t.date).getMonth() === new Date().getMonth())
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)
    const savings = accounts.filter((a) => a.type === "savings").reduce((sum, a) => sum + a.balance, 0)

    return NextResponse.json({
      success: true,
      data: {
        user,
        accounts,
        recentTransactions,
        budgets,
        goals,
        stats: {
          totalBalance,
          monthlyExpenses,
          savings,
        },
      },
    })
  } catch (error) {
    console.error("Erreur dashboard:", error)
    return NextResponse.json({ error: "Erreur lors du chargement du dashboard" }, { status: 500 })
  }
})
