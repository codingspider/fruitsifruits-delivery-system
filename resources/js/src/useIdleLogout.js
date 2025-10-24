import { useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';

const useIdleLogout = (timeout = 15 * 60 * 1000) => { // default: 15 min
  const navigate = useNavigate(); 
  const timerRef = useRef(null);

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      // Clear auth
      localStorage.removeItem("auth_token");
      localStorage.removeItem("role");
      navigate("/login");
    }, timeout);
  };

  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];

    events.forEach(event =>
      window.addEventListener(event, resetTimer)
    );

    resetTimer(); // start on mount

    return () => {
      events.forEach(event =>
        window.removeEventListener(event, resetTimer)
      );
      clearTimeout(timerRef.current);
    };
  }, []);

};

export default useIdleLogout;
