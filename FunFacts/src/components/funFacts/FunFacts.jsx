import {useNavigate} from "react-router-dom";
import * as funFactServer from '../../servers/funFactServer.js'
import ItemFunFacts from "./ItemFunFacts.jsx";
import {useEffect, useState} from "react";


export default function FunFacts() {
	const [facts, setFacts] = useState([]);

	useEffect(() => {
		funFactServer.getAll().then(result => setFacts(result));
	}, []);

	return (
		<>
			<h2>Fun Facts</h2>
			<section id="dashboard">
				{facts.map(fact => (
					<ItemFunFacts key={fact._id} {...fact}/>
				))}

			</section>

			{facts.length === 0 && <h2>No Fun Facts yet.</h2>}

		</>
	)
}