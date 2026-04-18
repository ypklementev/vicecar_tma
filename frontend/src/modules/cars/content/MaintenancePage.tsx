import {PageLoader} from "@/shared/ui/Loader.tsx";
import {useCarId} from "@/shared/hooks/useCarId.tsx";
import {useGetMaintenance} from "@/modules/modal/modals/ServiceForm/api";
import {ServiceCard} from "@/widgets/ServiceCard.tsx";


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
    <div className="services-container">
      {maintenance.data && (maintenance.data.map((item, index) => (
        <ServiceCard key={index} service={item} type={"maintenance"} />
      )))}
    </div>
  )
}