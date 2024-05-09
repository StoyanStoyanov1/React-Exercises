import {Link, useParams} from "react-router-dom";
import Login from "../../login/Login.jsx";
import EditCharacter from "../../editCharacter/EditCharacter.jsx";
import Path from "../../../paths.js";
import {useEffect, useState} from "react";
import * as characterService from "../../../services/characterService.js"
export default function DetailsCharacter() {
	const {characterId} = useParams()

	const [character, setCharacter] = useState({});

	useEffect(() => {
		characterService.getOne(characterId)
			.then(setCharacter)
	}, [characterId]);

	console.log(character)
	return (
		<section id="details">
			<div id="details-wrapper">
				<img id="details-img" src={character.imageUrl} alt={character.category}/>
				<div>
					<p id="details-category">Hero</p>
					<div id="info-wrapper">
						<div id="details-description">
							<p id="description">
								{character.description}
							</p>
							<p id ="more-info">
								{character['additional-info']}
							</p>
						</div>
					</div>
					<h3>Is This Useful:<span id="likes">0</span></h3>

					<div id="action-buttons">
						<Link to={Path.EditCharacter} id="edit-btn">Edit</Link>
						<Link to="#" id="delete-btn">Delete</Link>


						<Link to="#" id="like-btn">Like</Link>

					</div>
				</div>
			</div>
		</section>
	);
}