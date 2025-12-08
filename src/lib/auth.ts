import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import db from './db'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { signInSchema } from './validate'
import { Adapter } from 'next-auth/adapters'
import { sendWelcomeEmail } from './email'
declare module 'next-auth' {
  interface User {
    role: 'STUDENT' | 'TEACHER' | 'ADMIN'
    id?: string
  }
  interface Session {
    user: {
      id: string
      role: 'STUDENT' | 'TEACHER' | 'ADMIN'
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const { email, password } = await signInSchema.parseAsync(credentials)

          const user = await db.user.findUnique({
            where: { email },
            select: {
              id: true,
              email: true,
              password: true,
              role: true,
              name: true,
              image: true,
            },
          })

          if (!user) {
            throw new Error('No user found with this email')
          }

          if (!user?.password) throw new Error('User not found')

          const isValid = await compare(password, user.password)
          if (!isValid) throw new Error('Invalid credentials')

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.image,
          }
        } catch (error) {
          throw new Error(
            error instanceof Error ? error.message : 'Authentication failed'
          )
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt', // Must use JWT strategy for CredentialsProvider
    maxAge: 30 * 60, // 30 minutes
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token?.id && token?.role) {
        session.user = {
          ...session.user,
          id: token.id as string,
          role: token.role as 'STUDENT' | 'TEACHER' | 'ADMIN',
        }
      }
      return session
    },
  },
  events: {
    createUser: async ({ user }) => {
      if (user.email && user.name) {
        await sendWelcomeEmail(
          user.email,
          user.name || user.email.split('@')[0]
        )
      }
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
    newUser: '/register',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
})
