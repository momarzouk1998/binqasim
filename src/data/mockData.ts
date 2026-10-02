// Centralized Comprehensive Mock Data for Bin Qasim ERP

export interface ProductItem {
  id: string;
  nameAr: string;
  nameEn: string;
  category: 'فحم طبيعي' | 'فحم مضغوط' | 'فحم شيشة' | 'تعبئة وتغليف';
  unit: 'TON' | 'KG' | 'BAG' | 'CARTON';
  weightPerUnitKg: number;
  volumePerUnitM3: number;
  basePriceUSD: number;
  priceEGP: number;
  priceOMR: number;
  landedCostUSD: number;
  landedCostEGP: number;
  stockQuantity: number;
  minAlertLimit: number;
  originCountry: string;
  description: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  branch: 'EGY' | 'OMN';
  currency: 'EGP' | 'OMR';
  balance: number;
  creditLimit: number;
  address: string;
  routeDays: string[];
  totalPurchases: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Supplier {
  id: string;
  name: string;
  country: string;
  countryCode: 'ID' | 'VN' | 'EG' | 'OM';
  phone: string;
  email: string;
  balanceUSD: number;
  balanceEGP?: number;
  bankAccount: string;
  specialty: string;
  notes: string;
}

export interface Vehicle {
  id: string;
  plateNumber: string;
  model: string;
  branch: 'EGY' | 'OMN';
  driverName: string;
  driverPhone: string;
  lastOdometerKm: number;
  lastOilChangeKm: number;
  nextOilChangeAlertKm: number;
  fuelTankCapacityLiters: number;
  avgCostPerKm: number;
  status: 'ACTIVE' | 'MAINTENANCE_REQUIRED';
}

export interface TripLog {
  id: string;
  vehicleId: string;
  plateNumber: string;
  driverName: string;
  date: string;
  destination: string;
  startKm: number;
  endKm: number;
  distanceKm: number;
  fuelCost: number;
  costPerKm: number;
  deliveredCargo: string;
  notes?: string;
}

export interface MaintenanceLog {
  id: string;
  vehicleId: string;
  plateNumber: string;
  serviceType: string;
  serviceKm: number;
  cost: number;
  date: string;
  centerName: string;
  notes: string;
}

export interface ImportShipmentItem {
  id: string;
  itemId: string;
  itemName: string;
  quantityTons: number;
  volumeM3: number;
  purchasePriceUSDPerTon: number;
  customsTariffPerKgEGP: number;
  directCostUSD: number;
  freightCostUSD: number;
  customsCostEGP: number;
  vatEGP: number;
  landedCostUSDPerTon: number;
  landedCostEGPPerTon: number;
  landedCostEGPPerKg: number;
}

export interface ImportShipment {
  id: string;
  containerNo: string;
  originCountry: string;
  originPort: string;
  destinationPort: string;
  supplierId: string;
  supplierName: string;
  status: 'ORDERED' | 'IN_TRANSIT' | 'CUSTOMS_CLEARED' | 'IN_WAREHOUSE';
  arrivalDate: string;
  totalVolumeM3: number;
  totalFreightCostUSD: number;
  salesTaxPercent: number;
  exchangeRateUSDToEGP: number;
  totalDirectUSD: number;
  grandTotalLandedUSD: number;
  grandTotalLandedEGP: number;
  notes: string;
  items: ImportShipmentItem[];
}

export interface InvoiceItem {
  id: string;
  itemId: string;
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  unitLandedCost: number;
  totalPrice: number;
  totalCost: number;
  profit: number;
}

export interface SalesInvoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  branch: 'EGY' | 'OMN';
  currency: 'EGP' | 'OMR';
  paymentType: 'CASH' | 'CREDIT' | 'INSTALLMENT' | 'CHEQUE';
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  taxAmount: number;
  totalCost: number;
  netProfit: number;
  date: string;
  dueDate?: string;
  notes?: string;
  items: InvoiceItem[];
}

export interface InstallmentSchedule {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  customerName: string;
  installmentNo: number;
  totalInstallments: number;
  dueDate: string;
  amount: number;
  currency: 'EGP' | 'OMR';
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  paidAt?: string;
}

export interface ChequeRecord {
  id: string;
  invoiceId?: string;
  chequeNumber: string;
  issuerName: string;
  recipientName: string;
  type: 'INCOMING' | 'OUTGOING'; // وارد من عميل | صادر لمورد
  bankName: string;
  dueDate: string;
  issueDate: string;
  amount: number;
  currency: 'EGP' | 'OMR' | 'USD';
  status: 'PENDING' | 'CLEARED' | 'BOUNCED';
}

export interface Employee {
  id: string;
  name: string;
  branch: 'EGY' | 'OMN';
  jobTitle: string;
  phone: string;
  baseSalary: number;
  currency: 'EGP' | 'OMR';
  hireDate: string;
  status: 'ACTIVE' | 'ON_LEAVE';
  tripBonusesThisMonth: number;
  deductionsThisMonth: number;
  medicalCheckStatus: 'VALID' | 'DUE_SOON' | 'EXPIRED';
  lastMedicalCheckDate: string;
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  month: string;
  year: number;
  baseSalary: number;
  tripBonuses: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  currency: 'EGP' | 'OMR';
  status: 'PAID' | 'PENDING';
  paidAt?: string;
}

// ----------------------------------------------------
// INITIAL MOCK DATA INSTANCES
// ----------------------------------------------------

