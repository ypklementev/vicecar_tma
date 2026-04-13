import {useMatch} from "react-router-dom";

export function useCarId() {
    const match = useMatch("/car/:id")
    const carId = match ? Number(match.params.id) : undefined

    return carId ? carId : undefined
}