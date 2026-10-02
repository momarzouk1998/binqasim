'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ProductItem,
  Customer,
  Supplier,
  Vehicle,
  TripLog,
  MaintenanceLog,
  ImportShipment,
  SalesInvoice,
  InstallmentSchedule,
  ChequeRecord,
  Employee,
  PayrollRecord,
  INITIAL_PRODUCTS,
  INITIAL_CUSTOMERS,
  INITIAL_SUPPLIERS,
  INITIAL_VEHICLES,
  INITIAL_TRIP_LOGS,
  INITIAL_IMPORT_SHIPMENTS,
  INITIAL_SALES_INVOICES,
  INITIAL_INSTALLMENTS,
  INITIAL_CHEQUES,
  INITIAL_EMPLOYEES,
  INITIAL_PAYROLLS,
} from '@/data/mockData';

interface UserSession {
  name: string;
  title: string;
  phone: string;
  role: string;
  isLoggedIn: boolean;
}

interface AppContextType {
  // App state
  selectedBranch: 'ALL' | 'EGY' | 'OMN';
  setSelectedBranch: (branch: 'ALL' | 'EGY' | 'OMN') => void;
  usdToEgpRate: number;
  setUsdToEgpRate: (rate: number) => void;
  usdToOmrRate: number;
  setUsdToOmrRate: (rate: number) => void;
  currentUser: UserSession;
  setCurrentUser: (user: UserSession) => void;

  // Products
  products: ProductItem[];
  addProduct: (product: ProductItem) => void;
  updateProduct: (id: string, updated: Partial<ProductItem>) => void;
  adjustStock: (id: string, qtyDelta: number, reason: string) => void;

  // Customers
  customers: Customer[];
  addCustomer: (customer: Customer) => void;
  addCustomerPayment: (customerId: string, amount: number, paymentMethod: string, notes?: string) => void;

  // Suppliers
  suppliers: Supplier[];
  addSupplier: (supplier: Supplier) => void;
  addSupplierPayment: (supplierId: string, amountUSD: number, method: string, bank: string, notes?: string) => void;

  // Fleet
  vehicles: Vehicle[];
  tripLogs: TripLog[];
  maintenanceLogs: MaintenanceLog[];
  addTripLog: (trip: Omit<TripLog, 'id'>) => void;
  registerOilChange: (vehicleId: string, cost: number, centerName: string, notes?: string) => void;
  addVehicle: (vehicle: Vehicle) => void;

  // Shipments
  shipments: ImportShipment[];
  addShipment: (shipment: ImportShipment) => void;
  updateShipmentStatus: (id: string, status: ImportShipment['status']) => void;

  // Sales & Invoices
  invoices: SalesInvoice[];
  addInvoice: (invoice: Omit<SalesInvoice, 'id'>) => void;

  // Installments & Cheques
  installments: InstallmentSchedule[];
  payInstallment: (id: string) => void;
  cheques: ChequeRecord[];
  clearCheque: (id: string) => void;
  addCheque: (cheque: Omit<ChequeRecord, 'id'>) => void;

  // Employees & Payroll
  employees: Employee[];
  payrolls: PayrollRecord[];
  addEmployee: (employee: Employee) => void;
  addPayroll: (payroll: Omit<PayrollRecord, 'id'>) => void;
  addTripBonus: (employeeId: string, amount: number, notes?: string) => void;

  // Reset demo data
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  BRANCH: 'binqasim_branch',
  USD_EGP: 'binqasim_rate_egp',
  USD_OMR: 'binqasim_rate_omr',
  USER: 'binqasim_user',
  PRODUCTS: 'binqasim_products_v2',
  CUSTOMERS: 'binqasim_customers_v2',
  SUPPLIERS: 'binqasim_suppliers_v2',
  VEHICLES: 'binqasim_vehicles_v2',
  TRIP_LOGS: 'binqasim_trip_logs_v2',
  MAINTENANCE_LOGS: 'binqasim_maintenance_logs_v2',
  SHIPMENTS: 'binqasim_shipments_v2',
  INVOICES: 'binqasim_invoices_v2',
  INSTALLMENTS: 'binqasim_installments_v2',
  CHEQUES: 'binqasim_cheques_v2',
  EMPLOYEES: 'binqasim_employees_v2',
  PAYROLLS: 'binqasim_payrolls_v2',
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [selectedBranch, setSelectedBranchState] = useState<'ALL' | 'EGY' | 'OMN'>('EGY');
  const [usdToEgpRate, setUsdToEgpRateState] = useState<number>(48.5);
  const [usdToOmrRate, setUsdToOmrRateState] = useState<number>(0.385);
  const [currentUser, setCurrentUserState] = useState<UserSession>({
    name: 'وائل قاسم',
    title: 'المدير العام',
    phone: '01111189666',
    role: 'ADMIN',
    isLoggedIn: true,
  });

  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [tripLogs, setTripLogs] = useState<TripLog[]>(INITIAL_TRIP_LOGS);
  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLog[]>([]);
  const [shipments, setShipments] = useState<ImportShipment[]>(INITIAL_IMPORT_SHIPMENTS);
  const [invoices, setInvoices] = useState<SalesInvoice[]>(INITIAL_SALES_INVOICES);
  const [installments, setInstallments] = useState<InstallmentSchedule[]>(INITIAL_INSTALLMENTS);
  const [cheques, setCheques] = useState<ChequeRecord[]>(INITIAL_CHEQUES);
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [payrolls, setPayrolls] = useState<PayrollRecord[]>(INITIAL_PAYROLLS);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const getStored = (key: string, fallback: any) => {
        const item = localStorage.getItem(key);
        if (!item) return fallback;
        try {
          return JSON.parse(item);
        } catch {
          return fallback;
        }
      };

