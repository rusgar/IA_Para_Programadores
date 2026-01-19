// Variables globales
let currentSlideIndex = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    // Actualizar número total de slides
    document.getElementById('totalSlides').textContent = totalSlides;
    
    // Crear botones de navegación
    createNavigationButtons();
    
    // Mostrar primera slide
    showSlide(0);
});

// Crear botones de navegación
function createNavigationButtons() {
    const slidesContainer = document.querySelector('.slides-container');
    
    // Crear contenedor de navegación
    const navDiv = document.createElement('div');
    navDiv.className = 'navigation';
    
    // Botón anterior
    const prevBtn = document.createElement('button');
    prevBtn.id = 'prevBtn';
    prevBtn.className = 'btn-secondary';
    prevBtn.innerHTML = '⬅️ Anterior';
    prevBtn.onclick = () => changeSlide(-1);
    
    // Botón siguiente
    const nextBtn = document.createElement('button');
    nextBtn.id = 'nextBtn';
    nextBtn.className = 'btn-primary';
    nextBtn.innerHTML = 'Siguiente ➡️';
    nextBtn.onclick = () => changeSlide(1);
    
    navDiv.appendChild(prevBtn);
    navDiv.appendChild(nextBtn);
    slidesContainer.appendChild(navDiv);
}

// Mostrar slide específica
function showSlide(n) {
    // Ocultar todas las slides
    slides.forEach(slide => {
        slide.classList.remove('active');
    });

    // Ajustar índice si está fuera de rango
    if (n >= totalSlides) {
        currentSlideIndex = totalSlides - 1;
    } else if (n < 0) {
        currentSlideIndex = 0;
    } else {
        currentSlideIndex = n;
    }

    // Mostrar slide actual
    slides[currentSlideIndex].classList.add('active');

    // Actualizar contador
    document.getElementById('currentSlide').textContent = currentSlideIndex + 1;

    // Actualizar estado de botones
    updateButtons();

    // Scroll al inicio de la slide
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Cambiar slide
function changeSlide(direction) {
    showSlide(currentSlideIndex + direction);
}

// Actualizar estado de botones de navegación
function updateButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (!prevBtn || !nextBtn) return;

    // Deshabilitar botón anterior en primera slide
    if (currentSlideIndex === 0) {
        prevBtn.disabled = true;
        prevBtn.style.opacity = '0.5';
        prevBtn.style.cursor = 'not-allowed';
    } else {
        prevBtn.disabled = false;
        prevBtn.style.opacity = '1';
        prevBtn.style.cursor = 'pointer';
    }

    // Deshabilitar botón siguiente en última slide
    if (currentSlideIndex === totalSlides - 1) {
        nextBtn.disabled = true;
        nextBtn.style.opacity = '0.5';
        nextBtn.style.cursor = 'not-allowed';
    } else {
        nextBtn.disabled = false;
        nextBtn.style.opacity = '1';
        nextBtn.style.cursor = 'pointer';
    }
}

// Navegación con teclado
document.addEventListener('keydown', function(event) {
    switch(event.key) {
        case 'ArrowLeft':
            changeSlide(-1);
            break;
        case 'ArrowRight':
        case ' ': // Barra espaciadora
            event.preventDefault();
            changeSlide(1);
            break;
        case 'Home':
            showSlide(0);
            break;
        case 'End':
            showSlide(totalSlides - 1);
            break;
        case 'Escape':
            // Opcional: salir de pantalla completa
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
            break;
    }
});

// Función para descargar como PDF
function downloadPresentation() {
    // Mostrar mensaje de preparación
    const originalContent = document.body.innerHTML;
    
    // Crear overlay de carga
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        color: white;
        font-size: 1.5em;
        flex-direction: column;
    `;
    overlay.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 3em; margin-bottom: 20px;">📄</div>
            <div>Preparando presentación para PDF...</div>
            <div style="font-size: 0.8em; margin-top: 10px; opacity: 0.7;">
                Se abrirá el diálogo de impresión
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    // Preparar para impresión (mostrar todas las slides)
    setTimeout(() => {
        slides.forEach(slide => {
            slide.classList.add('active');
        });

        // Esperar un momento para que se rendericen todas las slides
        setTimeout(() => {
            // Abrir diálogo de impresión
            window.print();

            // Restaurar estado después de cerrar el diálogo
            setTimeout(() => {
                // Remover overlay
                document.body.removeChild(overlay);
                
                // Ocultar todas las slides excepto la actual
                slides.forEach((slide, index) => {
                    if (index !== currentSlideIndex) {
                        slide.classList.remove('active');
                    }
                });
            }, 500);
        }, 300);
    }, 500);
}

// Detectar cuando se cierra el diálogo de impresión
window.addEventListener('afterprint', function() {
    // Restaurar solo la slide actual
    slides.forEach((slide, index) => {
        if (index === currentSlideIndex) {
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
        }
    });
});

// Soporte para gestos táctiles en móviles
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(event) {
    touchStartX = event.changedTouches[0].screenX;
}, false);

document.addEventListener('touchend', function(event) {
    touchEndX = event.changedTouches[0].screenX;
    handleSwipe();
}, false);

function handleSwipe() {
    const swipeThreshold = 50; // Mínimo de píxeles para considerar un swipe
    
    if (touchEndX < touchStartX - swipeThreshold) {
        // Swipe izquierda - siguiente slide
        changeSlide(1);
    }
    
    if (touchEndX > touchStartX + swipeThreshold) {
        // Swipe derecha - slide anterior
        changeSlide(-1);
    }
}

// Función para modo presentación (pantalla completa)
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log(`Error al entrar en pantalla completa: ${err.message}`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// Atajo de teclado para pantalla completa (F11 o F)
document.addEventListener('keydown', function(event) {
    if (event.key === 'f' || event.key === 'F') {
        toggleFullscreen();
    }
});

// Prevenir zoom accidental en móviles
document.addEventListener('gesturestart', function(e) {
    e.preventDefault();
});

// Información de ayuda (opcional)
function showHelp() {
    const helpText = `
🎯 ATAJOS DE TECLADO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
→ o Espacio    : Siguiente slide
← : Anterior slide
Inicio         : Primera slide
Fin            : Última slide
F              : Pantalla completa
Esc            : Salir pantalla completa

📱 EN MÓVIL:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Desliza izquierda  : Siguiente
Desliza derecha    : Anterior
    `;
    
    alert(helpText);
}

// Opcional: Añadir botón de ayuda
document.addEventListener('DOMContentLoaded', function() {
    const controls = document.querySelector('.controls');
    if (controls) {
        const helpBtn = document.createElement('button');
        helpBtn.className = 'btn-secondary';
        helpBtn.innerHTML = '❓ Ayuda';
        helpBtn.onclick = showHelp;
        helpBtn.style.marginLeft = '10px';
        
        const btnGroup = controls.querySelector('.btn-group');
        if (btnGroup) {
            btnGroup.appendChild(helpBtn);
        }
    }
});

console.log('🎓 Módulo 1: Fundamentos de IA en Programación - Cargado correctamente');
console.log(`📊 Total de slides: ${totalSlides}`);
console.log('💡 Presiona F para pantalla completa o ? para ver ayuda');