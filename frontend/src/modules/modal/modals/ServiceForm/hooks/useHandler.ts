import {useAddMaintenanceHandler} from "@/modules/modal/modals/ServiceForm/handlers/useAddMaintenanceHandler.ts";
import {useAddRepairHandler} from "@/modules/modal/modals/ServiceForm/handlers/useAddRepairHandler.ts";
import type {ServiceFormMode} from "@/modules/modal/modals/types";
import {useEditServiceHandler} from "@/modules/modal/modals/ServiceForm/handlers/useEditServiceHandler.ts";


export const useHandler = (mode: ServiceFormMode, id: number) => {
    const handlers = {
        addMaintenance:  useAddMaintenanceHandler(),
        addRepair:       useAddRepairHandler(),
        editMaintenance: useEditServiceHandler({serviceId: id}),
        editRepair:      useEditServiceHandler({serviceId: id}),
    }
    return handlers[mode]
}