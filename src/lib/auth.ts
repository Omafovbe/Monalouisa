import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import db from './db'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { signInSchema } from './validate'
import { Adapter } from 'next-auth/adapters'
import { encode as defaultEncode } from 'next-auth/jwt'
import { nanoid } from 'nanoid'

declare module 'next-auth' {
  interface User {
    role: 'STUDENT' | 'TEACHER' | 'ADMIN'
  }
  interface Session {
    user: User & {
      role: 'STUDENT' | 'TEACHER' | 'ADMIN'
      id: string
    }
  }
}

const prismAdapter = PrismaAdapter(db) as Adapter

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: prismAdapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Missing credentials')
          }

          const { email, password } = await signInSchema.parseAsync(credentials)

          const user = await db.user.findUnique({
            where: {
              email: email,
            },
            select: {
              id: true,
              email: true,
              password: true,
              role: true,
              name: true,
              image: true,
            },
          })

          if (!user || !user.password) {
            throw new Error('Invalid credentials')
          }

          const isPasswordValid = await compare(password, user.password)

          if (!isPasswordValid) {
            throw new Error('Invalid credentials')
          }

          // Return only the data we want to save in the token
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.image || undefined,
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: 'database', // Change to JWT for CredentialsProvider
    maxAge: 30 * 60, // 30 mins
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account?.provider === 'credentials') {
        token.credentials = true
      }
      return token
    },
  },
  jwt: {
    encode: async function (params) {
      if (params.token?.credentials) {
        const sessionToken = nanoid(12)

        if (!params.token.sub) {
          throw new Error('No user ID found in token')
        }

        const createdSession = await prismAdapter?.createSession?.({
          sessionToken: sessionToken,
          userId: params.token.sub,
          expires: new Date(Date.now() + 1 * 30 * 60 * 1000),
        })

        if (!createdSession) {
          throw new Error('Failed to create session')
        }

        return sessionToken
      }
      return defaultEncode(params)
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
    newUser: '/register',
  },

  debug: process.env.NODE_ENV === 'development',
})
