import {type ReactNode, useEffect, useRef} from "react"
import {useAlert} from "@/modules/alert/context/AlertsContext.tsx"
import gsap from "gsap"


export const Alert = ({ children }: { children: ReactNode }) => {
    const { closeAlert, alert } = useAlert()
    const overlayRef = useRef<HTMLDivElement>(null)
    const alertRef = useRef<HTMLDivElement>(null)

    const handleClose = () => {
        closeAlert()
    }

    useEffect(() => {
        if (alert.type) {
            gsap.to(overlayRef.current, {
                opacity: 1,
                duration: 0.35,
                pointerEvents: 'auto'
            })
            gsap.to(alertRef.current, {
                opacity: 1,
                duration: 0.35,
                pointerEvents: "auto",
            })
        } else {
            gsap.to(overlayRef.current, {
                opacity: 0,
                duration: 0.35,
                pointerEvents: "none"
            })
            gsap.to(alertRef.current, {
                opacity: 0,
                duration: 0.35,
                pointerEvents: "none",
            })
        }
    }, [alert.type])

    return (
        <>
            <div ref={overlayRef} className="overlay" onClick={handleClose} />
            <div className="alert" ref={alertRef}>
                {children}
            </div>
        </>
    )
}