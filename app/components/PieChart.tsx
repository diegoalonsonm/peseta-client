"use client"

import { Doughnut } from "react-chartjs-2"
import { Chart, Tooltip, Legend, ArcElement } from "chart.js"
import { useEffect, useState } from "react"
import axios from "axios"

Chart.register(Tooltip, Legend, ArcElement)

interface PieChartProps {
  year?: number
}

export const PieChart = ({ year }: PieChartProps) => {
  const [categories, setCategories] = useState<string[]>([])
  const [amounts, setAmounts] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)

  axios.defaults.withCredentials = true

  useEffect(() => {
    const email = localStorage.getItem('email') || ""
    const currentYear = year || new Date().getFullYear()
    const API_URL = process.env.NEXT_PUBLIC_API_URL

    setIsLoading(true)

    axios.get(`${API_URL}/expenses/amountByCategory/${email}?year=${currentYear}`).then((response) => {
      const categoriesData = response.data.map((item: { description: string }) => item.description)
      const amountsData = response.data.map((item: { totalAmount: number }) => item.totalAmount)

      setCategories(categoriesData)
      setAmounts(amountsData)
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

  if (!isLoading && amounts.length === 0) {
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
        position: "bottom" as const,
        labels: {
          font: {
            size: 12
          },
          padding: 10
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
        callbacks: {
          label: function(context: any) {
            let label = context.label || ''
            if (label) {
              label += ': '
            }
            if (context.parsed !== null) {
              label += '₡' + context.parsed.toLocaleString('es-CR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            }
            return label
          }
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart' as const
    }
  }

  const pieChartData = {
    labels: categories,
    datasets: [
      {
        label: "Gastos",
        data: amounts,
        backgroundColor: [
          "#ef4444",
          "#f59e0b",
          "#10b981",
          "#3b82f6",
          "#8b5cf6",
          "#ec4899",
          "#14b8a6",
          "#f97316",
          "#06b6d4",
          "#6366f1"
        ],
        borderColor: "#fff",
        borderWidth: 2,
        hoverOffset: 8,
        hoverBorderWidth: 3
      }
    ]
  }

  return <Doughnut options={options} data={pieChartData} />
}