export const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: 'prod-01',
    nameAr: 'فحم طبيعي فاخر برتقال وجوافة (للشواء والمطاعم)',
    nameEn: 'Premium Natural Citrus Charcoal',
    category: 'فحم طبيعي',
    unit: 'TON',
    weightPerUnitKg: 1000,
    volumePerUnitM3: 1.85,
    basePriceUSD: 430,
    priceEGP: 27500,
    priceOMR: 200,
    landedCostUSD: 565,
    landedCostEGP: 27402,
    stockQuantity: 145,
    minAlertLimit: 20,
    originCountry: 'إندونيسيا',
    description: 'فحم طبيعي عالي النقاوة، بدون شرار، يدوم لأكثر من 4 ساعات متواصلة.',
  },
  {
    id: 'prod-02',
    nameAr: 'قوالب فحم جوز الهند السداسية المكعبة (إندونيسي فاخر)',
    nameEn: 'Coconut Shell Hexagonal Charcoal Briquettes',
    category: 'فحم مضغوط',
    unit: 'TON',
    weightPerUnitKg: 1000,
    volumePerUnitM3: 1.45,
    basePriceUSD: 520,
    priceEGP: 32000,
    priceOMR: 225,
    landedCostUSD: 660,
    landedCostEGP: 32010,
    stockQuantity: 92,
    minAlertLimit: 15,
    originCountry: 'إندونيسيا',
    description: 'قوالب فحم قشر جوز هند نقي 100% للشيشة والباربكيو، رماد أبيض ناصع.',
  },
  {
    id: 'prod-03',
    nameAr: 'فحم نباتي نشارة خشب مضغوط أسطواني (فيتنامي)',
    nameEn: 'Vietnam Sawdust Charcoal Briquettes (Grade A)',
    category: 'فحم مضغوط',
    unit: 'TON',
    weightPerUnitKg: 1000,
    volumePerUnitM3: 1.40,
    basePriceUSD: 480,
    priceEGP: 29500,
    priceOMR: 210,
    landedCostUSD: 615,
    landedCostEGP: 29827,
    stockQuantity: 65,
    minAlertLimit: 15,
    originCountry: 'فيتنام',
    description: 'فحم نشارة خشب طبيعي معالج حرارياً بكفاءة احتراق فائقة للمشاوي الكبرى.',
  },
  {
    id: 'prod-04',
    nameAr: 'مكعبات فحم الشيشة الفاخر الذهبي (25×25 ملم)',
    nameEn: 'Premium Shisha Cube Briquettes 25x25mm',
    category: 'فحم شيشة',
    unit: 'CARTON',
    weightPerUnitKg: 10,
    volumePerUnitM3: 0.02,
    basePriceUSD: 6.5,
    priceEGP: 390,
    priceOMR: 2.8,
    landedCostUSD: 7.8,
    landedCostEGP: 378,
    stockQuantity: 1850,
    minAlertLimit: 200,
    originCountry: 'إندونيسيا',
    description: 'كراتين 10 كجم مقسمة إلى أكياس 1 كجم سريعة الاشتعال وعديمة الرائحة.',
  },
  {
    id: 'prod-05',
    nameAr: 'فحم نباتي مانجروف صلب للمطاعم الكبرى',
    nameEn: 'Hardwood Mangrove Black Charcoal',
    category: 'فحم طبيعي',
    unit: 'TON',
    weightPerUnitKg: 1000,
    volumePerUnitM3: 1.70,
    basePriceUSD: 410,
    priceEGP: 25800,
    priceOMR: 190,
    landedCostUSD: 540,
    landedCostEGP: 26190,
    stockQuantity: 78,
    minAlertLimit: 20,
    originCountry: 'فيتنام',
    description: 'فحم أخشاب صلبة للمطابخ والمطاعم الكبرى والفنادق.',
  },
  {
    id: 'prod-06',
    nameAr: 'شكاير تعبئة فحم منسوجة بولي بروبيلين (سعة 20 كجم)',
    nameEn: 'PP Woven Charcoal Bags (20kg Capacity)',
    category: 'تعبئة وتغليف',
    unit: 'BAG',
    weightPerUnitKg: 0.08,
    volumePerUnitM3: 0.0005,
    basePriceUSD: 0.22,
    priceEGP: 14.5,
    priceOMR: 0.11,
    landedCostUSD: 0.25,
    landedCostEGP: 12.1,
    stockQuantity: 14500,
    minAlertLimit: 2000,
    originCountry: 'مصر',
    description: 'شكاير مطبوعة باسم وشعار شركة بي قاسم للتعبئة والتوزيع المحلي.',
  },
  {
    id: 'prod-07',
    nameAr: 'كراتين تصدير مقواة 5 طبقات (سعة 10 كجم فحم مضغوط)',
    nameEn: 'Export Corrugated Boxes 5-Ply (10kg)',
    category: 'تعبئة وتغليف',
    unit: 'CARTON',
    weightPerUnitKg: 0.45,
    volumePerUnitM3: 0.002,
    basePriceUSD: 0.55,
    priceEGP: 32,
    priceOMR: 0.25,
    landedCostUSD: 0.60,
    landedCostEGP: 29.1,
    stockQuantity: 6200,
    minAlertLimit: 1000,
    originCountry: 'مصر',
    description: 'كرتونة تصدير مخصصة لتحمل الشحن البحري والرطوبة للشحنات الدولية.',
  },
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-01',
    name: 'شركة الوادي للتجارة والتوزيع (القاهرة)',
    phone: '01012345678',
    branch: 'EGY',
    currency: 'EGP',
    balance: 145000,
    creditLimit: 250000,
    address: 'شارع عباس العقاد، مدينة نصر، القاهرة',
    routeDays: ['السبت', 'الثلاثاء'],
    totalPurchases: 1850000,
    status: 'ACTIVE',
  },
  {
    id: 'cust-02',
    name: 'مؤسسة الخليج للتجارة والاستيراد (مسقط)',
    phone: '+968 9123 4567',
    branch: 'OMN',
    currency: 'OMR',
    balance: 2850,
    creditLimit: 6000,
    address: 'سوق مطرح التجاري، مسقط - سلطنة عمان',
    routeDays: ['الأحد', 'الأربعاء'],
    totalPurchases: 42000,
    status: 'ACTIVE',
  },
  {
    id: 'cust-03',
    name: 'شركة الدلتا لتجارة وتوزيع الفحم والمواد الغذائية',
    phone: '01198765432',
    branch: 'EGY',
    currency: 'EGP',
    balance: 0,
    creditLimit: 180000,
    address: 'شارع البحر، طنطا، محافظة الغربية',
    routeDays: ['الإثنين'],
    totalPurchases: 960000,
    status: 'ACTIVE',
  },
  {
    id: 'cust-04',
    name: 'مركز النور التجاري وسلاسل الهايبر (صلالة)',
    phone: '+968 9876 1234',
    branch: 'OMN',
    currency: 'OMR',
    balance: -450, // رصيد مقدم (دائن)
    creditLimit: 5000,
    address: 'شارع السلام، صلالة - سلطنة عمان',
    routeDays: ['الخميس'],
    totalPurchases: 34500,
    status: 'ACTIVE',
  },
  {
    id: 'cust-05',
    name: 'سلسلة مطاعم وكافيهات قصر المشويات (الإسكندرية)',
    phone: '01234567890',
    branch: 'EGY',
    currency: 'EGP',
    balance: 62000,
    creditLimit: 120000,
    address: 'طريق الكورنيش، سموحة، الإسكندرية',
    routeDays: ['السبت', 'الأربعاء'],
    totalPurchases: 740000,
    status: 'ACTIVE',
  },
  {
    id: 'cust-06',
    name: 'مؤسسة صحار للمواد الاستهلاكية وتجهيز المطاعم',
    phone: '+968 9456 7890',
    branch: 'OMN',
    currency: 'OMR',
    balance: 1420,
    creditLimit: 4000,
    address: 'المنطقة الصناعية، صحار - سلطنة عمان',
    routeDays: ['الإثنين'],
    totalPurchases: 28000,
    status: 'ACTIVE',
  },
  {
    id: 'cust-07',
    name: 'شركة الفرسان لتجارة الجملة والتوريدات (المنصورة)',
    phone: '01501234567',
    branch: 'EGY',
    currency: 'EGP',
    balance: 88000,
    creditLimit: 150000,
    address: 'شارع قناة السويس، المنصورة، الدقهلية',
    routeDays: ['الأحد', 'الخميس'],
    totalPurchases: 890000,
    status: 'ACTIVE',
  },
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-01',
    name: 'PT Nusantara Charcoal Export Indonesia',
    country: 'إندونيسيا (Indonesia)',
    countryCode: 'ID',
    phone: '+62 812 9876 5432',
    email: 'export@nusantara-charcoal.co.id',
    balanceUSD: 22000,
    bankAccount: 'Bank Central Asia (BCA) Jakarta - ACC #8829104',
    specialty: 'فحم طبيعي فاخر + قوالب فحم جوز الهند للشيشة والشواء',
    notes: 'المورد الرئيسي الأول بإندونيسيا، شحن مباشر من ميناء جاكرتا إلى الإسكندرية ومسقط.',
  },
  {
    id: 'sup-02',
    name: 'Vietnam Charcoal & Briquette Export Corp',
    country: 'فيتنام (Vietnam)',
    countryCode: 'VN',
    phone: '+84 90 123 4567',
    email: 'sales@vietnamcharcoal.com',
    balanceUSD: 14500,
    bankAccount: 'Vietcombank Ho Chi Minh City - ACC #9018442',
    specialty: 'فحم نباتي نشارة خشب مضغوط Grade A + فحم مانجروف صلب',
    notes: 'مورد معتمد للفحم المضغوط الفيتنامي عالي الصلابة، التزام عالي بمواعيد الشحن.',
  },
  {
    id: 'sup-03',
    name: 'شركة الأهرام والنيل لصناعة الكرتون والتغليف',
    country: 'مصر (Egypt)',
    countryCode: 'EG',
    phone: '01055544332',
    email: 'orders@ahram-pack.com',
    balanceUSD: 0,
    balanceEGP: 38000,
    bankAccount: 'البنك التجاري الدولي CIB - فرع العبور',
    specialty: 'كراتين تصدير 5 طبقات + شكاير منسوجة مطبوعة',
    notes: 'توريد مواد التعبئة والتغليف والكراتين لمستودعات مصر مع طباعة العلامة التجارية.',
  },
  {
    id: 'sup-04',
    name: 'شركة مسقط الحديثة لخدمات الشحن والنولي البحري',
    country: 'سلطنة عمان (Oman)',
    countryCode: 'OM',
    phone: '+968 2478 9900',
    email: 'shipping@muscat-cargo.om',
    balanceUSD: 4200,
    bankAccount: 'بنك مسقط - الفرع الرئيسي',
    specialty: 'حجز ومتابعة خطوط الحاويات البحرية (Maersk & MSC & CMA)',
    notes: 'وكيل الشحن والتخليص الجمركي بميناء السلطان قابوس وميناء صحار.',
  },
];

