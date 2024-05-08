import {Link} from "react-router-dom";
import Login from "../../login/Login.jsx";
import EditCharacter from "../../editCharacter/EditCharacter.jsx";
import Path from "../../../paths.js";
export default function DetailsCharacter() {
	return (
		<section id="details">
			<div id="details-wrapper">
				<img id="details-img" src="./images/hero 1.png" alt="example1" />
				<div>
					<p id="details-category">Hero</p>
					<div id="info-wrapper">
						<div id="details-description">
							<p id="description">
								Choosing the Hero means you'll be focusing on
								all-out strength with this Elden Ring class. Serving as the opposite
								to the Warrior class, Hero players will use heavier weapons with slow
								attacks that deal massive damage.
							</p>
							<p id ="more-info">
								Elden Ring Heroes start off with good Vigor
								and Endurance, so more HP and Stamina,
								meaning they're at least a little tanky
								and agile too. You can boost these Attributes
								more in the early levels to make the Hero more
								balanced or can focus purely on Strength to up
								your damage as much as you can.
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