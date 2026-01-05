"use client"

import { Bar } from "react-chartjs-2"
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js" 
import { useEffect, useState } from "react"
import axios from "axios"

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export const BarChart = () => {  
  const [top5Categories, setTop5Categories] = useState([])
  const [top5CategoriesAmount, setTop5CategoriesAmount] = useState([])

  const email = localStorage.getItem('email') || ""
   
  useEffect(() => {
    axios.get(`http://localhost:3930/expenses/top5Categories/${email}`).then((response) => {
      const categories = response.data.map((item: { description: string }) => item.description)
      const amounts = response.data.map((item: { totalAmount: number }) => item.totalAmount)
    
      setTop5Categories(categories)
      setTop5CategoriesAmount(amounts)
    }).catch((error) => {
      console.log(error)
    })
  }, [email])

  const options = {
      responsive: true
  }

  let barChartData = {
    labels: top5Categories,
      datasets: [
        {
          label: "Expenses",
          data: top5CategoriesAmount,
          backgroundColor: ["#ADD8E6"],
          borderColor: ["#00008B"],
          borderWidth: 1
        }
      ]
  }   

  return (
      <Bar options={options} data={barChartData} />
  )
}