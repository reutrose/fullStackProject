const addZero = (num) => (num < 10 ? `0${num}` : num);

const currentTime = () => {
	const now = new Date();
	let result = {
		year: now.getFullYear(),
		month: now.getMonth() + 1,
		day: now.getDate(),
		hours: now.getHours(),
		minutes: now.getMinutes(),
		seconds: now.getSeconds(),
	};

	for (let key in result) {
		result[key] = addZero(result[key]);
	}

	return result;
};

module.exports = { currentTime };
