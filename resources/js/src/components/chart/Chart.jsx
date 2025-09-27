import React, { useRef, useEffect } from 'react';
import { Chart as ChartJS } from 'chart.js/auto'; // rename to avoid collision

export default function AcquisitionsChart() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const data = [
      { year: 2010, count: 10 },
      { year: 2011, count: 20 },
      { year: 2012, count: 15 },
      { year: 2013, count: 25 },
      { year: 2014, count: 22 },
      { year: 2015, count: 30 },
      { year: 2016, count: 28 },
    ];

    if (!canvasRef.current) return; // safety check

    const chart = new ChartJS(canvasRef.current, {
      type: 'bar',
      data: {
        labels: data.map(row => row.year),
        datasets: [
          {
            label: 'Acquisitions by year',
            data: data.map(row => row.count),
            backgroundColor: '#319795',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    return () => chart.destroy();
  }, []);

  return (
    <div style={{ height: 300 }}>
      <canvas ref={canvasRef} />
    </div>
  );
}
