import { type NextRequest, NextResponse } from "next/server"
import Database from "better-sqlite3"
import { join } from "path"

const db = new Database(join(process.cwd(), "database.db"))

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") // 'income' ou 'expense'

    let query = "SELECT id, name, type, color FROM categories"
    const params: string[] = []

    if (type) {
      query += " WHERE type = ?"
      params.push(type)
    }

    query += " ORDER BY name"

    const categories = db.prepare(query).all(...params)

    return NextResponse.json({
      success: true,
      data: categories,
    })
  } catch (error) {
    console.error("Erreur catégories:", error)
    return NextResponse.json({ error: "Erreur lors du chargement des catégories" }, { status: 500 })
  }
}