export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'veh-01',
    plateNumber: 'أ ب ج 1234',
    model: 'جامبو أيسوزو 4 طن (صندوق مغلق)',
    branch: 'EGY',
    driverName: 'أسامة السيد',
    driverPhone: '01099887766',
    lastOdometerKm: 42500,
    lastOilChangeKm: 41200, // 1300 km driven -> 200 km remaining (Normal)
    nextOilChangeAlertKm: 42700,
    fuelTankCapacityLiters: 90,
    avgCostPerKm: 4.80,
    status: 'ACTIVE',
  },
  {
    id: 'veh-02',
    plateNumber: 'س ص ع 5678',
    model: 'تويوتا دينا 5 طن (شاسيه طويل)',
    branch: 'EGY',
    driverName: 'إبراهيم علي',
    driverPhone: '01122334455',
    lastOdometerKm: 68100,
    lastOilChangeKm: 66400, // 1700 km driven -> ALERT! Overdue by 200 km
    nextOilChangeAlertKm: 67900,
    fuelTankCapacityLiters: 110,
    avgCostPerKm: 4.75,
    status: 'MAINTENANCE_REQUIRED',
  },
  {
    id: 'veh-03',
    plateNumber: 'OMN-88219',
    model: 'نيسان نيفارا نقل ثقيل (فرع مسقط)',
    branch: 'OMN',
    driverName: 'سالم المعمري',
    driverPhone: '+968 9111 2233',
    lastOdometerKm: 19800,
    lastOilChangeKm: 19000,
    nextOilChangeAlertKm: 20500,
    fuelTankCapacityLiters: 80,
    avgCostPerKm: 0.045, // OMR/km (~5.8 EGP)
    status: 'ACTIVE',
  },
  {
    id: 'veh-04',
    plateNumber: 'م ن هـ 9012',
    model: 'ميتسوبيشي كانتر 3.5 طن (مصر - الدلتا)',
    branch: 'EGY',
    driverName: 'طارق عبد السلام',
    driverPhone: '01299881122',
    lastOdometerKm: 34200,
    lastOilChangeKm: 33100, // 1100 km driven (Normal)
    nextOilChangeAlertKm: 34600,
    fuelTankCapacityLiters: 85,
    avgCostPerKm: 4.60,
    status: 'ACTIVE',
  },
  {
    id: 'veh-05',
    plateNumber: 'OMN-65431',
    model: 'تويوتا هاي لوكس بيك آب (فرع صلالة)',
    branch: 'OMN',
    driverName: 'خالد الرواحي',
    driverPhone: '+968 9777 6655',
    lastOdometerKm: 28400,
    lastOilChangeKm: 27100,
    nextOilChangeAlertKm: 28600,
    fuelTankCapacityLiters: 75,
    avgCostPerKm: 0.042, // OMR/km
    status: 'ACTIVE',
  },
];

