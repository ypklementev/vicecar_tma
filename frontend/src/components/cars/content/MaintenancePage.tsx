import {useGetMaintenance} from "@/api/api.ts";
import { useMatch } from "react-router-dom"
import {PageLoader} from "@/components/Loader.tsx";
import {MaintenanceCard} from "@/shared/ui/MaintenanceCard.tsx";


export const MaintenancePage = () => {
  const match = useMatch("/car/:id")
  const carId = match ? Number(match.params.id) : undefined
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
        // <div
        //   className='maintenance-item'
        //   key={items.id}
        // >
        //   <div className={"mini-container"}>
        //     <h3>{items.total_cost} ₽</h3>
        //     <button onClick={() => {}} className={"card-menu-button"}/>
        //   </div>
        //   {items.comment && <span className='comment'>{items.comment}</span>}
        //   <div className='mini-container'>
        //     <span className='mileage'>{items.mileage} км</span>
        //     <span className='date'>{formatDate(items.date)}</span>
        //   </div>
        // </div>
      )))}
    </div>
  )
}