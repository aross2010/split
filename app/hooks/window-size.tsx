'use client'
import { useState, useEffect } from 'react'

export default function useWindowSizeHook() {
  const [width, setWidth] = useState<number>(1920)

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return width
}
