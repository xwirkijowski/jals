import React from 'react';
import {
	Routes,
	Route,
	Navigate
} from "react-router-dom";

import Home from './pages/Home';
import Info from './pages/Info';
import Redirect from './pages/Redirect';

import Header from './components/Header';
import Footer from './components/Footer';
import Main from './components/Main';

function App() {
	return (
		<React.Fragment>
			<Header/>
			<Main>
				<Routes>
					<Route path="/" element={<Home/>} />
					<Route exact path="/:_id/" element={<Redirect/>} />
					<Route exact path="/:_id+/" element={<Info/>} />
					<Route path="*" element={<Navigate to="/" replace={true} />} />
				</Routes>
			</Main>
			<Footer/>
		</React.Fragment>
	)
}

export default App;
