document.addEventListener("DOMContentLoaded", function() {
    
    // 1. CONFIGURACIÓN: IDs exactos de tus cursos
    const cursosRequeridos = ['html', 'css', 'js', 'python', 'sql', 'git'];

    // 2. DETECTAR RUTA PARA LOS ENLACES
    // Si la URL contiene "/temas/", estamos dentro de una subcarpeta
    const path = window.location.pathname;
    const esSubcarpeta = path.includes('/temas/');
    
    // Si es subcarpeta, usamos "../" para subir un nivel, si no, nada.
    // Ajustado para tu estructura donde 'principal.html' está en la carpeta 'html/'
    const base = esSubcarpeta ? '../' : ''; 

    // 3. LÓGICA DEL CANDADO
    let cursosCompletados = 0;
    cursosRequeridos.forEach(curso => {
        // Verificamos las dos posibles llaves que usas
        if (localStorage.getItem('curso_completado_' + curso) === 'true' || 
            localStorage.getItem('curso_completado_' + curso + '_intro') === 'true') {
            cursosCompletados++;
        }
    });

    const todoCompleto = cursosCompletados === cursosRequeridos.length;
    
    // Definir apariencia del botón
    let certClass = todoCompleto ? 'btn-unlocked' : 'btn-locked';
    let certIcon = todoCompleto ? 'fa-medal' : 'fa-lock';
    let certLink = todoCompleto ? base + 'certificado.html' : '#';
    let certText = todoCompleto ? 'CERTIFICADO' : `Progreso ${cursosCompletados}/6`;
    let certAction = todoCompleto ? '' : 'onclick="alert(\'Completa los 6 cursos para desbloquear.\'); return false;"';

    // 4. HTML DEL NAVBAR
    const navbarHTML = `
    <header class="header-unificado">
        <a href="${base}principal.html" class="logo">MundoCODE<span>.</span></a>
        
        <nav class="nav-links">
            <a href="${base}contenidos.html" class="nav-link-unified">Cursos</a>
            <a href="${base}comunidad.html" class="nav-link-unified">Comunidad</a>
            
            <div style="width: 1px; height: 20px; background: #444;"></div>
            
            <a href="${certLink}" class="btn-certificado ${certClass}" ${certAction}>
                <i class="fas ${certIcon}"></i> ${certText}
            </a>

            <a href="${base}inicio.html" class="btn-logout-nav" onclick="localStorage.clear()">
                <i class="fas fa-sign-out-alt"></i>
            </a>
        </nav>
    </header>
    <div class="navbar-spacer"></div>
    `;

    // 5. INYECTAR NAVBAR
    // Busca si ya hay un header o nav y lo elimina para poner el nuevo
    const oldHeader = document.querySelector('header');
    const oldNav = document.querySelector('nav');
    
    if (oldHeader) oldHeader.remove();
    if (oldNav) oldNav.remove();

    // Insertar al principio del body
    document.body.insertAdjacentHTML('afterbegin', navbarHTML);
});