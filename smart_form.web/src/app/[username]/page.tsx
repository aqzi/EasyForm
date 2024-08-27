"use client"

import React from 'react'
import Link from 'next/link'
import { Bar, Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend)

// Mock data for the charts
const barChartData = {
  labels: ['Form A', 'Form B', 'Form C', 'Form D', 'Form E'],
  datasets: [{
    label: 'Submissions',
    data: [12, 19, 3, 5, 2],
    backgroundColor: 'rgba(75, 192, 192, 0.6)',
  }]
}

const doughnutChartData = {
  labels: ['Completed', 'In Progress', 'Not Started'],
  datasets: [{
    data: [300, 50, 100],
    backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'],
  }]
}

export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Forms Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Form Submissions</h2>
          <Bar data={barChartData} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Form Status</h2>
          <Doughnut data={doughnutChartData} />
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Recent Forms</h2>
        <ul className="divide-y divide-gray-200">
          {['Form A', 'Form B', 'Form C', 'Form D', 'Form E'].map((form, index) => (
            <li key={index} className="py-4 flex justify-between items-center">
              <span>{form}</span>
              <Link href={`/forms/${form.toLowerCase().replace(' ', '-')}`} className="text-blue-500 hover:underline">
                View Details
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}