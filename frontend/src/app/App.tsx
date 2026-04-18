import "@/styles/style.sass"
import "@/shared/style.sass"
import {ModalProvider, useModal} from "@/modules/modal/context/ModalContext.tsx"
import {initTelegram} from "@/api/telegram.ts";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Topline} from "@/modules/topline/Topline.tsx";
import {CarsPage} from "@/modules/cars/CarsPage.tsx";
import {CarInfoPage} from "@/modules/cars/CarInfoPage.tsx";
import {ModalContainer} from "@/modules/modal/ModalContainer.tsx";


const AppModalButton = () => {
    const {buttonConfig, openModal} = useModal()
    if (!buttonConfig) return null

    return (
        <button
            className="open-modal"
            onClick={() => {
                openModal(buttonConfig.modalType, buttonConfig.modalProps)
            }}
        />
    )
}

function App() {
    initTelegram()

    return (
        <BrowserRouter>
            <div className="app">
                <ModalProvider>
                    <Topline/>
                    <AppModalButton/>
                    <Routes>
                        <Route path="/" element={<CarsPage/>}/>
                        <Route path="/car/:id" element={<CarInfoPage/>}/>
                    </Routes>
                    <ModalContainer/>
                    <AppModalButton/>
                </ModalProvider>
            </div>
        </BrowserRouter>
    )
}

export default App