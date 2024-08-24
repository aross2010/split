'use client'
import { motion } from 'framer-motion'
import { DashboardData } from '../libs/types'
import { BiCalendarCheck } from 'react-icons/bi'
import { RiBracesFill } from 'react-icons/ri'
import {
  FaRepeat,
  FaLocationDot,
  FaArrowTrendUp,
  FaDumbbell,
  FaPencil,
  FaFire,
} from 'react-icons/fa6'
import IconCard from './ui/icon-card'
import ChartBar from './ui/chart-bar'
import { Tooltip } from 'recharts'
import ChartPie from './ui/chart-pie'
import { Fragment } from 'react'
import Link from 'next/link'

type DashboardProps = {
  dashboardData: DashboardData
  name: string
}

const facts = [
  {
    title: 'Workouts',
    value: 'totalWorkouts',
    icon: <BiCalendarCheck />,
    link: '/workouts',
  },
  {
    title: 'Sets',
    value: 'totalSets',
    icon: <RiBracesFill />,
  },
  {
    title: 'Reps',
    value: 'totalReps',
    icon: <FaRepeat />,
  },
  {
    title: 'Locations',
    value: 'totalLocations',
    icon: <FaLocationDot />,
  },
  {
    title: 'Exercises',
    value: 'totalExercises',
    icon: <FaDumbbell />,
    link: '/exercises',
  },
  {
    title: 'Workout Types',
    value: 'totalWorkoutNames',
    icon: <FaPencil />,
  },
  {
    title: 'maxPRExercise',
    value: 'maxPRValue',
    icon: <FaArrowTrendUp />,
  },
  {
    title: 'Current Streak',
    value: 'currentWorkoutStreak',
    icon: <FaFire />,
  },
] as const

const graphs = [
  {
    title: 'Personal Records',
    data: 'PRs',
    yaxisLabel: 'Weight (lbs)',
    tooltipLabel: 'PR',
    tooltipValue: 'lbs',
    type: 'bar',
  },
  {
    title: 'Workout Types',
    data: 'workoutNames',
    tooltipLabel: 'Workouts',
    type: 'pie',
  },
  {
    title: 'Locations',
    data: 'locations',
    tooltipLabel: 'Workouts',
    type: 'pie',
  },
  {
    title: 'Popular Exercises',
    data: 'popularExercises',
    yaxisLabel: 'Total Sets',
    tooltipLabel: 'Total Sets',
    tooltipValue: 'sets',
    type: 'bar',
  },
] as const

export default function Dashboard({ dashboardData, name }: DashboardProps) {
  const renderedFacts = facts.map((fact, i) => {
    return (
      <motion.div
        key={fact.value}
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: i * 0.1 }}
        viewport={{ once: true }}
        className="flex w-full h-auto"
      >
        <IconCard
          value={`${dashboardData[fact.value] as number} ${
            fact.value == 'maxPRValue' ? 'lbs' : ''
          }`}
          title={
            fact.title == 'maxPRExercise'
              ? dashboardData[fact.title]
              : fact.title
          }
          link={
            fact.value == 'totalExercises' || fact.value == 'totalWorkouts'
              ? fact.link
              : undefined
          }
          icon={fact.icon}
          className="!bg-gray-800"
        />
      </motion.div>
    )
  })

  const renderedGraphs = graphs.map((graph, i) => {
    return (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.25, delay: 0.7 + i * 0.1 }}
        className="w-full rounded-lg p-4 bg-gray-800"
      >
        <h3 className="font-medium text-lg mb-4">{graph.title}</h3>
        {graph.type === 'pie' ? (
          <ChartPie
            chartData={dashboardData[graph.data]}
            tooltipLabel={graph.tooltipLabel}
          />
        ) : (
          <ChartBar
            chartData={dashboardData[graph.data]}
            yaxisLabel={graph.yaxisLabel}
            tooltipLabel={graph.tooltipLabel}
            tooltipValue={graph.tooltipValue}
          />
        )}
      </motion.div>
    )
  })

  return (
    <section className="w-full">
      <h1 className="text-4xl font-medium">Welcome, {name.split(' ')[0]}.</h1>
      <h3 className="text-gray-400 mb-8 text-lg">
        Here&apos;s a quick overview of all your workouts:
      </h3>
      {dashboardData.totalWorkouts === 0 ? (
        <span>
          You don&apos;t have any workouts yet. Get started by{' '}
          <Link
            href="/workouts"
            className="font-medium underline underline-offset-2 hover:text-violet-500 transition-colors"
          >
            adding a workout
          </Link>
          .
        </span>
      ) : (
        <Fragment>
          <ul className="grid xl:grid-cols-8 gap-3 sm:grid-cols-4 grid-cols-2 ">
            {renderedFacts}
          </ul>
          <ul className="grid mt-3 gap-3 md:grid-cols-2 gris-cols-1">
            {renderedGraphs}
          </ul>
        </Fragment>
      )}
    </section>
  )
}
