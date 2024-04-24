import {useState, useEffect} from "react";

import * as gameServer from '../../services/gameService.js';
import GameListItem from "./gameListItem/GameListItem.jsx";

export default function GameList() {
	const [games, setGames] = useState([]);

	useEffect(() => {
		gameServer.getAll()
			.then(result => setGames(result))
	}, []);

	return (
		<section id="catalog-page">
			<h1>All Games</h1>

			{games.map(game => (
				<GameListItem key={game._id} {...game}/>
			))}

			{games.length === 0 && <h3 className="no-articles">No articles yet</h3>}

		</section>
	)

}