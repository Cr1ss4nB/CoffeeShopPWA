// =========================================================
// Promesa: Obtener todas las órdenes desde localStorage
// =========================================================
const obtenerOrdenes = () => {
    return new Promise((resolve, reject) => {
        const ordenesGuardadas = localStorage.getItem('misOrdenesArray');
        
        if (ordenesGuardadas) {
            const ordenes = JSON.parse(ordenesGuardadas);
            if (ordenes.length > 0) {
                resolve(ordenes);
            } else {
                reject("No hay órdenes registradas.");
            }
        } else {
            reject("No hay órdenes registradas.");
        }
    });
};

// =========================================================
// Promesa: Renderizar las órdenes en el DOM
// =========================================================
const renderizarOrdenes = (ordenes) => {
    return new Promise((resolve) => {
        const ordersList = document.getElementById('orders-list');
        let html = '';

        ordenes.forEach((orden) => {
            const azucarTexto = orden.azucar ? 'Con azúcar' : 'Sin azúcar';
            const precioFormateado = `$${orden.precio.toLocaleString('es-CO')}`;

            html += `
                <div class="order-card">
                    <div class="order-header">
                        <h3 class="order-title">${orden.cafe}</h3>
                        <span class="order-price">${precioFormateado}</span>
                    </div>
                    <div class="order-details">
                        <div class="detail-item">
                            <span class="detail-label">Tamaño:</span>
                            <span>${orden.tamaño}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Azúcar:</span>
                            <span>${azucarTexto}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">ID:</span>
                            <span>#${orden.id}</span>
                        </div>
                    </div>
                    <div class="order-date">
                        ${orden.fecha}
                    </div>
                </div>
            `;
        });

        ordersList.innerHTML = html;
        resolve(ordenes);
    });
};

// =========================================================
// Promesa: Calcular el resumen total de las órdenes
// =========================================================
const calcularResumen = (ordenes) => {
    return new Promise((resolve) => {
        const total = ordenes.reduce((sum, orden) => sum + orden.precio, 0);
        const cantidad = ordenes.length;

        const resumenHTML = `
            <div class="orders-summary">
                <div class="summary-row">
                    <span>Total de órdenes:</span>
                    <span class="summary-value">${cantidad}</span>
                </div>
                <div class="summary-row total">
                    <span>Total a pagar:</span>
                    <span class="summary-value">$${total.toLocaleString('es-CO')}</span>
                </div>
            </div>
        `;

        const ordersList = document.getElementById('orders-list');
        ordersList.insertAdjacentHTML('beforebegin', resumenHTML);

        resolve({ total, cantidad });
    });
};

// =========================================================
// Promesa: Mostrar los botones
// =========================================================
const mostrarBotonesAccion = () => {
    return new Promise((resolve) => {
        const actionButtons = document.getElementById('action-buttons');
        actionButtons.style.display = 'flex';
        resolve("Botones de acción mostrados.");
    });
};

// =========================================================
// Promesa: Confirmar todas las órdenes
// =========================================================
const confirmarOrdenes = () => {
    return new Promise((resolve) => {
        console.log("Órdenes confirmadas por el usuario.");
        localStorage.removeItem('misOrdenesArray');
        resolve("Todas las órdenes han sido confirmadas exitosamente.");
    });
};

// =========================================================
// Promesa: Rechazar todas las órdenes 
// =========================================================
const rechazarOrdenes = () => {
    return new Promise((resolve) => {
        console.log("Órdenes rechazadas por el usuario.");
        localStorage.removeItem('misOrdenesArray');
        resolve("Todas las órdenes han sido canceladas.");
    });
};

// =========================================================
// Promesa: Mostrar mensaje cuando no hay órdenes
// =========================================================
const mostrarMensajeVacio = () => {
    return new Promise((resolve) => {
        const ordersList = document.getElementById('orders-list');
        const emptyMessage = document.getElementById('empty-message');
        
        ordersList.style.display = 'none';
        emptyMessage.style.display = 'block';
        
        resolve("Mensaje de lista vacía mostrado.");
    });
};

// =========================================================
// Inicialización: Encadenamiento de promesas
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
    console.log("Cargando lista de órdenes...");

    obtenerOrdenes()
        .then((ordenes) => {
            console.log("1. Órdenes recuperadas desde localStorage:", ordenes.length);
            return renderizarOrdenes(ordenes);
        })
        .then((ordenes) => {
            console.log("2. Órdenes renderizadas en el DOM");
            return calcularResumen(ordenes);
        })
        .then((resumen) => {
            console.log("3. Resumen calculado:", resumen);
            return mostrarBotonesAccion();
        })
        .then((mensaje) => {
            console.log("4.", mensaje);
            console.log("-> Lista de órdenes cargada completamente.");
        })
        .catch((error) => {
            console.log("⚠️", error);
            mostrarMensajeVacio()
                .then((mensaje) => {
                    console.log(mensaje);
                });
        });

    const btnConfirm = document.getElementById('btn-confirm');
    if (btnConfirm) {
        btnConfirm.addEventListener('click', () => {
            if (confirm('¿Estás seguro de confirmar todas las órdenes? Esta acción limpiará tu lista.')) {
                confirmarOrdenes()
                    .then((mensaje) => {
                        alert(mensaje);
                        console.log("Operación confirmada exitosamente.");
                        window.location.href = 'index.html';
                    });
            }
        });
    }

    const btnReject = document.getElementById('btn-reject');
    if (btnReject) {
        btnReject.addEventListener('click', () => {
            if (confirm('¿Estás seguro de cancelar todas las órdenes? Esta acción limpiará tu lista.')) {
                rechazarOrdenes()
                    .then((mensaje) => {
                        alert(mensaje);
                        console.log("Operación rechazada exitosamente.");
                        window.location.href = 'index.html';
                    });
            }
        });
    }
});
