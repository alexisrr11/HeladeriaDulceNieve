const btnMenu = document.getElementById("btn-menu");
const menuNav = document.getElementById("menu-nav");
const btnPedidoOculto = document.getElementById("btn-pedido-oculto");
const pedidoOculto = document.getElementById("pedido-oculto");
const modalPedidos = document.getElementById("modal-pedidos");
const btnCerrarModalPedidos = document.getElementById("btn-cerrar-modal-pedidos");
const unOctavo = document.getElementById("un-octavo");
const unCuarto = document.getElementById("un-cuarto");
const unMedio = document.getElementById("un-medio");
const unKilo = document.getElementById("un-kilo");
const tituloModal = document.getElementById("titulo-modal");
const descripcionModal = document.getElementById("descripcion-modal");
const modalCarrito = document.getElementById("modal-carrito");
const btnModalCarrito  = document.getElementById("btn-modal-carrito");
const btnCerrarModalPotes  = document.getElementById("btn-cerrar-modal-potes");

export {
  btnMenu,
  menuNav,
  btnPedidoOculto,
  pedidoOculto,
  modalPedidos,
  btnCerrarModalPedidos,
  unOctavo,
  unCuarto,
  unMedio,
  unKilo,
  tituloModal,
  descripcionModal
};

const contenedoresActivos = []; // Lista de todos los contenedores

btnCerrarModalPotes.addEventListener("click", () => {
  pedidoOculto.classList.add("hidden")
});

function toggleClick(btn, contenedor) {
  // Guardamos el contenedor en la lista (si no está)
  if (!contenedoresActivos.includes(contenedor)) {
    contenedoresActivos.push(contenedor);
  }

  btn.addEventListener("click", () => {
    // Cierra todos los demás contenedores
    contenedoresActivos.forEach((c) => {
      if (c !== contenedor) c.classList.add("hidden");
    });
    contenedor.classList.toggle("hidden");
  });
}

// Función abrir modal con datos correspondientes
function abrirModal(medida, cantidadSabores) {
  tituloModal.textContent = `Pote de ${medida}`;
  descripcionModal.textContent = `Elija hasta ${cantidadSabores} sabores:`;
  modalPedidos.classList.remove("hidden");
}

toggleClick(btnMenu, menuNav);
toggleClick(btnPedidoOculto, pedidoOculto);
toggleClick(btnCerrarModalPedidos, modalPedidos);
toggleClick(btnModalCarrito, modalCarrito);

// Eventos para los botones
unOctavo.addEventListener("click", () => abrirModal("1/8 Kg", 2));
unCuarto.addEventListener("click", () => abrirModal("1/4 Kg", 3));
unMedio.addEventListener("click", () => abrirModal("1/2 Kg", 3));
unKilo.addEventListener("click", () => abrirModal("1 Kg", 4));


[unOctavo, unCuarto, unMedio, unKilo].forEach(boton => {
  boton.addEventListener("click", () => {
    pedidoOculto.classList.add("hidden");
  });
});