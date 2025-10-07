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
const btnModalCarrito = document.getElementById("btn-modal-carrito");
const btnCerrarModalPotes = document.getElementById("btn-cerrar-modal-potes");

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

// Al hacer click, scrollea hasta el final del viewport
document.getElementById("scrollDownBtn").addEventListener("click", () => {
  window.scrollBy({
    top: window.innerHeight, // baja una pantalla completa (100vh)
    behavior: "smooth"
  });
});

window.onload = function () {
  const titulo = document.getElementById("titulo-ofertas");
  const textoOferta = document.getElementById("texto-oferta");
  const btnPrev = document.getElementById("btn-prev");
  const btnNext = document.getElementById("btn-next");

  // Ofertas por día (1 = Lunes, 6 = Sábado)
  const ofertasPorDia = {
    1: ["🍨 Lunes: 20% OFF en 1/4 kg de crema americana", "💳 15% OFF con Visa en sabores frutales"],
    2: ["🍦 Martes: 2x1 en cucuruchos simples", "📲 10% OFF con Mercado Pago en 1/2 kg de helado"],
    3: ["🍫 Miércoles: 25% OFF en chocolates", "🍓 Agregados gratis en tu pote"],
    4: ["🍯 Jueves: 3x2 en bochas artesanales", "💳 15% OFF en combos familiares"],
    5: ["🍨 Viernes: 2x1 en copas heladas", "🎉 20% OFF en helados sin azúcar y sin gluten"],
    6: ["🍧 Sábado: 10% OFF en 1 kg artesanal", "🍫 Toppings gratis en compras +$3000"]
  };

  const diaHoy = new Date().getDay();
  const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

  const ofertasHoy = ofertasPorDia[diaHoy] || ["No tenemos ofertas hoy. ¡Vuelve mañana!"];
  titulo.textContent = `Ofertas del ${diasSemana[diaHoy]}`;

  let index = 0;
  textoOferta.textContent = ofertasHoy[index];

  // Función para actualizar el texto con animación
  function mostrarOferta(nuevaIndex) {
    textoOferta.style.opacity = 0;
    setTimeout(() => {
      textoOferta.textContent = ofertasHoy[nuevaIndex];
      textoOferta.style.opacity = 1;
    }, 400);
  }

  // Botones manuales
  btnNext.onclick = () => {
    index = (index + 1) % ofertasHoy.length;
    mostrarOferta(index);
  };

  btnPrev.onclick = () => {
    index = (index - 1 + ofertasHoy.length) % ofertasHoy.length;
    mostrarOferta(index);
  };

  // Rotación automática
  setInterval(() => {
    btnNext.click();
  }, 4000);
};

const slider = document.getElementById("slider");
  const dots = document.querySelectorAll(".dot");
  let index = 0;

  function mostrarSlide(i) {
    slider.style.transform = `translateX(-${i * 100}%)`;
    dots.forEach((dot, idx) => {
      dot.classList.toggle("opacity-70", idx === i);
      dot.classList.toggle("opacity-50", idx !== i);
    });
  }

  document.getElementById("next").addEventListener("click", () => {
    index = (index + 1) % 3;
    mostrarSlide(index);
  });

  document.getElementById("prev").addEventListener("click", () => {
    index = (index - 1 + 3) % 3;
    mostrarSlide(index);
  });

  // Cambio automático cada 5 segundos
  setInterval(() => {
    index = (index + 1) % 3;
    mostrarSlide(index);
  }, 5000);
