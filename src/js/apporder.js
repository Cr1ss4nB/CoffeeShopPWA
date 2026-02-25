const misOrdenes = [];

const urlParams = new URLSearchParams(window.location.search);
const coffeeName = urlParams.get('coffee') || "Café Especial";
const isEditing = urlParams.get('edit') === 'true';

// =========================================================
// Promesa: Obtener el café seleccionado desde localStorage
// =========================================================
const obtenerCafeSeleccionado = () => {
    return new Promise((resolve, reject) => {
        const cafeGuardado = localStorage.getItem('cafeActual');
        if (cafeGuardado) {
            const cafe = JSON.parse(cafeGuardado);
            resolve(cafe);
        } else {
            reject("Error: No se encontró información del café seleccionado.");
        }
    });
};

// =========================================================
// Promesa: Obtener orden a editar desde localStorage
// =========================================================
const obtenerOrdenEditando = () => {
    return new Promise((resolve, reject) => {
        const ordenGuardada = localStorage.getItem('ordenEditando');
        if (ordenGuardada) {
            const orden = JSON.parse(ordenGuardada);
            console.log("Orden a editar cargada:", orden);
            resolve(orden);
        } else {
            reject("Error: No se encontró la orden a editar.");
        }
    });
};

// =========================================================
// Promesa: Pre-llenar formulario con datos de la orden
// =========================================================
const prellenarFormulario = (orden) => {
    return new Promise((resolve) => {
        const sizeSelect = document.getElementById('size');
        const sugarCheckbox = document.getElementById('sugar');
        const coffeeTitle = document.getElementById('coffee-title');
        
        if (sizeSelect) sizeSelect.value = orden.tamaño;
        if (sugarCheckbox) sugarCheckbox.checked = orden.azucar;
        if (coffeeTitle) coffeeTitle.textContent = `Editar Orden: ${orden.cafe}`;
        
        console.log("Formulario pre-llenado con datos de la orden.");
        resolve(orden);
    });
};

// =========================================================
// Promesa: Actualizar el precio según el tamaño
// =========================================================
const actualizarPrecio = (cafe, tamaño) => {
    return new Promise((resolve) => {
        const precio = cafe.precios[tamaño];
        const priceValueElement = document.getElementById('price-value');
        if (priceValueElement && precio) {
            // precio con separadores de miles y simbolo de moneda
            priceValueElement.textContent = `$${precio.toLocaleString('es-CO')}`;
            resolve(precio);
        } else {
            priceValueElement.textContent = "$0";
            resolve(0);
        }
    });
};

const guardarEnArray = (nuevaOrden) => {
    return new Promise((resolve) => {
        let misOrdenes = JSON.parse(localStorage.getItem('misOrdenesArray')) || [];

        if (isEditing) {
            const index = misOrdenes.findIndex(orden => orden.id === nuevaOrden.id);
            if (index !== -1) {
                misOrdenes[index] = nuevaOrden;
                console.log(`Orden #${nuevaOrden.id} actualizada en el arreglo`);
            
                localStorage.removeItem('ordenEditando');
                resolve("Orden actualizada exitosamente.");
            } else {
                resolve("No se encontró la orden original, se creó una nueva.");
                misOrdenes.push(nuevaOrden);
            }
        } else {
            misOrdenes.push(nuevaOrden);
            resolve("Orden guardada exitosamente.");
        }

        localStorage.setItem('misOrdenesArray', JSON.stringify(misOrdenes));

        console.log("Arreglo actualizado:", misOrdenes);
    });
};

// =========================================================
// Inicialización: Encadenamiento de promesas al cargar la página
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
    let cafeActual = null;
    let ordenEditando = null;
    const sizeSelect = document.getElementById('size');

    if (isEditing) {
        const pageTitle = document.querySelector('h2');
        if (pageTitle) {
            pageTitle.textContent = 'Editar Pedido';
        }

        const btnSubmit = document.querySelector('.btn-submit');
        if (btnSubmit) {
            btnSubmit.textContent = 'Actualizar Pedido';
        }
    }

    obtenerCafeSeleccionado()
        .then((cafe) => {
            console.log("1. Café seleccionado recuperado desde localStorage:", cafe.name);
            cafeActual = cafe;

            if (isEditing) {
                return obtenerOrdenEditando()
                    .then((orden) => {
                        ordenEditando = orden;
                        return prellenarFormulario(orden);
                    })
                    .then(() => {
                        return actualizarPrecio(cafe, sizeSelect.value);
                    });
            } else {
                return actualizarPrecio(cafe, sizeSelect.value);
            }
        })
        .then((precioInicial) => {
            console.log("2. Precio inicial cargado:", precioInicial);

            sizeSelect.addEventListener('change', (e) => {
                const nuevoTamaño = e.target.value;
                actualizarPrecio(cafeActual, nuevoTamaño)
                    .then((nuevoPrecio) => {
                        console.log(`Precio actualizado para tamaño ${nuevoTamaño}: $${nuevoPrecio}`);
                    });
            });
        })
        .catch((error) => {
            console.error(error);
            document.getElementById('price-value').textContent = "No disponible";
        });

    const btnCancel = document.getElementById('btn-cancel');
    if (btnCancel) {
        btnCancel.addEventListener('click', () => {
            if (isEditing) {
                localStorage.removeItem('ordenEditando');
                console.log("Edición cancelada, volviendo al carrito.");
                window.location.href = 'cart.html';
            } else {
                console.log("Usuario canceló la orden, volviendo al menú principal.");
                window.location.href = 'index.html';
            }
        });
    }

  // =========================================================
  // Capturar el envío del formulario de la orden
  // =========================================================
const orderForm = document.getElementById('order-form');

if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();

    const size = document.getElementById('size').value;
    const hasSugar = document.getElementById('sugar').checked;

    const precioActual = cafeActual ? cafeActual.precios[size] : 0;
    const ordenId = (isEditing && ordenEditando) ? ordenEditando.id : Date.now();
    const fechaOrden = (isEditing && ordenEditando) ? ordenEditando.fecha : new Date().toLocaleString();

    const nuevaOrden = {
        id: ordenId,
        cafe: coffeeName,
        tamaño: size,
        precio: precioActual,
        azucar: hasSugar,
        fecha: fechaOrden
    };

    const resultDiv = document.getElementById('order-result');
    const btnSubmit = document.querySelector('.btn-submit');

    resultDiv.textContent = isEditing ? "Actualizando tu orden..." : "Procesando tu orden...";
    resultDiv.className = 'success';
    resultDiv.style.display = 'block';
    btnSubmit.disabled = true;

    guardarEnArray(nuevaOrden)
        .then((mensaje) => {
            resultDiv.textContent = `¡Listo! ${mensaje}`;
            setTimeout(() => {
                if (isEditing) {
                    window.location.href = 'cart.html';
                } else {
                    window.location.href = 'index.html';
                }
            }, 2000);
        })
        .catch((error) => {
            console.error(error);
            resultDiv.textContent = "Error al procesar la orden.";
            resultDiv.className = 'error';
            btnSubmit.disabled = false;
        });
    });
}
});