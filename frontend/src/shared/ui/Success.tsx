import {useEffect, useRef} from "react"
import gsap from "gsap"


interface SuccessProps {
    text?: string;
}


export const Success = ({ text }: SuccessProps) => {
    const spanIconRef = useRef<HTMLSpanElement>(null)
    const spanTextRef = useRef<HTMLSpanElement>(null)

    useEffect(() => {
        gsap.fromTo(
            spanIconRef.current,
            {
                scale: 0,
                rotate: '270'
            },
            {
                scale: 1,
                rotate: 0,
                duration: 0.15,
                ease: 'easeOut'
            }
        )

        gsap.fromTo(
            spanTextRef.current,
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
    })

    return (
        <span className="success" ref={spanTextRef}>
            {text}
            <span ref={spanIconRef} className="success__icon" />
        </span>
    );
};