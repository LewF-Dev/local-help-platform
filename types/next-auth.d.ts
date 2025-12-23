import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    role?: string
    tradeProfileId?: string
  }

  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
      tradeProfileId?: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string
    tradeProfileId?: string
  }
}
