import {useEffect, useRef} from "react"
import {MaintenancePage} from "@/modules/cars/content/MaintenancePage.tsx"
import {ServiceBookPage} from "@/modules/cars/content/ServiceBookPage.tsx"
import gsap from "gsap"
import {useCarPage} from "@/shared/hooks/useCarPage.tsx";
import {useModalButton} from "@/modules/modal/modals/ServiceForm/hooks/useModalButton.tsx";
import {useGetCars} from "@/api/api.ts";


export const CarInfoPage = () => {
  const { activePage } = useCarPage()
  const cars = useGetCars()

  useModalButton({
    modalType: activePage === "maintenance" ? "addMaintenance" : "addRepair",
    modalProps: {
      mode: activePage === "maintenance" ? "addMaintenance" : "addRepair"
    }
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

  if (cars.isError) return (
      <div className={"error-page"}>
        <h2>Ошибка загрузки</h2>
      </div>
  )

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