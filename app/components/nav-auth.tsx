'use client'
import { useRef, useState } from 'react'
import Modal from './ui/modal'
import { Session } from '../libs/types'
import SignUp from './sign-up'
import SignIn from './sign-in'
import { signOut } from 'next-auth/react'

export default function NavAuth({ session }: { session: Session | null }) {
  const [isSignIn, setIsSignIn] = useState(true)
  const ref = useRef<HTMLButtonElement>(null)

  return (
    <div>
      {!session ? (
        <button
          ref={ref}
          className="font-medium hover:text-violet-400 transition-colors"
        >
          Sign in
        </button>
      ) : (
        <button
          onClick={async () => {
            await signOut({ callbackUrl: '/' })
          }}
          className="font-medium hover:text-violet-400 transition-colors"
        >
          Sign out
        </button>
      )}

      <Modal button={ref}>
        <SignIn
          setIsSignIn={setIsSignIn}
          isSignIn={isSignIn}
        />
        <SignUp
          setIsSignIn={setIsSignIn}
          isSignIn={isSignIn}
        />
      </Modal>
    </div>
  )
}
