export default function EditFunFact() {
	return (
		<section id="edit">
			<div className="form">
				<h2>Edit Fact</h2>
				<form className="edit-form">
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
					<button type="submit">Post</button>
				</form>
			</div>
		</section>
	)
}