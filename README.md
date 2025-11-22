# 📦 Proyecto Farmacia Oasis

Aplicación de gestión para farmacia, desarrollada con **React (Frontend)** y **Express + SQLite (Backend)**.  
Incluye módulos de inventario, historial de ventas, ingresos/egresos y dashboard interactivo.

---

## ⚙️ Requisitos previos
- [Node.js](https://nodejs.org/) >= 18
- npm (incluido con Node)

---

## 🚀 Instalación y ejecución

### 1️⃣ Clonar el repositorio
```bash
git clone https://github.com/usuario/proyectofarmaciaoasis.git
cd proyectofarmaciaoasis/React
```

---

### 2️⃣ Configuración del **Backend**
```bash
cd Backend
npm init -y
npm install express sqlite3 cors
```

Ejecutar el servidor:
```bash
node index.js
```

El backend correrá en:
```
http://localhost:4000
```

---

### 3️⃣ Configuración del **Frontend**
```bash
cd ../Frontend/FarmaciaOasis
npm install
npm i -g vite
```

#### Dependencias principales:

- **Responsive:**
```bash
npm  install @fontsource/montserrat
```

- **Fuente:**
```bash
npm install react-responsive
```

- **Navegación (routing):**
```bash
npm install react-router-dom
```

- **Peticiones HTTP (API):**
```bash
npm install axios
```

- **UI y componentes:**
```bash
npm install @mantine/core @mantine/hooks @mantine/form @mantine/notifications @mantine/modals @mantine/dates @emotion/react
```

- **Gráficos para dashboard:**
```bash
npm install recharts
```

- **Internacionalización y fechas:**
```bash
npm install react-intl dayjs
```

- **Iconos:**
```bash
npm install @tabler/icons-react
```
- **Generar Pdf:**
```bash
npm install html2pdf.js

```

- **Generar EXCEL CON ESTILOS:**
```bash
npm install exceljs file-saver
```

---

### 4️⃣ Ejecutar el frontend
```bash
npm run dev
```

El frontend estará disponible en:
```
http://localhost:5173
```

---

## 📂 Estructura del proyecto
```
React/
 ├── Backend/         # Servidor Express con SQLite
 │   └── index.js
 │
 └── Frontend/
     └── FarmaciaOasis/   # Aplicación React con Vite
         ├── src/modules/ # Módulos: inventario, ventas, dashboard, etc.
         ├── package.json
         └── vite.config.js
```

---

## 🧪 Endpoints de ejemplo (Backend)
- **GET** `/api/users` → Lista de usuarios
- **POST** `/api/users` → Crear usuario  
  ```json
  {
    "name": "Juan Perez",
    "email": "juan@example.com"
  }
  ```

---

## ✅ Notas
- La base de datos SQLite se genera automáticamente como `farmacia.db` en el backend.
- Puedes modificar o agregar tablas desde `Backend/index.js`.
- El frontend actualmente usa datos mock en algunos módulos, listos para conectar al backend.

---

👨‍💻 Desarrollado por **Alejandro,Victor,Gael**
