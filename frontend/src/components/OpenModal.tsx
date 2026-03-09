import { useAppContext } from "@/context/AppContext.tsx";


export const OpenModal = () => {
  const { setIsModalOpen } = useAppContext()

  return (
    <div className="open-modal" onClick={() => setIsModalOpen(true)}>+</div>
  )
}