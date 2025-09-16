'use client';

import { useState } from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

interface StarRatingProps {
	initialValue?: number; // valor inicial (0-10)
	onChange?: (value: number) => void; // callback al cambiar
}

export default function StarRating({
	initialValue = 5,
	onChange,
}: StarRatingProps) {
	const [rating, setRating] = useState(initialValue); // 0-10 en incrementos de 0.5

	const handleClick = (value: number) => {
		setRating(value);
		onChange?.(value);
	};

	return (
		<div className="flex items-center space-x-1">
			{[...Array(5)].map((_, i) => {
				const starValue = (i + 1) * 2;
				if (rating >= starValue) {
					return (
						<FaStar
							key={i}
							onClick={() => handleClick(starValue)}
							className="text-yellow-400 cursor-pointer w-6 h-6"
						/>
					);
				} else if (rating >= starValue - 1) {
					return (
						<FaStarHalfAlt
							key={i}
							onClick={() => handleClick(starValue - 1)}
							className="text-yellow-400 cursor-pointer w-6 h-6"
						/>
					);
				} else {
					return (
						<FaRegStar
							key={i}
							onClick={() => handleClick(starValue)}
							className="text-yellow-400 cursor-pointer w-6 h-6"
						/>
					);
				}
			})}
			<input type="hidden" name="rating" value={rating} />
		</div>
	);
}
