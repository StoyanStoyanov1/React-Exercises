import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

import * as gameService from '../../services/gameService';
import * as commentService from '../../services/commentService.js'

export default function GameDetails() {
	const [game, setGame] = useState({});
	const {gameId} = useParams();

	useEffect(() => {
		gameService.getOne(gameId)
			.then(setGame);
	}, [gameId]);

	const [comments, setComments] = useState([]);

	useEffect( () => {
		commentService.getAll()
			.then(setComments)
	})

	console.log(game)
	const createCommentSubmitHandler = async (e) => {
		e.preventDefault();

		const commentData = Object.fromEntries(new FormData(e.currentTarget));

		const commentsDetails = {
			...commentData,
			gameTitle: game.title,
			gameId: game._id,
		}

		try {
			await commentService.create(commentsDetails);
		} catch (err) {
			console.log(err)
		}

	}

	const filterComments = () => comments.filter(comment => comment.gameId === game._id);

	return (
		<section id="game-details">
			<h1>Game Details</h1>
			<div className="info-section">

				<div className="game-header">
					<img className="game-img" src={game.imageUrl}/>
					<h1>Bright</h1>
					<span className="levels">MaxLevel: {game.maxLevel}</span>
					<p className="type">{game.category}</p>
				</div>

				<p className="text">
					{game.summary}
				</p>
				<div className="details-comments">
					<h2>Comments:</h2>
					{filterComments().map(comment => (<ul>
						<li className="comment">
							<p>{comment.username}: {comment.comment}</p>
						</li>

					</ul>))}

					{filterComments().length === 0 && (<p className="no-comment">No comments.</p>)}



				</div>

				{/*<div className="buttons">*/}
				{/*	<a href="#" className="button">Edit</a>*/}
				{/*	<a href="#" className="button">Delete</a>*/}
				{/*</div>*/}


				<article className="create-comment">
					<label>Add new comment:</label>
					<form className="form" onSubmit={createCommentSubmitHandler}>
						<input type="text" name='username' placeholder='Username'/>
						<textarea name="comment" placeholder="Comment......"></textarea>
						<input className="btn submit" type="submit" value="Add Comment"/>
					</form>
				</article>
			</div>
</section>
)
}