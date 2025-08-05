import { Route, Routes } from 'react-router';

import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import FlightDetailPage from "./pages/FlightDetailPage";
import Authentication from "./pages/authentication";
import Login from "./pages/login";
import Profile from "./pages/profile"
import Review from "./pages/Review"
// import { toast } from "react-hot-toast";

const App = () => {
  return (
    <div data-theme = "forest">
      <Routes>
        <Route path = "/" element = {<Authentication />} />
        <Route path = "/home" element = {<HomePage />} />
        <Route path = "/login" element = {<Login />} />
        <Route path = "/profile" element = {<Profile />} />
         <Route path = "/review" element = {<Review />} />
        <Route path = "/create" element = {<CreatePage />} />
        <Route path = "/flight-details" element = {<FlightDetailPage />} />

      </Routes>

    </div>
  )
}

export default App