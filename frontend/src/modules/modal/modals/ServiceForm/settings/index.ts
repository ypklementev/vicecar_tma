import type {ServiceFormMode} from "@/modules/modal/modals/types";


export const TITLES: Record<ServiceFormMode, string> = {
    addMaintenance:  "Добавить ТО",
    addRepair:       "Добавить ремонт",
    editMaintenance: "Изменить ТО",
    editRepair:      "Изменить ремонт",
}

export const SELECT_MODE: Record<ServiceFormMode, "maintenance" | "repair"> = {
    addMaintenance:  "maintenance",
    addRepair:       "repair",
    editMaintenance: "maintenance",
    editRepair:      "repair",
}