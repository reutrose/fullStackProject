const normalizeUser = async (user) => {
	return {
		...user,
		image: {
			url: user.image.url || "https://i.ibb.co/B4rd7yx/default-Avatar.png",
			alt: user.image.alt || "Avatar",
		},
	};
};

module.exports = normalizeUser;
