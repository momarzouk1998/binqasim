import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Bin Qasim ERP database...');

  // 1. Branches
  const egyBranch = await prisma.branch.upsert({
    where: { code: 'EGY' },
    update: {},
    create: {
      name: 'فرع مصر الرئيسي (القاهرة)',
      code: 'EGY',
      country: 'Egypt',
      currency: 'EGP',
    },
  });

  const omnBranch = await prisma.branch.upsert({
    where: { code: 'OMN' },
    update: {},
    create: {
      name: 'فرع سلطنة عمان (مسقط)',
      code: 'OMN',
      country: 'Oman',
      currency: 'OMR',
    },
  });

  // 2. Currencies
  await prisma.currencyRate.upsert({
    where: { code: 'USD' },
    update: { rateToUSD: 1.0 },
    create: { code: 'USD', rateToUSD: 1.0 },
  });
  await prisma.currencyRate.upsert({
    where: { code: 'EGP' },
    update: { rateToUSD: 48.5 },
    create: { code: 'EGP', rateToUSD: 48.5 },
  });
  await prisma.currencyRate.upsert({
    where: { code: 'OMR' },
    update: { rateToUSD: 0.385 },
    create: { code: 'OMR', rateToUSD: 0.385 },
  });

  // 3. Items
  const coal = await prisma.item.upsert({
    where: { id: 'item-fahm-01' },
    update: {},
    create: {
      id: 'item-fahm-01',
      nameAr: 'فحم فحم طبيعي للشيشة والشواء (درجة أولى)',
      nameEn: 'Premium Charcoal',
      category: 'فحم',
      unit: 'TON',
      weightPerUnitKg: 1000,
      volumePerUnitM3: 1.8,
      basePriceUSD: 450,
      priceEGP: 26500,
      priceOMR: 195,
      stockQuantity: 120,
    },
  });

  const onion = await prisma.item.upsert({
    where: { id: 'item-basal-01' },
    update: {},
    create: {
      id: 'item-basal-01',
      nameAr: 'بصل أحمر درجة أولى للتصدير',
      nameEn: 'Red Onions Export Grade',
      category: 'خضروات مصدّرة',
      unit: 'TON',
      weightPerUnitKg: 1000,
      volumePerUnitM3: 1.4,
      basePriceUSD: 380,
      priceEGP: 22000,
      priceOMR: 160,
      stockQuantity: 85,
    },
  });

  const spices = await prisma.item.upsert({
    where: { id: 'item-tawabel-01' },
    update: {},
    create: {
      id: 'item-tawabel-01',
      nameAr: 'توابل وفلفل أسود فاخر (فيتنامي)',
      nameEn: 'Vietnamese Black Pepper',
      category: 'توابل واستيراد',
      unit: 'KG',
      weightPerUnitKg: 1,
      volumePerUnitM3: 0.002,
      basePriceUSD: 4.8,
      priceEGP: 280,
      priceOMR: 2.1,
      stockQuantity: 4500,
    },
  });

  // 4. Suppliers
  const supplierVietnam = await prisma.supplier.upsert({
    where: { id: 'sup-vietnam-01' },
    update: {},
    create: {
      id: 'sup-vietnam-01',
      name: 'Vietnam Agri-Export Co.',
      country: 'Vietnam',
      phone: '+84 90 123 4567',
      email: 'export@vietnamagri.com',
      balanceUSD: 14500,
    },
  });

  const supplierIndonesia = await prisma.supplier.upsert({
    where: { id: 'sup-indo-01' },
    update: {},
    create: {
      id: 'sup-indo-01',
      name: 'PT Nusantara Charcoal & Spices',
      country: 'Indonesia',
      phone: '+62 812 9876 5432',
      email: 'sales@nusantara-export.co.id',
      balanceUSD: 22000,
    },
  });

  // 5. Vehicles
  const v1 = await prisma.vehicle.upsert({
    where: { plateNumber: 'أ ب ج 1234' },
    update: {},
    create: {
      plateNumber: 'أ ب ج 1234',
      model: 'جامبو أيسوزو 4 طن (مصر)',
      branchCode: 'EGY',
      driverName: 'أسامة السيد',
      lastOdometerKm: 42500,
      lastOilChangeKm: 41200, // 1300 KM driven -> 200 KM left until alert
      nextOilChangeAlertKm: 42700,
      status: 'ACTIVE',
    },
  });

  const v2 = await prisma.vehicle.upsert({
    where: { plateNumber: 'س ص ع 5678' },
    update: {},
    create: {
      plateNumber: 'س ص ع 5678',
      model: 'تويوتا دينا 5 طن (مصر)',
      branchCode: 'EGY',
      driverName: 'إبراهيم علي',
      lastOdometerKm: 68100,
      lastOilChangeKm: 66400, // 1700 KM driven -> MAINTENANCE REQUIRED!
      nextOilChangeAlertKm: 67900,
      status: 'MAINTENANCE_REQUIRED',
    },
  });

  const v3 = await prisma.vehicle.upsert({
    where: { plateNumber: 'OMN-88219' },
    update: {},
    create: {
      plateNumber: 'OMN-88219',
      model: 'نيسان نيفارا نقل (مسقط)',
      branchCode: 'OMN',
      driverName: 'سالم المعمري',
      lastOdometerKm: 19800,
      lastOilChangeKm: 19000,
      nextOilChangeAlertKm: 20500,
      status: 'ACTIVE',
    },
  });

  // 6. Maintenance Alert Log Example
  await prisma.maintenanceLog.create({
    data: {
      vehicleId: v2.id,
      serviceType: 'تغيير زيت وفلاتر',
      serviceKm: 66400,
      cost: 1850,
      notes: 'تغيير زيت شل 10,000 كم + فلتر زيت وفلتر هواء',
    },
  });

  // 7. Customers
  const custEgy = await prisma.customer.upsert({
    where: { id: 'cust-egy-01' },
    update: {},
    create: {
      id: 'cust-egy-01',
      name: 'شركة الوادي للتوزيع والشحن (القاهرة)',
      phone: '01012345678',
      branchCode: 'EGY',
      balanceLocal: 145000,
    },
  });

  const custOmn = await prisma.customer.upsert({
    where: { id: 'cust-omn-01' },
    update: {},
    create: {
      id: 'cust-omn-01',
      name: 'مؤسسة الخليج للتجارة والاستيراد (مسقط)',
      phone: '+968 9123 4567',
      branchCode: 'OMN',
      balanceLocal: 2850,
    },
  });

  // 8. Import Shipment (Container breakdown)
  const shipment = await prisma.importShipment.upsert({
    where: { containerNo: 'CONT-68M3-INDO-2026' },
    update: {},
    create: {
      containerNo: 'CONT-68M3-INDO-2026',
      originCountry: 'Indonesia',
      supplierId: supplierIndonesia.id,
      status: 'IN_WAREHOUSE',
      totalVolumeM3: 68,
      totalFreightCostUSD: 3200,
      salesTaxPercent: 14,
      notes: 'حاوية فحم 50 متر مكعب + بصل 18 متر مكعب قادمة من ميناء جاكرتا إلى ميناء الإسكندرية',
      items: {
        create: [
          {
            itemId: coal.id,
            quantityWeight: 25, // 25 Tons
            volumeM3: 50, // 50 m3 volume
            purchasePriceUSD: 420, // $420/ton direct cost
            customsTariffPerKgEGP: 10, // 10 EGP/kg customs
            directCostUSD: 10500,
            indirectCostUSD: 3420,
            landedCostUSD: 556.8, // landed per ton
            landedCostLocal: 27005, // EGP landed per ton
          },
          {
            itemId: onion.id,
            quantityWeight: 12, // 12 Tons
            volumeM3: 18, // 18 m3 volume
            purchasePriceUSD: 360,
            customsTariffPerKgEGP: 15,
            directCostUSD: 4320,
            indirectCostUSD: 1850,
            landedCostUSD: 514.1,
            landedCostLocal: 24935,
          },
        ],
      },
    },
  });

  // 9. Employees
  await prisma.employee.upsert({
    where: { id: 'emp-01' },
    update: {},
    create: {
      id: 'emp-01',
      name: 'محمود زويل',
      branchCode: 'EGY',
      jobTitle: 'المدير العام والتنفيذي',
      baseSalary: 35000,
    },
  });

  await prisma.employee.upsert({
    where: { id: 'emp-02' },
    update: {},
    create: {
      id: 'emp-02',
      name: 'محمد مرزوق',
      branchCode: 'EGY',
      jobTitle: 'رئيس الحسابات والمالية',
      baseSalary: 25000,
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
