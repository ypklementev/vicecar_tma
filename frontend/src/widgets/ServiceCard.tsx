import {useEffect, useRef, useState} from "react"
import gsap from "gsap"
import {useAppContext} from "@/app/context/AppContext.tsx";
import {DotsModal} from "@/widgets/DotsModal.tsx";
import {useFormatDate} from "@/shared/hooks/useFormatDate.ts";
import type {Service} from "@/shared/types/types.ts";


interface Props {
    service: Service,
    mode: "maintenance" | "repair" | undefined,
}

export const ServiceCard = ({ service }: Props) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const arrowRef = useRef<HTMLButtonElement>(null)
    const { setMenuId, menuId } = useAppContext()
    const [expanded, setExpanded] = useState(false)
    const isOpen = menuId === service.id
    const formatedDate = useFormatDate(service.date)
    const type = service.service_type === "maintenance" ? "editMaintenance" : "editRepair"

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

    useEffect(() => {
        if (!containerRef.current || !expanded) return

        gsap.to(containerRef.current, {
            height: "auto",
            duration: 0.3,
            ease: "power2.out",
        })
    }, [service])

    return (
        <div className="services-item" key={service.id}>
            <div className="mini-container">
                {service.comment ? (
                    <h3>{service.comment}</h3>
                ) : (
                    <span className={"empty-name"}>Пусто</span>
                )}

                <button
                    className="card-menu-button"
                    onClick={(e) => {
                        e.stopPropagation()
                        setMenuId(isOpen ? null : service.id)
                    }}
                />
            </div>

            <span>{service.mileage} км</span>

            <div className="mini-container">
                <span>{formatedDate}</span>
                <span>{service.total_cost}&nbsp;₽</span>
            </div>

            <div className="services-wrapper">
                <div
                    className="service-container"
                    ref={containerRef}
                    style={{ height: 0, overflow: "hidden" }}
                >
                    {service.items.map((item) => (
                        <div key={item.id} className="service-item">
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

            {isOpen && <DotsModal itemId={service.id} defaultValues={service} type={type}/>}
        </div>
    )
}