import React, {useEffect} from "react";
import gsap from "gsap";


interface useInputGsapProps {
    error: string | undefined,
    errorRef: React.RefObject<HTMLSpanElement | null>,
}

export const useInputGsap = ({error, errorRef}: useInputGsapProps) => {

    useEffect(() => {
        if (!errorRef.current) return
        if (error) {
            gsap.fromTo(errorRef.current,
                { opacity: 0, y: -6 },
                { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" }
            )
        } else {
            gsap.to(errorRef.current, { opacity: 0, y: -6, duration: 0.2 })
        }
    }, [error])
}