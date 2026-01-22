function cargarQuiz(preguntasArray) {
    const quizContainer = document.getElementById('quiz-container');
    let quizHTML = '';

    preguntasArray.forEach((pregunta, index) => {
        quizHTML += `
            <div class="pregunta-block" id="pregunta-${index}">
                <p style="font-size: 1.1rem; margin-bottom: 10px;"><strong>${index + 1}.</strong> ${pregunta.pregunta}</p>
                <div class="opciones-container">
        `;

        pregunta.opciones.forEach((opcion, opIndex) => {
            quizHTML += `
                <label class="opcion-label">
                    <input type="radio" name="pregunta${index}" value="${opIndex}" style="display:none;">
                    ${opcion}
                </label>
            `;
        });

        quizHTML += `
                </div>
                <div class="feedback" id="feedback-${index}"></div>
            </div>
        `;
    });

    quizContainer.innerHTML = quizHTML;

    // Agregar evento a los radio buttons para cambiar estilo al seleccionar
    const inputs = document.querySelectorAll('input[type="radio"]');
    inputs.forEach(input => {
        input.addEventListener('change', function() {
            // Remover selección previa en ese grupo
            const name = this.name;
            const groupInputs = document.querySelectorAll(`input[name="${name}"]`);
            groupInputs.forEach(i => i.parentElement.classList.remove('selected'));
            // Agregar selección actual
            this.parentElement.classList.add('selected');
        });
    });

    document.getElementById('submit-quiz').addEventListener('click', () => {
        verificarRespuestas(preguntasArray);
    });
}

function verificarRespuestas(preguntasArray) {
    let puntuacion = 0;
    
    preguntasArray.forEach((pregunta, index) => {
        const bloque = document.getElementById(`pregunta-${index}`);
        const feedback = document.getElementById(`feedback-${index}`);
        const seleccionado = document.querySelector(`input[name="pregunta${index}"]:checked`);

        bloque.classList.remove('correcta', 'incorrecta');

        if (!seleccionado) {
            bloque.classList.add('incorrecta');
            feedback.innerText = "⚠️ Por favor selecciona una respuesta.";
            return;
        }

        const respuestaUser = parseInt(seleccionado.value);

        if (respuestaUser === pregunta.correcta) {
            puntuacion++;
            bloque.classList.add('correcta');
            feedback.innerHTML = `✅ ¡Correcto! ${pregunta.explicacion}`;
        } else {
            bloque.classList.add('incorrecta');
            feedback.innerHTML = `❌ Incorrecto. ${pregunta.explicacion}`;
        }
    });

    const resultadoDiv = document.getElementById('quiz-result');
    resultadoDiv.style.display = 'block';
    resultadoDiv.innerHTML = `<h3>Puntuación: ${puntuacion} de ${preguntasArray.length}</h3>`;
    resultadoDiv.scrollIntoView({behavior: "smooth"});
}