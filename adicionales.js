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
      </div>
    `
    )
    .join("");
}
