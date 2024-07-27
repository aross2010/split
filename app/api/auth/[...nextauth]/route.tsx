import NextAuth from 'next-auth/next'
import prisma from '../../../libs/prismadb'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import bcrypt from 'bcrypt'

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' },
        username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
      },
      async authorize(credentials): Promise<any> {
        if (!credentials || !credentials.email || !credentials.password)
          throw new Error('Please enter an email and password')

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user?.password)
          throw new Error('No user found with email')

        const passwordsMatch = await bcrypt.compare(
          credentials.password,
          user.password
        )
        if (!passwordsMatch) {
          throw new Error('Incorrect password')
        }
        return user
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }: any) {
      if (user) token.id = user.id
      return token
    },
    async session({ session, token, user }: any) {
      session.user.id = token.id
      return session
    },
  },
  secret: process.env.SECRET,
  session: {
    strategy: 'jwt',
  },
  debug: process.env.NODE_ENV === 'development',
}

const handler = NextAuth(authOptions as any)

export { handler as GET, handler as POST, handler as PUT, handler as DELETE }
