import Path from "../../paths.js";
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import * as characterService from '../../services/characterService.js';
import ItemCharacter from "./itemCharacter/ItemCharacter.jsx";


export default function Characters() {
	const [characters, setCharacters] = useState([]);

	useEffect(() => {
		characterService.getAll()
			.then(result => setCharacters(result))
	}, []);

	console.log(characters)
	return (

		<section id="characters">

			{characters.length === 0 && <h2>No added Heroes yet.</h2> || <h2>Characters</h2>}

			{characters.map(char => (
				<ItemCharacter key={char._id} {...char}/>
			))}


		</section>
	)
}