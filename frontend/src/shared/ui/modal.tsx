// import {type ReactNode, useEffect, useRef} from 'react'
// import { useAppContext } from '@/context/AppContext.tsx'
// import gsap from 'gsap'
//
//
// interface AddCarModalProps {
//   children: ReactNode
// }
//
// export const Modal = ({children}: AddCarModalProps) => {
//   const {modal, setModal} = useAppContext()
//   const overlayRef = useRef<HTMLDivElement>(null)
//   const modalRef = useRef<HTMLDivElement>(null)
//
//   useEffect(() => {
//     if (modal.type) {
//       gsap.to(overlayRef.current, {opacity: 1, duration: 0.2, pointerEvents: 'auto'})
//       gsap.to(modalRef.current, {y: 0, duration: 0.2, ease: 'power1.out'})
//     } else {
//       gsap.to(overlayRef.current, {opacity: 0, duration: 0.2, pointerEvents: 'none'})
//       gsap.to(modalRef.current, {y: '100vh', duration: 0.2, ease: 'power1.in'})
//     }
//   }, [modal.type])
//
//   const closeModal = async () => {
//     gsap.to(overlayRef.current, {opacity: 0, duration: 0.2, pointerEvents: 'none'})
//     await gsap.to(modalRef.current, {y: '100vh', duration: 0.2, ease: 'power1.in'})
//     setModal((prev) => ({...prev, type: null}))
//   }
//
//   return (
//     <>
//       <div
//         ref={overlayRef}
//         className="overlay"
//         onClick={closeModal}
//       />
//       <div className="modal" ref={modalRef}>
//         <div className="modal-content">
//           {children}
//         </div>
//       </div>
//     </>
//   )
// }