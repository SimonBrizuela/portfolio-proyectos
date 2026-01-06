# 🎯 Quiz Master Application

Aplicación de quiz interactiva con múltiples categorías, niveles de dificultad y sistema de puntuación.

## ✨ Características

- 📚 6 Categorías de preguntas:
  - Cultura General
  - Ciencia
  - Historia
  - Geografía
  - Deportes
  - Entretenimiento
- 🎚️ 3 Niveles de dificultad (Fácil, Medio, Difícil)
- ⏱️ Temporizador de 30 segundos por pregunta
- 📊 Sistema de puntuación y estadísticas
- 🔄 Revisión de respuestas al finalizar
- 💾 Persistencia de estadísticas globales
- 🎨 Interfaz colorida y animada
- 📱 Diseño completamente responsivo

## 🛠️ Tecnologías

- HTML5
- CSS3 (Animations, SVG, Flexbox, Grid)
- JavaScript ES6+ (Classes, LocalStorage, Array Methods)

## 🚀 Cómo usar

1. Abre `index.html` en tu navegador
2. Selecciona una categoría
3. Elige el nivel de dificultad
4. Haz clic en "Comenzar Quiz"
5. Responde las preguntas antes de que termine el tiempo
6. Revisa tus resultados y estadísticas

## 💡 Conceptos Demostrados

- **Programación Orientada a Objetos**: Arquitectura basada en clases
- **Gestión de Estado**: Control de múltiples estados de la aplicación
- **Temporizadores**: setInterval y clearInterval
- **Manipulación de Arrays**: Shuffle, filter, slice
- **LocalStorage**: Persistencia de estadísticas
- **DOM Manipulation**: Creación dinámica de elementos
- **Animaciones CSS**: Transiciones y keyframes
- **SVG Progress Circle**: Círculo de progreso animado

## 🎮 Funcionalidades

- **Sistema de puntuación**: Calcula porcentaje de aciertos
- **Temporizador**: Cuenta regresiva con límite de tiempo
- **Barra de progreso**: Indicador visual del avance
- **Revisión detallada**: Muestra respuestas correctas e incorrectas
- **Estadísticas acumuladas**: Total de quizzes, promedio, mejor puntuación
- **Mensajes de rendimiento**: Retroalimentación personalizada según resultado

## 📝 Expandir Preguntas

Puedes agregar más preguntas editando `questions.js`:

```javascript
{
    question: "Tu pregunta aquí?",
    answers: ["Opción 1", "Opción 2", "Opción 3", "Opción 4"],
    correct: 0, // Índice de la respuesta correcta (0-3)
    difficulty: "easy" // easy, medium, hard
}
```

## 🏆 Mensajes de Rendimiento

- 100%: "¡Perfecto! 🌟"
- 80-99%: "¡Excelente! 🎉"
- 60-79%: "¡Bien hecho! 👍"
- 40-59%: "No está mal 📚"
- 0-39%: "Necesitas más práctica 💪"

---

**Proyecto desarrollado para demostrar lógica de juegos y gestión de datos**
