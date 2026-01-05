"use client"

import { Line } from "react-chartjs-2"
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js" 
import { useEffect, useState } from "react"
import axios from "axios"

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export const LineChart = () => {
  const [monthlyExpenses, setMonthlyExpenses] = useState([])
  const [monthlyIncomes, setMonthlyIncomes] = useState([])

  useEffect(() => {
    const email = localStorage.getItem('email') || ""

    axios.get(`http://localhost:3930/expenses/monthlyExpense/${email}`).then((response) => {
      setMonthlyExpenses(response.data)
    }).catch((error) => {
      console.log(error)
    })

    axios.get(`http://localhost:3930/incomes/monthlyIncome/${email}`).then((response) => {
      setMonthlyIncomes(response.data)
    }).catch((error) => {
      console.log(error)
    })
  }, [])

  const options = {
    responsive: true
  }

  let lineChartData = {
    labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    datasets: [
      {
        label: "Incomes",
        data: monthlyIncomes,
        borderColor: "#228B22"
      },
      {
        label: "Expenses",
        data: monthlyExpenses,
        borderColor: "#b22222"
      }
    ]
  }    

  return (
      <Line options={options} data={lineChartData} />
  )
}