export const INITIAL_TRIP_LOGS: TripLog[] = [
  {
    id: 'log-01',
    vehicleId: 'veh-02',
    plateNumber: 'س ص ع 5678',
    driverName: 'إبراهيم علي',
    date: '2026-08-29',
    destination: 'توزيع خط القاهرة - الإسكندرية (قصر المشويات)',
    startKm: 67900,
    endKm: 68100,
    distanceKm: 200,
    fuelCost: 950,
    costPerKm: 4.75,
    deliveredCargo: '8 طن فحم طبيعي فاخر + 50 كرتونة فحم شيشة',
    notes: 'تم تسليم الشحنة وتحصيل جزء نقدي والفاتورة بالكامل.',
  },
  {
    id: 'log-02',
    vehicleId: 'veh-01',
    plateNumber: 'أ ب ج 1234',
    driverName: 'أسامة السيد',
    date: '2026-08-28',
    destination: 'خط القاهرة الكبرى (مدينة نصر والتجمع والشروق)',
    startKm: 42250,
    endKm: 42500,
    distanceKm: 250,
    fuelCost: 1200,
    costPerKm: 4.80,
    deliveredCargo: '6 طن فحم جوز هند + شكاير تعبئة للمطاعم',
    notes: 'خط سير منتظم مع عملاء الجملة.',
  },
  {
    id: 'log-03',
    vehicleId: 'veh-04',
    plateNumber: 'م ن هـ 9012',
    driverName: 'طارق عبد السلام',
    date: '2026-08-27',
    destination: 'خط محافظات الدلتا (طنطا - المنصورة - المحلة)',
    startKm: 33900,
    endKm: 34200,
    distanceKm: 300,
    fuelCost: 1380,
    costPerKm: 4.60,
    deliveredCargo: '10 طن فحم مضغوط للموزعين المعتمدين',
    notes: 'تسليم لشركة الفرسان وشركة الدلتا.',
  },
  {
    id: 'log-04',
    vehicleId: 'veh-03',
    plateNumber: 'OMN-88219',
    driverName: 'سالم المعمري',
    date: '2026-08-26',
    destination: 'خط محافظة مسقط وسوق مطرح والسيب',
    startKm: 19620,
    endKm: 19800,
    distanceKm: 180,
    fuelCost: 8.1, // OMR
    costPerKm: 0.045, // OMR/km
    deliveredCargo: '5 طن فحم قشور جوز هند لمؤسسة الخليج',
    notes: 'تحصيل شيك بنكي من العميل.',
  },
];

