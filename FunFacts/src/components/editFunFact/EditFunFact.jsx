import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {edit, getOne} from "../../servers/funFactServer.js";
import * as factService from '../../servers/funFactServer.js'
import Path from "../../paths.js";

const edinFunFactKeys = {
	Category: 'category',
	ImageUrl: 'imageUrl',
	Description: 'description',
	AdditionalInfo: 'additionalInfo',
}

export default function EditFunFact() {
	const navigate = useNavigate();

	const {factId} = useParams();
	const [factValues, setFactValues] = useState({
		[edinFunFactKeys.Category]: '',
		[edinFunFactKeys.ImageUrl]: '',
		[edinFunFactKeys.Description]: '',
		[edinFunFactKeys.AdditionalInfo]: '',
	})

	const onChange = (e) => {
		setFactValues(state => ({
			...state,
			[e.target.name]: e.target.value,
		}));
	};

	const onSubmit = async (e) => {
		e.preventDefault();


		try {
			await factService.edit(factId, factValues);

			navigate(`${Path.DetailsFunFact}/${factId}`)
		} catch (err) {
			console.log(err)
		}
	}

	useEffect(() => {
		getOne(factId).then(result => setFactValues(result));
	}, [factId]);
	return (
		<section id="edit">
			<div className="form">
				<h2>Edit Fact</h2>
				<form className="edit-form" onSubmit={onSubmit}>
					<input
						type="text"
						name="category"
						id="category"
						placeholder="Category"
						value={factValues[edinFunFactKeys.Category]}
						onChange={onChange}
					/>
					<input
						type="text"
						name="imageUrl"
						id="image-url"
						placeholder="Image URL"
						value={factValues[edinFunFactKeys.ImageUrl]}
						onChange={onChange}
					/>
					<textarea
						id="description"
						name="description"
						placeholder="Description"
						rows="10"
						cols="50"
						value={factValues[edinFunFactKeys.Description]}
						onChange={onChange}
					></textarea>
					<textarea
						id="additional-info"
						name="additionalInfo"
						placeholder="Additional Info"
						rows="10"
						cols="50"
						value={factValues[edinFunFactKeys.AdditionalInfo]}
						onChange={onChange}
					></textarea>
					<button type="submit">Post</button>
				</form>
			</div>
		</section>
	)
}