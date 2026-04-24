import React, {lazy} from "react";
import {useAlert} from "@/modules/alert/context/AlertsContext.tsx";
import {Alert} from "@/modules/alert/ui/Alert.tsx";


const ALERT_CONTENT: Record<string, React.LazyExoticComponent<any>> = {
    deleteService: lazy(() => import('./DeleteAlert'))
}

export const AlertsContainer = () => {
    const { alert } = useAlert()
    const Content = alert.type? ALERT_CONTENT[alert.type] : null

    return (
        <Alert>
            {Content && <Content {...(alert.props ?? {})}/>}
        </Alert>
    )
}