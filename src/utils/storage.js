import { generateMockProducts } from './mockData';

const STORAGE_KEYS = {
  PRODUCTS: 'inventory_products',
  MOVEMENTS: 'inventory_movements',
  SETTINGS: 'inventory_settings',
};

/**
 * Initialize storage with mock data if empty
 */
export const initializeData = () => {
  const existingProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  
  if (!existingProducts) {
    const mockProducts = generateMockProducts(30);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(mockProducts));
  }

  const existingMovements = localStorage.getItem(STORAGE_KEYS.MOVEMENTS);
  if (!existingMovements) {
    localStorage.setItem(STORAGE_KEYS.MOVEMENTS, JSON.stringify([]));
  }

  const existingSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  if (!existingSettings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify({
      currency: 'USD',
      language: 'es',
    }));
  }
};

/**
 * Get all products
 */
export const getProducts = () => {
  const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  return data ? JSON.parse(data) : [];
};

/**
 * Save products
 */
export const saveProducts = (products) => {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
};

/**
 * Add a new product
 */
export const addProduct = (product) => {
  const products = getProducts();
  const newProduct = {
    ...product,
    id: Math.max(...products.map(p => p.id), 0) + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  products.push(newProduct);
  saveProducts(products);
  return newProduct;
};

/**
 * Update a product
 */
export const updateProduct = (id, updates) => {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index === -1) throw new Error('Product not found');
  
  products[index] = {
    ...products[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveProducts(products);
  return products[index];
};

/**
 * Delete a product
 */
export const deleteProduct = (id) => {
  const products = getProducts();
  const filtered = products.filter(p => p.id !== id);
  saveProducts(filtered);
};

/**
 * Duplicate a product
 */
export const duplicateProduct = (id) => {
  const products = getProducts();
  const product = products.find(p => p.id === id);
  if (!product) throw new Error('Product not found');
  
  const duplicate = {
    ...product,
    id: Math.max(...products.map(p => p.id), 0) + 1,
    name: `${product.name} (Copia)`,
    sku: `${product.sku}-DUP`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  products.push(duplicate);
  saveProducts(products);
  return duplicate;
};

/**
 * Get all movements
 */
export const getMovements = () => {
  const data = localStorage.getItem(STORAGE_KEYS.MOVEMENTS);
  return data ? JSON.parse(data) : [];
};

/**
 * Add a movement
 */
export const addMovement = (movement) => {
  const movements = getMovements();
  const newMovement = {
    ...movement,
    id: Math.max(...movements.map(m => m.id), 0) + 1,
    timestamp: new Date().toISOString(),
  };
  movements.push(newMovement);
  localStorage.setItem(STORAGE_KEYS.MOVEMENTS, JSON.stringify(movements));
  return newMovement;
};

/**
 * Get product status
 */
export const getProductStatus = (quantity, minStock) => {
  if (quantity === 0) return 'Agotado';
  if (quantity <= minStock) return 'Bajo stock';
  return 'Disponible';
};

/**
 * Calculate inventory value
 */
export const calculateInventoryValue = (products) => {
  return products.reduce((total, product) => {
    return total + (product.quantity * product.sellPrice);
  }, 0);
};

/**
 * Export to CSV
 */
export const exportToCSV = (products, filename = 'inventario.csv') => {
  const headers = [
    'ID',
    'SKU',
    'Código de Barras',
    'Nombre',
    'Categoría',
    'Marca',
    'Proveedor',
    'Precio de Compra',
    'Precio de Venta',
    'Cantidad',
    'Stock Mínimo',
    'Estado',
    'Ubicación',
    'Fecha de Ingreso',
  ];

  const rows = products.map(p => [
    p.id,
    p.sku,
    p.barcode,
    p.name,
    p.category,
    p.brand,
    p.provider,
    p.costPrice,
    p.sellPrice,
    p.quantity,
    p.minStock,
    p.status,
    p.location,
    new Date(p.createdAt).toLocaleDateString('es-ES'),
  ]);

  let csv = headers.join(',') + '\n';
  rows.forEach(row => {
    csv += row.map(cell => `"${cell}"`).join(',') + '\n';
  });

  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

/**
 * Export to Excel (JSON format)
 */
export const exportToExcel = (products, filename = 'inventario.json') => {
  const dataStr = JSON.stringify(products, null, 2);
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(dataStr));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};