const nameMap: Record<string, string> = {
	premier: 'Premier League',
	champions: 'UEFA Champions League',
	laliga: 'La Liga',
	seriea: 'Serie A',
	// add more mappings here
};
const NameMapper = ({ name }: { name: string }) => {
	return nameMap[name];
};

export default NameMapper;
