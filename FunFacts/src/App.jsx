import {Routes, Route, RouterProvider} from 'react-router-dom'

import Path from "./paths.js";
import {AuthProvider} from './context/AuthContext.jsx'

import Header from "./components/header/Header.jsx";
import Home from "./components/home/Home.jsx";
import FunFacts from "./components/funFacts/FunFacts.jsx";
import Register from "./components/register/Register.jsx";
import Login from "./components/login/Login.jsx";
import CreateFunFact from "./components/createFunFact/CreateFunFact.jsx";
import DetailsFunFact from "./components/detailsFunFact/DetailsFunFact.jsx";
import Footer from "./components/footer/Footer.jsx";
import Logout from "./components/logout/Logout.jsx";
import EditFunFact from "./components/editFunFact/EditFunFact.jsx";
import RemoveFunFact from "./components/removeFunFact/RemoveFunFact.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import AuthGuard from "./components/guards/AuthGuard.jsx";

function App() {

	return (
		<ErrorBoundary>
			<AuthProvider>
				<div id="wrapper">
					<Header/>

					<Routes>
						<Route path={Path.Home} element={<Home/>}/>
						<Route path={Path.FunFacts} element={<FunFacts/>}/>
						<Route path={Path.Register} element={<Register/>}/>
						<Route path={Path.Login} element={<Login/>}/>
						<Route path={`${Path.DetailsFunFact}/:factId`} element={<DetailsFunFact/>}/>
						<Route element={<AuthGuard/>}>
							<Route path={Path.CreateFunFact} element={<CreateFunFact/>}/>
							<Route path={Path.Logout} element={<Logout/>}/>
							<Route path={`${Path.EditFunFact}/:factId`} element={<EditFunFact/>}/>
							<Route path={`${Path.RemovePath}/:factId`} element={<RemoveFunFact/>}/>
						</Route>
					</Routes>

					<Footer/>
				</div>
			</AuthProvider>
		</ErrorBoundary>
	);
}

export default App
