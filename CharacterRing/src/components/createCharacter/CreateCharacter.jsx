export default function CreateCharacter() {
	return (
		<section id="create">
			<div className="form">
				<img className="border" src="./images/border.png" alt=""/>
				<h2>Add Character</h2>
				<form className="create-form">
					<input
						type="text"
						name="category"
						id="category"
						placeholder="Character Type"
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
						rows="2"
						cols="10"
					></textarea>
					<textarea
						id="additional-info"
						name="additional-info"
						placeholder="Additional Info"
						rows="2"
						cols="10"
					></textarea>
					<button type="submit">Add Character</button>
				</form>
				<img className="border" src="./images/border.png" alt=""/>
			</div>
		</section>
	)
}