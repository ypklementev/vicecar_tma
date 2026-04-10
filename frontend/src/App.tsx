import "@/styles/style.sass"
import "@/shared/style.sass"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import {Topline} from "@/components/topline/Topline.tsx"
import {CarsPage} from "@/components/cars/CarsPage.tsx"
import {initTelegram} from "@/api/telegram.ts"
import {CarInfoPage} from "@/components/cars/CarInfoPage.tsx";
import {OpenModal} from "@/components/OpenModal.tsx";
import {ModalsManager} from "@/components/modals/ModalsManager.tsx";


function App() {
  initTelegram()

  return (
    <BrowserRouter>
      <div className="app">
        <Topline />
        <ModalsManager />
        <OpenModal />
        <Routes>
          <Route path="/" element={<CarsPage />} />
          <Route path="/car/:id" element={<CarInfoPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
