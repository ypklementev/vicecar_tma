import {type ReactNode, useEffect, useRef} from 'react';
import { useAppContext } from '@/context/AppContext.tsx';
import gsap from 'gsap';


interface AddCarModalProps {
  children: ReactNode;
}

export const Modal = ({children}: AddCarModalProps) => {
  const { isModalOpen, setIsModalOpen } = useAppContext();
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isModalOpen) {
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.2, pointerEvents: 'auto' });
      gsap.to(modalRef.current, { y: 0, duration: 0.2, ease: 'power1.out' });
    } else {
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.2, pointerEvents: 'none' });
      gsap.to(modalRef.current, { y: '100vh', duration: 0.2, ease: 'power1.in' });
    }
  }, [isModalOpen]);

  return (
    <>
      <div
        ref={overlayRef}
        className="overlay"
        onClick={() => setIsModalOpen(false)}
      />
      <div className="modal" ref={modalRef}>
        <div className="modal-content">
          {children}
        </div>
      </div>
    </>
  );
};