import { useEffect } from 'react'
import { useModal } from '@/modules/modal/context/ModalContext.tsx'
import type {ModalButtonConfig} from "@/modules/modal/modals/types";


export function useModalButton(config: ModalButtonConfig | null) {
    const { setButtonConfig } = useModal()

    useEffect(() => {
        setButtonConfig(config)
        return () => setButtonConfig(null)
    }, [config?.modalType])
}