import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {getOne} from "../../servers/funFactServer.js";

export default function DetailsFunFact() {
	const {factId} = useParams();

	const [fact, setFact] = useState({});

	useEffect(() => {
		getOne(factId).then(result => setFact(result));
	}, []);

	return (
		<section id="details">
			<div id="details-wrapper">
				<img id="details-img" src={fact.imageUrl} alt="example1"/>
				<p id="details-category">History</p>
				<div id="info-wrapper">
					<div id="details-description">
						<p id="description">
							{fact.description}
						</p>
						<p id="more-info">
							{fact.additionalInfo}
						</p>
					</div>

					<h3>Likes:<span id="likes">0</span></h3>

					<div id="action-buttons">
						<a href="" id="edit-btn">Edit</a>
						<a href="" id="delete-btn">Delete</a>

						<a href="" id="like-btn">Like</a>

					</div>
				</div>
			</div>
		</section>
	)
}