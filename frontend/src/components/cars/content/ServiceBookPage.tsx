import {useMatch} from "react-router-dom";
import {useGetMaintenance} from "@/api/api.ts";

export const ServiceBookPage = () => {
  const match = useMatch("/car/:id")
  const carId = match ? Number(match.params.id) : undefined
  const maintenance = useGetMaintenance(carId)

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("ru-RU")
  }

  if (maintenance.isLoading) return (
    <div className="maintenance-container">
      <div className='maintenance-item skeleton' />
      <div className='maintenance-item skeleton' />
      <div className='maintenance-item skeleton' />
    </div>
  )

  if (maintenance.data && maintenance.data.length === 0) return (
    <div className="empty-page">Нет записей</div>
  )

  return (
    <div className="maintenance-container">
      {maintenance && maintenance.data && (maintenance.data.map((item) => (
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