const contenedorAdicionales = document.getElementById("contenedor-adicionales");

// === CARGAR ADICIONALES DESDE JSON ===
fetch("./adicionales.json")
  .then((response) => {
    if (!response.ok) throw new Error("Error al cargar los adicionales");
    return response.json();
  })
  .then((adicionales) => {
    renderizarAdicionales(adicionales);
  })
  .catch((error) => console.error("Error:", error));

// === RENDERIZAR ADICIONALES ===
function renderizarAdicionales(adicionales) {
  contenedorAdicionales.innerHTML = adicionales
    .map(
      (item) => `
      <div class="bg-white rounded-xl shadow-md p-4 text-center hover:scale-105 transition-transform">
        <img src="${item.imagen}" 
             alt="${item.nombre}" 
             class="w-24 h-24 object-cover mx-auto mb-3">
        <h3 class="text-xl font-bold">${item.nombre}</h3>
        <p class="text-gray-600 text-sm">${item.descripcion}</p>
        <p class="font-bold text-pink-600 mt-2">$${item.precio.toFixed(2)}</p>
        <div id="btns-sumar-restar" class="py-2">
          <button id="sumarAdicional" class="sumar-adicional">
            <i class='border-2 border-pink-300 rounded-full p-2 bx bx-plus'></i>
          </button>
          <span class="cantidad-adicional px-2 text-xl font-semibold">1</span>
          <button id="restarAdicional" class="restar-adicional">
            <i class='border-2 border-pink-300 rounded-full p-2 bx bx-minus'></i>
          </button>
        </div>
      </div>
    `
    )
    .join("");
}
