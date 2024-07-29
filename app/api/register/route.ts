import bcrypt from 'bcrypt'
import prisma from '../../libs/prismadb'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const data = await request.json()

  if (!data) return

  const { name, email, password, confirmPassword } = data
  if (!name || !email || !password || !confirmPassword) {
    return NextResponse.json(
      { error: 'Please complete all fields' },
      { status: 400 }
    )
  }

  if (password !== confirmPassword) {
    return NextResponse.json(
      { error: 'Passwords do not match.' },
      { status: 400 }
    )
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: 'Password must be at least 8 characters long.' },
      { status: 400 }
    )
  }

  const exists = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (exists) {
    return NextResponse.json(
      { error: 'User with this email address already exists.' },
      {
        status: 400,
      }
    )
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })
    prisma.$disconnect()
    return NextResponse.json(user)
  } catch (e) {
    prisma.$disconnect()
    return NextResponse.json(
      { error: 'Something went wrong.' },
      { status: 500 }
    )
  }
}
