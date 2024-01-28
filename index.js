const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

function main() {}

main()
	.then(() => console.log('Main ran successfully!'))
	.catch((e) => console.log(e))
	.finally(async () => {
		await prisma.$disconnect();
	});
