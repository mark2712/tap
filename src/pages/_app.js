import "../styles/globalStyles.scss";
import "@/styles/tap.scss";

export default function App({ Component }) {
	return (
		<div className="mainContainer">
			<Component/>
		</div>
	);
}

