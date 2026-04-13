import {useEffect, useRef} from "react"
import {MaintenancePage} from "@/components/cars/content/MaintenancePage.tsx"
import {ServiceBookPage} from "@/components/cars/content/ServiceBookPage.tsx"
import gsap from "gsap"
import {useCarPage} from "@/hooks/useCarPage.tsx";
import {useModalButton} from "@/hooks/useModalButton.tsx";


export const CarInfoPage = () => {
  const { activePage } = useCarPage()

  useModalButton({
    modalType: activePage === "maintenance" ? "addMaintenance" : "addService"
  })

  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!contentRef.current) return

    gsap.to(contentRef.current, {
      x: activePage === "maintenance" ? "0%" : "-50%",
      duration: 0.35,
      ease: "power3.out"
    })
  }, [activePage])

  useEffect(() => {
    if (!contentRef.current) return

    gsap.to(contentRef.current, {
      x: activePage === 'maintenance' ? '0' : '-50%',
      duration: 0.35,
      ease: "power3.out"
    })
  }, [activePage])

  return (
    <div className="content-wrapper" ref={contentRef}>
      <div className="page-content">
        <MaintenancePage />
      </div>

      <div className="page-content">
        <ServiceBookPage />
      </div>
    </div>
  )
}