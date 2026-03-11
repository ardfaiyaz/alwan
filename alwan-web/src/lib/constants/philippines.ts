export const PROVINCES = [
  'Metro Manila',
  'Abra',
  'Agusan del Norte',
  'Agusan del Sur',
  'Aklan',
  'Albay',
  'Antique',
  'Apayao',
  'Aurora',
  'Basilan',
  'Bataan',
  'Batanes',
  'Batangas',
  'Benguet',
  'Biliran',
  'Bohol',
  'Bukidnon',
  'Bulacan',
  'Cagayan',
  'Camarines Norte',
  'Camarines Sur',
  'Camiguin',
  'Capiz',
  'Catanduanes',
  'Cavite',
  'Cebu',
  'Cotabato',
  'Davao de Oro',
  'Davao del Norte',
  'Davao del Sur',
  'Davao Occidental',
  'Davao Oriental',
  'Dinagat Islands',
  'Eastern Samar',
  'Guimaras',
  'Ifugao',
  'Ilocos Norte',
  'Ilocos Sur',
  'Iloilo',
  'Isabela',
  'Kalinga',
  'La Union',
  'Laguna',
  'Lanao del Norte',
  'Lanao del Sur',
  'Leyte',
  'Maguindanao',
  'Marinduque',
  'Masbate',
  'Misamis Occidental',
  'Misamis Oriental',
  'Mountain Province',
  'Negros Occidental',
  'Negros Oriental',
  'Northern Samar',
  'Nueva Ecija',
  'Nueva Vizcaya',
  'Occidental Mindoro',
  'Oriental Mindoro',
  'Palawan',
  'Pampanga',
  'Pangasinan',
  'Quezon',
  'Quirino',
  'Rizal',
  'Romblon',
  'Samar',
  'Sarangani',
  'Siquijor',
  'Sorsogon',
  'South Cotabato',
  'Southern Leyte',
  'Sultan Kudarat',
  'Sulu',
  'Surigao del Norte',
  'Surigao del Sur',
  'Tarlac',
  'Tawi-Tawi',
  'Zambales',
  'Zamboanga del Norte',
  'Zamboanga del Sur',
  'Zamboanga Sibugay',
]

export const CITIES_BY_PROVINCE: Record<string, string[]> = {
  'Metro Manila': [
    'Caloocan',
    'Las Piñas',
    'Makati',
    'Malabon',
    'Mandaluyong',
    'Manila',
    'Marikina',
    'Muntinlupa',
    'Navotas',
    'Parañaque',
    'Pasay',
    'Pasig',
    'Quezon City',
    'San Juan',
    'Taguig',
    'Valenzuela',
  ],
  'Cebu': [
    'Cebu City',
    'Mandaue',
    'Lapu-Lapu',
    'Talisay',
    'Toledo',
    'Danao',
    'Carcar',
    'Naga',
    'Bogo',
  ],
  'Davao del Sur': [
    'Davao City',
    'Digos',
  ],
  'Laguna': [
    'Calamba',
    'Santa Rosa',
    'Biñan',
    'San Pedro',
    'Cabuyao',
    'San Pablo',
  ],
  'Cavite': [
    'Bacoor',
    'Dasmariñas',
    'Imus',
    'Cavite City',
    'Tagaytay',
    'Trece Martires',
    'General Trias',
  ],
  'Bulacan': [
    'Malolos',
    'Meycauayan',
    'San Jose del Monte',
  ],
  'Pampanga': [
    'Angeles',
    'San Fernando',
    'Mabalacat',
  ],
  'Batangas': [
    'Batangas City',
    'Lipa',
    'Tanauan',
  ],
  'Rizal': [
    'Antipolo',
  ],
  'Pangasinan': [
    'Dagupan',
    'San Carlos',
    'Urdaneta',
    'Alaminos',
  ],
  'Iloilo': [
    'Iloilo City',
    'Passi',
  ],
  'Negros Occidental': [
    'Bacolod',
    'Bago',
    'Cadiz',
    'Escalante',
    'Himamaylan',
    'Kabankalan',
    'La Carlota',
    'Sagay',
    'San Carlos',
    'Silay',
    'Sipalay',
    'Talisay',
    'Victorias',
  ],
}

export const ID_TYPES = [
  { value: 'national_id', label: 'National ID (PhilSys)' },
  { value: 'drivers_license', label: "Driver's License" },
  { value: 'passport', label: 'Passport' },
  { value: 'umid', label: 'UMID' },
  { value: 'philhealth', label: 'PhilHealth ID' },
]

export const BUSINESS_TYPES = [
  'Sari-sari Store',
  'Food Vendor',
  'Online Seller',
  'Small Retail',
  'Carinderia',
  'Bakery',
  'Laundry Shop',
  'Beauty Salon',
  'Barbershop',
  'Tailoring',
  'Repair Shop',
  'Transportation',
  'Agriculture',
  'Livestock',
  'Fishing',
  'Construction',
  'Services',
  'Other',
]

export const REGISTRATION_TYPES = [
  { value: 'dti', label: 'DTI Registration' },
  { value: 'barangay_permit', label: 'Barangay Permit' },
  { value: 'sec', label: 'SEC Registration' },
  { value: 'none', label: 'None' },
]

export const CIVIL_STATUS_OPTIONS = [
  { value: 'single', label: 'Single' },
  { value: 'married', label: 'Married' },
  { value: 'widowed', label: 'Widowed' },
  { value: 'separated', label: 'Separated' },
  { value: 'divorced', label: 'Divorced' },
]

