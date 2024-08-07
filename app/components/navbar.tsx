import { getSession } from '../functions/get-session'
import NavContent from './nav-content'

export default async function Navbar() {
  const session = await getSession()

  return <NavContent session={session} />
}
