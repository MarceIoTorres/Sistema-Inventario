import { useState } from 'react';
import Card from '../components/common/Card';
import { getProducts } from '../utils/storage';
import { formatCurrency, formatNumber } from '../utils/formatters';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ReportsPage = () => {
  const [products] = useState(getProducts());

  // Report 1: Inventory Value by Category
  const categoryValue = products.reduce((acc, product) => {
    const existing = acc.find(item => item.category === product.category);
    const value = product.quantity * product.sellPrice;
    if (existing) {
      existing.value += value;
    } else {
      acc.push({ category: product.category, value });
    }
    return acc;
  }, []);

  const categoryValueChart = {
    labels: categoryValue.map(item => item.category),
    datasets: [
      {
        label: 'Valor del Inventario por Categoría',
        data: categoryValue.map(item => item.value),
        backgroundColor: [
          'rgba(59, 130, 246, 0.5)',
          'rgba(16, 185, 129, 0.5)',
          'rgba(251, 146, 60, 0.5)',
          'rgba(239, 68, 68, 0.5)',
          'rgba(168, 85, 247, 0.5)',
          'rgba(6, 182, 212, 0.5)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(251, 146, 60, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(168, 85, 247, 1)',
          'rgba(6, 182, 212, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Report 2: Stock Levels by Provider
  const providerStock = products.reduce((acc, product) => {
    const existing = acc.find(item => item.provider === product.provider);
    if (existing) {
      existing.quantity += product.quantity;
    } else {
      acc.push({ provider: product.provider, quantity: product.quantity });
    }
    return acc;
  }, []).sort((a, b) => b.quantity - a.quantity).slice(0, 10);

  const providerStockChart = {
    labels: providerStock.map(item => item.provider),
    datasets: [
      {
        label: 'Cantidad de Producto',
        data: providerStock.map(item => item.quantity),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Report 3: Stock Status Distribution
  const criticalProducts = products.filter(p => p.quantity === 0);
  const lowStockProducts = products.filter(p => p.quantity > 0 && p.quantity <= p.minStock);
  const normalProducts = products.filter(p => p.quantity > p.minStock);

  const statusChart = {
    labels: ['Disponible', 'Bajo Stock', 'Agotado'],
    datasets: [
      {
        data: [normalProducts.length, lowStockProducts.length, criticalProducts.length],
        backgroundColor: [
          'rgba(16, 185, 129, 0.7)',
          'rgba(251, 146, 60, 0.7)',
          'rgba(239, 68, 68, 0.7)',
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(251, 146, 60, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Report 4: Top 10 Products by Value
  const topProductsByValue = [...products]
    .sort((a, b) => (b.quantity * b.sellPrice) - (a.quantity * a.sellPrice))
    .slice(0, 10);

  const topProductsChart = {
    labels: topProductsByValue.map(p => p.name.substring(0, 15)),
    datasets: [
      {
        label: 'Valor del Inventario',
        data: topProductsByValue.map(p => p.quantity * p.sellPrice),
        backgroundColor: 'rgba(168, 85, 247, 0.5)',
        borderColor: 'rgba(168, 85, 247, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Summary Statistics
  const totalInventoryValue = products.reduce((sum, p) => sum + (p.quantity * p.sellPrice), 0);
  const totalCostValue = products.reduce((sum, p) => sum + (p.quantity * p.costPrice), 0);
  const profitMargin = totalInventoryValue - totalCostValue;
  const avgProductValue = products.length > 0 ? totalInventoryValue / products.length : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Reportes</h2>
        <p className="text-gray-600 dark:text-gray-400">Análisis y visualización de datos del inventario</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">Valor Total Inventario</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            {formatCurrency(totalInventoryValue)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {formatNumber(products.length)} productos
          </p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">Costo Total</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            {formatCurrency(totalCostValue)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Inversión en inventario
          </p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">Margen de Ganancia</p>
          <p className="text-2xl font-bold text-green-600 mt-2">
            {formatCurrency(profitMargin)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {((profitMargin / totalInventoryValue) * 100).toFixed(1)}% de margen
          </p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">Valor Promedio</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            {formatCurrency(avgProductValue)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Por producto
          </p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inventory Value by Category */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Valor del Inventario por Categoría
          </h3>
          <Bar data={categoryValueChart} options={{ responsive: true, maintainAspectRatio: true }} />
        </Card>

        {/* Stock Status Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Distribución de Estado
          </h3>
          <Pie data={statusChart} options={{ responsive: true, maintainAspectRatio: true }} />
        </Card>

        {/* Provider Stock Levels */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Cantidad de Producto por Proveedor
          </h3>
          <Bar data={providerStockChart} options={{ responsive: true, maintainAspectRatio: true }} />
        </Card>

        {/* Top Products */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top 10 Productos por Valor
          </h3>
          <Line
            data={topProductsChart}
            options={{
              responsive: true,
              maintainAspectRatio: true,
              scales: { y: { beginAtZero: true } },
            }}
          />
        </Card>
      </div>

      {/* Critical Products Table */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Productos Críticos (Agotados)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-2 text-left font-semibold">SKU</th>
                <th className="px-4 py-2 text-left font-semibold">Nombre</th>
                <th className="px-4 py-2 text-left font-semibold">Categoría</th>
                <th className="px-4 py-2 text-left font-semibold">Proveedor</th>
                <th className="px-4 py-2 text-right font-semibold">Precio Venta</th>
              </tr>
            </thead>
            <tbody>
              {criticalProducts.map(product => (
                <tr key={product.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-4 py-2">{product.sku}</td>
                  <td className="px-4 py-2">{product.name}</td>
                  <td className="px-4 py-2">{product.category}</td>
                  <td className="px-4 py-2">{product.provider}</td>
                  <td className="px-4 py-2 text-right">{formatCurrency(product.sellPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Low Stock Products Table */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Productos con Bajo Stock
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-2 text-left font-semibold">SKU</th>
                <th className="px-4 py-2 text-left font-semibold">Nombre</th>
                <th className="px-4 py-2 text-center font-semibold">Stock Actual</th>
                <th className="px-4 py-2 text-center font-semibold">Stock Mínimo</th>
                <th className="px-4 py-2 text-left font-semibold">Categoría</th>
              </tr>
            </thead>
            <tbody>
              {lowStockProducts.map(product => (
                <tr key={product.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-4 py-2">{product.sku}</td>
                  <td className="px-4 py-2">{product.name}</td>
                  <td className="px-4 py-2 text-center font-semibold text-yellow-600">{product.quantity}</td>
                  <td className="px-4 py-2 text-center">{product.minStock}</td>
                  <td className="px-4 py-2">{product.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default ReportsPage;