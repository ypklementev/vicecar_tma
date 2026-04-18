import {useRef, useEffect} from "react"
import gsap from "gsap"
import {useModal} from "@/modules/modal/context/ModalContext.tsx";
import {useAppContext} from "@/app/context/AppContext.tsx";
import type {Service} from "@/shared/types/types.ts";
import type {ModalType} from "@/modules/modal/modals/types";


interface DotsModalProps {
    itemId: number,
    defaultValues?: Partial<Service>,
    type: ModalType
}

export const DotsModal = ({itemId, defaultValues, type}: DotsModalProps) => {
    const { setMenuId } = useAppContext()
    const { openModal } = useModal()
    const modalRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (!modalRef.current?.contains(e.target as Node)) {
                close()
            }
        }

        window.addEventListener("click", handleClick)

        return () => window.removeEventListener("click", handleClick)
    }, [])


    useEffect(() => {
        if (!modalRef.current) return

        gsap.fromTo(
            modalRef.current,
            {
                opacity: 0,
                scale: 0.9,
                y: -8,
                transformOrigin: "top right"
            },
            {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.18,
                ease: "power2.out"
            }
        )
    }, [])

    const close = () => {
        if (!modalRef.current) return

        gsap.to(modalRef.current, {
            opacity: 0,
            scale: 0.9,
            y: -8,
            duration: 0.15,
            ease: "power2.in",
            transformOrigin: "top right",
            onComplete: () => {
                setMenuId(null)
            }
        })
    }

    if (!itemId) return null

    return (
        <div className="dots-modal" ref={modalRef}>
            <button
                className="dots-button edit"
                onClick={() => {
                    openModal(type, { mode: type, id: itemId, defaultValues: defaultValues, type: "edit" })  // ← передаём id
                    close()
                }}
            >
                Редактировать
            </button>

            <button
                className="dots-button delete"
                onClick={close}
            >
                Удалить
            </button>
        </div>
    )
}