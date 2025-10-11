import {
  unOctavo,
  unCuarto,
  unMedio,
  unKilo,
  tituloModal,
  descripcionModal,
  modalPedidos
} from "./index.js";

const contenedorSabores = document.getElementById("sabores");
const contenedorPedidos = document.getElementById("lista-gustos-pedidos");
const selectFiltro = document.getElementById("filtro-categorias");
const inputBuscar = document.getElementById("buscar-nombre");
const modalCarrito = document.getElementById("modal-carrito");
const contenedorCarrito = document.getElementById("en-carrito");
const contadorCarrito = document.getElementById("contador-carrito");
const btnWhatsapp = document.getElementById("btn-whatsapp");
const mensajeCarrito = document.getElementById("mensaje-carrito");
const modalAdicionales = document.getElementById("modal-adicionales");
let adicionalesSeleccionados = [];
let saboresSeleccionados = [];
let limiteSabores = 0;

// CARGA DEL JSON 
fetch("./sabores.json")
  .then((response) => {
    if (!response.ok) throw new Error("Error al cargar el archivo JSON");
    return response.json();
  })
  .then((sabores) => {
    renderizarSabores(sabores);
    renderizarPedidos(sabores);
    window.todosLosSabores = sabores;
  })
  .catch((error) => console.error("Error:", error));

// === RENDERIZAR LISTA GENERAL ===
function renderizarSabores(sabores) {
  // 1️⃣ Agrupar por categoría
  const categorias = sabores.reduce((acc, sabor) => {
    if (!acc[sabor.categoria]) acc[sabor.categoria] = [];
    acc[sabor.categoria].push(sabor);
    return acc;
  }, {});

  // 2️⃣ Generar el HTML agrupado
  contenedorSabores.innerHTML = Object.keys(categorias)
    .map(
      (categoria) => `
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-pink-700 mb-4">${categoria}</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            ${categorias[categoria]
          .map(
            (sabor) => `
                  <div class="bg-white rounded-xl shadow-lg p-4 text-center hover:scale-105 transition-transform">
                    <img src="${sabor.imagen}" alt="${sabor.nombre}" 
                         class="w-full h-48 object-cover rounded-lg mb-3">
                    <h3 class="text-xl font-semibold text-pink-600">${sabor.nombre}</h3>
                    <p class="text-gray-600 text-sm mb-2">${sabor.descripcion}</p>
                  </div>`
          )
          .join("")}
          </div>
        </div>`
    )
    .join("");
}

// === RENDERIZAR PEDIDOS AGRUPADOS ===
function renderizarPedidos(sabores) {
  const categorias = sabores.reduce((acc, sabor) => {
    if (!acc[sabor.categoria]) acc[sabor.categoria] = [];
    acc[sabor.categoria].push(sabor);
    return acc;
  }, {});

  // === LLENAR OPCIONES DEL SELECT SOLO UNA VEZ ===
  if (selectFiltro.options.length === 1) {
    Object.keys(categorias).forEach((categoria) => {
      const option = document.createElement("option");
      option.value = categoria;
      option.textContent = categoria;
      selectFiltro.appendChild(option);
    });
  }

  // === FUNCION PARA MOSTRAR SEGÚN FILTRO ===
  function mostrarPedidos(categoriaSeleccionada, textoBuscar = "") {
    const categoriasFiltradas =
      categoriaSeleccionada === "todas"
        ? categorias
        : { [categoriaSeleccionada]: categorias[categoriaSeleccionada] };

    // Filtrar por nombre
    const categoriasConBusqueda = {};
    Object.keys(categoriasFiltradas).forEach((categoria) => {
      categoriasConBusqueda[categoria] = categoriasFiltradas[categoria].filter((sabor) =>
        sabor.nombre.toLowerCase().includes(textoBuscar.toLowerCase())
      );
    });

    contenedorPedidos.innerHTML = Object.keys(categoriasConBusqueda)
      .map(
        (categoria) => {
          if (categoriasConBusqueda[categoria].length === 0) return ""; // Omitir si no hay coincidencias
          return `
          <div class="mb-6">
            <h2 class="text-xl font-bold text-pink-700 mb-4">${categoria}</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              ${categoriasConBusqueda[categoria]
              .map(
                (sabor) => `
                    <button 
                      class="sabor-btn bg-white rounded-xl shadow-lg p-4 text-center hover:scale-105 transition-transform"
                      data-nombre="${sabor.nombre}">
                      <img src="${sabor.imagen}" alt="${sabor.nombre}" class="m-auto max-h-40 max-w-40 min-h-40 min-w-40 object-cover rounded-lg mb-3">
                      <h3 class="text-sm font-semibold text-pink-600">${sabor.nombre}</h3>
                    </button>`
              )
              .join("")}
            </div>
          </div>`;
        }
      )
      .join("");

    // Reasignar eventos a los botones visibles
    document.querySelectorAll(".sabor-btn").forEach((btn) => {
      btn.addEventListener("click", () => seleccionarSabor(btn));
    });
  }

  // === EVENTOS FILTRO Y BÚSQUEDA ===
  selectFiltro.addEventListener("change", (e) => {
    mostrarPedidos(e.target.value, inputBuscar.value);
  });

  inputBuscar.addEventListener("input", () => {
    mostrarPedidos(selectFiltro.value, inputBuscar.value);
  });

  // === MOSTRAR TODO AL INICIO ===
  mostrarPedidos("todas");
}

