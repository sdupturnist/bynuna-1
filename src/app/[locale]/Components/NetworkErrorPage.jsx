'use client'

import { useState, useEffect } from "react";

const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Trigger a reload when coming back online
      window.location.reload();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    // Set loading to false when the component has mounted
    setLoading(false);

    // Add event listeners for online/offline status changes
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Cleanup event listeners when the component is unmounted
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return { isOnline, loading };
};

export default useNetworkStatus;