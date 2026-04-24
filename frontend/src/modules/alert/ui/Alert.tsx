import {type ReactNode, useCallback, useEffect, useRef} from "react"
import {useAlert} from "@/modules/alert/context/AlertsContext.tsx"
import gsap from "gsap"


export const Alert = ({ children }: { children: ReactNode }) => {
    const { alert, animatedCloseRef, closeAlert } = useAlert()
    const overlayRef = useRef<HTMLDivElement>(null)
    const alertRef = useRef<HTMLDivElement>(null)

    const handleClose = useCallback(async () => {
        gsap.to(overlayRef.current, { opacity: 0, duration: 0.2, pointerEvents: "none" })
        await gsap.to(alertRef.current, { opacity: 0, duration: 0.2, pointerEvents: "none" })
        closeAlert()
    }, [closeAlert])

    useEffect(() => {
        animatedCloseRef.current = handleClose
    }, [handleClose])

    useEffect(() => {
        if (alert.type) {
            gsap.to(overlayRef.current, {
                opacity: 1,
                duration: 0.2,
                pointerEvents: 'auto'
            })
            gsap.to(alertRef.current, {
                opacity: 1,
                duration: 0.2,
                pointerEvents: "auto",
            })
        } else {
            gsap.to(overlayRef.current, {
                opacity: 0,
                duration: 0.2,
                pointerEvents: "none"
            })
            gsap.to(alertRef.current, {
                opacity: 0,
                duration: 0.2,
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