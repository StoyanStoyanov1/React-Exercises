import {Link, useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {getOne} from "../../servers/funFactServer.js";
import authContext from "../../context/AuthContext.jsx";

export default function DetailsFunFact() {
	const {factId} = useParams();

	const {userId} = useContext(authContext)
	const [fact, setFact] = useState({});
	const [likeCount, setLikeCount] = useState(0);
	const [isLiked, setIsLiked] = useState(false);

	const clickLikeButton = () => {

		if (!isLiked) {
			setLikeCount(likeCount + 1);
			setIsLiked(true);
		} else {
			setLikeCount(likeCount - 1);
			setIsLiked(false);
		}

	}

	useEffect(() => {
		getOne(factId).then(result => {
			setFact(result);
			setLikeCount(result.likes || 0)
		});
	}, [factId]);

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

					<h3>Likes:<span id="likes">{likeCount}</span></h3>
					{userId === fact._ownerId && (<div id="action-buttons">

						<Link to="" id="edit-btn">Edit</Link>
						<Link to="" id="delete-btn">Delete</Link>


					</div>)}

					{userId !== fact._ownerId && (
						<div id="action-buttons">
							<button onClick={clickLikeButton} id="like-btn">{isLiked ? 'Dislike': 'Like'}</button>
						</div>
					)}


				</div>
			</div>
		</section>
	)
}