import {useGetMaintenance} from "@/api/api.ts";
import {useAppContext} from "@/context/AppContext.tsx";

export const MaintenancePage = () => {
  const { car } = useAppContext();
  const maintenance = car ? useGetMaintenance(car.id) : null

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("ru-RU")
  }

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