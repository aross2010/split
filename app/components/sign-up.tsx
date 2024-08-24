import React from 'react'
import TextInput from './ui/text-input'
import GoogleAuth from './ui/google-auth'
import axios from 'axios'
import { handleLogin } from '../functions/handle-login'
import toast from 'react-hot-toast'
import { RegisterUserData } from '../libs/types'
import SubmitButton from './ui/submit-btn'

const signUpInputs = [
  {
    label: 'Email',
    type: 'email',
    placeholder: 'Email',
    name: 'email',
  },
  {
    label: 'Name',
    type: 'text',
    placeholder: 'Name',
    name: 'name',
  },
  {
    label: 'Password',
    type: 'password',
    placeholder: 'Password',
    name: 'password',
  },
  {
    label: 'Confirm Password',
    type: 'password',
    placeholder: 'Confirm Password',
    name: 'confirmPassword',
  },
] as const

type SignUpProps = {
  setIsSignIn: React.Dispatch<React.SetStateAction<boolean>>
  isSignIn: boolean
}

export default function SignUp({ setIsSignIn, isSignIn }: SignUpProps) {
  const registerUser = async (formData: FormData) => {
    try {
      const data = Object.fromEntries(formData.entries()) as RegisterUserData
      await axios.post('/api/register', data)
      const { email, password } = data
      const loginData = {
        email,
        password,
      }
      await handleLogin(loginData)
    } catch (e: any) {
      if (e.response.data.error) toast.error(e.response.data.error)
      else toast.error('Something went wrong.')
    }
  }

  const renderedInputs = signUpInputs.map((input, i) => {
    const { name, label, type } = input
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
          className="!bg-gray-700"
        />
      </div>
    )
  })

  return (
    <section
      className="p-4"
      hidden={isSignIn}
    >
      <h2 className="text-2xl font-medium mb-4">Sign up</h2>
      <form
        className="flex flex-col gap-4 mb-4"
        action={registerUser}
      >
        {renderedInputs}
        <SubmitButton className="flex justify-center bg-violet-500">
          Sign up
        </SubmitButton>
      </form>
      <span className="block mb-4">
        Already have an account?{' '}
        <button
          onClick={() => {
            setIsSignIn(true)
          }}
          className="text-violet-500 hover:underline font-medium"
        >
          Sign in
        </button>
      </span>
      <GoogleAuth />
    </section>
  )
}
