import React, {
  useMemo,
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
} from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Room from './Room';
import Navbar from './Navbar';
import { ContextUser } from './context/UserContext';
import Cookies from 'js-cookie';
import axios from 'axios';
import App from './App';
import About from './About';
import Board from './Board';
import io from 'socket.io-client';
import PrivateRoute from './utils/PrivateRoute';
import AppFooter from './landing/modules/views/AppFooter';
import "regenerator-runtime/runtime.js";

const AppRouter = () => {
  const loggedOutState = {
    googleId: 0,
    displayName: '',
    firstName: '',
    lastName: '',
    image: '',
    createdAt: 0,
    sessionId: 0,
    hospitalInfo: {},
  };
  const [user, setUser] = useState(loggedOutState);
  const [isLoading, setLoading] = useState(false);
  const [userId, setUserId] = useState(0);
  const value = useMemo(() => ({ user, setUser }), [user, setUser]);
  const socket = useRef();

  useLayoutEffect(() => {
    const userCookie = Cookies.get('loggedInUser');
    if (userCookie && !user.firstName) {
      setLoading(true);
      axios
        .get(`/api/user/${userCookie}`)
        .then(res => setUser(res.data))
        .then(setLoading(false))
        .catch(err => console.log(err));
    }
  }, []);

  useEffect(() => {
    socket.current = io.connect('/');
    socket.current.on('yourId', id => {
      setUserId(id);
    });
  }, []);

  const handleLogOut = async () => {
    await fetch('/auth/logout').then(setUser(loggedOutState));
    Cookies.remove('loggedInUser');
  };

  return (
    <ContextUser.Provider value={value}>
      <div className="App">
        <BrowserRouter>
          <div>
            <Navbar
              handleLogOut={handleLogOut}
              socket={socket.current}
              socketId={userId}
            />
            <Switch>
              <Route path="/" exact>
                <App isLoading={isLoading} />
              </Route>
              <Route path="/about" exact component={About} />
              <PrivateRoute>
                <Route path="/rooms/" exact>
                  <Board socket={socket.current} isLoading={isLoading} />
                </Route>
                <Route path="/rooms/:id">
                  <Room socket={socket.current} socketId={userId} />
                </Route>
              </PrivateRoute>
            </Switch>
          </div>
        </BrowserRouter>
        <AppFooter />
      </div>
    </ContextUser.Provider>
  );
};

export default AppRouter;
