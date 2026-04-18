import { PageLoader } from "@/shared/ui/Loader.tsx"
import {useCarId} from "@/shared/hooks/useCarId.tsx";
import {useGetRepairs} from "@/modules/modal/modals/ServiceForm/api";
import {ServiceCard} from "@/widgets/ServiceCard.tsx";


export const ServiceBookPage = () => {
  const carId = useCarId();
  const repairs = useGetRepairs(carId)

  if (repairs.isLoading) {
    return <PageLoader />
  }

  if (repairs.data?.length === 0) {
    return <div className="empty-page">Нет записей</div>
  }

  return (
    <div className="services-container">
      {repairs.data?.map((item, index) => (
          <ServiceCard key={index} service={item} type={"maintenance"} />
      ))}
    </div>
  )
}