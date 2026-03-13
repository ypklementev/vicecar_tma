import {Modal} from "@/shared/ui/modal.tsx";
import {AddCarModal} from "@/components/modals/AddCarModal.tsx";
import {AddServiceModal} from "@/components/modals/AddServiceModal.tsx";
import {useLocation} from "react-router-dom";
import {useRef} from "react";


export const ModalsManager = () => {
  const location = useLocation()
  const debounceRef = useRef<number | null>(null)

  return (
    <Modal>
      {location.pathname === "/"
        ? <AddCarModal debounceRef={debounceRef}/>
        : <AddServiceModal debounceRef={debounceRef} />
      }
    </Modal>
  )
}