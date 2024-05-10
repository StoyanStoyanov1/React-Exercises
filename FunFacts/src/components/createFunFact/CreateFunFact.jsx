import {useNavigate} from "react-router-dom";
import * as funFactServer from '../../servers/funFactServer.js'
import Path from "../../paths.js";


export default function CreateFunFact() {
	const navigation = useNavigate();

	const createSubmitHandler = async (e) => {
		e.preventDefault();

		const data = Object.fromEntries(new FormData(e.currentTarget));

		try {
			await funFactServer.create(data);

			navigation(Path.FunFacts)
		} catch (err) {
			console.log(`Failed to create a new FunFact: ${err}`);
		}
	}

	return (
		<section id="create">
			<div className="form">
				<h2>Add Fact</h2>
				<form className="create-form" onSubmit={createSubmitHandler}>
					<input
						type="text"
						name="category"
						id="category"
						placeholder="Category"
					/>
					<input
						type="text"
						name="image-url"
						id="image-url"
						placeholder="Image URL"
					/>
					<textarea
						id="description"
						name="description"
						placeholder="Description"
						rows="10"
						cols="50"
					></textarea>
					<textarea
						id="additional-info"
						name="additional-info"
						placeholder="Additional Info"
						rows="10"
						cols="50"
					></textarea>
					<button type="submit">Add Fact</button>
				</form>
			</div>
		</section>
	)
}