import {Link, useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {edit, getOne} from "../../servers/funFactServer.js";
import authContext from "../../context/AuthContext.jsx";

export default function DetailsFunFact() {

	const {factId, likes} = useParams();

	const {userId} = useContext(authContext)
	const [fact, setFact] = useState({});
	const [allLikes, setAllLikes] = useState([]);

	const [isLiked, setIsLiked] = useState(false)

	const clickLikeButton = async () => {
		const updatedLikes = isLiked ? allLikes.filter(like => like !== userId) : [...allLikes, userId];
		setAllLikes(updatedLikes);
		setIsLiked(!isLiked);
		const updatedFact = {...fact, likes: updatedLikes};
		try {
			await edit(factId, updatedFact);
		} catch (error) {
			console.error('Failed to update likes:', error);
		}
	};


	useEffect(() => {
		getOne(factId).then(result => {
			setFact(result);
			setAllLikes(result.likes)
			setIsLiked(result.likes.includes(userId));
		});

	}, [factId, isLiked]);
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

					<h3>Likes:<span id="likes">{allLikes.length}</span></h3>
					{userId === fact._ownerId && (<div id="action-buttons">

						<Link to="" id="edit-btn">Edit</Link>
						<Link to="" id="delete-btn">Delete</Link>


					</div>)}

					{userId && userId !== fact._ownerId && (
						<div id="action-buttons">
							<button onClick={clickLikeButton} id="like-btn">{isLiked ? 'Dislike': 'Like'}</button>
						</div>
					)}


				</div>
			</div>
		</section>
	)
}