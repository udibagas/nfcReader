import { useState, useEffect } from "react";

function getCurrentTime() {
  return new Date().toLocaleTimeString("id-ID").replaceAll(".", ":");
}

function getCurrentDate() {
  return new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const Clock = () => {
  const [time, setTime] = useState(getCurrentTime());
  const [date, setDate] = useState(getCurrentDate());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getCurrentTime());
      setDate(getCurrentDate());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <h1
        style={{
          margin: 0,
          fontSize: "2.2rem",
          color: "green",
          fontFamily: "monospace",
        }}
      >
        {time}
      </h1>
      <h3 style={{ margin: 0 }}>{date}</h3>
    </>
  );
};

export default Clock;
