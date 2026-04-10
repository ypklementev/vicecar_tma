import {useMatch, useNavigate} from "react-router-dom";
import {useAppContext} from "@/context/AppContext.tsx";
import {useEffect, useRef} from "react";
import gsap from "gsap";


export const ToplineName = () => {
  const { user, cars, car } = useAppContext()
  const isHome = useMatch("/")
  const isCarPage = useMatch("/car/:id")
  const navigate = useNavigate()
  const nameRef = useRef<HTMLInputElement>(null)

  const isLoading = user.isLoading || cars.isLoading

  const clickBack = () => {
    navigate('/')
  }

  useEffect(() => {
    if (!nameRef.current) return

    gsap.fromTo(
      nameRef.current,
      {
        opacity: 0,
        x: -15
      },
      {
        opacity: 1,
        x: 0,
        duration: 0.35,
        ease: "power2.out"
      }
    )
  }, [location.pathname])

  return (
    <div ref={nameRef}>
      <div className='name'>
        {isCarPage && (<span className="back" onClick={clickBack} />)}

        {isLoading ? (
          <div className='names skeleton-container'>
            {isHome ? <h1>Мои автомобили</h1> : <h1 className='skeleton'/>}
            <span className='skeleton'/>
          </div>
        ) : isHome && user.data && !user.error ? (
          <div className='names'>
            <h1>Мои автомобили</h1>
            <span>Привет, {user.data.first_name}</span>
          </div>
        ) : isCarPage && car && !cars.error ? (
          <div className='names'>
            <h1>{car.brand} {car.model}</h1>
            <span>{car.year}, {car.current_mileage} км</span>
          </div>
        ) : <p>Ошибка загрузки</p>}
      </div>
    </div>

  )
}