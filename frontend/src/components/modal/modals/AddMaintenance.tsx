// import { FormProvider } from "react-hook-form"
// import { useAddMaintenance } from "@/api/api.ts"
// import { useModal } from "@/context/ModalContext.tsx"
// import { useCarId } from "@/hooks/useCarId.tsx"
// import { Button, Input, Loader } from "@/shared/ui"
// import { Success } from "@/shared/ui/Success.tsx"
// import { SelectItems } from "@/components/modal/modals/components/SelectItems.tsx"
// import { useMaintenanceForm } from "./hooks/useMaintenanceForm.ts"
// import { buildMaintenancePayload } from "./utils/buildPayload.ts"
// import type { Maintenances } from "@/types/types.ts"
//
// export const AddMaintenance = () => {
//     const carId = useCarId()
//     const addMaintenance = useAddMaintenance(carId)
//     const { closeModal } = useModal()
//     const methods = useMaintenanceForm()
//
//     const { register, handleSubmit, setError, formState: { errors } } = methods
//
//     const onSubmit = (data: Maintenances) => {
//         if (data.items.length === 0) {
//             setError("items", { message: "Добавьте хотя бы одно поле" })
//             return
//         }
//         addMaintenance.mutate(buildMaintenancePayload(data), {
//             onSuccess: () => setTimeout(() => closeModal(), 500),
//         })
//     }
//
//     return (
//         <FormProvider {...methods}>
//             <form className="modal-content" onSubmit={handleSubmit(onSubmit)}>
//                 <h2>Добавить ТО</h2>
//
//                 <Input
//                     label="Комментарий"
//                     placeholder="..."
//                     type="text"
//                     {...register("comment")}
//                 />
//
//                 <Input
//                     label="Пробег*"
//                     placeholder="Введите пробег"
//                     type="text"
//                     error={errors.mileage?.message}
//                     {...register("mileage", {
//                         required: "Укажите пробег",
//                     })}
//                 />
//
//                 <SelectItems mode="maintenance" />
//
//                 <Button
//                     name="addMaintenance"
//                     label={
//                         addMaintenance.isPending ? <Loader /> :
//                             addMaintenance.isSuccess ? <Success /> :
//                                 "Добавить"
//                     }
//                     disabled={addMaintenance.isPending || addMaintenance.isSuccess}
//                     customClass={addMaintenance.isSuccess ? "btn-success" : ""}
//                     type="submit"
//                     style={{ marginTop: "1rem" }}
//                 />
//             </form>
//         </FormProvider>
//     )
// }