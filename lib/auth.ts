import jwt from "jsonwebtoken"
import type { NextRequest } from "next/server"
import Database from "better-sqlite3"
import { join } from "path"

const db = new Database(join(process.cwd(), "database.db"))

export interface AuthUser {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  city: string
  profession: string
}

export async function verifyAuth(request: NextRequest): Promise<AuthUser | null> {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return null
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as any

    const user = db
      .prepare(`
      SELECT id, firstName, lastName, email, phone, city, profession
      FROM users WHERE id = ?
    `)
      .get(decoded.userId)

    return user as AuthUser
  } catch (error) {
    return null
  }
}

export function requireAuth(handler: (request: NextRequest, user: AuthUser) => Promise<Response>) {
  return async (request: NextRequest) => {
    const user = await verifyAuth(request)

    if (!user) {
      return new Response(JSON.stringify({ error: "Non autorisé" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }

    return handler(request, user)
  }
}
