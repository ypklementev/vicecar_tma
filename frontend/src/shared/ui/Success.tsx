import {useEffect, useRef} from "react"
import gsap from "gsap"


interface SuccessProps {
    text?: string;
}


export const Success = ({ text }: SuccessProps) => {
    const spanIconRef = useRef<HTMLSpanElement>(null)

    useEffect(() => {
        gsap.fromTo(
            spanIconRef.current,
            {
                scale: 0,
                rotate: '-270'
            },
            {
                scale: 1,
                rotate: 0,
                duration: 0.15,
                ease: 'easeOut'
            }
        )
    })

    return (
        <span className="success">
            {text}
            <span ref={spanIconRef} className="success__icon" />
        </span>
    );
};