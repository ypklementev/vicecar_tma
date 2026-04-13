import { useModal } from '@/context/ModalContext'
import { Modal } from './Modal'
import React, { lazy } from 'react'

const MODAL_CONTENT: Record<string, React.LazyExoticComponent<any>> = {
    addCar:         lazy(() => import('./modals/AddCarContent')),
    addMaintenance: lazy(() => import('./modals/AddMaintenance')),
    addService:     lazy(() => import('./modals/AddService')),
}

export function ModalContainer() {
    const { modal } = useModal()

    const Content = modal.type ? MODAL_CONTENT[modal.type] : null

    return (
        <Modal>
            {Content && <Content {...(modal.props ?? {})} />}
        </Modal>
    )
}