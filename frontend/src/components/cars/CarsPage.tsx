import {useAppContext} from "@/context/AppContext.tsx";
import {useNavigate} from "react-router-dom"


const LoadingCars = () => {
  return (
    <div className='page-content cars'>
      <div className='car-card skeleton'/>
      <div className='car-card skeleton'/>
      <div className='car-card skeleton'/>
    </div>
  )
}

export const CarsPage = () => {
  const { cars, setActiveCar, user } = useAppContext()
  const navigate = useNavigate()

  const carClick = (id: number) => {
    setActiveCar(id)
    navigate({
      pathname: `/car/${id}`,
      search: "?page=maintenance"
    })
  }

  if (cars.isLoading || user.isLoading) return <LoadingCars />
  if (cars.error) return <div className='error'>Ошибка при загрузке страницы</div>

  return (
    <div className='page-content cars'>
      {cars && cars.data?.map((car) => (
        <div key={car.id} className="car-card" onClick={() => carClick(car.id)}>
          <h3>{car.brand} {car.model}</h3>
          <span>{car.current_mileage} км</span>
        </div>
      ))}
    </div>
  )
}