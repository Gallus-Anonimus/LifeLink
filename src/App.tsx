import { Routes, Route } from "react-router-dom";
import NavBar from "./componets/NavBar/NavBar.tsx";
import 'bootstrap/dist/css/bootstrap.css';
import MedicalCard from "./componets/MedicalCard/MedicalCard.tsx";
import {Login} from "./componets/Login/Login.tsx";
import {Dashboard} from "./componets/Dashboard/Dashboard.tsx";
import Register from "./componets/Register/Register.tsx";


function App() {

  return (
    <>
        <div className="row" >
            <div className="col">
                <NavBar/>
                <Routes>
                    <Route path="login" element={<Login />} />
                    <Route path="/" element={<Login />} />
                    <Route path="/card/:NFC" element={<MedicalCard />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
            </div>
        </div>
    </>
  )
}

export default App


