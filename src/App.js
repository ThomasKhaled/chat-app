import { useState, useRef, useEffect } from "react";
import Auth from "./components/Auth";
import Cookies from "universal-cookie";
import Chat from "./components/Chat";
import { signOut } from "firebase/auth";
import { auth, docs } from "./firebase-config";
import './App.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
const cookies = new Cookies();

function App() {
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));
  const [room, setRoom] = useState("");
  const [rooms, setRooms] = useState([]);

  const roomName = useRef();

  useEffect(() => {
    const rooms = [];
    const uniqueRooms = new Set();

    const getRooms = async () => {
      await docs.then((qs) => {
        qs.forEach((doc) => {
          const room = doc.data().room;
          rooms.push(room);
          uniqueRooms.add(room);
        });

        setRooms([...uniqueRooms]);
      });
    }
    getRooms();

  }, []);

  if (!isAuth) {
    return (
      <div className="App">
        <Auth setIsAuth={ setIsAuth } />
      </div>
    );
  }

  const enterChatHandler = () => {
    setRoom(roomName.current.value);
  };

  const signOutHandler = async () => {
    await signOut(auth);
    cookies.remove('auth-token');
    setIsAuth(false);
    setRoom('');
  };

  const availRoomsHandler = (event) => {
    setRoom(event.target.textContent);
  };


  return (
    <>
      { room ? (
        <Chat roomName={ room } />

      ) : (
        <div className="parent">
          <div className="container">
            { rooms.length > 0 && <h1>Available Rooms</h1> }
            { rooms.map((room, id) => (
              <p className="avail-rooms" onClick={ availRoomsHandler } key={ id }>{ room }</p>
            )) }
            <div className="room">
              <label className="room-label" htmlFor="roomName">Join (Create) Room: </label>
              <input id="roomName" type="text" ref={ roomName } />
              <button onClick={ enterChatHandler }>Enter Chat</button>
            </div>
            <div className="sign-out">
              <button onClick={ signOutHandler }> Sign Out </button>
            </div>
          </div>
        </div>
      ) }


    </>
  );
}

export default App;
