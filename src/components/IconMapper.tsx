import React from 'react';

interface IconMapperProps {
	name: string;
	size?: number;
}

const iconMap: Record<string, string> = {
	premier: '/premier.png',
	champions: '/champions.jpeg',
	laliga: '/laliga.svg',
	seriea: '/seriea.png',
};

const IconMapper: React.FC<IconMapperProps> = ({ name, size = 5 }) => {
	const iconSrc = iconMap[name];

	if (!iconSrc) {
		return null;
	}

	return <img src={iconSrc} alt={name} className={`h-${size}`} />;
};

export default IconMapper;
