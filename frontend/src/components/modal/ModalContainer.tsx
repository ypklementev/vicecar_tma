import { useModal } from '@/context/ModalContext'
import { Modal } from './Modal'
import React, { lazy, Suspense } from 'react'

const MODAL_CONTENT: Record<string, React.LazyExoticComponent<any>> = {
    addCar:         lazy(() => import('./modals/AddCarContent')),
    addMaintenance: lazy(() => import('./modals/AddMaintenance')),
    addService: lazy(() => import('./modals/AddService')),
    // confirmDelete: lazy(() => import('./modals/ConfirmDeleteContent')),
    // editUser:      lazy(() => import('./modals/EditUserContent')),
}

export function ModalContainer() {
    const { modal } = useModal()

    const Content = modal.type ? MODAL_CONTENT[modal.type] : null

    return (
        <Modal>
            <Suspense fallback={null}>
                {Content && <Content {...(modal.props ?? {})} />}
            </Suspense>
        </Modal>
    )
}