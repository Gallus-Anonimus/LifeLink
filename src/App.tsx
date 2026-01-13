import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import NavBar from "./componets/NavBar/NavBar.tsx";
import 'bootstrap/dist/css/bootstrap.css';
import MedicalCard from "./componets/MedicalCard/MedicalCard.tsx";
import ChildrenMode from "./componets/MedicalCard/ChildrenMode/ChildrenMode.tsx";
import {Login} from "./componets/Login/Login.tsx";
import {Dashboard} from "./componets/Dashboard/Dashboard.tsx";
import Register from "./componets/Register/Register.tsx";
import {AboutUs} from "./componets/AboutUs/AboutUs.tsx";
import {MedicationTracker} from "./componets/MedicationTracker/MedicationTracker.tsx";


function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const storedPath = sessionStorage.getItem("lifelink-redirect-path");
    if (storedPath) {
      sessionStorage.removeItem("lifelink-redirect-path");
      try {
        const decodedPath = decodeURIComponent(storedPath);
        navigate(decodedPath.startsWith("/") ? decodedPath : `/${decodedPath}`, {
          replace: true,
        });
      } catch (err) {
        navigate("/", { replace: true });
      }
    }
  }, [navigate]);

  return (
    <>
        <div className="row" >
            <div className="col">
                <NavBar/>
                <Routes>
                    <Route path="login" element={<Login />} />
                    <Route path="/" element={<Login />} />
                    <Route path="/card" element={<MedicalCard />} />
                    <Route path="/card/:NFC" element={<MedicalCard />} />
                    <Route path="/card/children" element={<ChildrenMode />} />
                    <Route path="/card/:NFC/children" element={<ChildrenMode />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/about-us" element={<AboutUs />} />
                    <Route path="/medication-tracker" element={<MedicationTracker />} />
                </Routes>
            </div>
        </div>
    </>
  )
}

export default App


