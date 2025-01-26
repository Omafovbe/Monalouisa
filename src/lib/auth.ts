import NextAuth, { CredentialsSignin } from 'next-auth'
import { nanoid } from 'nanoid'
import { compare } from 'bcryptjs'
import db from './db'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import { signInSchema } from './validate'
import { Provider } from 'next-auth/providers'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { encode as defaultEncode } from 'next-auth/jwt'

// interface User {
//   id: string
//   image: string
//   email: string
//   name?: string | null
//   role: 'STUDENT' | 'TEACHER' | 'ADMIN'
// }

const adapter = PrismaAdapter(db)

const providers: Provider[] = [
  Google,
  Credentials({
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },

    //   eslint-disable-next-line @typescript-eslint/no-explicit-any
    authorize: async (credentials): Promise<any> => {
      let user = null

      const { email, password } = await signInSchema.parseAsync(credentials)

      user = await db.user.findUnique({
        where: {
          email: email,
        },
        select: {
          id: true,
          email: true,
          password: true,
          image: true,
          role: true,
          name: true,
        },
      })

      if (!user) {
        throw new Error('Invalid Credentials') as CredentialsSignin
      }

      if (!user.password) {
        throw new Error('Password is null')
      }

      const isPasswordValid = await compare(password as string, user.password)

      if (!isPasswordValid) {
        return null
      }

      return user
    },
  }),
]

export const providerMap = providers
  .map((provider) => {
    if (typeof provider === 'function') {
      const providerData = provider()
      return { id: providerData.id, name: providerData.name }
    } else {
      return { id: provider.id, name: provider.name }
    }
  })
  .filter((provider) => provider.id !== 'credentials')

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: adapter,
  providers,
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

        const createdSession = await adapter?.createSession?.({
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
  },
})

// Define session types
// declare module 'next-auth' {
//   interface Session {
//     user: {
//       email: string
//       name?: string | null
//       role: 'STUDENT' | 'TEACHER' | 'ADMIN'
//     }
//   }
//   interface User {
//     email: string
//     name?: string | null
//     role: 'STUDENT' | 'TEACHER' | 'ADMIN'
//   }
// }

// declare module 'next-auth/jwt' {
//   interface JWT {
//     email: string
//     name?: string | null
//     role: 'STUDENT' | 'TEACHER' | 'ADMIN'
//   }
// }

// // Example registration function

// export const authOptions: NextAuthOptions = {
//   providers: [
//     CredentialsProvider({
//       name: 'credentials',
//       credentials: {
//         email: { label: 'Email', type: 'email' },
//         password: { label: 'Password', type: 'password' },
//       },
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       async authorize(credentials): Promise<any> {
//         if (!credentials?.email || !credentials?.password) {
//           return null
//         }

//         const user = await db.user.findUnique({
//           where: {
//             email: credentials.email,
//           },
//           select: {
//             id: true,
//             email: true,
//             password: true,
//             role: true,
//             name: true,
//           },
//         })

//         if (!user) {
//           return null
//         }

//         const isPasswordValid = await compare(
//           credentials.password,
//           user.password
//         )

//         if (!isPasswordValid) {
//           return null
//         }

//         return {
//           id: user.id,
//           email: user.email,
//           name: user.name,
//           role: user.role,
//         }
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         return {
//           ...token,
//           id: user.id,
//           email: user.email,
//           name: user.name,
//           role: user.role,
//         }
//       }
//       return token
//     },
//     async session({ session, token }) {
//       return {
//         ...session,
//         user: {
//           ...session.user,
//           id: token.id,
//           email: token.email,
//           name: token.name,
//           role: token.role,
//         },
//       }
//     },
//   },
//   pages: {
//     signIn: '/login',
//     error: '/login',
//     newUser: '/register',
//   },
//   session: {
//     strategy: 'jwt',
//     maxAge: 20 * 60, // 20 mins
//   },
//   secret: process.env.NEXTAUTH_SECRET,
//   debug: process.env.NODE_ENV === 'development',
// }
