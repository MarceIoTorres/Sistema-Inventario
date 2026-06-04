import { useState } from 'react';
import { Plus, Search, Download } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import Table from '../components/common/Table';
import Badge from '../components/common/Badge';
import { getProducts, addProduct, updateProduct, deleteProduct, duplicateProduct, exportToCSV, exportToExcel } from '../utils/storage';
import { formatCurrency, formatDate } from '../utils/formatters';
import { validateProduct, isSkuUnique } from '../utils/validators';
import { useSearch } from '../hooks/useSearch';
import { usePagination } from '../hooks/usePagination';
import { useSort } from '../hooks/useSort';
import ProductForm from '../components/products/ProductForm';

const ProductsPage = () => {
  const [products, setProducts] = useState(getProducts());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);

  const { searchTerm, setSearchTerm, filteredItems: searchedProducts } = useSearch(products, ['name', 'sku', 'category']);
  const { sortedItems, sortConfig, setSortKey } = useSort(searchedProducts);
  const { currentItems, ...pagination } = usePagination(sortedItems, 10);

  const handleAddProduct = (formData) => {
    try {
      addProduct(formData);
      setProducts(getProducts());
      setIsModalOpen(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleUpdateProduct = (formData) => {
    try {
      updateProduct(editingProduct.id, formData);
      setProducts(getProducts());
      setIsModalOpen(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDeleteProduct = (id) => {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      deleteProduct(id);
      setProducts(getProducts());
    }
  };

  const handleDuplicateProduct = (id) => {
    try {
      duplicateProduct(id);
      setProducts(getProducts());
    } catch (error) {
      console.error('Error duplicating product:', error);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (selected) => {
    setSelectedRows(selected ? currentItems.map(p => p.id) : []);
  };

  const columns = [
    { key: 'sku', label: 'SKU', sortable: true },
    { key: 'name', label: 'Nombre', sortable: true },
    { key: 'category', label: 'Categoría', sortable: true },
    {
      key: 'quantity',
      label: 'Stock',
      sortable: true,
      render: (value, row) => (
        <Badge variant={row.status === 'Disponible' ? 'success' : row.status === 'Bajo stock' ? 'warning' : 'danger'}>
          {value}
        </Badge>
      ),
    },
    {
      key: 'sellPrice',
      label: 'Precio Venta',
      sortable: true,
      render: value => formatCurrency(value),
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Productos</h2>
          <p className="text-gray-600 dark:text-gray-400">Administra el catálogo de productos</p>
        </div>
        <Button onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" /> Nuevo Producto
        </Button>
      </div>

      {/* Search and Export */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              label="Buscar"
              placeholder="SKU, nombre, categoría..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => exportToCSV(products)}>
              <Download className="w-4 h-4 mr-2" /> CSV
            </Button>
            <Button variant="secondary" onClick={() => exportToExcel(products)}>
              <Download className="w-4 h-4 mr-2" /> JSON
            </Button>
          </div>
        </div>
      </Card>

      {/* Products Table */}
      <Card className="overflow-hidden">
        <Table
          columns={columns}
          data={currentItems}
          onSort={setSortKey}
          sortConfig={sortConfig}
          selectable={true}
          selectedRows={selectedRows}
          onSelectRow={handleSelectRow}
          onSelectAll={handleSelectAll}
          pagination={pagination}
        />
      </Card>

      {/* Product Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingProduct(null); }}
        title={editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
        size="2xl"
      >
        <ProductForm
          product={editingProduct}
          onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
          onCancel={() => { setIsModalOpen(false); setEditingProduct(null); }}
        />
      </Modal>
    </div>
  );
};

export default ProductsPage;