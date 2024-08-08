import Image from 'next/image'
import React, { Fragment } from 'react'
import google from '@/public/google.png'
import { signIn } from 'next-auth/react'

export default function GoogleAuth() {
  return (
    <Fragment>
      <div className="flex justify-center items-center google-auth mb-4">
        <span className="text-sm text-gray-200">Or continue with</span>
      </div>
      <button
        onClick={async () => {
          await signIn('google', {
            callbackUrl: 'https://split-test.vercel.app',
          })
        }}
        type="button"
        className="flex p-3 bg-[#4285f4] w-full rounded-md text-white gap-2 justify-center items-center hover:brightness-110 transition-all"
      >
        <Image
          src={google}
          alt="Google logo"
          height={20}
          width={20}
        />
        Google
      </button>
    </Fragment>
  )
}
