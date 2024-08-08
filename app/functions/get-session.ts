import { AuthOptions, getServerSession } from 'next-auth'
import { authOptions } from '@/app/functions/auth-options'
import { Session } from '@/app/libs/types'

export const getSession = async () => {
  const session = (await getServerSession(
    authOptions as AuthOptions
  )) as Session | null

  return session
}
