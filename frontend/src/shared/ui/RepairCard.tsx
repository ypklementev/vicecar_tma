import {useRef, useState} from "react"
import gsap from "gsap"
import type {Repairs} from "@/types/types.ts";
import {useAppContext} from "@/context/AppContext.tsx";
import {DotsModal} from "@/shared/ui/dotsmodal.tsx";


interface Props {
  repair: Repairs
}

export const RepairCard = ({ repair }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const arrowRef = useRef<HTMLButtonElement>(null)
  const { setMenuId, menuId } = useAppContext()
  const [expanded, setExpanded] = useState(false)
  const isOpen = menuId === repair.id

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("ru-RU")
  }

  const toggle = () => {
    const container = containerRef.current
    const arrow = arrowRef.current

    if (!container || !arrow) return

    if (!expanded) {
      gsap.set(container, { height: "auto" })
      const height = container.offsetHeight

      gsap.fromTo(
        container,
        { height: 0 },
        {
          height,
          duration: 0.3,
          ease: "power2.out",
        }
      )

      gsap.to(arrow, {
        rotate: 180,
        duration: 0.3
      })
    } else {
      gsap.to(container, {
        height: 0,
        duration: 0.3,
        ease: "power2.inOut"
      })

      gsap.to(arrow, {
        rotate: 0,
        duration: 0.3
      })
    }

    setExpanded(!expanded)
  }

  return (
    <div className="repairs-item" key={repair.id}>
      <div className="mini-container">
        <h3>{repair.comment}</h3>
        <button
          className="card-menu-button"
          onClick={(e) => {
            e.stopPropagation()
            setMenuId(isOpen ? null : repair.id)
          }}
        />
      </div>

      <span>{repair.mileage} км</span>

      <div className="mini-container">
        <span>{formatDate(repair.date)}</span>
        <span>{repair.total_cost}&nbsp;₽</span>
      </div>

      <div className="repair-wrapper">
        <div
          className="repair-container"
          ref={containerRef}
          style={{ height: 0, overflow: "hidden" }}
        >
          {repair.items.map((item) => (
            <div key={item.id} className="repair-item">
              <span>{item.name}</span>
              <span>{item.cost}&nbsp;₽</span>
            </div>
          ))}
        </div>
        <button
          className="expand-button"
          ref={arrowRef}
          onClick={toggle}
        />
      </div>

      {isOpen && <DotsModal itemId={repair.id} />}
    </div>
  )
}