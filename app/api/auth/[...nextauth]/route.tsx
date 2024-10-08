import NextAuth from 'next-auth/next'

import { AuthOptions } from 'next-auth'
import { authOptions } from '@/app/functions/auth-options'

const handler = NextAuth(authOptions as AuthOptions)

export { handler as GET, handler as POST, handler as PUT, handler as DELETE }
