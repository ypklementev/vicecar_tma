import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type {AppContextProps, Car} from "@/types/types.ts";
import { useGetCars, useGetUser } from "@/api/api.ts";


const AppContext = createContext<AppContextProps | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [ theme, setTheme ] = useState<'light' | 'dark'>('light')
  const [ isLoading, setIsLoading ] = useState<boolean>(false)
  const [ addModalOpen, setAddModalOpen ] = useState<boolean>(false)
  const [ isBtnLoading, setIsBtnLoading ] = useState<boolean>(false)
  const [ activeCar, setActiveCar ] = useState<number>(0)
  const [activePage, setActivePage] = useState<"maintenance" | "service">("maintenance")
  const [car, setCar] = useState<Car | null>(null)
  const user = useGetUser()
  const cars = useGetCars()

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        isLoading,
        setIsLoading,
        isModalOpen: addModalOpen,
        setIsModalOpen: setAddModalOpen,
        isBtnLoading,
        setIsBtnLoading,
        activeCar,
        setActiveCar,
        user,
        cars,
        car,
        setCar,
        activePage,
        setActivePage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};