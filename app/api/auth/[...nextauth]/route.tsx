import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from '@/app/libs/prismadb'
import bcrypt from 'bcrypt'

const authOptions = {
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
        email: { label: 'Email', type: 'text', placeholder: '' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<any> {
        if (!credentials || !credentials.email || !credentials.password)
          throw new Error('Please enter an email and password')
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })
        if (!user) throw new Error('No user found with email')
        else if (!user.password)
          throw new Error(
            'User associated with Google account, please continue with Google'
          )
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
    async jwt({ token, user }: any) {
      if (user) token.id = user.id
      return token
    },
    async session({ session, token }: any) {
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

// @ts-ignore
export default (req: any, res: any) => NextAuth(req, res, authOptions)
