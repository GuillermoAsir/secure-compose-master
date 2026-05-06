# 📘 Secure Compose Master
Plataforma educativa interactiva para dominar YAML, Docker Compose y Kubernetes. Diseñada para **principiantes** y enfocada en usabilidad, accesibilidad y buenas prácticas.

## 🚀 Instalación
1. Clona o descarga la carpeta.
2. Abre `index.html` en Chrome, Firefox, Edge o Safari.
3. **No requiere servidor**. Si deseas rutas absolutas, usa `python -m http.server 8000`.

## 🎨 Diseño y UX
- **Tipografía:** Base 14px, código 13px. Optimizada para legibilidad prolongada.
- **Modo Oscuro:** Contraste WCAG AA. Fondo `#0b1120`, texto `#e2e8f0`, acentos suaves.
- **Navegación:** 5 pestañas por módulo (Teoría → Referencia → Editor → Auditoría → Resultados).
- **Progreso:** Sistema de XP y barra de progreso persistente (`localStorage`).

## 🧩 Arquitectura
- `styles.css`: Variables CSS, diseño responsivo, modo claro/oscuro, animaciones ligeras.
- `app.js`: Lógica modular. Gestiona pestañas, validación básica de YAML, progreso y temas.
- `*.html`: Cada módulo es independiente pero comparte estructura y recursos globales.

## 🛠️ Cómo añadir un módulo
1. Copia `mapas_y_listas.html` y renómbralo.
2. Cambia el `<h1>` y los contenidos de las pestañas.
3. Añade un enlace en `index.html`.
4. El JS detectará el módulo automáticamente y reutilizará el validador y el sistema de XP.

## ⚡ Rendimiento
- 0 dependencias externas.
- CSS puro con hardware acceleration.
- Validación en cliente optimizada (sin parsers pesados).
- Estado guardado en `localStorage` para evitar recargas innecesarias.

## 📜 Licencia
Uso educativo. Basado en la guía oficial de Docker y Kubernetes.