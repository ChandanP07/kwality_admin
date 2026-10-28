
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const usersCount = await prisma.user.count();
    const citiesCount = await prisma.city.count();
    const clientsCount = await prisma.client.count();
    const printersCount = await prisma.printer.count();
    const complaintsCount = await prisma.complaint.count();
    const branchesCount = await prisma.branch.count();
    const clientGroupsCount = await prisma.clientGroup.count();
    const agreementsCount = await prisma.agreement.count();
    const cartridgesCount = await prisma.cartridge.count();
    const ordersCount = await prisma.order.count();
    const dispatchesCount = await prisma.dispatch.count();
    const billsCount = await prisma.bill.count();
    const paymentsCount = await prisma.payment.count();
    const pageCountingCount = await prisma.pageCounting.count();
    const replacementsCount = await prisma.replacement.count();
    const terminationsCount = await prisma.termination.count();

    console.log('--- Database Verification (All Modules) ---');
    console.log(`Users: ${usersCount}`);
    console.log(`Cities: ${citiesCount}`);
    console.log(`Clients: ${clientsCount}`);
    console.log(`Client Groups: ${clientGroupsCount}`);
    console.log(`Branches: ${branchesCount}`);
    console.log(`Printers: ${printersCount}`);
    console.log(`Agreements: ${agreementsCount}`);
    console.log(`Cartridges: ${cartridgesCount}`);
    console.log(`Orders: ${ordersCount}`);
    console.log(`Dispatches: ${dispatchesCount}`);
    console.log(`Bills: ${billsCount}`);
    console.log(`Payments: ${paymentsCount}`);
    console.log(`Complaints: ${complaintsCount}`);
    console.log(`Page Counts: ${pageCountingCount}`);
    console.log(`Replacements: ${replacementsCount}`);
    console.log(`Terminations: ${terminationsCount}`);
    console.log('-----------------------------------------');
}

main().catch(console.error).finally(() => prisma.$disconnect());
