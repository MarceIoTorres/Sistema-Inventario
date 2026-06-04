import { useState } from 'react';
import { Package, AlertCircle, TrendingUp, DollarSign } from 'lucide-react';
import KPICard from '../components/common/KPICard';
import Card from '../components/common/Card';
import { getProducts, getMovements } from '../utils/storage';
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

const Dashboard = () => {
  const products = getProducts();
  const movements = getMovements();

  // Calculate KPIs
  const totalProducts = products.length;
  const totalUnits = products.reduce((sum, p) => sum + p.quantity, 0);
  const inventoryValue = products.reduce((sum, p) => sum + (p.quantity * p.sellPrice), 0);
  const lowStockProducts = products.filter(p => p.quantity > 0 && p.quantity <= p.minStock).length;
  const outOfStockProducts = products.filter(p => p.quantity === 0).length;

  // Chart data
  const categoryData = products.reduce((acc, product) => {
    const existing = acc.find(item => item.category === product.category);
    if (existing) {
      existing.quantity += product.quantity;
    } else {
      acc.push({ category: product.category, quantity: product.quantity });
    }
    return acc;
  }, []);

  const inventoryChartData = {
    labels: categoryData.map(item => item.category),
    datasets: [
      {
        label: 'Cantidad por Categoría',
        data: categoryData.map(item => item.quantity),
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

  // Top products by value
  const topProductsByValue = [...products]
    .sort((a, b) => (b.quantity * b.sellPrice) - (a.quantity * a.sellPrice))
    .slice(0, 5);

  const salesChartData = {
    labels: topProductsByValue.map(p => p.name.substring(0, 15)),
    datasets: [
      {
        label: 'Valor de Inventario',
        data: topProductsByValue.map(p => p.quantity * p.sellPrice),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Status distribution
  const statusData = {
    available: products.filter(p => p.quantity > p.minStock).length,
    lowStock: lowStockProducts,
    outOfStock: outOfStockProducts,
  };

  const statusChartData = {
    labels: ['Disponible', 'Bajo Stock', 'Agotado'],
    datasets: [
      {
        data: [statusData.available, statusData.lowStock, statusData.outOfStock],
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
        <p className="text-gray-600 dark:text-gray-400">Resumen del estado del inventario</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard
          icon={Package}
          title="Total Productos"
          value={formatNumber(totalProducts)}
          subtitle="En catálogo"
        />
        <KPICard
          icon={TrendingUp}
          title="Unidades en Stock"
          value={formatNumber(totalUnits)}
          subtitle="Todas las categorías"
        />
        <KPICard
          icon={DollarSign}
          title="Valor Inventario"
          value={formatCurrency(inventoryValue)}
          subtitle="Precio de venta"
        />
        <KPICard
          icon={AlertCircle}
          title="Bajo Stock"
          value={formatNumber(lowStockProducts)}
          subtitle="Requieren atención"
          trend={`${((lowStockProducts / totalProducts) * 100).toFixed(1)}%`}
          trendUp={false}
        />
        <KPICard
          icon={AlertCircle}
          title="Agotados"
          value={formatNumber(outOfStockProducts)}
          subtitle="Sin inventario"
          trend={`${((outOfStockProducts / totalProducts) * 100).toFixed(1)}%`}
          trendUp={false}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inventory by Category */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Inventario por Categoría
          </h3>
          <Bar data={inventoryChartData} options={{ responsive: true, maintainAspectRatio: true }} />
        </Card>

        {/* Status Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Distribución de Estado
          </h3>
          <Pie data={statusChartData} options={{ responsive: true, maintainAspectRatio: true }} />
        </Card>
      </div>

      {/* Top Products */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Productos con Mayor Valor
        </h3>
        <Line
          data={salesChartData}
          options={{
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: { display: true, position: 'top' },
            },
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          }}
        />
      </Card>

      {/* Recent Movements */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Movimientos Recientes
        </h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {movements.slice(-10).reverse().map(movement => (
            <div key={movement.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {movement.type} - Cantidad: {movement.quantity}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(movement.timestamp).toLocaleString('es-ES')}
                </p>
              </div>
              <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                movement.type === 'Entrada'
                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                  : movement.type === 'Salida'
                  ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                  : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
              }`}>
                {movement.type}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;