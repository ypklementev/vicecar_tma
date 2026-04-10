import { useRef, useEffect } from "react"
import gsap from "gsap"
import { useAppContext } from "@/context/AppContext"


interface DotsModalProps {
  itemId: number | null
}

export const DotsModal = ({ itemId }: DotsModalProps) => {
  const { setModal, setMenuId, menuId } = useAppContext()

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
          setModal({type: 'editRepair', data: menuId})
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