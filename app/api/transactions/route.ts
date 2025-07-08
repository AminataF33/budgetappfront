import { type NextRequest, NextResponse } from "next/server"
import Database from "better-sqlite3"
import { join } from "path"
import { requireAuth } from "@/lib/auth"

const db = new Database(join(process.cwd(), "database.db"))

export const GET = requireAuth(async (request: NextRequest, user) => {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    let query = `
      SELECT 
        t.id, t.description, t.amount, t.date, t.notes,
        c.name as category,
        a.name as account
      FROM transactions t
      JOIN categories c ON t.categoryId = c.id
      JOIN accounts a ON t.accountId = a.id
      WHERE t.userId = ?
    `
    const params = [user.id]

    if (category && category !== "all") {
      query += " AND c.name = ?"
      params.push(category)
    }

    if (search) {
      query += " AND t.description LIKE ?"
      params.push(`%${search}%`)
    }

    query += " ORDER BY t.date DESC, t.createdAt DESC LIMIT ? OFFSET ?"
    params.push(limit, offset)

    const transactions = db.prepare(query).all(...params)

    return NextResponse.json({
      success: true,
      data: transactions,
    })
  } catch (error) {
    console.error("Erreur transactions:", error)
    return NextResponse.json({ error: "Erreur lors du chargement des transactions" }, { status: 500 })
  }
})

export const POST = requireAuth(async (request: NextRequest, user) => {
  try {
    const body = await request.json()
    const { description, amount, categoryId, accountId, date, notes } = body

    // Vérifier que le compte appartient à l'utilisateur
    const account = db.prepare("SELECT id FROM accounts WHERE id = ? AND userId = ?").get(accountId, user.id)
    if (!account) {
      return NextResponse.json({ error: "Compte non trouvé" }, { status: 404 })
    }

    // Insérer la transaction
    const insertTransaction = db.prepare(`
      INSERT INTO transactions (userId, accountId, categoryId, description, amount, date, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)

    const result = insertTransaction.run(user.id, accountId, categoryId, description, amount, date, notes)

    // Mettre à jour le solde du compte
    const updateBalance = db.prepare("UPDATE accounts SET balance = balance + ? WHERE id = ?")
    updateBalance.run(amount, accountId)

    return NextResponse.json({
      success: true,
      message: "Transaction ajoutée avec succès",
      transactionId: result.lastInsertRowid,
    })
  } catch (error) {
    console.error("Erreur ajout transaction:", error)
    return NextResponse.json({ error: "Erreur lors de l'ajout de la transaction" }, { status: 500 })
  }
})
