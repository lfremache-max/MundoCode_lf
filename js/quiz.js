/* js/quiz.js - SISTEMA DE MENSAJERÍA ACTUALIZADO */

let score = 0;
let preguntasContestadas = 0;
let totalPreguntas = 0;
let quizIdActual = '';

// --- 1. SONIDOS ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playTone(freq, type, duration, delay = 0) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type; osc.frequency.value = freq;
    osc.connect(gain); gain.connect(audioCtx.destination);
    const now = audioCtx.currentTime + delay;
    osc.start(now); gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.stop(now + duration);
}
function playSound(type) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    if (type === 'correct') { playTone(600, 'sine', 0.1, 0); playTone(1200, 'sine', 0.4, 0.1); } 
    else if (type === 'wrong') { playTone(150, 'sawtooth', 0.3, 0); playTone(100, 'sawtooth', 0.3, 0.1); } 
    else if (type === 'fanfare') { playTone(400, 'triangle', 0.1, 0); playTone(800, 'square', 0.6, 0.45); }
}

// --- 2. LÓGICA ---
function cargarQuiz(preguntas, quizId) {
    const container = document.getElementById('quiz-container');
    container.innerHTML = ''; 
    score = 0; preguntasContestadas = 0;
    totalPreguntas = preguntas.length;
    quizIdActual = quizId;
    window.quizStartTime = Date.now();
    actualizarBarraVisual();

    preguntas.forEach((pregunta, index) => {
        const card = document.createElement('div');
        card.className = 'question-card';
        card.innerHTML = `<h3>${index + 1}. ${pregunta.pregunta}</h3><div class="options-container"></div><div class="feedback-msg" style="display:none; margin-top:20px; padding:15px; background:#1a1a1d; border-radius:5px;"></div>`;
        
        const opcionesDiv = card.querySelector('.options-container');
        pregunta.opciones.forEach((opcion, opIndex) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn'; btn.innerHTML = opcion;
            btn.onclick = () => {
                card.querySelectorAll('.option-btn').forEach(b => b.disabled = true);
                const feedback = card.querySelector('.feedback-msg');
                feedback.style.display = 'block';
                if (opIndex === pregunta.correcta) {
                    score++; playSound('correct');
                    btn.style.background = 'rgba(46, 213, 115, 0.2)'; btn.style.borderColor = '#2ed573';
                    feedback.innerHTML = `<span style="color:#2ed573">✨ Correcto:</span> ${pregunta.explicacion}`;
                } else {
                    playSound('wrong');
                    btn.style.background = 'rgba(255, 71, 87, 0.2)'; btn.style.borderColor = '#ff4757';
                    feedback.innerHTML = `<span style="color:#ff4757">✖ Incorrecto:</span> ${pregunta.explicacion}`;
                }
                preguntasContestadas++; actualizarBarraVisual();
            };
            opcionesDiv.appendChild(btn);
        });
        container.appendChild(card);
    });
    const btnF = document.createElement('button');
    btnF.innerText = "Ver Resultados"; btnF.className = "btn-final";
    btnF.onclick = mostrarResultadoFinal; container.appendChild(btnF);
}

function actualizarBarraVisual() {
    const pb = document.getElementById('progress-bar');
    if (pb) pb.style.width = (preguntasContestadas / totalPreguntas * 100) + '%';
}

function verificarLogros() {
    const segundos = (Date.now() - window.quizStartTime) / 1000;
    const hora = new Date().getHours();
    let delay = 0;

    const mandar = (id, txt) => {
        if (localStorage.getItem('badge_' + id) !== 'true') {
            localStorage.setItem('badge_' + id, 'true');
            setTimeout(() => {
                window.parent.postMessage({ tipo: 'LOGRO_DESBLOQUEADO', mensaje: txt }, '*');
            }, delay);
            delay += 600; // Espaciado entre envíos
        }
    };

    if (segundos < 60) mandar('velocista', "¡Logro Desbloqueado: Velocista! ⚡");
    if (score === totalPreguntas) mandar('cerebro', "¡Logro Desbloqueado: Cerebro de Oro! 👑");
    if (hora >= 0 && hora < 6) mandar('noctambulo', "¡Logro Desbloqueado: Noctámbulo! 🌙");
}

function mostrarResultadoFinal() {
    if(preguntasContestadas < totalPreguntas) return alert("Responde todo");
    const container = document.getElementById('quiz-container');
    const nota = (score / totalPreguntas) * 10;
    container.innerHTML = `<div class="result-card" style="text-align:center; padding:40px; background:#111; border-radius:20px; border:2px solid ${nota >= 7 ? '#2ed573' : '#ff4757'}">
        <h2 style="color:${nota >= 7 ? '#2ed573' : '#ff4757'}">${nota >= 7 ? '¡Aprobado!' : 'Sigue Intentando'}</h2>
        <p style="font-size:2rem; color:white;">Nota: ${nota.toFixed(1)}/10</p>
        <br><button onclick="${nota >= 7 ? "location.href='../contenidos.html'" : "location.reload()"}" class="btn-final">${nota >= 7 ? 'Volver al Menú' : 'Reintentar'}</button>
    </div>`;
    if (nota >= 7) { playSound('fanfare'); verificarLogros(); localStorage.setItem('curso_completado_' + quizIdActual, 'true'); }
}