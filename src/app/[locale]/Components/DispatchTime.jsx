"use client";

import { useEffect, useState } from "react";
import { apiUrl, siteName } from "../Utils/variables";
import { DateTime } from "luxon";

const API_URL =
  `${apiUrl}wp-json/dispatch-time/v1/get-dispatch-time`;

const DispatchTime = () => {
  const [timeLeft, setTimeLeft] = useState(0);

  const fetchEndTime = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      if (!data.saved_time || !data.dispatch_time) {
        console.error("Missing saved_time or dispatch_time in API response");
        return;
      }

      let formattedSavedTime = data.saved_time.replace(" ", "T");

      let savedTimeUAE = DateTime.fromFormat(
        formattedSavedTime,
        "yyyy-MM-dd'T'HH:mm:ss",
        { zone: "Asia/Dubai" }
      );

      if (!savedTimeUAE.isValid) {
        console.error("Invalid saved_time format:", data.saved_time);
        return;
      }

      const dispatchDurationMs = parseInt(data.dispatch_time) * 60 * 60 * 1000;
      // const dispatchDurationMs = parseInt(data.dispatch_time) * 60 * 1000; // Convert minutes to ms(Testing....)


      let endTimeUAE = savedTimeUAE.plus({ milliseconds: dispatchDurationMs });
      let currentTimeUAE = DateTime.now().setZone("Asia/Dubai");

      // If the saved end time is in the past, calculate a new end time
      while (currentTimeUAE >= endTimeUAE) {
        endTimeUAE = endTimeUAE.plus({ milliseconds: dispatchDurationMs });
      }

      localStorage.setItem(`${siteName}_endTimeUAE`, endTimeUAE.toISO()); // Store correct end time
      setTimeLeft(Math.floor(endTimeUAE.diff(currentTimeUAE, "seconds").seconds));
    } catch (error) {
      console.error("Error fetching end time:", error);
    }
  };

  useEffect(() => {
    const storedEndTime = localStorage.getItem(`${siteName}_endTimeUAE`);

    if (storedEndTime) {
      const endTimeUAE = DateTime.fromISO(storedEndTime).setZone("Asia/Dubai");
      const currentTimeUAE = DateTime.now().setZone("Asia/Dubai");

      if (currentTimeUAE >= endTimeUAE) {
        fetchEndTime(); // Get new end time if expired
      } else {
        setTimeLeft(Math.floor(endTimeUAE.diff(currentTimeUAE, "seconds").seconds));
      }
    } else {
      fetchEndTime(); // Fetch new time if no stored time is found
    }
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      fetchEndTime(); // Fetch new end time when countdown reaches zero
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return formatTime(timeLeft)
   
};

export default DispatchTime;
