// 1. Creamos nuestro arreglo vacío donde vivirá la información
const misOrdenes = [];

// Obtenemos el nombre del café de la URL
const urlParams = new URLSearchParams(window.location.search);
const coffeeName = urlParams.get('coffee') || "Café Especial";

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
        // 1. Traemos el arreglo actual (o creamos uno vacío)
        let misOrdenes = JSON.parse(localStorage.getItem('misOrdenesArray')) || [];

        // 2. Insertamos la nueva orden en el arreglo
        misOrdenes.push(nuevaOrden);

        // 3. Lo guardamos para que index.html pueda leerlo
        localStorage.setItem('misOrdenesArray', JSON.stringify(misOrdenes));

        console.log("Arreglo actualizado:", misOrdenes);
        resolve("Orden guardada exitosamente.");
    });
};

// =========================================================
// Inicialización: Encadenamiento de promesas al cargar la página
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
    let cafeActual = null;
    const sizeSelect = document.getElementById('size');

    obtenerCafeSeleccionado()
        .then((cafe) => {
            console.log("1. Café seleccionado recuperado desde localStorage:", cafe.name);
            cafeActual = cafe;
            return actualizarPrecio(cafe, sizeSelect.value);
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
            console.log("Usuario canceló la orden, volviendo al menú principal.");
            window.location.href = 'index.html';
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

    const nuevaOrden = {
        id: Date.now(),
        cafe: coffeeName,
        tamaño: size,
        precio: precioActual,
        azucar: hasSugar,
        fecha: new Date().toLocaleString()
    };

    const resultDiv = document.getElementById('order-result');
    const btnSubmit = document.querySelector('.btn-submit');

    resultDiv.textContent = "Procesando tu orden...";
    resultDiv.className = 'success';
    resultDiv.style.display = 'block';
    btnSubmit.disabled = true;

    guardarEnArray(nuevaOrden)
        .then((mensaje) => {
            resultDiv.textContent = `¡Listo! ${mensaje}`;

          // IMPORTANTE: Para ver el arreglo en consola, 
          // vamos a comentar temporalmente la redirección.
        /*
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);
          */

        setTimeout(() => {
            btnSubmit.disabled = false;
            btnSubmit.textContent = "Hacer otro pedido igual";
        }, 1000);
        })
        .catch((error) => {
            console.error(error);
        });
    });
}
});