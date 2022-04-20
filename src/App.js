import './App.css';
import {Route, Routes} from "react-router-dom";
import Login from "./login-flow/login";
import Home from "./home";
import 'mapbox-gl/dist/mapbox-gl.css';
import CreateUser from "./login-flow/createUser";
import Register from "./login-flow/register";
import SelectType from "./login-flow/selectType";
import CreateCustomer from "./login-flow/createCustomer";
import CreateRider from "./login-flow/createRider";

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
