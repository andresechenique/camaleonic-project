import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

export default function Rating({ rating }: { rating: number }) {
	// rating is 0-10, we convert it to 0-5 scale with half-stars
	const stars = [];
	let tempRating = rating / 2;

	for (let i = 1; i <= 5; i++) {
		if (tempRating >= 1) {
			stars.push(<FaStar key={i} className="text-yellow-500" />);
		} else if (tempRating >= 0.5) {
			stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />);
		} else {
			stars.push(<FaRegStar key={i} className="text-yellow-500" />);
		}
		tempRating -= 1;
	}

	return <div className="flex space-x-1">{stars}</div>;
}
