// import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Login from './components/auth/Login'
import DisplayUser from './components/chat/DisplayUser'
import UserItem from './components/chat/UserItem';
import Chatbox from './components/chat/Chatbox'
import Register from "./components/auth/Register";
function App() {
  return (
    <div className="App">
     <BrowserRouter>
    <Routes>
    <Route path='/' element={<Login/>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/displayuser" element={<DisplayUser />} />
      <Route path="/useritem" element={<UserItem />} />
      <Route path="/chatbox/:id" element={<Chatbox />} />
    </Routes>
  </BrowserRouter>
  </div>
  );
}

export default App;
