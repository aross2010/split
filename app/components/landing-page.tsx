'use client'
import React, { cloneElement, useRef } from 'react'
import {
  FaArrowRight,
  FaClipboardCheck,
  FaChartLine,
  FaTrophy,
  FaQuoteLeft,
  FaQuoteRight,
} from 'react-icons/fa6'
import Link from 'next/link'
import dashboard from '@/public/dashboard.png'
import filters from '@/public/filter-workouts.png'
import exercises from '@/public/exercise-data.png'
import log from '@/public/log-workout.png'
import Image from 'next/image'
import FAQ from './faq'
import { motion } from 'framer-motion'
import useWindowSizeHook from '../hooks/window-size'
import { handleLogin } from '../functions/handle-login'
import toast from 'react-hot-toast'

const benefits = [
  {
    title: 'Log Workouts',
    description: 'Log your workouts on any device, any time with ease.',
    icon: <FaClipboardCheck />,
  },
  {
    title: 'Track Progress',
    description: 'Visualize your progress with charts and graphs.',
    icon: <FaChartLine />,
  },
  {
    title: 'Get Results',
    description: 'Reach your goals faster with a structured plan.',
    icon: <FaTrophy />,
  },
]

const demos = [
  {
    title: 'Find Any Workout With a Click',
    description:
      'Filter through your workout history with ease, finding the exact workout you need in seconds to continue making gains',
    image: filters,
  },
  {
    title: 'Your Workout Data, Visualized',
    description:
      'Seeing progress in the gym has never been simpler with our interactive charts, designed to make data clear and accessible',
    image: dashboard,
  },

  {
    title: 'Log Workouts on the Go',
    description:
      'Log workouts on any device, at any time with ease, so you never miss logging a workout and tracking your progress',
    image: log,
  },
  {
    title: 'Individualized Exercise Data',
    description:
      'Get personalized data for each exercise you perform, making goal setting for each execise tailored to your needs',
    image: exercises,
  },
]

const QAs = new Map<string, string>([
  [
    'What is the pupose of this application?',
    'The purpose of this application is to make tracking progress in the gym as simple as can be while also providing enough depth to be and essential in making progress in the gym.',
  ],
  [
    'Who is this application for?',
    'This application is designed for weightlifters of all types, including beginners looking to get started!',
  ],
  [
    'Is there a mobile app available?',
    'There is no native mobile application as of now, but the website is designed to be mobile-friendly and can be used on any device. The app is also a PWA, so you can install it on your device for easy access.',
  ],
  [
    'Is the application free to use?',
    'Yes, the application is free to use and will always be free to use!',
  ],
])

export default function LandingPage() {
  const renderedBenefits = benefits.map((benefit, i) => {
    return (
      <motion.div
        key={i}
        className="p-4 rounded-lg bg-gray-900 text-gray-200 flex flex-col"
        initial={{ opacity: 0, x: -25 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.25, delay: i * 0.1 + 0.5 }}
      >
        {cloneElement(benefit.icon, {
          className: 'text-violet-500 text-4xl mb-4',
        })}
        <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
        <p className="text-gray-400">{benefit.description}</p>
      </motion.div>
    )
  })

  const renderedDemos = demos.map((demo, i) => {
    return (
      <div
        key={i}
        className={`grid lg:grid-cols-2 grid-cols-1 gap-16`}
      >
        <motion.div
          initial={{ opacity: 0, x: i % 2 == 0 ? 25 : -25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.25, delay: 0.5 }}
          className={`flex items-center justify-center ${
            i % 2 == 0 ? 'lg:order-1' : 'lg:-order-1'
          }`}
        >
          <Image
            src={demo.image}
            alt={demo.title}
            className="xl:h-[450px] xl:w-auto max-h-[350px] w-auto"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: i % 2 == 0 ? -25 : 25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.25, delay: 0.5 }}
          className={`flex flex-col gap-6 items-center justify-center -order-1 ${
            i % 2 != 0 ? 'lg:order-1' : 'lg:-order-1'
          }`}
        >
          <h2 className="lg:text-5xl text-4xl text-white font-semibold text-center">
            {demo.title}
          </h2>
          <p className="text-gray-400 text-center font-medium text-lg">
            {demo.description}
          </p>
        </motion.div>
      </div>
    )
  })

  const handleGetStarted = () => {
    const btn = document.getElementById('sign-up')
    btn?.click()
  }

  const handleDemoLogin = async () => {
    try {
      await handleLogin({
        email: 'demo@gmail.com',
        password: 'Password1',
      })
    } catch (e) {
      toast.error('An error occurred. Please try again.')
    }
  }

  return (
    <section className="w-full flex flex-col items-center">
      <motion.h1
        initial={{ opacity: 0, x: -25 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.25 }}
        className="lg:text-6xl text-5xl mt-8 mb-8 text-center font-bold xl:px-48"
      >
        Reshaping your <span className="text-violet-500">fitness</span> journey.
      </motion.h1>
      <motion.h3
        initial={{ opacity: 0, x: -25 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.25, delay: 0.25 }}
        className="text-gray-400 lg:text-xl text-lg text-center mb-8"
      >
        Log workouts. Track progress. Get results.
      </motion.h3>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.25, delay: 0.5 }}
        className="flex items-center gap-6 mb-16"
      >
        <button
          type="button"
          onClick={handleGetStarted}
          className="rounded-full bg-gradient transition-all hover:scale-110 active:scale-100 font-medium py-2 px-8 text-lg"
        >
          Get Started
        </button>
        <button
          type="button"
          onClick={handleDemoLogin}
          className="text-gray-400 lg:text-lg text-base flex items-center gap-2 group hover:text-gray-100"
        >
          Demo Login{' '}
          <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>
      <div className="grid sm:grid-cols-3 grid-cols-1 auto-rows-fr w-full gap-4 text-lg">
        {renderedBenefits}
      </div>
      <div className="flex flex-col lg:gap-36 gap-20 my-24">
        {renderedDemos}
      </div>
      <div className="mb-24 flex flex-col items-center">
        <FaQuoteLeft className="text-5xl text-violet-500" />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="font-semibold text-white py-6 lg:text-3xl text-2xl mb-4 lg:px-24 sm:px-6 text-center"
        >
          The simplest, most effective way to track your workouts and make
          progress in the gym.
        </motion.p>

        <FaQuoteRight className="text-5xl text-violet-500" />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 1.25 }}
          className="text-center text-lg mt-6"
        >
          <span className="text-gray-400 ">- Anonymous User</span>
        </motion.p>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.25, delay: 0.5 }}
        className="flex items-center gap-6 mb-24"
      >
        <button
          type="button"
          onClick={handleGetStarted}
          className="rounded-full bg-gradient transition-all hover:scale-110 active:scale-100 font-medium py-2 px-8 text-lg"
        >
          Get Started
        </button>
        <button
          type="button"
          onClick={handleDemoLogin}
          className="text-gray-400 text-lg flex items-center gap-2 group hover:text-gray-100"
        >
          Demo Login{' '}
          <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>
      <FAQ QAs={QAs} />
    </section>
  )
}
