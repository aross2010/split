import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { Session } from '@/app/libs/types'

export const getSession = async () => {
  const session = (await getServerSession(authOptions as any)) as Session | null

  return session
}
