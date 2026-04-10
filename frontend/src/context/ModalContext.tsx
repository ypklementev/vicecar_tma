import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type {ModalButtonConfig, ModalState, ModalType} from '@/types/types.ts'

interface ModalContextValue {
    modal: ModalState
    openModal: (type: ModalType, props?: Record<string, unknown>) => void
    closeModal: () => void
    buttonConfig: ModalButtonConfig | null
    setButtonConfig: (cfg: ModalButtonConfig | null) => void
}

const ModalContext = createContext<ModalContextValue | null>(null)

export function ModalProvider({ children }: { children: ReactNode }) {
    const [modal, setModal] = useState<ModalState>({ type: null })
    const [buttonConfig, setButtonConfig] = useState<ModalButtonConfig | null>(null)

    const openModal = useCallback((type: ModalType, props?: Record<string, unknown>) => {
        setModal({ type, props })
    }, [])

    const closeModal = useCallback(() => {
        setModal((prev) => ({ ...prev, type: null }))
    }, [])

    return (
        <>
            <ModalContext.Provider value={{ modal, openModal, closeModal, buttonConfig, setButtonConfig }}>
                {children}
            </ModalContext.Provider>
        </>
    )
}

export function useModal() {
    const ctx = useContext(ModalContext)
    if (!ctx) throw new Error('useModal must be used within ModalProvider')
    return ctx
}