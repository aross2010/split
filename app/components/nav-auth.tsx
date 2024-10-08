'use client'
import { useRef, useState } from 'react'
import Modal from './ui/modal'
import { Session } from '../libs/types'
import SignUp from './sign-up'
import SignIn from './sign-in'
import { signOut } from 'next-auth/react'
import useWindowSizeHook from '../hooks/window-size'

export default function NavAuth({ session }: { session: Session | null }) {
  const [isSignIn, setIsSignIn] = useState(false)
  const ref = useRef<HTMLButtonElement>(null)
  const ref2 = useRef<HTMLButtonElement>(null)

  const screenWidth = useWindowSizeHook()

  return (
    <div>
      {!session ? (
        <button
          ref={ref}
          className="font-medium hover:text-violet-500 transition-colors"
          id="sign-up"
        >
          Sign up
        </button>
      ) : (
        <button
          ref={ref2}
          className="font-medium hover:text-violet-500 transition-colors"
        >
          Sign out
        </button>
      )}

      <Modal button={ref2}>
        <h3 className="text-center text-xl mb-8">
          Are you sure you want to sign out?
        </h3>
        <div className="flex justify-center">
          <button
            onClick={async () => {
              await signOut({ callbackUrl: '/' })
            }}
            className="bg-violet-500 text-white px-4 py-2 rounded-md w-fit mb-4 hover:brightness-110 transition-all "
          >
            Sign out
          </button>
        </div>
      </Modal>

      <Modal
        button={ref}
        fullScreen={screenWidth < 550}
      >
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
