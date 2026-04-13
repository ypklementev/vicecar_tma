import {useEffect, useRef} from "react"
import gsap from "gsap"


interface SuccessProps {
    text?: string;
}


export const Success = ({ text }: SuccessProps) => {
    const spanRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        gsap.fromTo(
            spanRef.current,
            {
                scale: 0,
                rotate: '180'
            },
            {
                scale: 1,
                rotate: 0,
                duration: 0.1,
                ease: 'easeOut'
            }
        )
    })

    return (
        <span className="success">
            {text}
            <span ref={spanRef} className="success__icon" />
        </span>
    );
};