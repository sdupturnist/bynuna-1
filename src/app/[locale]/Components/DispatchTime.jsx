"use client";

import { useEffect, useState } from "react";
import { apiUrl } from "../Utils/variables";
import { DateTime } from "luxon";

const API_URL =
`${apiUrl}wp-json/dispatch-time/v1/get-dispatch-time`;

const DispatchTime = () => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [dispatchDuration, setDispatchDuration] = useState(0);

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
      setDispatchDuration(Math.floor(dispatchDurationMs / 1000)); // Store dispatch time in seconds

      let endTimeUAE = savedTimeUAE.plus({ milliseconds: dispatchDurationMs });
      let currentTimeUAE = DateTime.now().setZone("Asia/Dubai");

      if (currentTimeUAE < savedTimeUAE) {
        setTimeLeft(Math.floor(dispatchDurationMs / 1000));
      } else if (currentTimeUAE >= endTimeUAE) {
        setTimeLeft(Math.floor(dispatchDurationMs / 1000)); // Reset countdown
      } else {
        setTimeLeft(Math.floor(endTimeUAE.diff(currentTimeUAE, "seconds").seconds));
      }

    //   console.log("Saved Time (UAE):", savedTimeUAE.toISO());
    //   console.log("End Time (UAE):", endTimeUAE.toISO());
    //   console.log("Current Time (UAE):", currentTimeUAE.toISO());
    //   console.log("Remaining Time:", timeLeft);
    } catch (error) {
      console.error("Error fetching end time:", error);
    }
  };

  useEffect(() => {
    fetchEndTime();
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      // Reset the countdown instead of fetching the API again
      setTimeLeft(dispatchDuration);
    }
  }, [timeLeft, dispatchDuration]);

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