export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Prefer not to say' },
]

export const HOUSING_TYPE_OPTIONS = [
  { value: 'owned', label: 'Owned' },
  { value: 'renting', label: 'Renting' },
  { value: 'living_with_family', label: 'Living with Family' },
]

// Number of Dependents Options
export const DEPENDENTS_OPTIONS = [
  { value: '0', label: '0' },
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5' },
  { value: '6', label: '6' },
  { value: '7+', label: '7+' },
]

// Years Living Options
export const YEARS_LIVING_OPTIONS = [
  { value: 'less_than_6_months', label: 'Less than 6 months' },
  { value: '6_months_1_year', label: '6 months – 1 year' },
  { value: '1_2_years', label: '1 – 2 years' },
  { value: '2_5_years', label: '2 – 5 years' },
  { value: '5_10_years', label: '5 – 10 years' },
  { value: '10_20_years', label: '10 – 20 years' },
  { value: '20_plus_years', label: '20+ years' },
]

// Years Operating Options
export const YEARS_OPERATING_OPTIONS = [
  { value: 'less_than_6_months', label: 'Less than 6 months' },
  { value: '6_months_1_year', label: '6 months – 1 year' },
  { value: '1_2_years', label: '1 – 2 years' },
  { value: '2_3_years', label: '2 – 3 years' },
  { value: '3_5_years', label: '3 – 5 years' },
  { value: '5_10_years', label: '5 – 10 years' },
  { value: '10_plus_years', label: '10+ years' },
]

// Daily Sales Options
export const DAILY_SALES_OPTIONS = [
  { value: '0_500', label: '₱0 – ₱500' },
  { value: '501_1000', label: '₱501 – ₱1,000' },
  { value: '1001_3000', label: '₱1,001 – ₱3,000' },
  { value: '3001_5000', label: '₱3,001 – ₱5,000' },
  { value: '5001_10000', label: '₱5,001 – ₱10,000' },
  { value: '10001_20000', label: '₱10,001 – ₱20,000' },
  { value: '20001_50000', label: '₱20,001 – ₱50,000' },
  { value: '50001_plus', label: '₱50,001+' },
]

// Monthly Revenue Options
export const MONTHLY_REVENUE_OPTIONS = [
  { value: 'below_10000', label: 'Below ₱10,000' },
  { value: '10000_20000', label: '₱10,000 – ₱20,000' },
  { value: '20001_30000', label: '₱20,001 – ₱30,000' },
  { value: '30001_50000', label: '₱30,001 – ₱50,000' },
  { value: '50001_100000', label: '₱50,001 – ₱100,000' },
  { value: '100001_200000', label: '₱100,001 – ₱200,000' },
  { value: '200001_300000', label: '₱200,001 – ₱300,000' },
  { value: '300001_plus', label: '₱300,001+' },
]

// Number of Employees Options
export const EMPLOYEES_OPTIONS = [
  { value: '0', label: '0 (Self-employed)' },
  { value: '1_2', label: '1 – 2 employees' },
  { value: '3_5', label: '3 – 5 employees' },
  { value: '6_10', label: '6 – 10 employees' },
  { value: '11_20', label: '11 – 20 employees' },
  { value: '21_plus', label: '21+' },
]

// Monthly Income Options
export const MONTHLY_INCOME_OPTIONS = [
  { value: 'below_10000', label: 'Below ₱10,000' },
  { value: '10000_20000', label: '₱10,000 – ₱20,000' },
  { value: '20001_30000', label: '₱20,001 – ₱30,000' },
  { value: '30001_50000', label: '₱30,001 – ₱50,000' },
  { value: '50001_100000', label: '₱50,001 – ₱100,000' },
  { value: '100001_200000', label: '₱100,001 – ₱200,000' },
  { value: '200001_plus', label: '₱200,001+' },
]

// Monthly Expenses Options
export const MONTHLY_EXPENSES_OPTIONS = [
  { value: 'below_5000', label: 'Below ₱5,000' },
  { value: '5000_10000', label: '₱5,000 – ₱10,000' },
  { value: '10001_20000', label: '₱10,001 – ₱20,000' },
  { value: '20001_30000', label: '₱20,001 – ₱30,000' },
  { value: '30001_50000', label: '₱30,001 – ₱50,000' },
  { value: '50001_plus', label: '₱50,001+' },
]

// Loan Amount Options
export const LOAN_AMOUNT_OPTIONS = [
  { value: '0_5000', label: '₱0 – ₱5,000' },
  { value: '5001_10000', label: '₱5,001 – ₱10,000' },
  { value: '10001_20000', label: '₱10,001 – ₱20,000' },
  { value: '20001_50000', label: '₱20,001 – ₱50,000' },
  { value: '50001_100000', label: '₱50,001 – ₱100,000' },
  { value: '100001_200000', label: '₱100,001 – ₱200,000' },
  { value: '200001_plus', label: '₱200,001+' },
]

// Asset Value Options
export const ASSET_VALUE_OPTIONS = [
  { value: 'below_10000', label: 'Below ₱10,000' },
  { value: '10000_50000', label: '₱10,000 – ₱50,000' },
  { value: '50001_100000', label: '₱50,001 – ₱100,000' },
  { value: '100001_300000', label: '₱100,001 – ₱300,000' },
  { value: '300001_500000', label: '₱300,001 – ₱500,000' },
  { value: '500001_1000000', label: '₱500,001 – ₱1,000,000' },
  { value: '1000000_plus', label: '₱1,000,000+' },
]
