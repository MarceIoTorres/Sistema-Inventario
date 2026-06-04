# Sistema de Administración de Inventario

Una aplicación web moderna y profesional de gestión de inventario desarrollada con React, Tailwind CSS y Chart.js. Diseñada para empresas que necesitan control total sobre su inventario sin complicaciones backend.

## 🚀 Características

### Dashboard
- ✅ KPIs en tiempo real
- ✅ Gráficos interactivos con Chart.js
- ✅ Estado del inventario
- ✅ Productos críticos
- ✅ Historial de movimientos recientes

### Gestión de Productos
- ✅ Crear, editar, eliminar productos
- ✅ Duplicar productos
- ✅ Búsqueda instantánea
- ✅ Filtros avanzados
- ✅ Información completa (SKU, código de barras, precios, ubicación, etc.)
- ✅ Exportar a CSV y JSON

### Tabla de Inventario
- ✅ Vista completa de productos
- ✅ Paginación (15 productos por página)
- ✅ Ordenamiento por columnas
- ✅ Búsqueda en tiempo real
- ✅ Indicadores de estado

### Movimientos de Inventario
- ✅ Registrar entradas
- ✅ Registrar salidas
- ✅ Ajustes de inventario
- ✅ Historial completo
- ✅ Observaciones en movimientos

### Reportes Analíticos
- ✅ Valor del inventario por categoría
- ✅ Stock por proveedor
- ✅ Distribución de estado
- ✅ Top 10 productos por valor
- ✅ Productos críticos
- ✅ Productos con bajo stock

### Interfaz
- ✅ Diseño moderno tipo SaaS
- ✅ Sidebar colapsable
- ✅ Navbar profesional
- ✅ Modo claro y oscuro
- ✅ 100% responsive (móvil, tablet, escritorio)
- ✅ Animaciones suaves
- ✅ Iconos de Lucide

## 📋 Requisitos

- Node.js 14+ 
- npm o yarn
- Navegador moderno

## 🔧 Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/MarceIoTorres/Sistema-Inventario.git
cd Sistema-Inventario
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Iniciar servidor de desarrollo**
```bash
npm run dev
```

La aplicación se abrirá automáticamente en `http://localhost:5173`

## 🏗️ Estructura del Proyecto

```
src/
├── components/
│   ├── common/              # Componentes reutilizables
│   │   ├── Badge.jsx
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Input.jsx
│   │   ├── KPICard.jsx
│   │   ├── Modal.jsx
│   │   ├── Select.jsx
│   │   ├── Table.jsx
│   │   └── Textarea.jsx
│   ├── layout/              # Componentes de layout
│   │   ├── Navbar.jsx
│   │   └── Sidebar.jsx
│   └── products/            # Componentes de productos
│       └── ProductForm.jsx
├── hooks/                   # Custom hooks
│   ├── useFilter.js
│   ├── useLocalStorage.js
│   ├── usePagination.js
│   ├── useSearch.js
│   └── useSort.js
├── pages/                   # Páginas principales
│   ├── Dashboard.jsx
│   ├── InventoryPage.jsx
│   ├── MovementsPage.jsx
│   ├── ProductsPage.jsx
│   └── ReportsPage.jsx
├── utils/                   # Utilidades
│   ├── formatters.js        # Funciones de formato
│   ├── mockData.js          # Datos de ejemplo
│   ├── storage.js           # Funciones de LocalStorage
│   └── validators.js        # Validaciones
├── App.jsx                  # Componente principal
├── main.jsx                 # Punto de entrada
└── index.css               # Estilos globales
```

## 💾 Persistencia de Datos

Todos los datos se guardan automáticamente en **LocalStorage** del navegador:
- `inventory_products` - Catálogo de productos
- `inventory_movements` - Historial de movimientos
- `inventory_settings` - Configuración de la aplicación

La primera vez que abres la aplicación, se cargan automáticamente 30 productos de ejemplo.

## 🎨 Características de Diseño

### Paleta de Colores
- **Primario**: Azul cielo (#0ea5e9)
- **Éxito**: Verde (#10b981)
- **Alerta**: Naranja (#f97316)
- **Error**: Rojo (#ef4444)
- **Fondo**: Blanco/Gris oscuro

### Componentes UI
- Botones con múltiples variantes
- Inputs validados
- Tablas profesionales
- Modales modernas
- Cards con efectos
- Badges informativas

## 🚀 Uso

### Crear un Producto
1. Ir a "Productos"
2. Hacer clic en "Nuevo Producto"
3. Completar el formulario
4. Hacer clic en "Guardar Producto"

### Registrar un Movimiento
1. Ir a "Movimientos"
2. Hacer clic en "Nuevo Movimiento"
3. Seleccionar producto y tipo de movimiento
4. Ingresar cantidad
5. Hacer clic en "Registrar Movimiento"

### Ver Reportes
1. Ir a "Reportes"
2. Consultar gráficos y análisis
3. Ver productos críticos y bajo stock

### Exportar Datos
1. Ir a "Productos"
2. Hacer clic en "CSV" o "JSON"
3. Descargar archivo

## 📦 Dependencias

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "chart.js": "^4.4.0",
  "react-chartjs-2": "^5.2.0",
  "lucide-react": "^0.263.1"
}
```

## 🔧 Build para Producción

```bash
npm run build
```

Genera los archivos optimizados en la carpeta `dist/`.

## 📱 Compatibilidad

- ✅ Chrome/Edge (v90+)
- ✅ Firefox (v88+)
- ✅ Safari (v14+)
- ✅ Dispositivos móviles (iOS/Android)

## 🎯 Próximas Mejoras

- [ ] Sincronización con backend
- [ ] Autenticación de usuarios
- [ ] Múltiples sucursales
- [ ] Transferencias entre almacenes
- [ ] Códigos QR/Barras
- [ ] Notificaciones en tiempo real
- [ ] Reportes en PDF
- [ ] Integración con proveedores

## 📝 Licencia

MIT License - Libre para uso comercial

## 👨‍💻 Autor

Desarrollado por Marcelo Torres

## 📞 Soporte

Para reportar bugs o sugerencias, contacta al desarrollador.

---

**Versión**: 1.0.0  
**Última actualización**: 2026
