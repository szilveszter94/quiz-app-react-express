/* eslint-disable react/no-unescaped-entities */
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";
import "./Leaderboard.css";
import { getAllUsersDocuments } from "../../utils/firebase/firebase.utils";
import { useEffect, useState } from "react";
import Loading from "../../components/Loading/Loading";

const Leaderboard = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [usersInfo, setUsersInfo] = useState([])

    useEffect(() => {
        const loadUsers = async () => {
            const response = await getAllUsersDocuments()
            if (response.ok) {
                setUsersInfo(response.data)
            } else {
                alert(response.message)
            }
            setIsLoading(false)
        }
        loadUsers()
    }, [])


    if (isLoading) {
        return <Loading />
    }

    return (
        <div className="main">
            <Navbar />
            <div className="container my-5 content">
                <h1 className="about-title mb-4 text-center">Leaderboard</h1>
                <div className="container text-center w-75 lead mb-5">
                    <p>
                        Introducing the epic battleground where champions are born and legends are made our game leaderboard! Step into a world where skill,
                        strategy, and determination collide, as players from across the globe vie for supremacy.
                    </p>
                </div>
                <hr />
                <div className="container mb-3">
                    <table className="table table-dark text-center point-system-container">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Username</th>
                                <th scope="col">Points</th>
                            </tr>
                        </thead>
                        <tbody>{usersInfo.map((user, index) => <tr key={user.displayName}>
                            <th scope="row">{index + 1}</th>
                            <td>
                                <span>{user.displayName}</span>
                            </td>
                            <td>
                                <span> {user.points} </span>
                            </td>
                        </tr>)}
                        </tbody>
                    </table>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Leaderboard;
