import type {Service} from "@/shared/types/types.ts";

export type ModalType =
    | "addCar"
    | "addService"
    | "addMaintenance"
    | "addRepair"
    | "editMaintenance"
    | "editRepair"
    | null

export type ServiceFormMode = "addMaintenance" | "addRepair" | "editMaintenance" | "editRepair"

export interface ModalState {
    type: ModalType | null
    props?: Record<string, unknown>
}

export interface ModalButtonConfig {
    label?: string
    modalType: ModalType
    modalProps?: Record<string, unknown>
}

export type ServicesApi = Service[]