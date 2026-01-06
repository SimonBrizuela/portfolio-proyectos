# 🎬 Movie Search App

Aplicación de búsqueda de películas con información detallada, favoritos y lista de seguimiento.

## ✨ Características

- 🔍 Búsqueda de películas en tiempo real
- 🎯 Información detallada de cada película
- ⭐ Sistema de favoritos
- 📌 Lista "Ver después"
- 🔄 Carga infinita (Load More)
- 💾 Persistencia de favoritos y watchlist
- 🎨 Interfaz moderna estilo streaming
- 📱 Diseño responsivo
- 🖼️ Modal con detalles completos

## 🛠️ Tecnologías

- HTML5
- CSS3 (Grid, Flexbox, Animations, Gradients)
- JavaScript ES6+ (Async/Await, Fetch API, Promises)
- OMDb API (The Open Movie Database)

## 🚀 Configuración

1. Obtén una API key gratuita en [OMDb API](http://www.omdbapi.com/apikey.aspx)
2. Abre `script.js`
3. Reemplaza `'YOUR_API_KEY'` con tu clave:
   ```javascript
   const API_KEY = 'tu_api_key_aqui';
   ```
4. Abre `index.html` en tu navegador

## 📖 Cómo usar

1. Escribe el nombre de una película en el buscador
2. Haz clic en cualquier película para ver detalles completos
3. Marca películas como favoritas con el corazón
4. Agrega a "Ver después" con el pin
5. Filtra por "Favoritos" o "Ver Después"
6. Carga más resultados con el botón "Cargar Más"

## 💡 Conceptos Demostrados

- **API REST**: Consumo de APIs externas
- **Async/Await**: Manejo de múltiples llamadas asíncronas
- **Promise.all()**: Carga paralela de datos
- **Modal Windows**: Diálogos interactivos
- **Infinite Scroll**: Paginación con carga progresiva
- **LocalStorage**: Persistencia de favoritos
- **Responsive Design**: Grid adaptativo
- **Error Handling**: Manejo robusto de errores

## 🎯 Información Mostrada

- Título y año
- Póster oficial
- Rating de IMDb
- Sinopsis completa
- Director y reparto
- Género y duración
- Premios
- Recaudación de taquilla
- Y más...

## 🔧 API Gratuita

OMDb API ofrece 1,000 llamadas diarias gratuitas, ideal para proyectos de portafolio.

---

**Proyecto desarrollado para demostrar integración con APIs de entretenimiento**
