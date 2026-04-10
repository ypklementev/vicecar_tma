import { useMatch } from "react-router-dom"
import { useGetRepairs } from "@/api/api"
import { PageLoader } from "@/shared/ui/Loader.tsx"
import { RepairCard } from "@/shared/ui/RepairCard.tsx";


export const ServiceBookPage = () => {
  const match = useMatch("/car/:id")
  const carId = match ? Number(match.params.id) : undefined
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