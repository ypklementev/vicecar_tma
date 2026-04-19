import { Button, Loader } from "@/shared/ui"
import { Success } from "@/shared/ui/Success.tsx"
import {useHandler} from "@/modules/alert/alerts/DeleteAlert/hooks/useHandler.ts";
import {useAlert} from "@/modules/alert/context/AlertsContext.tsx";


interface DeleteAlertProps {
    serviceId: number
}

export const DeleteAlert = ({ serviceId }: DeleteAlertProps) => {
    const { onSubmit, mutation } = useHandler(serviceId)
    const { animatedCloseRef } = useAlert()

    return (
        <div className="alert-content">
            <div className={"alert-info"}>
                <h2>Удалить запись?</h2>
                <span>Это действие нельзя отменить</span>
            </div>

            <div className="alert-actions">
                <Button
                    name={"cancel"}
                    label={"Отменить"}
                    customClass={"smaller btn-cancel"}
                    onClick={() => animatedCloseRef.current?.()}
                />
                <Button
                    name="deleteService"
                    label={
                        mutation.isPending ? <Loader /> :
                            mutation.isSuccess ? <Success /> :
                                "Удалить"
                    }
                    disabled={mutation.isPending || mutation.isSuccess}
                    customClass={mutation.isSuccess ? "btn-success smaller" : "btn-delete smaller"}
                    type="button"
                    onClick={onSubmit}
                />
            </div>
        </div>
    )
}