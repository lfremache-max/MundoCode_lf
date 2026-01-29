/* js/quiz.js - CÓDIGO COMPLETO (Sonidos matemáticos + Lógica 7.0) */

let score = 0;
let preguntasContestadas = 0;
let totalPreguntas = 0;
let quizIdActual = '';

// --- 1. GENERADOR DE SONIDOS (Sintetizador) ---
// Esto crea el sonido desde cero, no necesita archivos mp3 ni sounds.js
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTone(freq, type, duration, delay = 0) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = type; // tipos de onda: sine, square, sawtooth, triangle
    osc.frequency.value = freq;
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    const now = audioCtx.currentTime + delay;
    osc.start(now);
    
    // Efecto de desvanecimiento para que no suene brusco
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    
    osc.stop(now + duration);
}

function playSound(type) {
    // Reactivar el audio si el navegador lo bloqueó (pasa a veces en Chrome)
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    if (type === 'correct') {
        // ✨ Sonido "Ding" agudo
        playTone(600, 'sine', 0.1, 0);
        playTone(1200, 'sine', 0.4, 0.1); 
    } 
    else if (type === 'wrong') {
        // ❌ Sonido "Error" grave
        playTone(150, 'sawtooth', 0.3, 0); 
        playTone(100, 'sawtooth', 0.3, 0.1); 
    } 
    else if (type === 'fanfare') {
        // 🏆 Música de victoria
        playTone(400, 'triangle', 0.1, 0);
        playTone(500, 'triangle', 0.1, 0.15);
        playTone(600, 'triangle', 0.1, 0.30);
        playTone(800, 'square', 0.6, 0.45); 
    }
}

// --- 2. LÓGICA DEL QUIZ ---

function cargarQuiz(preguntas, quizId) {
    const container = document.getElementById('quiz-container');
    container.innerHTML = ''; 
    
    score = 0;
    preguntasContestadas = 0;
    totalPreguntas = preguntas.length;
    quizIdActual = quizId;

    preguntas.forEach((pregunta, index) => {
        // Crear Tarjeta
        const card = document.createElement('div');
        card.className = 'question-card';

        // Título Pregunta
        const titulo = document.createElement('h3');
        titulo.textContent = `${index + 1}. ${pregunta.pregunta}`;
        card.appendChild(titulo);

        // Opciones
        const opcionesDiv = document.createElement('div');
        opcionesDiv.className = 'options-container';

        pregunta.opciones.forEach((opcion, opIndex) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = opcion;
            
            btn.onclick = () => {
                // Bloquear botones tras click
                const btns = opcionesDiv.querySelectorAll('.option-btn');
                btns.forEach(b => b.disabled = true);

                // Mostrar explicación
                const feedbackDiv = card.querySelector('.feedback-msg');
                feedbackDiv.style.display = 'block';

                // Verificar respuesta
                if (opIndex === pregunta.correcta) {
                    // CORRECTO
                    score++;
                    playSound('correct'); // <--- SONIDO GENERADO
                    
                    btn.classList.add('correct');
                    btn.style.background = 'rgba(46, 213, 115, 0.2)';
                    btn.style.borderColor = '#2ed573';

                    feedbackDiv.style.borderLeft = "5px solid #2ed573";
                    feedbackDiv.innerHTML = `
                        <div style="color: #2ed573; font-weight: bold; margin-bottom: 5px;">✨ ¡Excelente!</div>
                        <div style="color: #ddd;">${pregunta.explicacion}</div>
                    `;
                } else {
                    // INCORRECTO
                    playSound('wrong'); // <--- SONIDO GENERADO
                    
                    btn.classList.add('incorrect');
                    btn.style.background = 'rgba(255, 71, 87, 0.2)';
                    btn.style.borderColor = '#ff4757';

                    feedbackDiv.style.borderLeft = "5px solid #ff4757";
                    feedbackDiv.innerHTML = `
                        <div style="color: #ff4757; font-weight: bold; margin-bottom: 5px;">✖ Respuesta Incorrecta</div>
                        <div style="color: #ddd;">${pregunta.explicacion}</div>
                    `;
                }
                preguntasContestadas++;
            };
            opcionesDiv.appendChild(btn);
        });

        card.appendChild(opcionesDiv);

        // Caja oculta para la explicación
        const feedback = document.createElement('div');
        feedback.className = 'feedback-msg';
        feedback.style.marginTop = "20px";
        feedback.style.padding = "15px";
        feedback.style.background = "#1a1a1d"; 
        feedback.style.borderRadius = "5px";
        feedback.style.display = 'none';
        card.appendChild(feedback);

        container.appendChild(card);
    });

    // Botón Resultados
    const btnFinal = document.createElement('button');
    btnFinal.innerText = "Ver Resultados";
    btnFinal.className = "btn-final";
    btnFinal.style.marginTop = "30px";
    btnFinal.onclick = mostrarResultadoFinal;
    container.appendChild(btnFinal);
}

function mostrarResultadoFinal() {
    if(preguntasContestadas < totalPreguntas) {
        alert("Por favor responde todas las preguntas.");
        return;
    }

    const container = document.getElementById('quiz-container');
    container.innerHTML = ''; 

    const porcentaje = (score / totalPreguntas) * 10;
    
    const card = document.createElement('div');
    card.className = 'result-card';
    card.style.textAlign = 'center';
    card.style.padding = '40px';
    card.style.border = '2px solid #333';
    card.style.borderRadius = '20px';
    card.style.background = '#111';

    // REGLA: Aprobado solo si nota >= 7.0
    if (porcentaje >= 7) {
        playSound('fanfare'); // <--- MÚSICA VICTORIA
        
        // Guardar progreso con ID normal e intro para asegurar compatibilidad
        localStorage.setItem('curso_completado_' + quizIdActual, 'true');
        if (!quizIdActual.includes('_intro')) {
             localStorage.setItem('curso_completado_' + quizIdActual + '_intro', 'true');
        }

        card.style.borderColor = '#2ed573';
        card.innerHTML = `
            <h2 style="color: #2ed573; font-size: 2.5rem;">¡Felicidades!</h2>
            <p style="font-size: 1.5rem; color: white;">Nota Final: <strong>${score} / ${totalPreguntas}</strong></p>
            <p style="color: #aaa;">Has aprobado el curso satisfactoriamente.</p>
            <br>
            <a href="../contenidos.html" class="btn-final" style="background:#2ed573; color:white; padding:15px 30px; text-decoration:none; border-radius:50px; font-weight:bold;">Volver al Menú</a>
        `;
    } else {
        playSound('wrong'); 

        card.style.borderColor = '#ff4757';
        card.innerHTML = `
            <h2 style="color: #ff4757; font-size: 2.5rem;">Sigue Practicando</h2>
            <p style="font-size: 1.5rem; color: white;">Nota Final: <strong>${score} / ${totalPreguntas}</strong></p>
            <p style="color: #aaa;">Necesitas un 7.0 para aprobar.</p>
            <br>
            <button onclick="location.reload()" style="background:white; color:black; padding:15px 30px; border:none; border-radius:50px; font-weight:bold; cursor:pointer;">Intentar de Nuevo</button>
            <br><br>
            <a href="../contenidos.html" style="color:#666; text-decoration:none;">Salir sin guardar</a>
        `;
    }
    
    container.appendChild(card);
}