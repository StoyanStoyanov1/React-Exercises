import Header from "./components/header/Header.jsx";
import {Route, Routes} from "react-router-dom";
import Path from "./paths.js";
import Home from "./components/home/Home.jsx";
import Characters from "./components/characters/Characters.jsx";
import Register from "./components/register/Register.jsx";
import Login from "./components/login/Login.jsx";
import CreateCharacter from "./components/createCharacter/CreateCharacter.jsx";
import EditCharacter from "./components/editCharacter/EditCharacter.jsx";
import DetailsCharacter from "./components/characters/detailsCharacter/DetailsCharacter.jsx";
import Footer from "./components/footer/Footer.jsx";
import {AuthProvider} from "./context/AuthContext.jsx";
import Logout from "./components/logout/Logout.jsx";


function App() {

	return (
		<AuthProvider>

		<div id='wrapper'>
			<Header/>

				<Routes>
					<Route path={Path.Home} element={<Home/>}/>
					<Route path={Path.Characters} element={<Characters/>}/>
					<Route path={Path.Register} element={<Register/>}/>
					<Route path={Path.Login} element={<Login/>}/>
					<Route path={Path.CreateCharacter} element={<CreateCharacter/>}/>
					<Route path={Path.EditCharacter} element={<EditCharacter />}/>
					<Route path={Path.DetailsCharacter} element={<DetailsCharacter/>}/>
					<Route path={Path.Logout} element={<Logout/>}/>
				</Routes>

			<Footer/>

		</div>
		</AuthProvider>
	)
}

export default App
