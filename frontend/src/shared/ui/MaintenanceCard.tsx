import { useRef, useState } from "react"
import gsap from "gsap"
import type {Maintenances} from "@/types/types.ts";


interface Props {
  maintenance: Maintenances
}

export const MaintenanceCard = ({ maintenance }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const arrowRef = useRef<HTMLButtonElement>(null)

  const [expanded, setExpanded] = useState(false)

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
    <div className="maintenances-item">
      <div className="mini-container">
        <h3>{maintenance.comment ? maintenance.comment : "..."}</h3>
        <button className="card-menu-button" />
      </div>

      <div className="mini-container">
        <span>{maintenance.mileage} км</span>
        <span>{formatDate(maintenance.date)}</span>
      </div>

      <div className="maintenances-wrapper">
        <div
          className="maintenance-container"
          ref={containerRef}
          style={{ height: 0, overflow: "hidden" }}
        >
          {maintenance.items.map((item, index) => (
            <div key={index} className="maintenance-item">
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
    </div>
  )
}