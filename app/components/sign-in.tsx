import React from 'react'
import TextInput from './ui/text-input'
import GoogleAuth from './ui/google-auth'
import { handleLogin } from '../functions/handle-login'
import { redirect } from 'next/navigation'
import { LoginUserData } from '../libs/types'
import SubmitButton from './ui/submit-btn'

const signInInputs = [
  {
    label: 'Email',
    type: 'email',
    placeholder: 'Email',
    name: 'email',
  },
  {
    label: 'Password',
    type: 'password',
    placeholder: 'Password',
    name: 'password',
  },
] as const

type SignInProps = {
  setIsSignIn: React.Dispatch<React.SetStateAction<boolean>>
  isSignIn: boolean
}

export default function SignIn({ setIsSignIn, isSignIn }: SignInProps) {
  return (
    <section
      className="p-4"
      hidden={!isSignIn}
    >
      <h2 className="text-2xl font-medium mb-4">Sign in</h2>
      <form
        className="flex flex-col gap-6 mb-4"
        action={async (formData: FormData) => {
          try {
            const data = Object.fromEntries(formData.entries()) as LoginUserData
            await handleLogin(data)
          } catch (e) {}
        }}
      >
        {signInInputs.map((input, i) => {
          const { label, type, name } = input
          return (
            <div
              key={i}
              className="flex flex-col gap-2"
            >
              <label htmlFor={name}>{label}</label>
              <TextInput
                type={type}
                name={name}
                id={name}
                className="!bg-gray-600"
              />
            </div>
          )
        })}
        <SubmitButton className="flex justify-center bg-violet-400">
          Sign in
        </SubmitButton>
      </form>
      <span className="block mb-4">
        Don&apos;t have an account?{' '}
        <button
          onClick={() => setIsSignIn(false)}
          className="text-violet-400 hover:underline font-medium"
        >
          Sign up
        </button>
      </span>
      <GoogleAuth />
    </section>
  )
}
