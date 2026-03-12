import { useEffect, useRef } from "react"
import { useLocation, useMatch } from "react-router-dom"
import gsap from "gsap"
import { useAppContext } from "@/context/AppContext.tsx";
import { ToplineName } from "@/components/topline/ui/ToplineName.tsx";
import {useCarPage} from "@/hooks/useCarPage.tsx";


export const Topline = () => {
  const location = useLocation()
  const { cars, setCar } = useAppContext()
  const { activePage, setActivePage } = useCarPage()
  const underlineRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Record<string, HTMLDivElement>>({})
  const isCarPage = useMatch("/car/:id")
  const carId = isCarPage ? Number(isCarPage.params.id) : null

  useEffect(() => {
    if (!cars.data || !carId) {
      setCar(null)
      return
    }

    const foundCar = cars.data.find(c => c.id === carId) ?? null
    setCar(foundCar)
  }, [cars.data, carId])

  useEffect(() => {
    const activeEl = itemRefs.current[activePage]
    if (!activeEl || !underlineRef.current) return;

    const { offsetLeft, offsetWidth } = activeEl;

    gsap.to(underlineRef.current, {
      x: offsetLeft,
      width: offsetWidth,
      duration: 0.3,
      ease: "power2.out",
    });
  }, [activePage, location.pathname])

  const showMenu = location.pathname.startsWith("/car");

  const menuItems: Record<"maintenance" | "service", string> = {
    maintenance: "ТО",
    service: "Сервисная книга"
  }

  return (
    <div className="topline">
      <ToplineName />

      {showMenu && (
        <div className="menu-container">
          <menu>
            {Object.entries(menuItems).map(([key, name]) => (
              <div
                key={key}
                ref={(el) => { if (el) itemRefs.current[key] = el }}
                className="menu-item"
                onClick={() => setActivePage(key as "maintenance" | "service")}
              >
                {name}
              </div>
            ))}
          </menu>
          <div className="underline" ref={underlineRef} />
        </div>
      )}
    </div>
  );
};