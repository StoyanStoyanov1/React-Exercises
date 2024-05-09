import {Link} from "react-router-dom";
import Path from "../../../paths.js";

export default function ItemCharacter({
										  _id,
										  category,
										  description,
										  imageUrl,
									  }) {
	return (
		<div className="character">
			<img src={imageUrl} alt={category}/>
			<div className="hero-info">
				<h3 className="category">{category}</h3>
				<p className="description">{description}</p>
				<Link className="details-btn" to={`${Path.DetailsCharacter}/${_id}`}>More info</Link>
			</div>

		</div>
	)
}