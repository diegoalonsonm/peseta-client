"use client"

import { Doughnut } from "react-chartjs-2";
import { Chart, Tooltip, Legend, ArcElement } from "chart.js";
import { useEffect, useState } from "react";
import axios from "axios";

Chart.register(Tooltip, Legend, ArcElement)

export const PieChart = () => {
    const [categories, setCategories] = useState([])
    const [amounts, setAmounts] = useState([])
    
    useEffect(() => {
        const email = localStorage.getItem('email') || ""
        
        axios.get(`http://localhost:3930/expenses/amountByCategory/${email}`).then((response) => {
            const categoriesData = response.data.map((item: { description: string }) => item.description)
            const amountsData = response.data.map((item: { totalAmount: number }) => item.totalAmount)

            setCategories(categoriesData)
            setAmounts(amountsData)
        }).catch((error) => {
            console.log(error)
        })
    }, [])

    const options = {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom" as const,
          }
        }
    }    

    const pieChartData = {
        labels: categories,
        datasets: [
            {
                label: "Money Spent",
                data: amounts,
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#E7E9ED", "#FF5733", "#33FF57"],
                hoverOffset: 8
            }
        ]
    }

    return <Doughnut options={options} data={pieChartData} /> 
}