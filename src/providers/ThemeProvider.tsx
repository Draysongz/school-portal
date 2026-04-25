'use client';

import React, { createContext, useContext, useEffect } from 'react';

interface ThemeConfig {
  primary: string;
  secondary: string;
}

const ThemeContext = createContext<ThemeConfig | null>(null);

export function ThemeProvider({ 
  children, 
  config 
}: { 
  children: React.ReactNode;
  config: ThemeConfig;
}) {
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary', config.primary);
    root.style.setProperty('--secondary', config.secondary);
  }, [config]);

  return (
    <ThemeContext.Provider value={config}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
