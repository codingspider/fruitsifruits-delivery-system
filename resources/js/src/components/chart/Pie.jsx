import React, { useRef, useEffect, useState } from 'react';
import { Chart as ChartJS } from 'chart.js/auto';
import api from '../../axios';
import { useCurrencyFormatter } from './../../useCurrencyFormatter';

export default function Pie() {
  const canvasRef = useRef(null);
  const [sellsByDate, setTotalSellsByDate] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 
  const { formatAmount, currency } = useCurrencyFormatter();

  // 1️⃣ Fetch sell data from backend
  const fetchSellsByDate = async () => {
    try {
          const res = await api.get("/superadmin/total-sell-by-date");
          console.log(res.data.data);
          setTotalSellsByDate(res.data.data);
      } catch (err) {
          console.error("fetchFlavours error:", err);
      } finally {
          setIsLoading(false);
      }
  };

  // 2️⃣ Fetch data when component mounts
  useEffect(() => {
    fetchSellsByDate();
  }, []);

  // 3️⃣ Draw chart after data is fetched
  useEffect(() => {
    if (!canvasRef.current || sellsByDate.length === 0) return;

    const chart = new ChartJS(canvasRef.current, {
      type: "pie",
      data: {
        labels: sellsByDate.map((row) => row.date),
        datasets: [
          {
            label: "Total Sells by Date",
            data: sellsByDate.map((row) => Number(row.count)),
            backgroundColor: [
              "#3182CE",
              "#38A169",
              "#DD6B20",
              "#D69E2E",
              "#805AD5",
              "#E53E3E",
              "#319795",
              "#718096",
            ],
            borderColor: "#fff",
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
            labels: {
              color: "#2D3748",
              font: { size: 14 },
            },
          },
        },
      },
    });

    return () => chart.destroy();
  }, [sellsByDate]);

  return (
    <div style={{ height: 250, position: "relative" }}>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}
