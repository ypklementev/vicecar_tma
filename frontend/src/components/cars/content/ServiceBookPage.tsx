import { useGetRepairs } from "@/api/api"
import { PageLoader } from "@/shared/ui/Loader.tsx"
import { RepairCard } from "@/shared/ui/RepairCard.tsx";
import {useCarId} from "@/hooks/useCarId.tsx";


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
    <div className="repairs-container">
      {repairs.data?.map((repair) => (
        <RepairCard key={repair.id} repair={repair} />
      ))}
    </div>
  )
}