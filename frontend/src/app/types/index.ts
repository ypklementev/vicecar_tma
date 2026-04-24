import type {Car, Cars, User} from "@/shared/types/types.ts";
import type {UseQueryResult} from "@tanstack/react-query";
import React, {type SetStateAction} from "react";
import type {ModalState} from "@/modules/modal/modals/types";


type isEditing = {
    open: boolean
    id: number | null
}

export interface AppContextProps {
    theme: 'light' | 'dark'
    setTheme: React.Dispatch<React.SetStateAction<'light' | 'dark'>>

    isLoading: boolean
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>

    isBtnLoading: boolean
    setIsBtnLoading: React.Dispatch<React.SetStateAction<boolean>>

    user: UseQueryResult<User, Error>
    cars: UseQueryResult<Cars, Error>

    car: Car | null
    setCar: React.Dispatch<React.SetStateAction<Car | null>>

    activeCar: number | null
    setActiveCar: React.Dispatch<React.SetStateAction<number>>

    isEditing: isEditing
    setIsEditing: React.Dispatch<React.SetStateAction<isEditing>>

    menuId: number | null
    setMenuId: React.Dispatch<SetStateAction<number | null>>

    modal: ModalState
    setModal: React.Dispatch<React.SetStateAction<ModalState>>
}