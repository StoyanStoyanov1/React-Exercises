import Path from "../../paths.js";
import {Link} from "react-router-dom";

export default function Characters() {
	return (

		<section id="characters">
			<h2>Characters</h2>
			<div className="character">
				<img src="./images/hero 1.png" alt="example1"/>
				<div className="hero-info">
					<h3 className="category">Hero</h3>
					<p className="description">Choosing the Hero means you'll be focusing on
						all-out strength with this Elden Ring class. Serving as the opposite
						to the Warrior class, Hero players will use heavier weapons with slow
						attacks that deal massive damage.</p>
					<Link className="details-btn" to={Path.DetailsCharacter}>More Info</Link>
				</div>

			</div>
			<div className="character">
				<img src="./images/hero 2.png" alt="example2"/>
				<div className="hero-info">
					<h3 className="category">Astrologer</h3>
					<p className="description">The Elden Ring Astrologer class is one of the few options
						built for magic from the start, with an impressive 15 Mind and 16 Intelligence
						stats.Astrologers will be able to cast many powerful Sorcery spells for single and
						multiple targets.
					</p>
					<Link className="details-btn" to={'#'}>More Info</Link>
				</div>

			</div>
			<div className="character">
				<img src="./images/hero 3.png" alt="example3"/>
				<div className="hero-info">
					<h3 className="category">Bandit</h3>
					<p className="description">The Bandit class is Elden Ring's
						stealth assassin. With a dagger and a small shield,
						Bandit players need to avoid direct conflict with
						groups of enemies and should instead focus on critical
						hits with backstabs or sniping with the starting Short Bow.</p>
					<a className="details-btn" href="#">More Info</a>
				</div>

			</div>
			<h2>No added Heroes yet.</h2>
		</section>
	)
}