// === CARGAR CARRITO DESDE LOCALSTORAGE AL INICIO ===
window.addEventListener("DOMContentLoaded", () => {
  const pedidosGuardados = JSON.parse(localStorage.getItem("carrito")) || [];
  pedidosGuardados.forEach((pedido) => {
    if (!pedido.sabores) pedido.sabores = [];
    if (!pedido.adicionales) pedido.adicionales = [];
    agregarPedidoAlDOM(pedido);
  });
  actualizarWhatsapp();
});

// === SELECCIONAR SABOR ===
function seleccionarSabor(boton) {
  const nombre = boton.dataset.nombre;
  if (saboresSeleccionados.includes(nombre)) return;

  saboresSeleccionados.push(nombre);
  boton.classList.add("line-through", "opacity-50");

  if (saboresSeleccionados.length < limiteSabores) {
    const agregarOtro = confirm(`Has elegido "${nombre}". ¿Querés agregar otro sabor?`);
    if (!agregarOtro) {
      preguntarAdicionales();
    }
  } else {
    preguntarAdicionales();
  }
}

// === NUEVA PREGUNTA: DESEA AGREGAR ADICIONALES ===
function preguntarAdicionales() {
  const deseaAdicional = confirm("¿Desea agregar un adicional?");
  if (deseaAdicional) {
    abrirModalAdicionales();
  } else {
    confirmarPedido();
  }
}

// === ABRIR MODAL DE ADICIONALES ===
function abrirModalAdicionales() {
  modalAdicionales.classList.remove("hidden");
  adicionalesSeleccionados = [];

  const cards = document.querySelectorAll("#contenedor-adicionales > div");

  // 🔥 Limpiar listeners previos
  cards.forEach((card) => {
    const newCard = card.cloneNode(true);
    card.parentNode.replaceChild(newCard, card);
  });

  // Re-seleccionar cards
  const nuevasCards = document.querySelectorAll("#contenedor-adicionales > div");

  nuevasCards.forEach((card) => {
    const nombre = card.querySelector("h3").textContent;
    const btnsCantidad = card.querySelector("#btns-sumar-restar");
    const cantidadSpan = btnsCantidad.querySelector("span");

    btnsCantidad.classList.add("hidden");

    card.addEventListener("click", () => {
      const index = adicionalesSeleccionados.findIndex((a) => a.nombre === nombre);
      const yaSeleccionado = index !== -1;

      if (!yaSeleccionado) {
        adicionalesSeleccionados.push({
          nombre,
          cantidad: parseInt(cantidadSpan.textContent),
        });
        card.classList.add("ring", "ring-pink-400");
        btnsCantidad.classList.remove("hidden");
      } else {
        adicionalesSeleccionados.splice(index, 1);
        card.classList.remove("ring", "ring-pink-400");
        btnsCantidad.classList.add("hidden");
      }
    });

    // === Sumar/restar cantidad ===
    const btnSumar = card.querySelector("#sumarAdicional");
    const btnRestar = card.querySelector("#restarAdicional");

    btnSumar.addEventListener("click", (e) => {
      e.stopPropagation();
      let cantidad = parseInt(cantidadSpan.textContent);
      cantidad++;
      cantidadSpan.textContent = cantidad;

      const adicional = adicionalesSeleccionados.find((a) => a.nombre === nombre);
      if (adicional) adicional.cantidad = cantidad;
    });

    btnRestar.addEventListener("click", (e) => {
      e.stopPropagation();
      let cantidad = parseInt(cantidadSpan.textContent);
      if (cantidad > 1) {
        cantidad--;
        cantidadSpan.textContent = cantidad;

        const adicional = adicionalesSeleccionados.find((a) => a.nombre === nombre);
        if (adicional) adicional.cantidad = cantidad;
      }
    });
  });

  // Botón confirmar
  const btnConfirmarAdicionales = document.getElementById("confirmar-adicionales");
  btnConfirmarAdicionales.onclick = () => {
    modalAdicionales.classList.add("hidden");
    confirmarPedido();
  };
}


