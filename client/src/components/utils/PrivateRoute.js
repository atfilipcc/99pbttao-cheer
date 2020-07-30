import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { ContextUser } from '../context/UserContext';
import Cookies from 'js-cookie';

const PrivateRoute = ({ children }) => {
  const { user } = useContext(ContextUser);
  const userCookie = Cookies.get('loggedInUser');
  return (
  <>
      { (user.firstName || userCookie) ? children : <Redirect to={'/'} /> }
  </>
)}

export default PrivateRoute;
