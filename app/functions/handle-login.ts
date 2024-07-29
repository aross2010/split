import { LoginUserData } from '../libs/types'
import { signIn } from 'next-auth/react'
import toast from 'react-hot-toast'

export const handleLogin = async (data: LoginUserData) => {
  try {
    await signIn('credentials', { ...data, redirect: false }).then(
      (callback) => {
        if (callback?.error) {
          toast.error(callback.error)
        } else {
          location.reload()
        }
      }
    )
  } catch (e) {
    toast.error('Something went wrong.')
  }
}
