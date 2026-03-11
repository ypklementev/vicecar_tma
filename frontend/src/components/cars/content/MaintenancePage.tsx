import {useGetMaintenance} from "@/api/api.ts";
import { useMatch } from "react-router-dom"
import {PageLoader} from "@/components/Loader.tsx";


export const MaintenancePage = () => {
  const match = useMatch("/car/:id")
  const carId = match ? Number(match.params.id) : undefined
  const maintenance = useGetMaintenance(carId)

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("ru-RU")
  }

  if (maintenance.isLoading) {
    return <PageLoader />
  }

  if (maintenance.data && maintenance.data.length === 0) return (
    <div className="empty-page">Нет записей</div>
  )

  return (
    <div className="maintenance-container">
      {maintenance.data && (maintenance.data.map((item) => (
        <div
          className='maintenance-item'
          key={item.id}
        >
          <h3>{item.total_cost} ₽</h3>
          {item.comment && <span className='comment'>{item.comment}</span>}
          <div className='info'>
            <span className='mileage'>{item.mileage} км</span>
            <span className='date'>{formatDate(item.date)}</span>
          </div>
        </div>
      )))}
    </div>
  )
}