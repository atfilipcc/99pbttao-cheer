import React, { useContext } from 'react';
import { ContextUser } from './context/UserContext';
import Home from './landing/Home';
import Board from './Board';
import Loader from 'react-loader-spinner';

const App = ({ isLoading }) => {
	const { user } = useContext(ContextUser);
	const loggedInTemplate = () => <h2>Welcome, {user.firstName}!</h2>;
	return (
		<div>
			{user && user.firstName ? loggedInTemplate() && <Board /> : (
				<Home />
			)}
		</div>
	);
};

export default App;
