'use client'
import { useState } from 'react'
import TextInput from './ui/text-input'
import ExerciseForm from './exercise-form'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const inputs = [
  {
    label: 'Workout Name',
    type: 'text',
    name: 'workoutName',
  },
  {
    label: 'Date',
    type: 'date',
    name: 'date',
  },
  {
    label: 'Location',
    type: 'text',
    name: 'location',
  },
]

export default function WorkoutForm() {
  const [data, setData] = useState({
    workoutName: '',
    location: '',
    notes: '',
  })
  const [date, setDate] = useState<Date | null>(new Date())

  const renderedInputs = inputs.map((input, i) => {
    return (
      <div
        key={i}
        className="flex flex-col gap-2"
      >
        <label htmlFor={input.name}>{input.label}</label>
        {input.type == 'date' ? (
          <DatePicker
            selected={date}
            onChange={(date) => setDate(date)}
            enableTabLoop={false}
          />
        ) : (
          <TextInput
            name={input.name}
            type={input.type}
            value={data[input.name as keyof typeof data]}
            onChange={(e) => {
              setData((prev) => ({
                ...prev,
                [input.name]: e.target.value,
              }))
            }}
          />
        )}
      </div>
    )
  })

  return (
    <form className="flex flex-col w-full max-w-[550px] gap-6">
      {renderedInputs}
      <ExerciseForm />
      <div className="flex flex-col gap-2">
        <label>Notes</label>
        <textarea
          value={data.notes}
          onChange={(e) =>
            setData((prev) => ({ ...prev, notes: e.target.value }))
          }
          className="rounded-md h-32 bg-gray-700 p-3 outline-none focus:outline-violet-400 focus:bg-violet-400/25 focus:ring-2 focus:ring-violet-400 shadow-sm"
        />
      </div>
    </form>
  )
}