// === FUNCION PARA CONFIRMAR PEDIDO Y GUARDARLO ===
function confirmarPedido(completo = false) {
  const pedido = {
    pote: tituloModal.textContent,
    sabores: [...saboresSeleccionados],
    adicionales: [...adicionalesSeleccionados], // ahora son objetos {nombre, cantidad}
  };

  const textoAdicionales =
    pedido.adicionales.length > 0
      ? pedido.adicionales.map((a) => `${a.nombre} x${a.cantidad}`).join(", ")
      : "";

  alert(
    `🍨 Pedido agregado!\nPote: ${pedido.pote}\nSabores: ${pedido.sabores.join(", ")}${
      textoAdicionales ? `\nAdicionales: ${textoAdicionales}` : ""
    }${completo ? "\n(Se alcanzó el límite de sabores)" : ""}`
  );

  const carritoActual = JSON.parse(localStorage.getItem("carrito")) || [];
  carritoActual.push(pedido);
  localStorage.setItem("carrito", JSON.stringify(carritoActual));

  agregarPedidoAlDOM(pedido);

  saboresSeleccionados = [];
  adicionalesSeleccionados = [];

  document.querySelectorAll("#contenedor-adicionales > div").forEach((card) => {
    card.classList.remove("ring", "ring-pink-400");
  });

  modalPedidos.classList.add("hidden");
  modalCarrito.classList.remove("hidden");
}

// === AGREGAR PEDIDO AL DOM ===
function agregarPedidoAlDOM(pedido) {
  const pedidoDiv = document.createElement("div");
  pedidoDiv.classList.add(
    "border-b", "border-gray-300", "w-full", "py-2", "flex", "justify-around", "items-center", "font-[cursive]", "gap-2", "text-xl"
  );

  const adicionalesHtml = pedido.adicionales?.length > 0
    ? `<p class="adicionales">➕ Adicionales: ${pedido.adicionales.map(a => `${a.nombre} x${a.cantidad}`).join(", ")}</p>`
    : "";

  pedidoDiv.innerHTML = `
    <div>
      <p class="font-semibold">${pedido.pote}</p>
      <p>🍨 Sabores: ${pedido.sabores.join(", ")}</p>
      ${adicionalesHtml}
    </div>
    <button class="btn-eliminar text-red-600 text-2xl hover:text-red-500"><i class='bx bx-trash'></i></button>
  `;

  // === ELIMINAR PEDIDO ===
  const btnEliminar = pedidoDiv.querySelector(".btn-eliminar");
  btnEliminar.addEventListener("click", () => {
    pedidoDiv.remove();

    const carritoActual = JSON.parse(localStorage.getItem("carrito")) || [];
    const nuevoCarrito = carritoActual.filter((p) => {
      const mismoPote = p.pote === pedido.pote;
      const mismosSabores = JSON.stringify(p.sabores) === JSON.stringify(pedido.sabores);
      const mismosAdicionales = JSON.stringify(p.adicionales) === JSON.stringify(pedido.adicionales);
      return !(mismoPote && mismosSabores && mismosAdicionales);
    });

    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
    actualizarWhatsapp();
    contadorDinamico();
  });

  function contadorDinamico() {
    contadorCarrito.textContent = contenedorCarrito.children.length;
  }

  contenedorCarrito.appendChild(pedidoDiv);
  actualizarWhatsapp();
  contadorDinamico();
}

// === ACTUALIZAR LINK DE WHATSAPP ===
function actualizarWhatsapp() {
  if (contenedorCarrito.children.length === 0) {
    btnWhatsapp.classList.add("hidden");
    btnWhatsapp.href = "#";
    mensajeCarrito.innerHTML = "No hay ningún pedido en el carrito";
    return;
  } else {
    mensajeCarrito.innerHTML = "";
  }

  const mensajes = Array.from(contenedorCarrito.children)
    .map((pedidoDiv) => {
      const titulo = pedidoDiv.querySelector("p.font-semibold")?.textContent || "";
      // tomamos todos los <p> excepto el primero (el título)
      const detalles = Array.from(pedidoDiv.querySelectorAll("p")).slice(1).map(p => p.textContent).join(", ");
      return `(${titulo}: ${detalles})`;
    })
    .join("\n");

  btnWhatsapp.href = `https://wa.me/5491137659081?text=${encodeURIComponent("Hola! Quisiera pedir: \n" + mensajes)}`;
  btnWhatsapp.classList.remove("hidden");
}

// === ABRIR MODAL ===
function abrirModal(medida, cantidadSabores) {
  tituloModal.textContent = `Pote de ${medida}`;
  descripcionModal.textContent = `Elija hasta ${cantidadSabores} sabores:`;
  limiteSabores = cantidadSabores;
  saboresSeleccionados = [];

  // Quitar tachado anterior
  document
    .querySelectorAll(".sabor-btn")
    .forEach((btn) => btn.classList.remove("line-through", "opacity-50"));
  modalPedidos.classList.remove("hidden");
}

// ASOCIAR TAMAÑOS 
const tamaños = [
  { boton: unOctavo, medida: "1/8 Kg", sabores: 2 },
  { boton: unCuarto, medida: "1/4 Kg", sabores: 3 },
  { boton: unMedio, medida: "1/2 Kg", sabores: 3 },
  { boton: unKilo, medida: "1 Kg", sabores: 4 },
];

tamaños.forEach(({ boton, medida, sabores }) => {
  boton.addEventListener("click", () => abrirModal(medida, sabores));
});


