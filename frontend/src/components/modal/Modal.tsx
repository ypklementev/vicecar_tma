import { useEffect, useRef, type ReactNode } from 'react'
import { useModal } from '@/context/ModalContext'
import gsap from 'gsap'

export function Modal({ children }: { children: ReactNode }) {
    const { modal, closeModal } = useModal()
    const overlayRef = useRef<HTMLDivElement>(null)
    const modalRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (modal.type) {
            gsap.to(overlayRef.current, { opacity: 1, duration: 0.2, pointerEvents: 'auto' })
            gsap.to(modalRef.current, { y: 0, duration: 0.2, ease: 'power1.out' })
        } else {
            gsap.to(overlayRef.current, { opacity: 0, duration: 0.2, pointerEvents: 'none' })
            gsap.to(modalRef.current, { y: '100vh', duration: 0.2, ease: 'power1.in' })
        }
    }, [modal.type])

    const handleClose = async () => {
        gsap.to(overlayRef.current, { opacity: 0, duration: 0.2, pointerEvents: 'none' })
        await gsap.to(modalRef.current, { y: '100vh', duration: 0.2, ease: 'power1.in' })
        closeModal()
    }

    return (
        <>
            <div ref={overlayRef} className="overlay" onClick={handleClose} />
            <div className="modal" ref={modalRef}>
                <div className="modal-content">
                    {children}
                </div>
            </div>
        </>
    )
}