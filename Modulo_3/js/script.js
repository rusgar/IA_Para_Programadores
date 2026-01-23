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
    
    console.log('🧪 Módulo 3: Testing, Debugging y Documentación con IA - Cargado');
    console.log(`📊 Total de slides: ${totalSlides}`);
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

    // Scroll al inicio
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
    // No ejecutar si hay un modal abierto
    if (document.getElementById('pdfPreviewModal')) return;
    
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
            // Cerrar modal si está abierto
            const modal = document.getElementById('pdfPreviewModal');
            if (modal) {
                closePdfPreview();
            } else if (document.fullscreenElement) {
                document.exitFullscreen();
            }
            break;
        case 'f':
        case 'F':
            toggleFullscreen();
            break;
    }
});

// Función para mostrar vista previa antes de descargar PDF
function downloadPresentation() {
    // Crear modal de vista previa
    const modal = document.createElement('div');
    modal.id = 'pdfPreviewModal';
    modal.className = 'pdf-preview-modal';
    
    modal.innerHTML = `
        <div class="pdf-preview-content">
            <div class="pdf-preview-header">
                <h2>📄 Vista Previa - Módulo 3: Testing, Debugging y Documentación con IA</h2>
                <button class="close-preview" onclick="closePdfPreview()">✖️</button>
            </div>
            
            <div class="pdf-preview-body" id="pdfPreviewBody">
                <div class="loading-preview">
                    <div class="spinner"></div>
                    <p>Generando vista previa...</p>
                </div>
            </div>
            
            <div class="pdf-preview-footer">
                <button class="btn-secondary" onclick="closePdfPreview()">
                    ❌ Cancelar
                </button>
                <button class="btn-primary" onclick="printPDF()">
                    📥 Descargar PDF
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Generar vista previa después de un momento
    setTimeout(() => {
        generatePreview();
    }, 300);
}

// Generar vista previa de todas las slides
function generatePreview() {
    const previewBody = document.getElementById('pdfPreviewBody');
    const allSlides = document.querySelectorAll('.slide');
    
    let previewHTML = '<div class="preview-slides-container">';
    
    allSlides.forEach((slide, index) => {
        previewHTML += `
            <div class="preview-slide-wrapper">
                <div class="preview-slide-number">Diapositiva ${index + 1} de ${totalSlides}</div>
                <div class="preview-slide">
                    ${slide.innerHTML}
                </div>
            </div>
        `;
    });
    
    previewHTML += '</div>';
    previewBody.innerHTML = previewHTML;
}

// Cerrar vista previa
function closePdfPreview() {
    const modal = document.getElementById('pdfPreviewModal');
    if (modal) {
        modal.classList.add('closing');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// Imprimir PDF (función principal)
function printPDF() {
    // Añadir clase para imprimir
    document.body.classList.add('printing-mode');
    
    // Mostrar todas las slides
    const allSlides = document.querySelectorAll('.slide');
    allSlides.forEach(slide => {
        slide.classList.add('active');
    });
    
    // Cerrar modal
    const modal = document.getElementById('pdfPreviewModal');
    if (modal) {
        modal.style.display = 'none';
    }
    
    // Esperar un momento y abrir diálogo de impresión
    setTimeout(() => {
        window.print();
        
        // Restaurar después de imprimir
        setTimeout(() => {
            document.body.classList.remove('printing-mode');
            
            // Ocultar todas las slides excepto la actual
            allSlides.forEach((slide, index) => {
                if (index !== currentSlideIndex) {
                    slide.classList.remove('active');
                }
            });
            
            // Cerrar modal completamente
            closePdfPreview();
        }, 500);
    }, 300);
}

// Detectar cierre del diálogo de impresión
window.addEventListener('afterprint', function() {
    slides.forEach((slide, index) => {
        if (index === currentSlideIndex) {
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
        }
    });
});

// Soporte táctil para móviles
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
    const swipeThreshold = 50;
    
    if (touchEndX < touchStartX - swipeThreshold) {
        changeSlide(1); // Swipe izquierda = siguiente
    }
    
    if (touchEndX > touchStartX + swipeThreshold) {
        changeSlide(-1); // Swipe derecha = anterior
    }
}

// Pantalla completa
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log(`Error: ${err.message}`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// Prevenir zoom accidental
document.addEventListener('gesturestart', function(e) {
    e.preventDefault();
});

// Información de ayuda
function showHelp() {
    const helpText = `
🧪 MÓDULO 3: ATAJOS DE TECLADO
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

🖨️ IMPRIMIR/PDF:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Click en "Descargar PDF"
2. Selecciona "Guardar como PDF"
3. Ajusta configuración si necesario
    `;
    
    alert(helpText);
}

// Añadir botón de ayuda
document.addEventListener('DOMContentLoaded', function() {
    const btnGroup = document.querySelector('.btn-group');
    if (btnGroup) {
        const helpBtn = document.createElement('button');
        helpBtn.className = 'btn-secondary';
        helpBtn.innerHTML = '❓ Ayuda';
        helpBtn.onclick = showHelp;
        btnGroup.appendChild(helpBtn);
    }
});

console.log('💡 Presiona F para pantalla completa o ❓ para ver ayuda');