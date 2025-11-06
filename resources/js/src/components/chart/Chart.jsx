import React, { useRef, useEffect, useState } from 'react';
import { Chart as ChartJS } from 'chart.js/auto';
import api from '../../axios';

export default function AcquisitionsChart() {
  const canvasRef = useRef(null);
  const [sellsByDate, setSellByDate] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const DashboardStats = async () => {
      try {
          const res = await api.get("/superadmin/get/sells/by/date");
          console.log(res.data.data);
          setSellByDate(res.data.data);
      } catch (err) {
          console.error("fetchFlavours error:", err);
      } finally {
          setIsLoading(false);
      }
  };

  useEffect(() => {
    DashboardStats();
  }, []);

  useEffect(() => {
    if (!canvasRef.current || sellsByDate.length === 0) return;

    const chart = new ChartJS(canvasRef.current, {
      type: "bar",
      data: {
        labels: sellsByDate.map((row) => row.date),
        datasets: [
          {
            label: "Sales by Date",
            data: sellsByDate.map((row) => row.count),
            backgroundColor: "#319795",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    return () => chart.destroy();
  }, [sellsByDate]);

  return (
    <div style={{ height: 300 }}>
      <canvas ref={canvasRef} />
    </div>
  );
}
