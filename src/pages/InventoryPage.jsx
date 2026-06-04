import { useState } from 'react';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import Badge from '../components/common/Badge';
import Input from '../components/common/Input';
import { getProducts } from '../utils/storage';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useSearch } from '../hooks/useSearch';
import { usePagination } from '../hooks/usePagination';
import { useSort } from '../hooks/useSort';

const InventoryPage = () => {
  const [products] = useState(getProducts());
  const { searchTerm, setSearchTerm, filteredItems } = useSearch(products, ['name', 'sku', 'category']);
  const { sortedItems, sortConfig, setSortKey } = useSort(filteredItems);
  const { currentItems, ...pagination } = usePagination(sortedItems, 15);

  const columns = [
    { key: 'sku', label: 'SKU', sortable: true },
    { key: 'name', label: 'Nombre', sortable: true },
    { key: 'category', label: 'Categoría', sortable: true },
    { key: 'brand', label: 'Marca', sortable: true },
    { key: 'provider', label: 'Proveedor', sortable: true },
    {
      key: 'quantity',
      label: 'Stock Actual',
      sortable: true,
      render: (value, row) => (
        <span className={`font-semibold ${
          value === 0 ? 'text-red-600' : value <= row.minStock ? 'text-yellow-600' : 'text-green-600'
        }`}>
          {value} / {row.minStock}
        </span>
      ),
    },
    {
      key: 'costPrice',
      label: 'Precio Compra',
      sortable: true,
      render: value => formatCurrency(value),
    },
    {
      key: 'sellPrice',
      label: 'Precio Venta',
      sortable: true,
      render: value => formatCurrency(value),
    },
    {
      key: 'location',
      label: 'Ubicación',
      sortable: true,
    },
    {
      key: 'status',
      label: 'Estado',
      render: value => (
        <Badge variant={value === 'Disponible' ? 'success' : value === 'Bajo stock' ? 'warning' : 'danger'}>
          {value}
        </Badge>
      ),
    },
  ];

  const stats = {
    total: products.length,
    available: products.filter(p => p.quantity > p.minStock).length,
    lowStock: products.filter(p => p.quantity > 0 && p.quantity <= p.minStock).length,
    outOfStock: products.filter(p => p.quantity === 0).length,
    value: products.reduce((sum, p) => sum + (p.quantity * p.sellPrice), 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Tabla de Inventario</h2>
        <p className="text-gray-600 dark:text-gray-400">Vista completa del estado del inventario</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Productos</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Disponibles</p>
          <p className="text-2xl font-bold text-green-600">{stats.available}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Bajo Stock</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.lowStock}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Agotados</p>
          <p className="text-2xl font-bold text-red-600">{stats.outOfStock}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Valor Total</p>
          <p className="text-2xl font-bold text-primary-600">{formatCurrency(stats.value)}</p>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4">
        <Input
          label="Buscar Producto"
          placeholder="SKU, nombre, categoría..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <Table
          columns={columns}
          data={currentItems}
          onSort={setSortKey}
          sortConfig={sortConfig}
          pagination={pagination}
        />
      </Card>
    </div>
  );
};

export default InventoryPage;