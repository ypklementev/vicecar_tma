import {useEffect, useRef} from "react"
import gsap from "gsap";

export const Loader = () => {
    const loaderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        gsap.fromTo(
            loaderRef.current,
            {
                translateX: "-100%",
                opacity: 0,
            },
            {
                translateX: "0",
                opacity: 1,
                duration: 0.2,
                ease: "power2.easeInOut",
            }
        )
    }, [])

    return (
        <div className="loader-container mobile">
            <div ref={loaderRef} className={"loader mobile"}/>
        </div>
    )
}

export const PageLoader = () => {
    return (
        <div className={"loader-container page"}>
            <div className={"loader page"}/>
        </div>
    )
}