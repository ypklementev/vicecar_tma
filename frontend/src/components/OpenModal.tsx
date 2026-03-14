import { useAppContext } from "@/context/AppContext"
import { useLocation } from "react-router-dom"
import {useCarPage} from "@/hooks/useCarPage.tsx";


export const OpenModal = () => {
  const { setModal } = useAppContext()
  const { activePage } = useCarPage()
  const location = useLocation()

  const openModal = () => {
    if (location.pathname === "/") {
      setModal({ type: "addCar" })
      return
    }

    if (activePage === 'service') {
      setModal({ type: "addService" })
      return
    }

    if (activePage === 'maintenance') {
      setModal({ type: "addMaintenance" })
    }
  }

  return (
    <div className="open-modal" onClick={openModal}>
      +
    </div>
  )
}