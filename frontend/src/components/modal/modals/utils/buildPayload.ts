import type { Maintenances } from "@/types/types.ts"

export const buildMaintenancePayload = (data: Maintenances): Maintenances => ({
    service_type: "maintenance",
    date: new Date(),
    mileage: data.mileage,
    comment: data.comment,
    items: data.items,
})