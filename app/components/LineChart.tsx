"use client"

import { Line } from "react-chartjs-2"
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from "chart.js"
import { useEffect, useState } from "react"
import axios from "axios"

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

interface LineChartProps {
  year?: number
}

export const LineChart = ({ year }: LineChartProps) => {
  const [monthlyExpenses, setMonthlyExpenses] = useState<number[]>([])
  const [monthlyIncomes, setMonthlyIncomes] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)

  axios.defaults.withCredentials = true

  useEffect(() => {
    const email = localStorage.getItem('email') || ""
    const currentYear = year || new Date().getFullYear()
    const API_URL = process.env.NEXT_PUBLIC_API_URL

    setIsLoading(true)

    Promise.all([
      axios.get(`${API_URL}/expenses/monthlyExpense/${email}?year=${currentYear}`),
      axios.get(`${API_URL}/incomes/monthlyIncome/${email}?year=${currentYear}`)
    ]).then(([expensesRes, incomesRes]) => {
      setMonthlyExpenses(expensesRes.data)
      setMonthlyIncomes(incomesRes.data)
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

  const hasData = monthlyExpenses.some(val => val > 0) || monthlyIncomes.some(val => val > 0)

  if (!isLoading && !hasData) {
    return (
      <div className="text-center py-5">
        <p className="text-muted">No hay datos para mostrar este año</p>
      </div>
    )
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 13,
            weight: 'normal' as const
          }
        }
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

  let lineChartData = {
    labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
    datasets: [
      {
        label: "Ingresos",
        data: monthlyIncomes,
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.4,
        fill: true,
        borderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: "#10b981",
        pointBorderColor: "#fff",
        pointBorderWidth: 2
      },
      {
        label: "Gastos",
        data: monthlyExpenses,
        borderColor: "#ef4444",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        tension: 0.4,
        fill: true,
        borderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: "#ef4444",
        pointBorderColor: "#fff",
        pointBorderWidth: 2
      }
    ]
  }

  return (
      <Line options={options} data={lineChartData} />
  )
}
