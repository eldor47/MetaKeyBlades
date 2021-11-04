import React, { useEffect, useState } from "react";
import "./Timer.css";

import { useHistory } from 'react-router-dom';

function Timer() {

  const history = useHistory();
  const calculateTimeLeft = () => {
    let year = new Date().getFullYear();
    const difference = new Date("2021-11-12T16:00:00Z") - new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [year] = useState(new Date().getFullYear());

  useEffect(() => {
    setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
  });

  const timerComponents = [];

  Object.keys(timeLeft).forEach((interval) => {
    var value = timeLeft[interval]
    if (!timeLeft[interval]) {
      value = 0
    }

    timerComponents.push(
      <div className='time-top' key={interval}>
        {value}
        <div className='time-bottom'>
          {interval}
        </div>
      </div>
    );
  });
  return (
    <div>
      <div className='time-holder'>
        {timerComponents.length ? timerComponents : <h1 className='mintText'>Mint is live ⚔️</h1>}
      </div>
      {timerComponents.length ? (
        <button className="disabled" disabled={timerComponents.length}>Mint Coming Soon</button>
      ) : <button className="mintButton" onClick={() => history.push('/mint')} disabled={timerComponents.length}>Mint MetaKey Blade</button>}
    </div>
  );
}

export default Timer;