      const storedUser = getStored(STORAGE_KEYS.USER, null);
      if (storedUser && storedUser.name) setCurrentUserState(storedUser);

      const storedBranch = localStorage.getItem(STORAGE_KEYS.BRANCH);
      if (storedBranch && ['ALL', 'EGY', 'OMN'].includes(storedBranch)) {
        setSelectedBranchState(storedBranch as any);
      }

      const storedEgpRate = localStorage.getItem(STORAGE_KEYS.USD_EGP);
      if (storedEgpRate) setUsdToEgpRateState(parseFloat(storedEgpRate) || 48.5);

      const storedOmrRate = localStorage.getItem(STORAGE_KEYS.USD_OMR);
      if (storedOmrRate) setUsdToOmrRateState(parseFloat(storedOmrRate) || 0.385);

      setProducts(getStored(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS));
      setCustomers(getStored(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS));
      setSuppliers(getStored(STORAGE_KEYS.SUPPLIERS, INITIAL_SUPPLIERS));
      setVehicles(getStored(STORAGE_KEYS.VEHICLES, INITIAL_VEHICLES));
      setTripLogs(getStored(STORAGE_KEYS.TRIP_LOGS, INITIAL_TRIP_LOGS));
      setMaintenanceLogs(getStored(STORAGE_KEYS.MAINTENANCE_LOGS, []));
      setShipments(getStored(STORAGE_KEYS.SHIPMENTS, INITIAL_IMPORT_SHIPMENTS));
      setInvoices(getStored(STORAGE_KEYS.INVOICES, INITIAL_SALES_INVOICES));
      setInstallments(getStored(STORAGE_KEYS.INSTALLMENTS, INITIAL_INSTALLMENTS));
      setCheques(getStored(STORAGE_KEYS.CHEQUES, INITIAL_CHEQUES));
      setEmployees(getStored(STORAGE_KEYS.EMPLOYEES, INITIAL_EMPLOYEES));
      setPayrolls(getStored(STORAGE_KEYS.PAYROLLS, INITIAL_PAYROLLS));
    } catch (e) {
      console.error('Error hydrating state from localStorage', e);
    }
  }, []);

  const setSelectedBranch = (b: 'ALL' | 'EGY' | 'OMN') => {
    setSelectedBranchState(b);
    try {
      localStorage.setItem(STORAGE_KEYS.BRANCH, b);
    } catch {}
  };

  const setUsdToEgpRate = (r: number) => {
    setUsdToEgpRateState(r);
    try {
      localStorage.setItem(STORAGE_KEYS.USD_EGP, r.toString());
    } catch {}
  };

  const setUsdToOmrRate = (r: number) => {
    setUsdToOmrRateState(r);
    try {
      localStorage.setItem(STORAGE_KEYS.USD_OMR, r.toString());
    } catch {}
  };

  const setCurrentUser = (u: UserSession) => {
    setCurrentUserState(u);
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(u));
    } catch {}
  };

  // Helper to save state
  const save = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error(e);
    }
  };

  // Products
  const addProduct = (product: ProductItem) => {
    const updated = [product, ...products];
    setProducts(updated);
    save(STORAGE_KEYS.PRODUCTS, updated);
  };

  const updateProduct = (id: string, updatedFields: Partial<ProductItem>) => {
    const updated = products.map((p) => (p.id === id ? { ...p, ...updatedFields } : p));
    setProducts(updated);
    save(STORAGE_KEYS.PRODUCTS, updated);
  };

  const adjustStock = (id: string, qtyDelta: number, _reason: string) => {
    const updated = products.map((p) => {
      if (p.id === id) {
        return { ...p, stockQuantity: Math.max(0, p.stockQuantity + qtyDelta) };
      }
      return p;
    });
    setProducts(updated);
    save(STORAGE_KEYS.PRODUCTS, updated);
  };

  // Customers
  const addCustomer = (cust: Customer) => {
    const updated = [cust, ...customers];
    setCustomers(updated);
    save(STORAGE_KEYS.CUSTOMERS, updated);
  };

  const addCustomerPayment = (customerId: string, amount: number, _method: string, _notes?: string) => {
    const updated = customers.map((c) => {
      if (c.id === customerId) {
        return { ...c, balance: c.balance - amount };
      }
      return c;
    });
    setCustomers(updated);
    save(STORAGE_KEYS.CUSTOMERS, updated);
  };

  // Suppliers
  const addSupplier = (sup: Supplier) => {
    const updated = [sup, ...suppliers];
    setSuppliers(updated);
    save(STORAGE_KEYS.SUPPLIERS, updated);
  };

  const addSupplierPayment = (supplierId: string, amountUSD: number, _method: string, _bank: string, _notes?: string) => {
    const updated = suppliers.map((s) => {
      if (s.id === supplierId) {
        return { ...s, balanceUSD: Math.max(0, s.balanceUSD - amountUSD) };
      }
      return s;
    });
    setSuppliers(updated);
    save(STORAGE_KEYS.SUPPLIERS, updated);
  };

  // Fleet
  const addTripLog = (trip: Omit<TripLog, 'id'>) => {
    const newLog: TripLog = { ...trip, id: 'trip-' + Date.now() };
    const updatedLogs = [newLog, ...tripLogs];
    setTripLogs(updatedLogs);
    save(STORAGE_KEYS.TRIP_LOGS, updatedLogs);

    // Update vehicle odometer and status
    const updatedVehicles = vehicles.map((v) => {
      if (v.id === trip.vehicleId || v.plateNumber === trip.plateNumber) {
        const newOdo = Math.max(v.lastOdometerKm, trip.endKm);
        const drivenSinceOil = newOdo - v.lastOilChangeKm;
        return {
          ...v,
          lastOdometerKm: newOdo,
          status: drivenSinceOil >= 1500 ? ('MAINTENANCE_REQUIRED' as const) : ('ACTIVE' as const),
        };
      }
      return v;
    });
    setVehicles(updatedVehicles);
    save(STORAGE_KEYS.VEHICLES, updatedVehicles);
  };

  const registerOilChange = (vehicleId: string, cost: number, centerName: string, notes?: string) => {
    const targetVeh = vehicles.find((v) => v.id === vehicleId);
    if (!targetVeh) return;

    const newMaintLog: MaintenanceLog = {
      id: 'maint-' + Date.now(),
      vehicleId,
      plateNumber: targetVeh.plateNumber,
      serviceType: 'تغيير زيت وفلاتر كامل (1,500 كم)',
      serviceKm: targetVeh.lastOdometerKm,
      cost,
      date: new Date().toISOString().split('T')[0],
      centerName,
      notes: notes || 'تم تصفير عداد الزيت وإعادة فحص المحرك بنجاح.',
    };

    const updatedMaint = [newMaintLog, ...maintenanceLogs];
    setMaintenanceLogs(updatedMaint);
    save(STORAGE_KEYS.MAINTENANCE_LOGS, updatedMaint);

    const updatedVehicles = vehicles.map((v) => {
      if (v.id === vehicleId) {
        return {
          ...v,
          lastOilChangeKm: v.lastOdometerKm,
          nextOilChangeAlertKm: v.lastOdometerKm + 1500,
          status: 'ACTIVE' as const,
        };
      }
      return v;
    });
    setVehicles(updatedVehicles);
    save(STORAGE_KEYS.VEHICLES, updatedVehicles);
  };

  const addVehicle = (vehicle: Vehicle) => {
    const updated = [vehicle, ...vehicles];
    setVehicles(updated);
    save(STORAGE_KEYS.VEHICLES, updated);
  };

  // Shipments
  const addShipment = (shipment: ImportShipment) => {
    const updated = [shipment, ...shipments];
    setShipments(updated);
    save(STORAGE_KEYS.SHIPMENTS, updated);
  };

  const updateShipmentStatus = (id: string, status: ImportShipment['status']) => {
    const updated = shipments.map((s) => (s.id === id ? { ...s, status } : s));
    setShipments(updated);
    save(STORAGE_KEYS.SHIPMENTS, updated);
  };

  // Sales & Invoices
  const addInvoice = (inv: Omit<SalesInvoice, 'id'>) => {
    const newInvoice: SalesInvoice = { ...inv, id: 'inv-' + Date.now() };
    const updatedInvoices = [newInvoice, ...invoices];
    setInvoices(updatedInvoices);
    save(STORAGE_KEYS.INVOICES, updatedInvoices);

    // Update customer balance if credit/installment
    if (newInvoice.remainingAmount > 0) {
      const updatedCustomers = customers.map((c) => {
        if (c.id === newInvoice.customerId) {
          return {
            ...c,
            balance: c.balance + newInvoice.remainingAmount,
            totalPurchases: c.totalPurchases + newInvoice.totalAmount,
          };
        }
        return c;
      });
      setCustomers(updatedCustomers);
      save(STORAGE_KEYS.CUSTOMERS, updatedCustomers);
    }

    // Deduct stock for items
    newInvoice.items.forEach((item) => {
      adjustStock(item.itemId, -item.quantity, `فاتورة مبيعات ${newInvoice.invoiceNumber}`);
    });
  };

  // Installments
  const payInstallment = (id: string) => {
    const target = installments.find((inst) => inst.id === id);
    if (!target) return;

    const updated = installments.map((inst) =>
      inst.id === id
        ? {
            ...inst,
            status: 'PAID' as const,
            paidAt: new Date().toISOString().split('T')[0],
          }
        : inst
    );
    setInstallments(updated);
    save(STORAGE_KEYS.INSTALLMENTS, updated);

    // Update customer debt
    const invoice = invoices.find((inv) => inv.id === target.invoiceId);
    if (invoice) {
      addCustomerPayment(invoice.customerId, target.amount, 'سداد قسط دوري');
    }
  };

  // Cheques
  const clearCheque = (id: string) => {
    const updated = cheques.map((chk) => (chk.id === id ? { ...chk, status: 'CLEARED' as const } : chk));
    setCheques(updated);
    save(STORAGE_KEYS.CHEQUES, updated);
  };

  const addCheque = (cheque: Omit<ChequeRecord, 'id'>) => {
    const newCheque: ChequeRecord = { ...cheque, id: 'chk-' + Date.now() };
    const updated = [newCheque, ...cheques];
    setCheques(updated);
    save(STORAGE_KEYS.CHEQUES, updated);
  };

  // Employees & Payroll
  const addEmployee = (emp: Employee) => {
    const updated = [emp, ...employees];
    setEmployees(updated);
    save(STORAGE_KEYS.EMPLOYEES, updated);
  };

  const addPayroll = (pr: Omit<PayrollRecord, 'id'>) => {
    const newPr: PayrollRecord = { ...pr, id: 'pay-' + Date.now() };
    const updated = [newPr, ...payrolls];
    setPayrolls(updated);
    save(STORAGE_KEYS.PAYROLLS, updated);
  };

  const addTripBonus = (employeeId: string, amount: number, _notes?: string) => {
    const updated = employees.map((emp) => {
      if (emp.id === employeeId) {
        return {
          ...emp,
          tripBonusesThisMonth: emp.tripBonusesThisMonth + amount,
        };
      }
      return emp;
    });
    setEmployees(updated);
    save(STORAGE_KEYS.EMPLOYEES, updated);
  };

  const resetAllData = () => {
    setProducts(INITIAL_PRODUCTS);
    setCustomers(INITIAL_CUSTOMERS);
    setSuppliers(INITIAL_SUPPLIERS);
    setVehicles(INITIAL_VEHICLES);
    setTripLogs(INITIAL_TRIP_LOGS);
    setMaintenanceLogs([]);
    setShipments(INITIAL_IMPORT_SHIPMENTS);
    setInvoices(INITIAL_SALES_INVOICES);
    setInstallments(INITIAL_INSTALLMENTS);
    setCheques(INITIAL_CHEQUES);
    setEmployees(INITIAL_EMPLOYEES);
    setPayrolls(INITIAL_PAYROLLS);
    setUsdToEgpRateState(48.5);
    setUsdToOmrRateState(0.385);

    Object.values(STORAGE_KEYS).forEach((key) => {
      try {
        localStorage.removeItem(key);
      } catch {}
    });
  };

  return (
    <AppContext.Provider
      value={{
        selectedBranch,
        setSelectedBranch,
        usdToEgpRate,
        setUsdToEgpRate,
        usdToOmrRate,
        setUsdToOmrRate,
        currentUser,
        setCurrentUser,

        products,
        addProduct,
        updateProduct,
        adjustStock,

        customers,
        addCustomer,
        addCustomerPayment,

        suppliers,
        addSupplier,
        addSupplierPayment,

        vehicles,
        tripLogs,
        maintenanceLogs,
        addTripLog,
        registerOilChange,
        addVehicle,

        shipments,
        addShipment,
        updateShipmentStatus,

        invoices,
        addInvoice,

        installments,
        payInstallment,

        cheques,
        clearCheque,
        addCheque,

        employees,
        payrolls,
        addEmployee,
        addPayroll,
        addTripBonus,

        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
