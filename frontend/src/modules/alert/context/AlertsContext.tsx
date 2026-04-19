import type {AlertsState} from "@/modules/alert/types";
import React, {createContext, useCallback, useContext, useRef, useState} from "react";


interface AlertsContextValue {
    alert: AlertsState,
    openAlert: ({type, props}: AlertsState) => void,
    closeAlert: () => void,
    animatedCloseRef: React.RefObject<(() => void) | null>
}

const AlertsContext = createContext<AlertsContextValue | null>(null)

export const AlertsProvider = ({ children }: { children: React.ReactNode }) => {
    const [alert, setAlert] = useState<AlertsState>({ type: null })
    const animatedCloseRef = useRef<(() => void) | null>(null)

    const openAlert = useCallback(({type, props}: AlertsState) => {
        setAlert({type, props})
    }, [])

    const closeAlert = useCallback(() => {
        setAlert({type: null, props: {}})
    }, [])

    return (
        <AlertsContext.Provider value={{
            alert: alert,
            openAlert: openAlert,
            closeAlert: closeAlert,
            animatedCloseRef: animatedCloseRef,
        }}>
            {children}
        </AlertsContext.Provider>
    )
}

export function useAlert() {
    const ctx = useContext(AlertsContext)
    if (!ctx) throw new Error('useModal must be used within ModalProvider')
    return ctx
}