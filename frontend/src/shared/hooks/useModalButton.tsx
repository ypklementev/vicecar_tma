import { useEffect } from 'react'
import { useModal } from '@/context/ModalContext.tsx'
import type { ModalButtonConfig } from '@/types/types.ts'

export function useModalButton(config: ModalButtonConfig | null) {
    const { setButtonConfig } = useModal()

    useEffect(() => {
        setButtonConfig(config)
        return () => setButtonConfig(null)
    }, [config?.modalType])
}