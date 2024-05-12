import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as factServer from '../../servers/funFactServer.js';
import Path from "../../paths.js";

export default function RemoveFunFact() {
	const navigate = useNavigate();
	const { factId } = useParams();

	useEffect(() => {

		const removeFact = async () => {
			await factServer.remove(factId);
			navigate(Path.FunFacts);
		};


		removeFact();
	}, [factId]);


	return null;
}
