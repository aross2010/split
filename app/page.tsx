import Image from 'next/image'
import { getSession } from './functions/get-session'

export default async function Home() {
  const session = await getSession()

  if (!session) {
    return <section>Not logged in</section>
  }

  const name = session.user.name

  return (
    <section className="w-full">
      <h1 className="text-4xl font-medium">Welcome, {name.split(' ')[0]}.</h1>
    </section>
  )
}
