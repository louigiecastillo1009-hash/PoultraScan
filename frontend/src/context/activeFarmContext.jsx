import React, { createContext, useContext, useState, useEffect } from 'react';

const STORAGE_KEY = 'poultryscan_active_farm_id';
const ActiveFarmContext = createContext(null);

export function ActiveFarmProvider({ children }) {
  const [activeFarmId, setActiveFarmIdState] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? Number(stored) : null;
  });

  useEffect(() => {
    if (activeFarmId != null) {
      localStorage.setItem(STORAGE_KEY, String(activeFarmId));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [activeFarmId]);

  const setActiveFarmId = (id) => setActiveFarmIdState(id);

  return (
    <ActiveFarmContext.Provider value={{ activeFarmId, setActiveFarmId }}>
      {children}
    </ActiveFarmContext.Provider>
  );
}

export function useActiveFarm() {
  const ctx = useContext(ActiveFarmContext);
  if (!ctx) {
    throw new Error('useActiveFarm must be used within an ActiveFarmProvider');
  }
  return ctx;
}