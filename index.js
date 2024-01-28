const { PrismaClient } = require('@prisma/client');
const { PrismaClientKnownRequestError } = require('@prisma/client/runtime/library');
const { randomData } = require('./util');

const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] }).$extends({
	name: 'soft-delete',
	query: {
		$allModels: {
			async findMany({ args, query }) {
				args.where = { ...args, deleted: false };
				return query(args);
			},
			async findUniqueOrThrow({ args, query }) {
				args.where = { ...args, deleted: false };
			},
			async delete({ model, args }) {
				return prisma[model].update({
					...args,
					data: { deleted: true },
				});
			},
		},
	},
});

const main = {
	//POST one
	createDriver: async (data) => {
		return await prisma.driver.create({ data: randomData(['name', 'email']) });
	},
	// POST many
	createManyDrivers: async (length) => {
		let arr = [];
		for (let i = 0; i <= length; i++) {
			arr.push(randomData(['name', 'email']));
		}
		return await prisma.driver.createMany({
			data: arr,
			skipDuplicates: true,
		});
	},
	// GET one
	getDriver: async (id) => {
		return await prisma.driver.findUniqueOrThrow({ where: { id: id } });
	},
	// GET all
	getAllDrivers: async () => {
		return await prisma.driver.findMany();
	},
	// PATCH one
	updateDriver: async (id) => {
		return await prisma.driver.update({
			where: { id: id },
			data: randomData(['name']),
		});
	},
	//PATCH many
	updateManyDrivers: async (ids) => {
		return await prisma.driver.updateMany({
			where: { id: { in: ids } },
			data: randomData(['name']),
		});
	},
	//DELETE one
	deleteDriver: async (id) => {
		return await prisma.driver.delete({ where: { id: id } });
	},
	//UPSERT or FINDSERT [ Update ? update:create OR if update:"empty" then find ? find:create ]
	upsertDriver: async (name) => {
		return await prisma.driver.upsert({
			where: { name: name },
			update: randomData(['email']), //OR update:''
			create: randomData(['name', 'email']),
		});
	},
};
/*
                          ------------Driver-------------
    createDriver();
    createManyDrivers(length)
    getAllDrivers()
    getDriver(id)
    updateDriver(id)
    updateManyDrivers(Array[ids])
    deleteDriver(id)
    upsertDriver(name)
                           ------------Cars---------------
                           They are all same bro, except it has driver_id.
                           plus, relations in ORM's are more dependent on schema.

     Transaction:
     var postsCreated = await prisma.$transaction(posts)


     soft-delete:
     We can use prisma extensions or create our own


    */

main.getAllDrivers()
	.then((data) => {
		console.log('Ran successfully!');
		console.log(data);
	})
	.catch((e) => {
		if (e instanceof PrismaClientKnownRequestError) {
			console.log({
				code: e.code,
				message: e.message,
			});
		} else if (e instanceof PrismaClientValidationError) {
			console.log({
				code: 400,
				message: e.message,
			});
		} else {
			console.error(e);
			process.exit(1);
		}
	})
	.finally(async () => {
		await prisma.$disconnect();
		process.exit(1);
	});
