'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

const data = [
  {
    name: 'Week 1',
    progress: 65,
  },
  {
    name: 'Week 2',
    progress: 75,
  },
  {
    name: 'Week 3',
    progress: 85,
  },
  {
    name: 'Week 4',
    progress: 90,
  },
]

export function StudentProgress() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Progress</CardTitle>
        <CardDescription>
          Average performance over the last 4 weeks
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={350}>
          <BarChart data={data}>
            <XAxis
              dataKey='name'
              stroke='#888888'
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke='#888888'
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number) => `${value}%`}
            />
            <Bar
              dataKey='progress'
              fill='currentColor'
              radius={[4, 4, 0, 0]}
              className='fill-amber-500'
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
