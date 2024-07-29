'use client'
import { TailSpin } from 'react-loader-spinner'

export default function Loading() {
  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div className="flex flex-col items-center gap-0 justify-center"></div>
      <TailSpin
        color="#ffffff"
        height={50}
        width={50}
      />
    </div>
  )
}
