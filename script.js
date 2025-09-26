document.addEventListener('DOMContentLoaded', () => {
  let currentCategory = "gorros";

  const sidebar = document.getElementById("sidebar");
  const main = document.getElementById("mainContent");
  const homeScreen = document.getElementById("homeScreen");
  const overlay = document.getElementById("overlay");
  const menuBtn = document.getElementById("menuToggle");
  const fileInput = document.getElementById("imageInput");
  const catalogoSubmenu = document.getElementById("catalogoSubmenu");
  const notification = document.getElementById("notification");

  const categoriasDisponibles = {
    gorros: "Gorros",
    partesArriba: "Partes de arriba",
    partesAbajo: "Partes de abajo",
    zapatillas: "Zapatillas",
    ropaInterior: "Ropa interior",
    enteros: "Enteros",
    accesorios: "Accesorios"
  };

  let categoriasActivas =
    JSON.parse(localStorage.getItem("categoriasActivas")) || [
      "gorros", "partesArriba", "partesAbajo", "zapatillas"
    ];

  // Cierra el sidebar y hace toggle en el menu desplegable del catalog
  function closeSidebarToggleCatalog() {
    sidebar.classList.add("oculto");
    overlay.classList.remove("activo");
    main.classList.remove("desplazado");
    catalogoSubmenu.classList.toggle("hidden"); // Pliega el desplegable del catalogo
  }

  function closeSidebar(){         //Cierra el sidebar y pliega el desplegable del catalogo
    sidebar.classList.add("oculto");
    overlay.classList.remove("activo");
    main.classList.remove("desplazado");
    catalogoSubmenu.classList.add("hidden"); // Pliega el desplegable del catalogo
  }

  function displayCatalog(category) {
    currentCategory = category;
    const catalog = document.getElementById("catalog");
    catalog.innerHTML = "";

    const prendas = JSON.parse(localStorage.getItem(category)) || [];

    prendas.forEach((prenda, index) => {
      const prendaDiv = document.createElement("div");
      prendaDiv.className = "prenda";

      const img = document.createElement("img");
      img.src = prenda.url;

      const eliminarBtn = document.createElement("button");
      eliminarBtn.className = "eliminarBtn";
      eliminarBtn.textContent = "✕";
      eliminarBtn.onclick = () => {
        prendas.splice(index, 1);
        localStorage.setItem(category, JSON.stringify(prendas));
        displayCatalog(category);
      };

      if (prenda.color) {
        prendaDiv.style.boxShadow = `0 0 0 4px ${prenda.color}`;
      }

      const colorSelector = document.createElement("div");
      colorSelector.className = "colorSelector";
      colorSelector.innerHTML = "🎨";
      if (prenda.color) colorSelector.style.backgroundColor = prenda.color;

      const colorModal = document.createElement("div");
      colorModal.className = "colorModal";

      const temaColores = [
        ["#000000", "#444444", "#888888", "#bbbbbb", "#dddddd", "#ffffff"],
        ["#1e88e5", "#42a5f5", "#64b5f6", "#90caf9", "#bbdefb", "#e3f2fd"],
        ["#fb8c00", "#9d5f01ff", "#c57704ff", "#fbad38ff", "#f6c77cff", "#fee9a4ff"],
        ["#00ff0dff", "#014f05ff", "#018208ff", "#4cfc52ff", "#86ff8aff", "#abfbb1ff"],
        ["#c800ffff", "#51025fff", "#68037aff", "#ba02dbff", "#e973fcff", "#f7a1faff"],
        ["#f02222ff", "#800505ff", "#af2b2bff", "#fb3f3fff", "#fe6f6fff", "#faa2a2ff"],
        ["#fbff00ff", "#ab9d0cff", "#cbc805ff", "#feed35ff", "#f8f27eff", "#fcfe94ff"],
      ];

      // Transponer el array de colores
      const transpuesta = temaColores[0].map((_, i) => temaColores.map(row => row[i]));

      transpuesta.forEach((filaColores, filaIndex) => {
        const fila = document.createElement("div");
        fila.className = "filaColores";

        filaColores.forEach(color => {
          const swatch = document.createElement("div");
          swatch.className = "swatch";
          swatch.style.backgroundColor = color;
          swatch.onclick = () => {
            prenda.color = color;
            colorSelector.style.backgroundColor = color;
            prendaDiv.style.boxShadow = `0 0 0 4px ${color}`;
            closePaletaColores();
            localStorage.setItem(category, JSON.stringify(prendas));
          };
          fila.appendChild(swatch);
        });

        if (filaIndex === 0) {
          fila.style.marginBottom = "12px"; // 👈 espacio debajo de la primera fila
        }

        colorModal.appendChild(fila);
      });


      function closePaletaColores(){    //Cierra la paleta de colores
        colorModal.style.display = "none";
      }


      document.body.appendChild(colorModal);

      document.addEventListener("click", (e) => {
        // Si se hace clic fuera del colorModal y del botón colorSelector, cerramos la paleta
        if (!colorModal.contains(e.target) && e.target !== colorSelector) {
          closePaletaColores();
        }
      });

      // Evita que clics dentro del modal cierren la paleta
      colorModal.addEventListener("click", (e) => {
        e.stopPropagation();
      });

      colorSelector.onclick = () => { colorModal.style.display = "flex"; }; //Boton en la prenda para abrir el desplegable de la paleta

      prendaDiv.appendChild(img);
      prendaDiv.appendChild(eliminarBtn);
      prendaDiv.appendChild(colorSelector);
      catalog.appendChild(prendaDiv);
    });

    const addBtn = document.createElement("div");
    addBtn.className = "addBtn";
    addBtn.textContent = "+";
    addBtn.onclick = () => fileInput.click();
    catalog.prepend(addBtn);

    document.getElementById("catalogTitle").textContent =
      categoriasDisponibles[category];

    main.classList.remove("hidden");
    homeScreen.classList.add("hidden");

    closeSidebarToggleCatalog(); // 👈 cerrar sidebar automáticamente
    //Ver si se puede poner esa funcion aqui y ya
  }

  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const prendas = JSON.parse(localStorage.getItem(currentCategory)) || [];
      prendas.push({ url: reader.result, color: null });
      localStorage.setItem(currentCategory, JSON.stringify(prendas));
      displayCatalog(currentCategory);

      notification.classList.remove("hidden");
      setTimeout(() => notification.classList.add("hidden"), 2000);
    };
    reader.readAsDataURL(file);
  });

  // Crear menú dinámico
  Object.entries(categoriasDisponibles).forEach(([key, label]) => {
    if (categoriasActivas.includes(key)) {
      const li = document.createElement("li");
      const link = document.createElement("a");
      link.href = "#";
      link.textContent = label;

      link.addEventListener("click", (e) => {
        e.preventDefault();
        displayCatalog(key);
      });

      li.appendChild(link);
      catalogoSubmenu.appendChild(li);
    }
  });

  menuBtn.addEventListener("click", ()=>{ //Cuando se clicka la hamburguesa (El boton del menu)
    const isClosed = sidebar.classList.contains("oculto");
    sidebar.classList.toggle("oculto");
    overlay.classList.toggle("activo", isClosed);
    main.classList.toggle("desplazado", isClosed);
  });

  overlay.addEventListener("click", closeSidebar);

  function goToHome(){  //Funcion que te lleva a home/inicio    //Cierra el desplegable del catalogo
    main.classList.add("hidden");
    homeScreen.classList.remove("hidden");
    closeSidebar();
  }

  document.getElementById("inicioBtn").addEventListener("click", goToHome);

  document.getElementById("catalogoToggle").addEventListener("click", () => {
    catalogoSubmenu.classList.toggle("hidden");
  });

  const modal = document.getElementById("modalCatalogo");
  const cerrarModalBtn = document.getElementById("cerrarModal");
  const editarCatalogoBtn = document.getElementById("editarCatalogoBtn");
  const catalogoForm = document.getElementById("catalogoForm");

  editarCatalogoBtn.addEventListener("click", () => {
    catalogoForm.querySelectorAll("input[type=checkbox]").forEach(input => {
      input.checked = categoriasActivas.includes(input.value);
    });
    modal.classList.remove("oculto");
    overlay.classList.remove("activo");
  });

  cerrarModalBtn.addEventListener("click", () => {
    modal.classList.add("oculto");
    overlay.classList.remove("activo");
  });

  catalogoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const seleccionadas = Array.from(
      catalogoForm.querySelectorAll("input[type=checkbox]:checked")
    ).map(input => input.value);

    localStorage.setItem("categoriasActivas", JSON.stringify(seleccionadas));
    location.reload();
  });

  const perfilBtn = document.getElementById("perfilBtn");
  const perfilMenu = document.getElementById("perfilMenu");

  perfilBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    perfilMenu.classList.toggle("activo"); // 👈 ahora usamos activo
  });

  // Cerrar menú al clicar fuera
  document.addEventListener("click", () => {
    perfilMenu.classList.remove("activo");
  });

  // Evita que clics dentro del menú lo cierren
  perfilMenu.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  //Boton de elegir fondo
  const elegirFondoBtn = document.getElementById("elegirFondoBtn");
  const fondoCarrusel = document.getElementById("fondoCarrusel");
  const carruselContenido = document.getElementById("carruselContenido");

  // Coloca aquí las URLs de tus 7 fondos
  const fondosDisponibles = [
    "images/vittorio.jpg",
    "images/london.jpg",
    "images/coche.jpg",
    "images/arteas.jpg",
    "images/jardinj.jpg",
    "images/paris.jpg",
    "images/ropa.jpg"
  ];

  // Abrir carrusel
  elegirFondoBtn.addEventListener("click", (e) => {
    goToHome(); //Te lleva al home por si no estas
    perfilMenu.classList.remove("activo");
    e.stopPropagation(); // 👈 evita que se cierre instantáneamente
    carruselContenido.innerHTML = "";
    fondosDisponibles.forEach(url => {
      const img = document.createElement("img");
      img.src = url;
      img.addEventListener("click", (e) => {
        // Aplicar fondo en vivo sin cerrar el carrusel
        homeScreen.style.backgroundImage = `url('${url}')`;
        localStorage.setItem("fondoUsuario", url);
        e.stopPropagation(); // 👈 evita que clic en la foto cierre el carrusel
      });
      carruselContenido.appendChild(img);
    });

    fondoCarrusel.classList.add("activo"); // 👈 mostrar carrusel
  });

  // Cerrar carrusel al clicar fuera del contenido
  homeScreen.addEventListener("click", () => {
    fondoCarrusel.classList.remove("activo"); // 👈 ocultar carrusel
    
  });

  // Evitar que clics dentro del carrusel cierren el contenedor
  carruselContenido.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  // Aplicar fondo guardado al cargar la página
  const fondoGuardado = localStorage.getItem("fondoUsuario");
  if (fondoGuardado) {
    homeScreen.style.backgroundImage = `url('${fondoGuardado}')`;
  }



});
