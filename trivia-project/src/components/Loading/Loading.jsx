import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import loadingGif from "../../assets/loading.gif";
import "./Loading.css";

const Loading = () => {
  return (
    <div className="main">
        <Navbar />
        <div className="content d-flex justify-content-center align-items-center">
            <img className="loading-gif" src={loadingGif} alt="loading-gif" />
        </div>
        <Footer />
    </div>
  )
}

export default Loading