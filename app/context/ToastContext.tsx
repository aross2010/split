'use client'

import { Toaster } from 'react-hot-toast'

export default function ToastContext() {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            width: '100%',
            maxWidth: '600px',
            backgroundColor: '#374151',
            color: '#F9FAFB',
            textAlign: 'center',
          },
        }}
      />
    </>
  )
}
