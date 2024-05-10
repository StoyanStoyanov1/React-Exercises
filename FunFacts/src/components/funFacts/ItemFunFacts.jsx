import {Link} from "react-router-dom";
import Path from "../../paths.js";

export default function ItemFunFacts({
										 _id,
										 category,
										 imageUrl,
										 description,
									 }) {
	return (
		<div className="fact">
			<img src={imageUrl} alt={category}/>
			<h3 className="category">History</h3>
			<p className="description">{description}</p>
			<Link className="details-btn" to={`${Path.DetailsFunFact}/${_id}`}>More Info</Link>
		</div>
	)
}