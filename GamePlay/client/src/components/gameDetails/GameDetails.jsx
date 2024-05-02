import {useContext, useEffect, useReducer, useState} from "react";
import {useParams} from "react-router-dom";

import * as gameService from '../../services/gameService';
import * as commentService from '../../services/commentService.js'
import authContext from "../../context/authContext.jsx";

const reducer = (state, action) => {
	switch (action?.type) {
		case "GET_ALL_GAMES":
			return [...action.payload];
		case "ADD_COMMENT":
			return [...state, action.payload];
		default:
			return state;
	}
};

export default function GameDetails() {
	const { email } = useContext(authContext);
	const [game, setGame] = useState({});
	const [comments, dispatch] = useReducer(reducer, []);
	const {gameId} = useParams();

	useEffect(() => {
		gameService.getOne(gameId)
			.then(setGame);
	}, [gameId]);

	// const [comments, setComments] = useState([]);

	useEffect(() => {

		commentService.getAll(gameId)
			.then((result) => {
				dispatch({
					type: "GET_ALL_GAMES",
					payload: result,
				})
			})
			.catch(err => console.error('Failed to fetch comments:', err));

	}, [gameId]);


	const createCommentSubmitHandler = async (e) => {
		e.preventDefault();

		const commentData = Object.fromEntries(new FormData(e.currentTarget));
		const commentsDetails = {
			...commentData,
			gameTitle: game.title,
			gameId: game._id,
			author: email,
		}

		try {
			const newComment = await commentService.create(commentsDetails);
			// setComments(prevComments => [...prevComments, newComment]);
			dispatch({
				type: 'ADD_COMMENT',
				payload: newComment,
			})
		} catch (err) {
			console.log(err);
		}
	}



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
					{comments.map(comment => (<ul key={comment._id}>
						<li className="comment">
							<p>{email}: {comment.comment}</p>
						</li>

					</ul>))}

					{comments.length === 0 && (<p className="no-comment">No comments.</p>)}



				</div>

				{/*<div className="buttons">*/}
				{/*	<a href="#" className="button">Edit</a>*/}
				{/*	<a href="#" className="button">Delete</a>*/}
				{/*</div>*/}


				<article className="create-comment">
					<label>Add new comment:</label>
					<form className="form" onSubmit={createCommentSubmitHandler}>
						<textarea name="comment" placeholder="Comment......"></textarea>
						<input className="btn submit" type="submit" value="Add Comment"/>
					</form>
				</article>
			</div>
		</section>
	)
}