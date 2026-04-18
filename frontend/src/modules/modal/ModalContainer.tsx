import { useModal } from '@/modules/modal/context/ModalContext.tsx'
import { Modal } from './ui/Modal.tsx'
import React, { lazy } from 'react'

const MODAL_CONTENT: Record<string, React.LazyExoticComponent<any>> = {
    addCar:          lazy(() => import('./modals/AddCarForm')),
    addMaintenance:  lazy(() => import('./modals/ServiceForm')),
    addRepair:       lazy(() => import('./modals/ServiceForm')),
    editMaintenance: lazy(() => import('./modals/ServiceForm')),
    editRepair:      lazy(() => import('./modals/ServiceForm')),
    // editService:     lazy(() => import('./modals/ServiceForm')),
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