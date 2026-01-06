// Base de datos de preguntas del Quiz

const quizDatabase = {
    general: [
        {
            question: "¿Cuál es el planeta más grande del sistema solar?",
            answers: ["Júpiter", "Saturno", "Tierra", "Marte"],
            correct: 0,
            difficulty: "easy"
        },
        {
            question: "¿En qué año llegó el hombre a la Luna?",
            answers: ["1969", "1959", "1979", "1989"],
            correct: 0,
            difficulty: "medium"
        },
        {
            question: "¿Cuál es el océano más grande del mundo?",
            answers: ["Pacífico", "Atlántico", "Índico", "Ártico"],
            correct: 0,
            difficulty: "easy"
        },
        {
            question: "¿Quién pintó 'La Mona Lisa'?",
            answers: ["Leonardo da Vinci", "Pablo Picasso", "Vincent van Gogh", "Miguel Ángel"],
            correct: 0,
            difficulty: "easy"
        },
        {
            question: "¿Cuántos continentes hay en el mundo?",
            answers: ["7", "5", "6", "8"],
            correct: 0,
            difficulty: "easy"
        }
    ],
    science: [
        {
            question: "¿Cuál es el símbolo químico del oro?",
            answers: ["Au", "Ag", "Fe", "Cu"],
            correct: 0,
            difficulty: "medium"
        },
        {
            question: "¿Cuál es la velocidad de la luz?",
            answers: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "200,000 km/s"],
            correct: 0,
            difficulty: "hard"
        },
        {
            question: "¿Cuántos huesos tiene el cuerpo humano adulto?",
            answers: ["206", "186", "226", "246"],
            correct: 0,
            difficulty: "medium"
        },
        {
            question: "¿Qué gas es esencial para la respiración?",
            answers: ["Oxígeno", "Nitrógeno", "Dióxido de Carbono", "Hidrógeno"],
            correct: 0,
            difficulty: "easy"
        },
        {
            question: "¿Quién desarrolló la teoría de la relatividad?",
            answers: ["Albert Einstein", "Isaac Newton", "Stephen Hawking", "Galileo Galilei"],
            correct: 0,
            difficulty: "easy"
        }
    ],
    history: [
        {
            question: "¿En qué año comenzó la Segunda Guerra Mundial?",
            answers: ["1939", "1914", "1945", "1929"],
            correct: 0,
            difficulty: "medium"
        },
        {
            question: "¿Quién fue el primer presidente de Estados Unidos?",
            answers: ["George Washington", "Thomas Jefferson", "Abraham Lincoln", "Benjamin Franklin"],
            correct: 0,
            difficulty: "easy"
        },
        {
            question: "¿En qué año cayó el Muro de Berlín?",
            answers: ["1989", "1991", "1987", "1985"],
            correct: 0,
            difficulty: "medium"
        },
        {
            question: "¿Qué civilización construyó Machu Picchu?",
            answers: ["Incas", "Aztecas", "Mayas", "Olmecas"],
            correct: 0,
            difficulty: "easy"
        },
        {
            question: "¿En qué siglo vivió Leonardo da Vinci?",
            answers: ["XV-XVI", "XIV-XV", "XVI-XVII", "XIII-XIV"],
            correct: 0,
            difficulty: "hard"
        }
    ],
    geography: [
        {
            question: "¿Cuál es la capital de Australia?",
            answers: ["Canberra", "Sídney", "Melbourne", "Brisbane"],
            correct: 0,
            difficulty: "medium"
        },
        {
            question: "¿Cuál es el río más largo del mundo?",
            answers: ["Amazonas", "Nilo", "Yangtsé", "Mississippi"],
            correct: 0,
            difficulty: "medium"
        },
        {
            question: "¿En qué continente se encuentra Egipto?",
            answers: ["África", "Asia", "Europa", "Oceanía"],
            correct: 0,
            difficulty: "easy"
        },
        {
            question: "¿Cuál es el país más grande del mundo por superficie?",
            answers: ["Rusia", "Canadá", "China", "Estados Unidos"],
            correct: 0,
            difficulty: "easy"
        },
        {
            question: "¿Cuál es la montaña más alta del mundo?",
            answers: ["Monte Everest", "K2", "Kilimanjaro", "Monte Aconcagua"],
            correct: 0,
            difficulty: "easy"
        }
    ],
    sports: [
        {
            question: "¿Cuántos jugadores hay en un equipo de fútbol?",
            answers: ["11", "10", "9", "12"],
            correct: 0,
            difficulty: "easy"
        },
        {
            question: "¿En qué deporte se usa una raqueta y una pelota amarilla?",
            answers: ["Tenis", "Bádminton", "Squash", "Ping Pong"],
            correct: 0,
            difficulty: "easy"
        },
        {
            question: "¿Cada cuántos años se celebran los Juegos Olímpicos?",
            answers: ["4 años", "2 años", "5 años", "3 años"],
            correct: 0,
            difficulty: "easy"
        },
        {
            question: "¿Quién tiene más Balones de Oro?",
            answers: ["Lionel Messi", "Cristiano Ronaldo", "Michel Platini", "Johan Cruyff"],
            correct: 0,
            difficulty: "medium"
        },
        {
            question: "¿En qué país se originó el karate?",
            answers: ["Japón", "China", "Corea", "Tailandia"],
            correct: 0,
            difficulty: "medium"
        }
    ],
    entertainment: [
        {
            question: "¿Quién dirigió 'Titanic'?",
            answers: ["James Cameron", "Steven Spielberg", "Martin Scorsese", "Christopher Nolan"],
            correct: 0,
            difficulty: "medium"
        },
        {
            question: "¿Cuántos episodios tiene cada temporada de 'Stranger Things' en promedio?",
            answers: ["8-9", "10-12", "6-7", "13-15"],
            correct: 0,
            difficulty: "medium"
        },
        {
            question: "¿Qué banda británica cantó 'Bohemian Rhapsody'?",
            answers: ["Queen", "The Beatles", "The Rolling Stones", "Led Zeppelin"],
            correct: 0,
            difficulty: "easy"
        },
        {
            question: "¿En qué película aparece el personaje de Jack Sparrow?",
            answers: ["Piratas del Caribe", "El Señor de los Anillos", "Harry Potter", "Star Wars"],
            correct: 0,
            difficulty: "easy"
        },
        {
            question: "¿Quién es el superhéroe conocido como 'El Hombre de Acero'?",
            answers: ["Superman", "Iron Man", "Capitán América", "Thor"],
            correct: 0,
            difficulty: "easy"
        }
    ]
};
