document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('.glass-card form');

    forms.forEach(form => {
        form.setAttribute('novalidate', true);

        form.addEventListener('submit', (e) => {
            let formIsValid = true;
            const inputs = form.querySelectorAll('input');

            inputs.forEach(input => {
                if (!input.validity.valid) {
                    // AQUÍ ESTÁ LA MAGIA: Usamos una función para obtener mensajes cortos
                    const customMessage = getCustomMessage(input);
                    showError(input, customMessage);
                    formIsValid = false;
                } else {
                    clearError(input);
                }
            });

            if (!formIsValid) {
                e.preventDefault();
            }
        });

        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
               if(input.validity.valid) {
                   clearError(input);
               }
            });
        });
    });

    // --- NUEVA FUNCIÓN: Traduce errores largos a cortos y profesionales ---
    function getCustomMessage(input) {
        if (input.validity.valueMissing) {
            return "Este campo es obligatorio";
        }
        if (input.validity.typeMismatch && input.type === "email") {
            return "Ingresa un correo válido";
        }
        if (input.validity.tooShort) {
            return `Mínimo ${input.minLength} caracteres`;
        }
        return "Dato incorrecto"; // Mensaje por defecto
    }

    function showError(input, message) {
        const wrapper = input.closest('.input-wrapper');
        const errorDiv = wrapper.nextElementSibling;
        
        wrapper.classList.add('error-shake');
        // Usamos una clase CSS para el borde en lugar de manipular estilos inline (más limpio)
        wrapper.classList.add('input-error-state');

        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        errorDiv.classList.add('active'); // Usamos clases para mostrar/ocultar

        setTimeout(() => {
            wrapper.classList.remove('error-shake');
        }, 500);
    }

    function clearError(input) {
        const wrapper = input.closest('.input-wrapper');
        const errorDiv = wrapper.nextElementSibling;

        wrapper.classList.remove('input-error-state');
        errorDiv.classList.remove('active');
    }
});