import {useSearchParams} from "react-router-dom";


type CarPage = "maintenance" | "service"

export const useCarPage = () => {
  const [params, setParams] = useSearchParams()

  const page = (params.get("page") as CarPage) || "maintenance"

  const setPage = (value: CarPage) => {
    setParams({ page: value })
  }

  return {
    activePage: page,
    setActivePage: setPage
  }
}