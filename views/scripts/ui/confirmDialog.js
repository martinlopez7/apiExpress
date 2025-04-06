// Componente para diálogo de confirmación personalizado

/**
 * Muestra un diálogo de confirmación personalizado
 * @param {Object} options Opciones del diálogo
 * @param {string} options.title Título del diálogo
 * @param {string} options.message Mensaje de confirmación
 * @param {string} options.confirmText Texto del botón de confirmación
 * @param {string} options.cancelText Texto del botón de cancelación
 * @returns {Promise} Promesa que se resuelve a true si se confirma o false si se cancela
 */
export function showConfirmDialog(options = {}) {
    return new Promise((resolve) => {
        const title = options.title || 'Confirmar';
        const message = options.message || '¿Estás seguro?';
        const confirmText = options.confirmText || 'Confirmar';
        const cancelText = options.cancelText || 'Cancelar';
        
        // Crear el diálogo
        const dialogOverlay = document.createElement('div');
        dialogOverlay.className = 'confirm-dialog-overlay';
        
        const dialogBox = document.createElement('div');
        dialogBox.className = 'confirm-dialog';
        
        dialogBox.innerHTML = `
            <div class="confirm-dialog-header">
                <h3>${title}</h3>
            </div>
            <div class="confirm-dialog-body">
                <p>${message}</p>
            </div>
            <div class="confirm-dialog-footer">
                <button class="btn-secondary cancel-btn">${cancelText}</button>
                <button class="btn-primary confirm-btn">${confirmText}</button>
            </div>
        `;
        
        // Añadir el diálogo al DOM
        dialogOverlay.appendChild(dialogBox);
        document.body.appendChild(dialogOverlay);
        
        // Añadir estilos si no existen
        if (!document.getElementById('confirm-dialog-styles')) {
            const styles = document.createElement('style');
            styles.id = 'confirm-dialog-styles';
            styles.textContent = `
                .confirm-dialog-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }
                
                .confirm-dialog {
                    background-color: #fff;
                    border-radius: 8px;
                    width: 90%;
                    max-width: 400px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    animation: dialogFadeIn 0.3s ease-out;
                }
                
                @keyframes dialogFadeIn {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .dark-mode .confirm-dialog {
                    background-color: #333;
                    color: #fff;
                }
                
                .confirm-dialog-header {
                    padding: 15px 20px;
                    border-bottom: 1px solid #eee;
                }
                
                .dark-mode .confirm-dialog-header {
                    border-bottom: 1px solid #444;
                }
                
                .confirm-dialog-header h3 {
                    margin: 0;
                    font-size: 1.2rem;
                }
                
                .confirm-dialog-body {
                    padding: 20px;
                }
                
                .confirm-dialog-body p {
                    margin: 0;
                }
                
                .confirm-dialog-footer {
                    padding: 15px 20px;
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                    border-top: 1px solid #eee;
                }
                
                .dark-mode .confirm-dialog-footer {
                    border-top: 1px solid #444;
                }
            `;
            document.head.appendChild(styles);
        }
        
        // Añadir event listeners
        const confirmButton = dialogBox.querySelector('.confirm-btn');
        const cancelButton = dialogBox.querySelector('.cancel-btn');
        
        confirmButton.addEventListener('click', () => {
            document.body.removeChild(dialogOverlay);
            resolve(true);
        });
        
        cancelButton.addEventListener('click', () => {
            document.body.removeChild(dialogOverlay);
            resolve(false);
        });
        
        // Cerrar al hacer clic fuera
        dialogOverlay.addEventListener('click', (e) => {
            if (e.target === dialogOverlay) {
                document.body.removeChild(dialogOverlay);
                resolve(false);
            }
        });
    });
} 