export const INITIAL_IMPORT_SHIPMENTS: ImportShipment[] = [
  {
    id: 'ship-01',
    containerNo: 'CONT-68M3-INDO-2026',
    originCountry: 'إندونيسيا',
    originPort: 'ميناء جاكرتا (Tanjung Priok)',
    destinationPort: 'ميناء الإسكندرية البحري',
    supplierId: 'sup-01',
    supplierName: 'PT Nusantara Charcoal Export Indonesia',
    status: 'IN_WAREHOUSE',
    arrivalDate: '2026-08-15',
    totalVolumeM3: 68,
    totalFreightCostUSD: 3200,
    salesTaxPercent: 14,
    exchangeRateUSDToEGP: 48.5,
    totalDirectUSD: 16740,
    grandTotalLandedUSD: 23610,
    grandTotalLandedEGP: 1145085,
    notes: 'حاوية 68 متر مكعب محملة بـ 25 طن فحم طبيعي + 12 طن فحم جوز هند مضغوط. تم التفريغ بالمستودع الرئيسي.',
    items: [
      {
        id: 'si-01',
        itemId: 'prod-01',
        itemName: 'فحم طبيعي فاخر برتقال وجوافة',
        quantityTons: 25,
        volumeM3: 50,
        purchasePriceUSDPerTon: 420,
        customsTariffPerKgEGP: 10,
        directCostUSD: 10500,
        freightCostUSD: 2353,
        customsCostEGP: 250000,
        vatEGP: 122500,
        landedCostUSDPerTon: 556.8,
        landedCostEGPPerTon: 27005,
        landedCostEGPPerKg: 27.0,
      },
      {
        id: 'si-02',
        itemId: 'prod-02',
        itemName: 'قوالب فحم جوز الهند السداسية المكعبة',
        quantityTons: 12,
        volumeM3: 18,
        purchasePriceUSDPerTon: 520,
        customsTariffPerKgEGP: 12,
        directCostUSD: 6240,
        freightCostUSD: 847,
        customsCostEGP: 144000,
        vatEGP: 68600,
        landedCostUSDPerTon: 660.0,
        landedCostEGPPerTon: 32010,
        landedCostEGPPerKg: 32.0,
      },
    ],
  },
  {
    id: 'ship-02',
    containerNo: 'CONT-68M3-VN-2026',
    originCountry: 'فيتنام',
    originPort: 'ميناء هو تشي منه (Ho Chi Minh Port)',
    destinationPort: 'ميناء الدخيلة - الإسكندرية',
    supplierId: 'sup-02',
    supplierName: 'Vietnam Charcoal & Briquette Export Corp',
    status: 'IN_WAREHOUSE',
    arrivalDate: '2026-08-01',
    totalVolumeM3: 68,
    totalFreightCostUSD: 3100,
    salesTaxPercent: 14,
    exchangeRateUSDToEGP: 48.5,
    totalDirectUSD: 18200,
    grandTotalLandedUSD: 24700,
    grandTotalLandedEGP: 1197950,
    notes: 'حاوية فحم نباتي مضغوط فيتنامي 25 طن + 15 طن فحم مانجروف صلب. تم التوزيع بنسبة 80%.',
    items: [
      {
        id: 'si-03',
        itemId: 'prod-03',
        itemName: 'فحم نباتي نشارة خشب مضغوط (فيتنامي)',
        quantityTons: 25,
        volumeM3: 42,
        purchasePriceUSDPerTon: 480,
        customsTariffPerKgEGP: 11,
        directCostUSD: 12000,
        freightCostUSD: 1915,
        customsCostEGP: 275000,
        vatEGP: 132400,
        landedCostUSDPerTon: 615.0,
        landedCostEGPPerTon: 29827,
        landedCostEGPPerKg: 29.8,
      },
      {
        id: 'si-04',
        itemId: 'prod-05',
        itemName: 'فحم نباتي مانجروف صلب للمطاعم',
        quantityTons: 15,
        volumeM3: 26,
        purchasePriceUSDPerTon: 410,
        customsTariffPerKgEGP: 9,
        directCostUSD: 6150,
        freightCostUSD: 1185,
        customsCostEGP: 135000,
        vatEGP: 68700,
        landedCostUSDPerTon: 540.0,
        landedCostEGPPerTon: 26190,
        landedCostEGPPerKg: 26.2,
      },
    ],
  },
  {
    id: 'ship-03',
    containerNo: 'CONT-40HQ-INDO-2026-B',
    originCountry: 'إندونيسيا',
    originPort: 'ميناء جاكرتا',
    destinationPort: 'ميناء السلطان قابوس (مسقط)',
    supplierId: 'sup-01',
    supplierName: 'PT Nusantara Charcoal Export Indonesia',
    status: 'IN_TRANSIT',
    arrivalDate: '2026-09-12',
    totalVolumeM3: 68,
    totalFreightCostUSD: 2800,
    salesTaxPercent: 5, // 5% Oman VAT
    exchangeRateUSDToEGP: 48.5,
    totalDirectUSD: 20800,
    grandTotalLandedUSD: 24800,
    grandTotalLandedEGP: 1202800,
    notes: 'شحنة متجهة مباشرة لفرع سلطنة عمان لدعم الطلب المتزايد على فحم الشيشة ومكعبات جوز الهند.',
    items: [
      {
        id: 'si-05',
        itemId: 'prod-02',
        itemName: 'قوالب فحم جوز الهند السداسية المكعبة',
        quantityTons: 40,
        volumeM3: 68,
        purchasePriceUSDPerTon: 520,
        customsTariffPerKgEGP: 0,
        directCostUSD: 20800,
        freightCostUSD: 2800,
        customsCostEGP: 0,
        vatEGP: 48500,
        landedCostUSDPerTon: 620.0,
        landedCostEGPPerTon: 30070,
        landedCostEGPPerKg: 30.1,
      },
    ],
  },
  {
    id: 'ship-04',
    containerNo: 'CONT-68M3-VN-ORDER-04',
    originCountry: 'فيتنام',
    originPort: 'ميناء دا نانغ',
    destinationPort: 'ميناء الإسكندرية',
    supplierId: 'sup-02',
    supplierName: 'Vietnam Charcoal & Briquette Export Corp',
    status: 'ORDERED',
    arrivalDate: '2026-10-05',
    totalVolumeM3: 68,
    totalFreightCostUSD: 3300,
    salesTaxPercent: 14,
    exchangeRateUSDToEGP: 48.5,
    totalDirectUSD: 19500,
    grandTotalLandedUSD: 26100,
    grandTotalLandedEGP: 1265850,
    notes: 'تم فتح الاعتماد المستندي البنكي وجاري تجهيز البضاعة والشحن من المصنع بفيتنام.',
    items: [
      {
        id: 'si-06',
        itemId: 'prod-03',
        itemName: 'فحم نباتي نشارة خشب مضغوط',
        quantityTons: 30,
        volumeM3: 50,
        purchasePriceUSDPerTon: 480,
        customsTariffPerKgEGP: 11,
        directCostUSD: 14400,
        freightCostUSD: 2426,
        customsCostEGP: 330000,
        vatEGP: 158000,
        landedCostUSDPerTon: 615.0,
        landedCostEGPPerTon: 29827,
        landedCostEGPPerKg: 29.8,
      },
    ],
  },
];

