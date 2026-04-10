import "@/styles/style.sass"
import "@/shared/style.sass"
import { ModalProvider, useModal } from "@/context/ModalContext"
import {initTelegram} from "@/api/telegram.ts";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Topline} from "@/components/topline/Topline.tsx";
import {CarsPage} from "@/components/cars/CarsPage.tsx";
import {CarInfoPage} from "@/components/cars/CarInfoPage.tsx";
import {ModalContainer} from "@/components/modal/ModalContainer.tsx";

const AppModalButton = () => {
  const { buttonConfig, openModal } = useModal()
  if (!buttonConfig) return null

  return (
      <button
          className="open-modal"
          onClick={() => openModal(buttonConfig.modalType, buttonConfig.modalProps)}
      />
  )
}

function App() {
  initTelegram()

  return (
      <BrowserRouter>
        <div className="app">
          <ModalProvider>
            <Topline />
            <AppModalButton />
            <Routes>
              <Route path="/" element={<CarsPage />} />
              <Route path="/car/:id" element={<CarInfoPage />} />
            </Routes>
            <ModalContainer />
            <AppModalButton />
          </ModalProvider>
        </div>
      </BrowserRouter>
  )
}

export default App