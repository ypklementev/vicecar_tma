import {useRef} from "react";
import {useAppContext} from "@/context/AppContext.tsx";
import {Modal} from "@/shared/ui/modal.tsx";
import {AddServiceModal} from "@/components/modals/service/AddServiceModal.tsx";
import {AddCarModal} from "@/components/modals/AddCarModal.tsx";
import {useMatch} from "react-router-dom";
import {useAddMaintenance, useAddRepair} from "@/api/api.ts";
import {AddMaintenanceModal} from "@/components/modals/service/AddMaintenanceModal.tsx";


export const ModalsManager = () => {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { modal, setModal } = useAppContext()
  const match = useMatch("/car/:id")
  const carId = match ? Number(match.params.id) : undefined
  const useMutation = modal.type === 'addMaintenance' ? useAddMaintenance(carId) : useAddRepair(carId)

  return (
    <Modal>
      {modal.type === "addCar" && (
        <AddCarModal debounceRef={debounceRef}/>
      )}

      {modal.type === "addMaintenance" && <AddMaintenanceModal carId={carId} setModal={setModal} />}

      {(modal.type === "addService" || modal.type === "editRepair") && (
        <AddServiceModal debounceRef={debounceRef} useMutation={useMutation}/>
      )}

      {/*{modal.type === "editRepair" && (*/}
      {/*  <EditServiceModal debounceRef={debounceRef}/>*/}
      {/*)}*/}
    </Modal>
  );
}