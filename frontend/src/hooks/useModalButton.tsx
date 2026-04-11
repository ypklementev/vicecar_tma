import { useEffect } from 'react'
import { useModal } from '@/context/ModalContext'
import type { ModalButtonConfig } from '@/types/types'

export function useModalButton(config: ModalButtonConfig | null) {
    const { setButtonConfig } = useModal()

    useEffect(() => {
        setButtonConfig(config)
        return () => setButtonConfig(null)
    }, [config?.modalType])
}