export const INITIAL_SALES_INVOICES: SalesInvoice[] = [
  {
    id: 'inv-101',
    invoiceNumber: 'INV-EGY-2026-081',
    customerId: 'cust-01',
    customerName: 'شركة الوادي للتجارة والتوزيع (القاهرة)',
    branch: 'EGY',
    currency: 'EGP',
    paymentType: 'CREDIT',
    totalAmount: 145000,
    paidAmount: 45000,
    remainingAmount: 100000,
    taxAmount: 0,
    totalCost: 118000,
    netProfit: 27000,
    date: '2026-08-25',
    dueDate: '2026-09-25',
    notes: 'فاتورة توريد 5 طن فحم برتقال طبيعي + 50 كرتونة فحم شيشة مكعبات',
    items: [
      {
        id: 'ii-01',
        itemId: 'prod-01',
        name: 'فحم طبيعي فاخر برتقال وجوافة',
        quantity: 5,
        unit: 'طن',
        unitPrice: 27500,
        unitLandedCost: 22000,
        totalPrice: 137500,
        totalCost: 110000,
        profit: 27500,
      },
      {
        id: 'ii-02',
        itemId: 'prod-04',
        name: 'مكعبات فحم الشيشة الفاخر الذهبي',
        quantity: 20,
        unit: 'كرتونة',
        unitPrice: 375,
        unitLandedCost: 400,
        totalPrice: 7500,
        totalCost: 8000,
        profit: -500,
      },
    ],
  },
  {
    id: 'inv-102',
    invoiceNumber: 'INV-OMN-2026-014',
    customerId: 'cust-02',
    customerName: 'مؤسسة الخليج للتجارة والاستيراد (مسقط)',
    branch: 'OMN',
    currency: 'OMR',
    paymentType: 'CHEQUE',
    totalAmount: 2850,
    paidAmount: 1200,
    remainingAmount: 1650,
    taxAmount: 135,
    totalCost: 2150,
    netProfit: 700,
    date: '2026-08-22',
    dueDate: '2026-09-15',
    notes: 'دفعة حساب مسقط بشيك بنكي مسحوب على بنك مسقط',
    items: [
      {
        id: 'ii-03',
        itemId: 'prod-02',
        name: 'قوالب فحم جوز الهند السداسية المكعبة',
        quantity: 12,
        unit: 'طن',
        unitPrice: 225,
        unitLandedCost: 170,
        totalPrice: 2700,
        totalCost: 2040,
        profit: 660,
      },
    ],
  },
  {
    id: 'inv-103',
    invoiceNumber: 'INV-EGY-2026-082',
    customerId: 'cust-05',
    customerName: 'سلسلة مطاعم وكافيهات قصر المشويات (الإسكندرية)',
    branch: 'EGY',
    currency: 'EGP',
    paymentType: 'INSTALLMENT',
    totalAmount: 82500,
    paidAmount: 20500,
    remainingAmount: 62000,
    taxAmount: 0,
    totalCost: 65000,
    netProfit: 17500,
    date: '2026-08-20',
    dueDate: '2026-11-20',
    notes: 'نظام أقساط على 3 دفعات شهرية متساوية.',
    items: [
      {
        id: 'ii-04',
        itemId: 'prod-01',
        name: 'فحم طبيعي فاخر برتقال وجوافة',
        quantity: 3,
        unit: 'طن',
        unitPrice: 27500,
        unitLandedCost: 21666,
        totalPrice: 82500,
        totalCost: 65000,
        profit: 17500,
      },
    ],
  },
  {
    id: 'inv-104',
    invoiceNumber: 'INV-EGY-2026-083',
    customerId: 'cust-07',
    customerName: 'شركة الفرسان لتجارة الجملة والتوريدات (المنصورة)',
    branch: 'EGY',
    currency: 'EGP',
    paymentType: 'CASH',
    totalAmount: 118000,
    paidAmount: 118000,
    remainingAmount: 0,
    taxAmount: 0,
    totalCost: 96000,
    netProfit: 22000,
    date: '2026-08-18',
    notes: 'سداد نقدي فوري مع خصم تعجيل دفع 2%',
    items: [
      {
        id: 'ii-05',
        itemId: 'prod-03',
        name: 'فحم نباتي نشارة خشب مضغوط',
        quantity: 4,
        unit: 'طن',
        unitPrice: 29500,
        unitLandedCost: 24000,
        totalPrice: 118000,
        totalCost: 96000,
        profit: 22000,
      },
    ],
  },
  {
    id: 'inv-105',
    invoiceNumber: 'INV-OMN-2026-015',
    customerId: 'cust-06',
    customerName: 'مؤسسة صحار للمواد الاستهلاكية وتجهيز المطاعم',
    branch: 'OMN',
    currency: 'OMR',
    paymentType: 'CREDIT',
    totalAmount: 1420,
    paidAmount: 0,
    remainingAmount: 1420,
    taxAmount: 68,
    totalCost: 1100,
    netProfit: 320,
    date: '2026-08-15',
    dueDate: '2026-09-15',
    notes: 'توريد مطاعم ومقاهي صحار - أجل 30 يوم',
    items: [
      {
        id: 'ii-06',
        itemId: 'prod-05',
        name: 'فحم نباتي مانجروف صلب للمطاعم',
        quantity: 7,
        unit: 'طن',
        unitPrice: 190,
        unitLandedCost: 150,
        totalPrice: 1330,
        totalCost: 1050,
        profit: 280,
      },
    ],
  },
];

