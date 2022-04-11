import './App.css';
import {Navigate, Route, Routes, useLocation, useNavigate} from "react-router-dom";
import Login from "./login-flow/login";
import Home from "./home";
import mapboxgl from '!mapbox-gl';// eslint-disable-line import/no-webpack-loader-syntax
import CreateUser from "./login-flow/createUser";
import Register from "./login-flow/register";
import SelectType from "./login-flow/selectType";
import CreateCustomer from "./login-flow/createCustomer";
import CreateRider from "./login-flow/createRider";

mapboxgl.accessToken = 'pk.eyJ1IjoicmVuc2IiLCJhIjoiY2s2a2xpNmg0MDU2dzNscnI5cjRnaG1uciJ9.GKmyEyKDRJCTuLe2elJ0Pw';

function App() {
    return (
      <div>
          <Routes>
            <Route exact path="/login" element={<Login/>}/>
              <Route exact path="/register" element={<Register/>}/>
              <Route exact path="/create-user" element={<CreateUser/>}/>
              <Route exact path="/select-type" element={<SelectType/>}/>
              <Route exact path="/create-customer" element={<CreateCustomer/>}/>
              <Route exact path="/create-rider" element={<CreateRider/>}/>
            <Route path="/" element={<Home/>}/>
          </Routes>
      </div>
  );
}

export default App;
