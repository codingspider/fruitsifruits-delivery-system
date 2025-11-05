import React, { useEffect } from 'react'
import DriverStats from '../driver/DriverStats'

const DriverDashboard = () => {
  useEffect(()=>{
      const app_name = localStorage.getItem("app_name");
      document.title = `${app_name} | Driver Dashboard`;
  });
  return (
    <>
      <DriverStats></DriverStats>
    </>
  )
}

export default DriverDashboard