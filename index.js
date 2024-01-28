const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

main = {
	//Create Driver
	createDriver: async () => {
		try {
			return await prisma.driver.create({
				data: {
					email: 'something01@gmai.com',
					name: 'radiohead',
				},
			});
		} catch (e) {
			console.error(e);
			throw Error(e);
		}
	},

	// Get driver
	getDriver: async (id) => {
		try {
			return await prisma.driver.findUniqueOrThrow({ where: { id: id } });
		} catch (e) {
			if (e.code === 'P2025') {
				console.log('Driver not found');
			} else {
				console.error(e);
				throw Error(e);
			}
		}
	},
};
main.createDriver()
	.then((data) => {
		console.log('Ran successfully!');
		console.log(data);
	})
	.catch((e) => {
		console.error(e);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