export const INITIAL_INSTALLMENTS: InstallmentSchedule[] = [
  {
    id: 'inst-01',
    invoiceId: 'inv-103',
    invoiceNumber: 'INV-EGY-2026-082',
    customerName: 'سلسلة مطاعم وكافيهات قصر المشويات',
    installmentNo: 1,
    totalInstallments: 3,
    dueDate: '2026-09-20',
    amount: 20666,
    currency: 'EGP',
    status: 'PENDING',
  },
  {
    id: 'inst-02',
    invoiceId: 'inv-103',
    invoiceNumber: 'INV-EGY-2026-082',
    customerName: 'سلسلة مطاعم وكافيهات قصر المشويات',
    installmentNo: 2,
    totalInstallments: 3,
    dueDate: '2026-10-20',
    amount: 20666,
    currency: 'EGP',
    status: 'PENDING',
  },
  {
    id: 'inst-03',
    invoiceId: 'inv-103',
    invoiceNumber: 'INV-EGY-2026-082',
    customerName: 'سلسلة مطاعم وكافيهات قصر المشويات',
    installmentNo: 3,
    totalInstallments: 3,
    dueDate: '2026-11-20',
    amount: 20668,
    currency: 'EGP',
    status: 'PENDING',
  },
];

export const INITIAL_CHEQUES: ChequeRecord[] = [
  {
    id: 'chk-01',
    invoiceId: 'inv-102',
    chequeNumber: 'CHK-OMN-99120',
    issuerName: 'مؤسسة الخليج للتجارة والاستيراد',
    recipientName: 'شركة بي قاسم للاستيراد والتصدير',
    type: 'INCOMING',
    bankName: 'بنك مسقط - فرع مطرح',
    issueDate: '2026-08-22',
    dueDate: '2026-09-15',
    amount: 1650,
    currency: 'OMR',
    status: 'PENDING',
  },
  {
    id: 'chk-02',
    chequeNumber: 'CHK-CIB-55421',
    issuerName: 'شركة بي قاسم للاستيراد والتصدير',
    recipientName: 'شركة الأهرام والنيل لصناعة الكرتون',
    type: 'OUTGOING',
    bankName: 'البنك التجاري الدولي CIB - مصر',
    issueDate: '2026-08-15',
    dueDate: '2026-09-15',
    amount: 38000,
    currency: 'EGP',
    status: 'PENDING',
  },
  {
    id: 'chk-03',
    chequeNumber: 'LC-QNB-7718',
    issuerName: 'شركة بي قاسم للاستيراد والتصدير',
    recipientName: 'PT Nusantara Charcoal Export Indonesia',
    type: 'OUTGOING',
    bankName: 'بنك قطر الوطني QNB - حساب الدولار',
    issueDate: '2026-08-10',
    dueDate: '2026-08-30',
    amount: 15000,
    currency: 'USD',
    status: 'CLEARED',
  },
];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-01',
    name: 'محمود زويل',
    branch: 'EGY',
    jobTitle: 'المدير العام والتنفيذي',
    phone: '01011112222',
    baseSalary: 35000,
    currency: 'EGP',
    hireDate: '2024-01-01',
    status: 'ACTIVE',
    tripBonusesThisMonth: 0,
    deductionsThisMonth: 0,
    medicalCheckStatus: 'VALID',
    lastMedicalCheckDate: '2026-06-15',
  },
  {
    id: 'emp-02',
    name: 'محمد مرزوق',
    branch: 'EGY',
    jobTitle: 'رئيس الحسابات والمدير المالي',
    phone: '01033334444',
    baseSalary: 25000,
    currency: 'EGP',
    hireDate: '2024-02-01',
    status: 'ACTIVE',
    tripBonusesThisMonth: 0,
    deductionsThisMonth: 0,
    medicalCheckStatus: 'VALID',
    lastMedicalCheckDate: '2026-07-10',
  },
  {
    id: 'emp-03',
    name: 'أسامة السيد',
    branch: 'EGY',
    jobTitle: 'سائق توزيع أول (سيارة جامبو 1234)',
    phone: '01099887766',
    baseSalary: 9500,
    currency: 'EGP',
    hireDate: '2024-05-10',
    status: 'ACTIVE',
    tripBonusesThisMonth: 2200, // بدل نقلات ومسافات
    deductionsThisMonth: 0,
    medicalCheckStatus: 'VALID',
    lastMedicalCheckDate: '2026-08-01',
  },
  {
    id: 'emp-04',
    name: 'إبراهيم علي',
    branch: 'EGY',
    jobTitle: 'سائق توزيع ثقيل (سيارة دينا 5678)',
    phone: '01122334455',
    baseSalary: 9800,
    currency: 'EGP',
    hireDate: '2024-06-01',
    status: 'ACTIVE',
    tripBonusesThisMonth: 2500,
    deductionsThisMonth: 300,
    medicalCheckStatus: 'DUE_SOON', // فحص طبي وشيك
    lastMedicalCheckDate: '2026-03-10',
  },
  {
    id: 'emp-05',
    name: 'سالم المعمري',
    branch: 'OMN',
    jobTitle: 'مسؤول فرع مسقط وسائق توزيع',
    phone: '+968 9111 2233',
    baseSalary: 550,
    currency: 'OMR',
    hireDate: '2025-01-15',
    status: 'ACTIVE',
    tripBonusesThisMonth: 80,
    deductionsThisMonth: 0,
    medicalCheckStatus: 'VALID',
    lastMedicalCheckDate: '2026-05-20',
  },
  {
    id: 'emp-06',
    name: 'خالد الرواحي',
    branch: 'OMN',
    jobTitle: 'مندوب مبيعات وتوزيع فرع صلالة',
    phone: '+968 9777 6655',
    baseSalary: 480,
    currency: 'OMR',
    hireDate: '2025-03-01',
    status: 'ACTIVE',
    tripBonusesThisMonth: 65,
    deductionsThisMonth: 0,
    medicalCheckStatus: 'VALID',
    lastMedicalCheckDate: '2026-07-01',
  },
  {
    id: 'emp-07',
    name: 'حسن عبد العال',
    branch: 'EGY',
    jobTitle: 'أمين المستودع والمخازن المركزية',
    phone: '01288776655',
    baseSalary: 11000,
    currency: 'EGP',
    hireDate: '2024-04-10',
    status: 'ACTIVE',
    tripBonusesThisMonth: 800,
    deductionsThisMonth: 0,
    medicalCheckStatus: 'VALID',
    lastMedicalCheckDate: '2026-06-25',
  },
];

