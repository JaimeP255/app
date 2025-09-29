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

  //Cierra el sidebar
  function closeSidebar(){
    sidebar.classList.add("oculto");
    overlay.classList.remove("activo");
    main.classList.remove("desplazado");
    catalogoSubmenu.classList.add("hidden"); // Pliega el desplegable del catalogo
    textoMenu.classList.remove("visible"); // Ocultar texto
  }

  function displayCatalog(category) {
    currentCategory = category;
    const catalog = document.getElementById("catalog");
    catalog.innerHTML = "";

    const prendas = JSON.parse(localStorage.getItem(category)) || [];

    prendas.forEach((prenda, index) => {
      const prendaDiv = document.createElement("div");
      prendaDiv.className = "prenda";
        // --- Guardamos info en dataset para que funcione el ordenado ---
      prendaDiv.dataset.timestamp = prenda.timestamp || Date.now();
      prendaDiv.dataset.marca = prenda.marca || "";

      if (prenda.color) {
        const hsl = hexToHSL(prenda.color);
        prendaDiv.dataset.hex = prenda.color;
        prendaDiv.dataset.colorPrincipal = getMainColor(hsl.h);
        prendaDiv.dataset.luminosidad = hsl.l;
      }


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

      // Paleta de color
      const colorSelector = document.createElement("div");
      colorSelector.className = "colorSelector";
      colorSelector.innerHTML = "🎨";
      if (prenda.color) colorSelector.style.backgroundColor = prenda.color;

      const colorModal = document.createElement("div");
      colorModal.className = "colorModal";

      const temaColores = [
        ["#000000","#444444","#888888","#bbbbbb","#dddddd","#ffffff"],
        ["#1e88e5","#42a5f5","#64b5f6","#90caf9","#bbdefb","#e3f2fd"],
        ["#fb8c00","#9d5f01ff","#c57704ff","#fbad38ff","#f6c77cff","#fee9a4ff"],
        ["#00ff0dff","#014f05ff","#018208ff","#4cfc52ff","#86ff8aff","#abfbb1ff"],
        ["#c800ffff","#51025fff","#68037aff","#ba02dbff","#e973fcff","#f7a1faff"],
        ["#f02222ff","#800505ff","#af2b2bff","#fb3f3fff","#fe6f6fff","#faa2a2ff"],
        ["#fbff00ff","#ab9d0cff","#cbc805ff","#feed35ff","#f8f27eff","#fcfe94ff"]
      ];

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
            colorModal.style.display = "none";
            localStorage.setItem(category, JSON.stringify(prendas));
          };
          fila.appendChild(swatch);
        });

        if (filaIndex === 0) fila.style.marginBottom = "12px";
        colorModal.appendChild(fila);
      });

      document.body.appendChild(colorModal);

      document.addEventListener("click", (e) => {
        if (!colorModal.contains(e.target) && e.target !== colorSelector) {
          colorModal.style.display = "none";
        }
      });

      colorModal.addEventListener("click", (e) => e.stopPropagation());
      colorSelector.onclick = () => { colorModal.style.display = "flex"; };

      // Botón/input de marca con autocompletado
      const marcaDiv = document.createElement("div");
      marcaDiv.className = "marcaDiv";
      marcaDiv.textContent = prenda.marca || "Marca";
      

      const marcaInput = document.createElement("input");
      marcaInput.type = "text";
      marcaInput.className = "marcaInput hidden";
      marcaInput.placeholder = "Escribe para buscar marca";

      const marcaDropdown = document.createElement("div");
      marcaDropdown.className = "marcaDropdown hidden";

      const marcasDisponibles = [
           "Zara",
  "Mango",
  "Bershka",
  "Massimo Dutti",
  "Stradivarius",
  "Pull&Bear",
  "Oysho",
  "Desigual",
  "Adolfo Domínguez",
  "Bimba y Lola",
  "El Corte Inglés",
  "H&M",
  "Primark",
  "Shein",
  "Nike",
  "Adidas",
  "Reebok",
  "Puma",
  "Calvin Klein",
  "Tommy Hilfiger",
  "Levi's",
  "Pepe Jeans",
  "Diesel",
  "Levi's",
  "Lacoste",
  "Ralph Lauren",
  "Carhartt",
  "Vans",
  "Converse",
  "New Balance",
  "Asics",
  "Under Armour",
  "Superdry",
  "Abercrombie & Fitch",
  "Hollister",
  "Uniqlo",
  "Jack & Jones",
  "Benetton",
  "C&A",
  "Kiabi",
  "Sfera",
  "Mayoral",
  "Cortefiel",
  "Women'secret",
  "Springfield",
  "Tendam",
  "AWWG",
  "Sociedad Textil Lonia",
  "Tous",
  "Lois",
  "Tenth",
  "Polinesia",
  "Decathlon",
  "Calzedonia",
  "Intimissimi",
  "Tezenis",
  "Hunkemöller",
  "Oysho",
  "Calvin Klein Underwear",
  "Victoria's Secret",
  "Agent Provocateur",
  "Sloggi",
  "Triumph",
  "Playtex",
  "Chantelle",
  "Simone Pérèle",
  "Wacoal",
  "Freya",
  "Panache",
  "Curvy Kate",
  "Bravissimo",
  "Boux Avenue",
  "Marks & Spencer",
  "Next",
  "River Island",
  "Topshop",
  "Topman",
  "Monsoon",
  "Accessorize",
  "Clarks",
  "Dr. Martens",
  "Timberland",
  "UGG",
  "Hunter",
  "Skechers",
  "Crocs",
  "Geox",
  "Pikolinos",
  "Camper",
  "El Naturalista",
  "Lottusse",
  "Pretty Ballerinas",
  "Bimba y Lola",
  "Castañer",
  "Manolo Blahnik",
  "Loewe",
  "Balenciaga",
  "Chanel",
  "Louis Vuitton",
  "Gucci",
  "Prada",
  "Dior",
  "Fendi",
  "Burberry",
  "Saint Laurent",
  "Valentino",
  "Givenchy",
  "Celine",
  "Chloé",
  "Isabel Marant",
  "Stella McCartney",
  "Alexander McQueen",
  "Victoria Beckham",
  "Simone Rocha",
  "JW Anderson",
  "Acne Studios",
  "Sacai",
  "Loewe",
  "Lemaire",
  "Haider Ackermann",
  "Dries Van Noten",
  "Ann Demeulemeester",
  "Haider Ackermann",
  "Junya Watanabe",
  "Comme des Garçons",
  "Issey Miyake",
  "Yohji Yamamoto",
  "Kenzo",
  "Sacai",
  "Undercover",
  "Maison Margiela",
  "Rick Owens",
  "Vetements",
  "Off-White",
  "Balenciaga",
  "Fendi",
  "Prada",
  "Dior",
  "Chanel",
  "Louis Vuitton",
  "Gucci",
  "Versace",
  "Bvlgari",
  "Cartier",
  "Piaget",
  "Chopard",
  "Tiffany & Co.",
  "Van Cleef & Arpels",
  "Harry Winston",
  "Graff",
  "De Beers",
  "Mikimoto",
  "David Yurman",
  "Boucheron",
  "Chaumet",
  "Piaget",
  "Chopard",
  "Tiffany & Co.",
  "Van Cleef & Arpels",
  "Harry Winston",
  "Graff",
  "De Beers",
  "Mikimoto",
  "David Yurman",
  "Boucheron",
  "Chaumet"
      ];

      function actualizarDropdown() {
        const valor = marcaInput.value.toLowerCase();
        marcaDropdown.innerHTML = "";
        marcasDisponibles.filter(m => m.toLowerCase().includes(valor))
          .forEach(m => {
            const item = document.createElement("div");
            item.className = "marcaItem";
            item.textContent = m;
            item.addEventListener("click", () => {
              prenda.marca = m;
              marcaDiv.textContent = m;
              marcaInput.classList.add("hidden");
              marcaDropdown.classList.add("hidden");
              localStorage.setItem(category, JSON.stringify(prendas));
            });
            marcaDropdown.appendChild(item);
          });
        marcaDropdown.classList.toggle("hidden", marcaDropdown.innerHTML === "");
      }

      marcaDiv.addEventListener("click", () => {
        marcaInput.value = "";
        marcaInput.classList.toggle("hidden");
        marcaDropdown.classList.toggle("hidden");
        marcaInput.focus();
        actualizarDropdown();
      });

      marcaInput.addEventListener("input", actualizarDropdown);

      document.addEventListener("click", (e) => {
        if (!marcaDiv.contains(e.target) && !marcaInput.contains(e.target) && !marcaDropdown.contains(e.target)) {
          marcaInput.classList.add("hidden");
          marcaDropdown.classList.add("hidden");
        }
      });

      // Append al DOM
      prendaDiv.appendChild(img);
      prendaDiv.appendChild(eliminarBtn);
      prendaDiv.appendChild(colorSelector); // ✅ directamente en prendaDiv para esquina superior
      prendaDiv.appendChild(marcaDiv);
      prendaDiv.appendChild(marcaInput);
      prendaDiv.appendChild(marcaDropdown);
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

    catalogoSubmenu.classList.toggle("hidden"); // Pliega/Despliega el desplegable del catalogo
    closeSidebar();
  }

  fileInput.addEventListener("change", (e) => {
  const files = Array.from(e.target.files);
  if (files.length === 0) return;

  const prendas = JSON.parse(localStorage.getItem(currentCategory)) || [];

  let loaded = 0;

  files.forEach((file) => {
    const reader = new FileReader();
    reader.onload = () => {
      prendas.push({
        url: reader.result,
        color: null,
        marca: "",
        timestamp: Date.now()
      });

      loaded++;
      if (loaded === files.length) {
        localStorage.setItem(currentCategory, JSON.stringify(prendas));
        displayCatalog(currentCategory);

        notification.classList.remove("hidden");
        setTimeout(() => notification.classList.add("hidden"), 2000);
      }
    };
    reader.readAsDataURL(file);
  });

  // Resetear input
  e.target.value = "";
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
    textoMenu.classList.toggle("visible"); // mostrar/ocultar texto
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

  // --- BOTÓN ORDENAR ---
const ordenarBtn = document.getElementById("ordenarBtn");
const ordenarDropdown = document.getElementById("ordenarDropdown");

// Abrir/cerrar desplegable
ordenarBtn.addEventListener("click", () => {
  ordenarDropdown.classList.toggle("show");
});

// Detectar opción seleccionada
document.querySelectorAll("#ordenarDropdown .opcion").forEach(opcion => {
  opcion.addEventListener("click", () => {
    const criterio = opcion.dataset.sort;
    ordenarPrendas(criterio);
    ordenarDropdown.classList.remove("show");
  });
});

document.addEventListener("click", ()=>{
  ordenarDropdown.classList.remove("show");
});

ordenarBtn.addEventListener("click",(e)=> {e.stopPropagation();});

// --- FUNCIONES DE COLOR ---
// Convierte HEX a HSL
function hexToHSL(hex) {
  let r = 0, g = 0, b = 0;
  hex = hex.replace(/^#/, "");

  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else {
    r = parseInt(hex.substring(0,2), 16);
    g = parseInt(hex.substring(2,4), 16);
    b = parseInt(hex.substring(4,6), 16);
  }

  r /= 255; g /= 255; b /= 255;
  let max = Math.max(r,g,b), min = Math.min(r,g,b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // gris
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch(max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return { h: Math.round(h*360), s: Math.round(s*100), l: Math.round(l*100) };
}

// Detecta color principal a partir de Hue
function getMainColor(h) {
  if (h < 15 || h >= 345) return "rojo";
  if (h < 45) return "naranja";
  if (h < 70) return "amarillo";
  if (h < 170) return "verde";
  if (h < 260) return "azul";
  if (h < 320) return "morado";
  return "rosa";
}

// Actualiza el dataset de una prenda cuando seleccionas un color en la paleta
function actualizarColor(prendaEl, hex) {
  const hsl = hexToHSL(hex);
  const mainColor = getMainColor(hsl.h);

  prendaEl.dataset.hex = hex;
  prendaEl.dataset.colorPrincipal = mainColor;
  prendaEl.dataset.luminosidad = hsl.l; // 0 = oscuro, 100 = claro
}

// --- FUNCIÓN DE ORDENAR ---
function ordenarPrendas(criterio) {
  const prendas = Array.from(document.querySelectorAll(".prenda"));
  const contenedor = document.querySelector("#catalog");


  if (criterio === "marca") {
    prendas.sort((a, b) => {
      const marcaA = a.dataset.marca?.toLowerCase() || "";
      const marcaB = b.dataset.marca?.toLowerCase() || "";
      return marcaA.localeCompare(marcaB);
    });
  }

  if (criterio === "reciente") {
    prendas.sort((a, b) => {
      return (b.dataset.timestamp || 0) - (a.dataset.timestamp || 0);
    });
  }

  if (criterio === "color") {
    const ordenColores = ["rojo","naranja","amarillo","verde","azul","morado","rosa"];

    prendas.sort((a, b) => {
      const colorA = a.dataset.colorPrincipal || "gris";
      const colorB = b.dataset.colorPrincipal || "gris";
      const lA = parseInt(a.dataset.luminosidad || 50);
      const lB = parseInt(b.dataset.luminosidad || 50);

      // Primero por color principal
      const idxA = ordenColores.indexOf(colorA);
      const idxB = ordenColores.indexOf(colorB);
      if (idxA !== idxB) return idxA - idxB;

      // Luego de oscuro a claro
      return lA - lB;
    });
  }

  // Recolocar en el contenedor
  prendas.forEach(p => contenedor.appendChild(p));
}

});