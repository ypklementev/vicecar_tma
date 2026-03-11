import {useAppContext} from "@/context/AppContext.tsx";
import {Modal} from "@/shared/ui/modal.tsx";
import {AddCarModal} from "@/components/modals/AddCarModal.tsx";
import {AddMaintenanceModal} from "@/components/modals/AddMaintenanceModal.tsx";
import {AddServiceModal} from "@/components/modals/AddServiceModal.tsx";
import {useLocation} from "react-router-dom";
import {useRef} from "react";


export const ModalsManager = () => {
  const { activePage } = useAppContext()
  const location = useLocation()
  const debounceRef = useRef<number | null>(null)

  return (
    <Modal>
      {location.pathname === "/" ? (
        <AddCarModal debounceRef={debounceRef}/>
      ) : activePage === "maintenance" ? (
        <AddMaintenanceModal debounceRef={debounceRef}/>
      ) : activePage === "service" ? (
        <AddServiceModal debounceRef={debounceRef}/>
      ) : null}
    </Modal>
  )
}