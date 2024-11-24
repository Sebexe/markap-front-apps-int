import { useEffect } from 'react';
import Navbar from "../Components/Navbar.jsx";
import AboutMe from "../Components/Me/AboutMe.jsx";
import LikedProducts from "../Components/Me/LikedProducts.jsx";
import HistoryProducts from "../Components/Me/HistoryProducts.jsx";
import {useNavigate} from "react-router-dom";

const Me = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("authToken")

    useEffect(() => {
        document.title = "Markap - Mi Perfil";
        if (!token) {
            navigate("/login");
        }
    }, []);


    return (
        <div>
            <Navbar/>
            <div
                 style={{
                     padding: "2vh",
                     display: "flex",
                     justifyContent: "start",
                     flexDirection: "row",
                 }}>
                <div>
                    <AboutMe/>
                </div>
                <div
                    style={
                        {
                            flexGrow: "1",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "start",
                            marginLeft: "5vh",
                            gap: "1.2vh"
                        }}>
                    <LikedProducts/>
                    <HistoryProducts/>
                </div>
            </div>
        </div>);};

export default Me;
