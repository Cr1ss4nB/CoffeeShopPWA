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
                    <button class="btn-edit-order" data-order-id="${orden.id}">
                        Editar Pedido
                    </button>
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
let totalAPagar = 0; // Variable global para usar en pagos

const calcularResumen = (ordenes) => {
    return new Promise((resolve) => {
        const total = ordenes.reduce((sum, orden) => sum + orden.precio, 0);
        const cantidad = ordenes.length;
        totalAPagar = total; // Guardar para usar en pagos

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
// Promesa: Mostrar la sección de pago
// =========================================================
const mostrarSeccionPago = () => {
    return new Promise((resolve) => {
        const paymentSection = document.getElementById('payment-section');
        paymentSection.style.display = 'block';
        resolve("Sección de pago mostrada.");
    });
};

// =========================================================
// Promesa: Ocultar elementos previos al pago
// =========================================================
const ocultarElementosParaPago = () => {
    return new Promise((resolve) => {
        document.getElementById('action-buttons').style.display = 'none';
        document.getElementById('orders-list').style.display = 'none';
        document.querySelector('.orders-summary').style.display = 'none';
        resolve("Elementos ocultados para mostrar pago.");
    });
};

// =========================================================
// Promesa: Validar formulario de efectivo
// =========================================================
const validarPagoEfectivo = (montoRecibido) => {
    return new Promise((resolve, reject) => {
        if (!montoRecibido || montoRecibido <= 0) {
            reject("Por favor, ingresa un monto válido.");
            return;
        }
        if (montoRecibido < totalAPagar) {
            reject(`El monto es insuficiente. Faltan $${(totalAPagar - montoRecibido).toLocaleString('es-CO')}`);
            return;
        }
        const cambio = montoRecibido - totalAPagar;
        resolve({ cambio, montoRecibido });
    });
};

// =========================================================
// Promesa: Validar formulario de tarjeta
// =========================================================
const validarPagoTarjeta = (numero, expiry, cvv, nombre) => {
    return new Promise((resolve, reject) => {
        // Validar número de tarjeta (16 dígitos)
        const numeroLimpio = numero.replace(/\s/g, '');
        if (!numeroLimpio || numeroLimpio.length < 13 || numeroLimpio.length > 19) {
            reject("El número de tarjeta debe tener entre 13 y 19 dígitos.");
            return;
        }
        if (!/^\d+$/.test(numeroLimpio)) {
            reject("El número de tarjeta solo debe contener dígitos.");
            return;
        }

        // Validar fecha de expiración (MM/AA)
        if (!expiry || !/^\d{2}\/\d{2}$/.test(expiry)) {
            reject("La fecha de expiración debe tener el formato MM/AA.");
            return;
        }
        const [mes, anio] = expiry.split('/').map(Number);
        if (mes < 1 || mes > 12) {
            reject("El mes de expiración no es válido.");
            return;
        }

        // Validar CVV (3 dígitos)
        if (!cvv || !/^\d{3,4}$/.test(cvv)) {
            reject("El CVV debe tener 3 o 4 dígitos.");
            return;
        }

        // Validar nombre
        if (!nombre || nombre.trim().length < 3) {
            reject("Por favor, ingresa el nombre del titular de la tarjeta.");
            return;
        }

        resolve({
            ultimosDigitos: numeroLimpio.slice(-4),
            titular: nombre.toUpperCase()
        });
    });
};

// =========================================================
// Promesa: Simular procesamiento de pago (con delay)
// =========================================================
const procesarPago = (metodoPago, datosPago) => {
    return new Promise((resolve, reject) => {
        // Mostrar overlay de carga
        const overlay = document.createElement('div');
        overlay.className = 'processing-overlay';
        overlay.innerHTML = `
            <div class="processing-spinner"></div>
            <p class="processing-text">Procesando pago...</p>
        `;
        document.body.appendChild(overlay);

        // Simular tiempo de procesamiento (2-3 segundos)
        const tiempoProcesamiento = 2000 + Math.random() * 1000;

        setTimeout(() => {
            // Simular aprobación/rechazo (90% aprobado, 10% rechazado)
            const aprobado = Math.random() > 0.1;

            // Remover overlay
            overlay.remove();

            if (aprobado) {
                resolve({
                    exito: true,
                    metodoPago,
                    transaccionId: 'TXN-' + Date.now(),
                    fecha: new Date().toLocaleString('es-CO'),
                    ...datosPago
                });
            } else {
                reject({
                    exito: false,
                    mensaje: metodoPago === 'efectivo' 
                        ? "Error al procesar el pago. Por favor, intenta nuevamente."
                        : "La transacción fue rechazada por el banco. Verifica los datos o usa otra tarjeta."
                });
            }
        }, tiempoProcesamiento);
    });
};

// =========================================================
// Promesa: Mostrar resultado del pago
// =========================================================
const mostrarResultadoPago = (resultado, esExito) => {
    return new Promise((resolve) => {
        const paymentSection = document.getElementById('payment-section');
        const paymentResult = document.getElementById('payment-result');
        const resultIcon = document.getElementById('result-icon');
        const resultTitle = document.getElementById('result-title');
        const resultMessage = document.getElementById('result-message');

        // Ocultar formularios
        document.getElementById('cash-form').style.display = 'none';
        document.getElementById('card-form').style.display = 'none';
        document.querySelector('.payment-methods').style.display = 'none';
        document.querySelector('.payment-subtitle').style.display = 'none';
        paymentSection.querySelector('h3').style.display = 'none';

        // Mostrar resultado
        paymentResult.style.display = 'block';

        if (esExito) {
            resultIcon.className = 'result-icon success';
            paymentResult.className = 'payment-result success';
            resultTitle.textContent = '¡Pago Exitoso!';
            
            let mensaje = `Transacción #${resultado.transaccionId}<br>`;
            mensaje += `Fecha: ${resultado.fecha}<br>`;
            mensaje += `Total pagado: $${totalAPagar.toLocaleString('es-CO')}<br>`;
            
            if (resultado.metodoPago === 'efectivo') {
                mensaje += `Método: Efectivo<br>`;
                mensaje += `Cambio entregado: $${resultado.cambio.toLocaleString('es-CO')}`;
            } else {
                mensaje += `Método: Tarjeta ****${resultado.ultimosDigitos}<br>`;
                mensaje += `Titular: ${resultado.titular}`;
            }
            
            resultMessage.innerHTML = mensaje;

            // Limpiar órdenes del localStorage
            localStorage.removeItem('misOrdenesArray');
        } else {
            resultIcon.className = 'result-icon error';
            paymentResult.className = 'payment-result error';
            resultTitle.textContent = 'Pago Rechazado';
            resultMessage.textContent = resultado.mensaje;
        }

        resolve(esExito);
    });
};

// =========================================================
// Promesa: Confirmar todas las órdenes (ir a pago)
// =========================================================
const confirmarOrdenes = () => {
    return new Promise((resolve) => {
        console.log("Usuario desea confirmar órdenes - mostrando opciones de pago.");
        resolve("Redirigiendo a selección de método de pago.");
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
// Promesa: Iniciar edición de una orden
// =========================================================
const iniciarEdicionOrden = (ordenId) => {
    return new Promise((resolve, reject) => {
        const ordenes = JSON.parse(localStorage.getItem('misOrdenesArray')) || [];
        const ordenAEditar = ordenes.find(orden => orden.id === ordenId);
        
        if (ordenAEditar) {
            // Guardar la orden a editar en localStorage
            localStorage.setItem('ordenEditando', JSON.stringify(ordenAEditar));
            console.log("Orden preparada para edición:", ordenAEditar);
            resolve(ordenAEditar);
        } else {
            reject("No se encontró la orden a editar.");
        }
    });
};

// =========================================================
// Promesa: Configurar event listeners para botones de editar
// =========================================================
const configurarBotonesEditar = () => {
    return new Promise((resolve) => {
        const botonesEditar = document.querySelectorAll('.btn-edit-order');
        
        botonesEditar.forEach(boton => {
            boton.addEventListener('click', (e) => {
                const ordenId = parseInt(e.currentTarget.dataset.orderId);
                
                iniciarEdicionOrden(ordenId)
                    .then((orden) => {
                        console.log(`Redirigiendo a editar orden #${orden.id}`);
                        // Redirigir a order.html con el café correspondiente
                        window.location.href = `order.html?coffee=${encodeURIComponent(orden.cafe)}&edit=true`;
                    })
                    .catch((error) => {
                        console.error(error);
                        alert("Error al intentar editar la orden.");
                    });
            });
        });
        
        resolve(`${botonesEditar.length} botones de editar configurados.`);
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
            return configurarBotonesEditar().then(() => ordenes);
        })
        .then((ordenes) => {
            console.log("3. Botones de editar configurados");
            return calcularResumen(ordenes);
        })
        .then((resumen) => {
            console.log("4. Resumen calculado:", resumen);
            return mostrarBotonesAccion();
        })
        .then((mensaje) => {
            console.log("5.", mensaje);
            console.log("-> Lista de órdenes cargada completamente.");
        })
        .catch((error) => {
            console.log("⚠️", error);
            mostrarMensajeVacio()
                .then((mensaje) => {
                    console.log(mensaje);
                });
        });

    // =========================================================
    // Event Listeners para botones de acción
    // =========================================================
    const btnConfirm = document.getElementById('btn-confirm');
    if (btnConfirm) {
        btnConfirm.addEventListener('click', () => {
            confirmarOrdenes()
                .then(() => ocultarElementosParaPago())
                .then(() => mostrarSeccionPago())
                .then((mensaje) => {
                    console.log("5.", mensaje);
                });
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

    // =========================================================
    // Event Listeners para selección de método de pago
    // =========================================================
    const payCash = document.getElementById('pay-cash');
    const payCard = document.getElementById('pay-card');
    const cashForm = document.getElementById('cash-form');
    const cardForm = document.getElementById('card-form');

    if (payCash) {
        payCash.addEventListener('change', () => {
            cashForm.style.display = 'block';
            cardForm.style.display = 'none';
            console.log("Método seleccionado: Efectivo");
        });
    }

    if (payCard) {
        payCard.addEventListener('change', () => {
            cardForm.style.display = 'block';
            cashForm.style.display = 'none';
            console.log("Método seleccionado: Tarjeta de Crédito");
        });
    }

    // =========================================================
    // Event Listeners para pago en efectivo
    // =========================================================
    const cashAmount = document.getElementById('cash-amount');
    const cashChange = document.getElementById('cash-change');
    const changeValue = document.getElementById('change-value');

    if (cashAmount) {
        cashAmount.addEventListener('input', () => {
            const monto = parseFloat(cashAmount.value) || 0;
            if (monto >= totalAPagar) {
                const cambio = monto - totalAPagar;
                cashChange.style.display = 'flex';
                changeValue.textContent = `$${cambio.toLocaleString('es-CO')}`;
            } else {
                cashChange.style.display = 'none';
            }
        });
    }

    const btnPayCash = document.getElementById('btn-pay-cash');
    if (btnPayCash) {
        btnPayCash.addEventListener('click', () => {
            const montoRecibido = parseFloat(cashAmount.value) || 0;

            validarPagoEfectivo(montoRecibido)
                .then((datos) => {
                    console.log("6. Pago en efectivo validado:", datos);
                    return procesarPago('efectivo', datos);
                })
                .then((resultado) => {
                    console.log("7. Pago procesado exitosamente:", resultado);
                    return mostrarResultadoPago(resultado, true);
                })
                .catch((error) => {
                    console.error("Error en pago:", error);
                    if (typeof error === 'string') {
                        alert(error);
                    } else {
                        mostrarResultadoPago(error, false);
                    }
                });
        });
    }

    const btnCancelCash = document.getElementById('btn-cancel-cash');
    if (btnCancelCash) {
        btnCancelCash.addEventListener('click', () => {
            if (confirm('¿Cancelar el pago? Volverás al menú principal.')) {
                window.location.href = 'index.html';
            }
        });
    }

    // =========================================================
    // Event Listeners para pago con tarjeta
    // =========================================================
    const cardNumber = document.getElementById('card-number');
    if (cardNumber) {
        // Formatear número de tarjeta con espacios
        cardNumber.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
            let formatted = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formatted;
        });
    }

    const cardExpiry = document.getElementById('card-expiry');
    if (cardExpiry) {
        // Formatear fecha de expiración
        cardExpiry.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }

    const btnPayCard = document.getElementById('btn-pay-card');
    if (btnPayCard) {
        btnPayCard.addEventListener('click', () => {
            const numero = document.getElementById('card-number').value;
            const expiry = document.getElementById('card-expiry').value;
            const cvv = document.getElementById('card-cvv').value;
            const nombre = document.getElementById('card-name').value;

            validarPagoTarjeta(numero, expiry, cvv, nombre)
                .then((datos) => {
                    console.log("6. Pago con tarjeta validado:", datos);
                    return procesarPago('tarjeta', datos);
                })
                .then((resultado) => {
                    console.log("7. Pago procesado exitosamente:", resultado);
                    return mostrarResultadoPago(resultado, true);
                })
                .catch((error) => {
                    console.error("Error en pago:", error);
                    if (typeof error === 'string') {
                        alert(error);
                    } else {
                        mostrarResultadoPago(error, false);
                    }
                });
        });
    }

    const btnCancelCard = document.getElementById('btn-cancel-card');
    if (btnCancelCard) {
        btnCancelCard.addEventListener('click', () => {
            if (confirm('¿Cancelar el pago? Volverás al menú principal.')) {
                window.location.href = 'index.html';
            }
        });
    }

    // =========================================================
    // Event Listener para volver al menú después del pago
    // =========================================================
    const btnBackMenu = document.getElementById('btn-back-menu');
    if (btnBackMenu) {
        btnBackMenu.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
});
