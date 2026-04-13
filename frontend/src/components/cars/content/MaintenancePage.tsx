import {useGetMaintenance} from "@/api/api.ts";
import {PageLoader} from "@/shared/ui/Loader.tsx";
import {MaintenanceCard} from "@/shared/ui/MaintenanceCard.tsx";
import {useCarId} from "@/hooks/useCarId.tsx";


export const MaintenancePage = () => {
  const carId = useCarId();
  const maintenance = useGetMaintenance(carId)

  if (maintenance.isLoading) {
    return <PageLoader />
  }

  if (maintenance.data && maintenance.data.length === 0) return (
    <div className="empty-page">Нет записей</div>
  )

  return (
    <div className="maintenances-container">
      {maintenance.data && (maintenance.data.map((items, index) => (
        <MaintenanceCard maintenance={items} key={index} />
      )))}
    </div>
  )
}