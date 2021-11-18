import React from 'react';
import {
	Routes,
	Route,
	Navigate
} from "react-router-dom";

import Home from './pages/Home';
import Info from './pages/Info';
import Redirect from './pages/Redirect';

function App() {
	return (
		<React.Fragment>
			<Routes>
				<Route path="/" element={<Home/>} />
				<Route exact path="/:_id/" element={<Redirect/>} />
				<Route exact path="/:_id+/" element={<Info/>} />
				<Route path="*" element={<Navigate to="/" replace={true} />} />
			</Routes>
		</React.Fragment>
	);
}

export default App;