export const INITIAL_PAYROLLS: PayrollRecord[] = [
  {
    id: 'pay-01',
    employeeId: 'emp-01',
    employeeName: 'محمود زويل',
    month: 'أغسطس',
    year: 2026,
    baseSalary: 35000,
    tripBonuses: 0,
    allowances: 3000,
    deductions: 0,
    netSalary: 38000,
    currency: 'EGP',
    status: 'PAID',
    paidAt: '2026-08-28',
  },
  {
    id: 'pay-02',
    employeeId: 'emp-02',
    employeeName: 'محمد مرزوق',
    month: 'أغسطس',
    year: 2026,
    baseSalary: 25000,
    tripBonuses: 0,
    allowances: 2000,
    deductions: 0,
    netSalary: 27000,
    currency: 'EGP',
    status: 'PAID',
    paidAt: '2026-08-28',
  },
  {
    id: 'pay-03',
    employeeId: 'emp-03',
    employeeName: 'أسامة السيد',
    month: 'أغسطس',
    year: 2026,
    baseSalary: 9500,
    tripBonuses: 2200,
    allowances: 1000,
    deductions: 0,
    netSalary: 12700,
    currency: 'EGP',
    status: 'PAID',
    paidAt: '2026-08-28',
  },
  {
    id: 'pay-04',
    employeeId: 'emp-04',
    employeeName: 'إبراهيم علي',
    month: 'أغسطس',
    year: 2026,
    baseSalary: 9800,
    tripBonuses: 2500,
    allowances: 1000,
    deductions: 300,
    netSalary: 13000,
    currency: 'EGP',
    status: 'PAID',
    paidAt: '2026-08-28',
  },
  {
    id: 'pay-05',
    employeeId: 'emp-05',
    employeeName: 'سالم المعمري',
    month: 'أغسطس',
    year: 2026,
    baseSalary: 550,
    tripBonuses: 80,
    allowances: 40,
    deductions: 0,
    netSalary: 670,
    currency: 'OMR',
    status: 'PAID',
    paidAt: '2026-08-28',
  },
];
