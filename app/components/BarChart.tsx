"use client"

import { Bar } from "react-chartjs-2"
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"
import { useEffect, useState } from "react"
import axios from "axios"

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface BarChartProps {
  year?: number
}

export const BarChart = ({ year }: BarChartProps) => {
  const [top5Categories, setTop5Categories] = useState<string[]>([])
  const [top5CategoriesAmount, setTop5CategoriesAmount] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)

  axios.defaults.withCredentials = true

  useEffect(() => {
    const email = localStorage.getItem('email') || ""
    const currentYear = year || new Date().getFullYear()
    const API_URL = process.env.NEXT_PUBLIC_API_URL

    setIsLoading(true)

    axios.get(`${API_URL}/expenses/top5Categories/${email}?year=${currentYear}`).then((response) => {
      const categories = response.data.map((item: { description: string }) => item.description)
      const amounts = response.data.map((item: { totalAmount: number }) => item.totalAmount)

      setTop5Categories(categories)
      setTop5CategoriesAmount(amounts)
    }).catch((error) => {
      console.log(error)
    }).finally(() => {
      setIsLoading(false)
    })
  }, [year])

  if (isLoading) {
    return (
      <div className="chart-loading" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    )
  }

  if (!isLoading && top5CategoriesAmount.length === 0) {
    return (
      <div className="text-center py-5">
        <p className="text-muted">No hay datos de gastos para mostrar este año</p>
      </div>
    )
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || ''
            if (label) {
              label += ': '
            }
            if (context.parsed.y !== null) {
              label += '₡' + context.parsed.y.toLocaleString('es-CR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            }
            return label
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return '₡' + value.toLocaleString('es-CR')
          }
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart' as const
    }
  }

  let barChartData = {
    labels: top5Categories,
    datasets: [
      {
        label: "Gastos",
        data: top5CategoriesAmount,
        backgroundColor: [
          "#3b82f6",
          "#8b5cf6",
          "#ec4899",
          "#f59e0b",
          "#10b981"
        ],
        borderColor: [
          "#2563eb",
          "#7c3aed",
          "#db2777",
          "#d97706",
          "#059669"
        ],
        borderWidth: 2,
        borderRadius: 8,
        hoverBackgroundColor: [
          "#60a5fa",
          "#a78bfa",
          "#f472b6",
          "#fbbf24",
          "#34d399"
        ]
      }
    ]
  }

  return (
      <Bar options={options} data={barChartData} />
  )
}
