type AlertsType =
    | "deleteService"
    | null

export interface AlertsState {
    type: AlertsType | null,
    props?: Record<string, unknown>,
}