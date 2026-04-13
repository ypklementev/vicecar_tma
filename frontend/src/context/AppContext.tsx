import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type {AppContextProps, Car, ModalState} from "@/types/types.ts";
import { useGetCars, useGetUser } from "@/api/api.ts";


const AppContext = createContext<AppContextProps | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [ theme, setTheme ] = useState<'light' | 'dark'>('light')
  const [ isLoading, setIsLoading ] = useState<boolean>(false)
  const [ isBtnLoading, setIsBtnLoading ] = useState<boolean>(false)
  const [ activeCar, setActiveCar ] = useState<number>(0)
  const [ car, setCar ] = useState<Car | null>(null)
  const [ isEditing, setIsEditing ] = useState<{ open: boolean, id: number | null }>({open: false, id: null})
  const [ menuId, setMenuId ] = useState<number | null>(null)
  const [ modal, setModal ] = useState<ModalState>({type: null})

  const user = useGetUser()
  const cars = useGetCars()

  return (
    <AppContext.Provider
      value={{
        theme: theme,
        setTheme: setTheme,

        isLoading: isLoading,
        setIsLoading: setIsLoading,

        isBtnLoading: isBtnLoading,
        setIsBtnLoading: setIsBtnLoading,

        activeCar: activeCar,
        setActiveCar: setActiveCar,

        car: car,
        setCar: setCar,

        menuId: menuId,
        setMenuId: setMenuId,

        isEditing: isEditing,
        setIsEditing: setIsEditing,

        modal: modal,
        setModal: setModal,

        user,
        cars,
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