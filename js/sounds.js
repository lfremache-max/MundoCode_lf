// js/sounds.js

const audioFX = {
    // Sonido de "Correcto" (Ding agradable)
    correct: new Audio('https://cdn.pixabay.com/download/audio/2021/08/04/audio_bb630cc098.mp3?filename=success-1-6297.mp3'),
    
    // Sonido de "Incorrecto" (Error suave)
    wrong: new Audio('https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a73467.mp3?filename=wrong-answer-129254.mp3'),
    
    // Sonido de "Aprobado / Victoria" (Trompetas)
    fanfare: new Audio('https://cdn.pixabay.com/download/audio/2021/08/04/audio_12b0c7443c.mp3?filename=success-fanfare-trumpets-6185.mp3')
};

// Ajuste de volumen (0.0 a 1.0) para que no sea molesto
audioFX.correct.volume = 0.5;
audioFX.wrong.volume = 0.3;
audioFX.fanfare.volume = 0.6;

// Función para reproducir sonidos
function playSound(type) {
    if (audioFX[type]) {
        audioFX[type].currentTime = 0; // Reinicia el sonido si ya estaba sonando
        // El .catch evita errores si el navegador bloquea el audio automático
        audioFX[type].play().catch(e => console.log("Audio esperando interacción"));
    }
}