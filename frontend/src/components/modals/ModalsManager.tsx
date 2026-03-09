import {useAppContext} from "@/context/AppContext.tsx";
import {Modal} from "@/shared/ui/modal.tsx";
import {AddCarModal} from "@/components/modals/AddCarModal.tsx";
import {AddMaintenanceModal} from "@/components/modals/AddMaintenanceModal.tsx";
import {AddServiceModal} from "@/components/modals/AddServiceModal.tsx";
import {useLocation} from "react-router-dom";


export const ModalsManager = () => {
  const { activePage } = useAppContext()
  const location = useLocation()

  return (
    <Modal>
      {location.pathname === "/" ? (
        <AddCarModal/>
      ) : activePage === "maintenance" ? (
        <AddMaintenanceModal/>
      ) : activePage === "service" ? (
        <AddServiceModal/>
      ) : null}
    </Modal>
  )
}