let inventario = [
    { id: "01", nombre: "Camisa Casual Hombre", stock: 12, precio: 25500, imagen: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=200&auto=format&fit=crop" },
    { id: "02", nombre: "Jeans Slim Fit", stock: 7, precio: 45000, imagen: "https://images.unsplash.com/photo-1542272604-780c96856592?q=80&w=200&auto=format&fit=crop" },
    { id: "03", nombre: "Vestido Dama Floral", stock: 2, precio: 35000, imagen: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=200&auto=format&fit=crop" },
    { id: "04", nombre: "Chaqueta de Cuero Hombre", stock: 12, precio: 90000, imagen: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=200&auto=format&fit=crop" },
    { id: "05", nombre: "Chaqueta de Cuero Mujer", stock: 12, precio: 60000, imagen: "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?q=80&w=200&auto=format&fit=crop" },
    { id: "06", nombre: "Buso Manga Larga", stock: 8, precio: 15000, imagen: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=200&auto=format&fit=crop" }
];

let cajaInicial = 120000;
let dineroTotalVentas = 0;

const totalStockElem = document.getElementById('totalStock');
const totalMoneyElem = document.getElementById('totalMoney');
const inventoryTableBody = document.getElementById('inventoryTableBody');
const searchIdInput = document.getElementById('searchId');
const searchBtn = document.getElementById('searchBtn');
const searchResult = document.getElementById('searchResult');
const lowStockList = document.getElementById('lowStockList');
const modIdInput = document.getElementById('modId');
const modStockInput = document.getElementById('modStock');
const modPriceInput = document.getElementById('modPrice');
const updateBtn = document.getElementById('updateBtn');
const systemStatus = document.getElementById('systemStatus');

function formatearMoneda(monto) {
    return "$" + monto.toLocaleString("es-CO");
}

function actualizarSistema() {
    renderizarTabla();
    actualizarEstadisticas();
    verificarStockBajo();
}

function renderizarTabla() {
    inventoryTableBody.innerHTML = "";
    let totalUnidades = 0;

    inventario.forEach(item => {
        totalUnidades += item.stock;
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><img src="${item.imagen}" class="img-thumb" alt="${item.nombre}"></td>
            <td><strong>${item.id}</strong></td>
            <td>${item.nombre}</td>
            <td>${item.stock} un.</td>
            <td>${formatearMoneda(item.precio)}</td>
            <td><button class="sell-btn" onclick="venderPrenda('${item.id}')">Vender 1</button></td>
        `;
        inventoryTableBody.appendChild(tr);
    });

    totalStockElem.textContent = totalUnidades;
}

function actualizarEstadisticas() {
    totalMoneyElem.textContent = formatearMoneda(cajaInicial + dineroTotalVentas);
}

function venderPrenda(id) {
    const prenda = inventario.find(item => item.id.toUpperCase() === id.toUpperCase());
    
    if (prenda) {
        if (prenda.stock > 0) {
            prenda.stock -= 1;
            dineroTotalVentas += prenda.precio;
            systemStatus.textContent = `>>> ¡Venta realizada! Se vendió 1 unidad de ${prenda.nombre}.`;
            actualizarSistema();
        } else {
            alert("No hay stock disponible de esta prenda.");
        }
    }
}

searchBtn.addEventListener('click', () => {
    const query = searchIdInput.value.trim().toUpperCase();
    if(query === "") {
        searchResult.textContent = "Por favor ingresa un ID o término de búsqueda.";
        return;
    }

    const encontrada = inventario.find(item => item.id.toUpperCase() === query || item.nombre.toUpperCase().includes(query));

    if (encontrada) {
        searchResult.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <img src="${encontrada.imagen}" class="img-thumb" alt="${encontrada.nombre}">
                <div>
                    <strong>${encontrada.nombre}</strong> (ID: ${encontrada.id})<br>
                    <span>Stock: ${encontrada.stock} un. | Precio: ${formatearMoneda(encontrada.precio)}</span>
                </div>
            </div>
        `;
    } else {
        searchResult.textContent = "Prenda no encontrada en el inventario.";
    }
});

updateBtn.addEventListener('click', () => {
    const id = modIdInput.value.trim().toUpperCase();
    const nuevoStock = modStockInput.value.trim();
    const nuevoPrecio = modPriceInput.value.trim();

    const prenda = inventario.find(item => item.id.toUpperCase() === id);

    if (!prenda) {
        alert("El ID de la prenda no existe.");
        return;
    }

    if (nuevoStock !== "") {
        prenda.stock = parseInt(nuevoStock);
    }
    if (nuevoPrecio !== "") {
        prenda.precio = parseFloat(nuevoPrecio);
    }

    systemStatus.textContent = `>>> Prenda ${prenda.id} actualizada correctamente.`;
    modIdInput.value = "";
    modStockInput.value = "";
    modPriceInput.value = "";
    actualizarSistema();
});

function verificarStockBajo() {
    lowStockList.innerHTML = "";
    const bajos = inventario.filter(item => item.stock < 5);

    if (bajos.length === 0) {
        lowStockList.innerHTML = "<span style='color: #888; font-size: 13px;'>No hay alertas de stock bajo por el momento.</span>";
        return;
    }

    bajos.forEach(item => {
        const badge = document.createElement('div');
        badge.className = 'badge-warning';
        badge.textContent = `⚠️ ${item.nombre} (ID: ${item.id}) - Quedan: ${item.stock}`;
        lowStockList.appendChild(badge);
    });
}

// Registro del Service Worker para PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(err => console.log(err));
    });
}

actualizarSistema();