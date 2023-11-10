import HomePage from "./pages/HomePage/HomePage";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import QuizList from "./pages/QuizList/QuizList";
import QuickPlay from "./pages/QuickPlay/QuickPlay";
import QuizCreator from "./pages/QuizCreator/QuizCreator";
import RandomGameCreator from "./pages/RandomGameCreator/RandomGameCreator";
import About from "./pages/About/About";
import Authentication from "./pages/Authentication/Authentication";
import { ProtectedRoute } from "./components/ProtectedRoute/ProtectedRoute";
import Forbidden from "./components/Forbidden/Forbidden";
import Profile from "./pages/Profile/Profile";
import Leaderboard from "./pages/Leaderboard/Leaderboard";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/quickplay" element={<QuickPlay />} />
        <Route path="/initrandomgame" element={<RandomGameCreator />} />
        <Route
          path="/quizlist/:type"
          element={
            <ProtectedRoute>
              <QuizList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz/create/:id"
          element={
            <ProtectedRoute>
              <QuizCreator />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz/edit/:id"
          element={
            <ProtectedRoute>
              <QuizCreator />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/about" element={<About />} />
        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <Leaderboard />
            </ProtectedRoute>
          }/>
        <Route path="authentication" element={<Authentication />} />
        <Route path="*" element={<Forbidden />} />
      </Routes>
    </>
  );
}

export default App;
