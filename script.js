document.addEventListener('DOMContentLoaded', () => {

  const dbName = "FashionClosetDB";

  // Función para conectar a la base de datos
  async function openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, 2);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        // Creamos una "tabla" para cada categoría
        const cats = ["gorras","chaquetas","sudaderas","camisas","polos","camisetas","tops","vestidos","pantaloneslargos","pantalonescortos","faldas","zapatillas"];
        cats.forEach(c => { 
          if (!db.objectStoreNames.contains(c)) db.createObjectStore(c, { keyPath: "id", autoIncrement: true }); 
        });
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Función para LEER prendas
  async function getPrendas(cat) {
    const db = await openDB();
    return new Promise(res => {
      const tx = db.transaction(cat, "readonly");
      const req = tx.objectStore(cat).getAll();
      req.onsuccess = () => res(req.result);
    });
  }

  // Función para GUARDAR prendas
  async function savePrenda(cat, prenda) {
    const db = await openDB();
    const tx = db.transaction(cat, "readwrite");
    tx.objectStore(cat).add(prenda);
    return tx.complete;
  }

  // Función para ACTUALIZAR prendas existentes (Color, Marca, etc.)
  async function updatePrenda(cat, prenda) {
    const db = await openDB();
    const tx = db.transaction(cat, "readwrite");
    const store = tx.objectStore(cat);
    
    // El método .put() busca el objeto por su ID y lo actualiza
    store.put(prenda); 
    
    return tx.complete;
  }

  // Función para ELIMINAR prendas
  async function deletePrenda(cat, id) {
    const db = await openDB();
    const tx = db.transaction(cat, "readwrite");
    const store = tx.objectStore(cat);
    
    // Borra la prenda usando su ID único
    store.delete(id);
    
    return tx.complete;
  }

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
    gorras: "GORRAS",
    chaquetas: "CHAQUETAS",
    sudaderas: "SUDADERAS",
    camisas: "CAMISAS",
    polos: "POLOS",
    camisetas: "CAMISETAS",
    tops: "TOPS",
    vestidos: "VESTIDOS",
    pantaloneslargos: "PANTALONES LARGOS",
    pantalonescortos: "PANTALONES CORTOS",
    faldas: "FALDAS",
    zapatillas: "ZAPATILLAS",
  };

  let categoriasActivas =
    JSON.parse(localStorage.getItem("categoriasActivas")) || [    //Aparecen o las guardadas previamente o las del array
      "gorras", "sudaderas", "camisetas", "pantalones cortos", "zapatillas"
    ];

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

  //Cierra el sidebar
  function closeSidebar(){
    sidebar.classList.add("oculto");
    overlay.classList.remove("activo");
    main.classList.remove("desplazado");
    catalogoSubmenu.classList.add("hidden"); // Pliega el desplegable del catalogo
    textoMenu.classList.remove("visible"); // Ocultar texto
  }


  //Funcion que cambia los archivos a .jpeg
  function fileToJPEG(file, callback) {
    const reader = new FileReader();

    reader.onload = function(e) {
      const img = new Image();
      img.onload = function() {
        // Creamos un canvas del tamaño de la imagen original
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;

        // Dibujamos la imagen original en el canvas
        ctx.drawImage(img, 0, 0);

        // Exportamos a JPEG con calidad 0.8
        const jpegData = canvas.toDataURL("image/jpeg", 0.8);

        callback(jpegData); // devolvemos la imagen en formato JPEG
      };
      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  }


  async function displayCatalog(category) {
    currentCategory = category;
    const catalog = document.getElementById("catalog");
    catalog.innerHTML = "";

    const prendas = await getPrendas(category);

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

     // --- LÓGICA DE ZOOM CON "VUELO" ---
      img.onclick = (e) => {
        e.stopPropagation();
        const overlayZoom = document.getElementById("overlayZoom");

        if (!prendaDiv.classList.contains("zoom")) {
          // 1. Limpiamos otros zooms por seguridad
          document.querySelectorAll('.prenda.zoom').forEach(p => {
             p.classList.remove('zoom');
             p.style.removeProperty('--muevex'); // Limpiamos variables viejas
             p.style.removeProperty('--mueveY');
          });

          // 2. CÁLCULOS MATEMÁTICOS
          // ¿Dónde está la prenda ahora?
          const rect = prendaDiv.getBoundingClientRect();
          // ¿Dónde está el centro de la prenda?
          const prendaCentroX = rect.left + rect.width / 2;
          const prendaCentroY = rect.top + rect.height / 2;
          
          // ¿Dónde está el centro de la pantalla?
          const pantallaCentroX = window.innerWidth / 2;
          const pantallaCentroY = window.innerHeight / 2;
          
          // ¿Cuánto tiene que moverse para llegar al centro?
          const distanciaX = pantallaCentroX - prendaCentroX;
          const distanciaY = pantallaCentroY - prendaCentroY;

          // 3. Inyectamos esos números en el estilo de la prenda
          prendaDiv.style.setProperty('--muevex', `${distanciaX}px`);
          prendaDiv.style.setProperty('--mueveY', `${distanciaY}px`);

          // 4. Activamos la clase (el CSS hará la magia usando las variables)
          prendaDiv.classList.add("zoom");
          overlayZoom.classList.add("activo");
          
          // Bloquear el scroll de la página para que no se mueva el fondo
          document.body.style.overflow = 'hidden'; 

        }
      };

      // --- CERRAR ZOOM ---
      const overlayZoom = document.getElementById("overlayZoom");
      overlayZoom.onclick = () => {
        document.querySelectorAll('.prenda.zoom').forEach(p => {
            p.classList.remove('zoom');
            // Esperamos a que acabe la transición para limpiar estilos (opcional, pero limpio)
            setTimeout(() => {
                p.style.removeProperty('--muevex');
                p.style.removeProperty('--mueveY');
            }, 400); 
        });
        overlayZoom.classList.remove("activo");
        document.body.style.overflow = ''; // Devolver el scroll a la página
      };

      const eliminarBtn = document.createElement("button");
      eliminarBtn.className = "eliminarBtn";
      eliminarBtn.textContent = "✕";
      eliminarBtn.onclick = async () => {
        await deletePrenda(category, prenda.id); // Borra de IndexedDB
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
        ["#ff00e1ff","#62064eff","#990a7fff","#e312bcff","#f05acbff","#fdb7eeff"],
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
          swatch.onclick = async () => { // 1. Añadimos async aquí
            prenda.color = color;
            colorSelector.style.backgroundColor = color;
            prendaDiv.style.boxShadow = `0 0 0 4px ${color}`;
            actualizarColor(prendaDiv, color);
            colorModal.style.display = "none";
          
            // 2. Cambiamos la línea de abajo por esta:
            await updatePrenda(category, prenda); 
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

      function abrirDropdown(trigger, prenda, marcaInput) {
        const root = document.getElementById("dropdown-root");
        root.innerHTML = ""; // limpiamos cualquier dropdown anterior
        document.removeEventListener("click", window._lastDropdownHandler);
        document.querySelectorAll(".marcaInput").forEach(input => input.classList.add("hidden"));

        const dropdown = document.createElement("div");
        dropdown.className = "marcaDropdown";

        // Generar opciones filtradas
        const valor = marcaInput.value.toLowerCase();
        marcasDisponibles
          .filter(m => m.toLowerCase().includes(valor))
          .forEach(m => {
            const item = document.createElement("div");
            item.className = "marcaItem";
            item.textContent = m;
            item.addEventListener("click", async () => {
              prenda.marca = m;
              prendaDiv.dataset.marca = m;
              trigger.textContent = m;
              marcaInput.classList.add("hidden");
              root.innerHTML = ""; // cerrar menú
              marcaInput.classList.add("hidden"); // 👈 cerrar input actual
              await updatePrenda(currentCategory, prenda);
              crearOpcionesFiltro();
            });
            dropdown.appendChild(item);
          });

        // Posicionar el dropdown debajo del trigger
        const rect = trigger.getBoundingClientRect();
        dropdown.style.top = rect.bottom + window.scrollY + 4 + "px";
        dropdown.style.left = rect.left + window.scrollX + "px";
        dropdown.style.width = rect.width + "px";

        root.appendChild(dropdown);

        // Cerrar si hago click fuera
        function handleClickOutside(e) {
            if (!dropdown.contains(e.target) && e.target !== trigger && e.target !== marcaInput) {
              root.innerHTML = "";
              marcaInput.classList.add("hidden");
              document.removeEventListener("click", handleClickOutside);
            }
        }
        document.addEventListener("click", handleClickOutside);

        window._lastDropdownHandler = handleClickOutside;

        marcaInput.classList.remove("hidden");
        marcaInput.focus();

      }


      marcaDiv.addEventListener("click", () => {
        marcaInput.value = "";
        marcaInput.classList.remove("hidden");
        marcaInput.focus();
        abrirDropdown(marcaDiv, prenda, marcaInput);
      });

      marcaInput.addEventListener("input", () => {
        abrirDropdown(marcaDiv, prenda, marcaInput);
      });


      // Append al DOM
      prendaDiv.appendChild(img);
      prendaDiv.appendChild(eliminarBtn);
      prendaDiv.appendChild(colorSelector); // ✅ directamente en prendaDiv para esquina superior
      prendaDiv.appendChild(marcaDiv);
      prendaDiv.appendChild(marcaInput);
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

    // Llamar al crear opciones cuando cargue la página
    crearOpcionesFiltro();
  }

  fileInput.addEventListener("change", async (e) => { // Añadimos async aquí
  const files = Array.from(e.target.files);
  if (files.length === 0) return;

  for (const file of files) { // Usamos for...of para manejar la base de datos
    await new Promise(resolve => {
      fileToJPEG(file, async (jpegData) => {
        // Guardamos directamente en IndexedDB en lugar de localStorage
        await savePrenda(currentCategory, {
          url: jpegData,
          color: null,
          marca: "",
          timestamp: Date.now()
        });
        resolve();
      });
    });
  }

  // Refrescamos el catálogo y mostramos notificación
  displayCatalog(currentCategory);
  notification.classList.remove("hidden");
  setTimeout(() => notification.classList.add("hidden"), 2000);

  e.target.value = ""; // Reseteamos el input
});


  //Crear los divs de cada parte
  var divCabeza = document.createElement("div");
  var divPartesArriba = document.createElement("div");
  var divPartesAbajo = document.createElement("div");
  var divPies = document.createElement("div");

  divCabeza.classList.add("separadorCategorias");
  divPartesArriba.classList.add("separadorCategorias");
  divPartesAbajo.classList.add("separadorCategorias");
  divPies.classList.add("separadorCategorias");

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
      switch(key){
        case "gorras":
          divCabeza.append(li);
          break;
        case "chaquetas":
        case "sudaderas":
        case "camisas":
        case "polos":
        case "camisetas":
        case "tops":
        case "vestidos":
          divPartesArriba.append(li);
          break;
        case "pantalonescortos":
        case "pantaloneslargos":
        case "faldas":
          divPartesAbajo.append(li);
          break;
        case "zapatillas":
          divPies.append(li);
          break;
      }
      //catalogoSubmenu.appendChild(li);
    }
  });

  catalogoSubmenu.appendChild(divCabeza);
  catalogoSubmenu.appendChild(divPartesArriba);
  catalogoSubmenu.appendChild(divPartesAbajo);
  catalogoSubmenu.appendChild(divPies);

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
    overlay.classList.add("activo");
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
    closeSidebar();
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
  // --- BOTÓN FILTRAR ---
const filtrarBtn = document.getElementById("filtrarBtn");
const filtrarDropdown = document.getElementById("filtrarDropdown");

// Colores "estándar" para filtrar
const coloresEstandar = ["rojo","naranja","amarillo","verde","azul","morado","rosa"];

// Abrir/cerrar desplegable
filtrarBtn.addEventListener("click", (e) => {
  filtrarDropdown.classList.toggle("show");
  ordenarDropdown.classList.remove("show");//Ocultar el dropdown de ordenar
  e.stopPropagation();
});

// Cerrar dropdown al clicar fuera
document.addEventListener("click", () => {
  filtrarDropdown.classList.remove("show");
});

// Evitar que clic dentro del dropdown cierre inmediatamente
filtrarDropdown.addEventListener("click", e => e.stopPropagation());

// Crear opciones de filtro dinámicamente
async function crearOpcionesFiltro() {
  const filtrarDropdown = document.getElementById("filtrarDropdown");
  filtrarDropdown.innerHTML = "";

  // 1. SECCIÓN DE COLOR (Esto no cambia)
  const subtituloColor = document.createElement("div");
  subtituloColor.className = "subtitulo";
  subtituloColor.textContent = "Filtrar por color";
  filtrarDropdown.appendChild(subtituloColor);

  const selectColor = document.createElement("select");
  selectColor.innerHTML = `<option value="">Todos</option>`;

  const coloresEstandar = ["rojo","naranja","amarillo","verde","azul","morado","rosa"];
  coloresEstandar.forEach(color => {
    const option = document.createElement("option");
    option.value = color;
    option.textContent = color.charAt(0).toUpperCase() + color.slice(1);
    selectColor.appendChild(option);
  });

  selectColor.addEventListener("change", () => {
    filtrarPrendas({ color: selectColor.value });
    filtrarDropdown.classList.remove("show");
  });
  filtrarDropdown.appendChild(selectColor);


  // 2. SECCIÓN DE MARCA
  const subtituloMarca = document.createElement("div");
  subtituloMarca.className = "subtitulo";
  subtituloMarca.textContent = "Filtrar por marca";
  filtrarDropdown.appendChild(subtituloMarca);

  const selectMarca = document.createElement("select");
  selectMarca.innerHTML = `<option value="">Todas</option>`;

  // A) Pedimos las prendas a IndexedDB (esperamos con await)
  const prendas = await getPrendas(currentCategory);

  // B) Sacamos las marcas únicas que YA EXISTEN en tus prendas
  const marcasUsadas = [...new Set(prendas.map(p => p.marca).filter(Boolean))].sort();

  // C) Si tienes marcas, las mostramos. Si no, podrías mostrar "Sin marcas"
  if (marcasUsadas.length > 0) {
      marcasUsadas.forEach(m => {
        const option = document.createElement("option");
        option.value = m;
        option.textContent = m;
        selectMarca.appendChild(option);
      });
  } else {
      // Opcional: Si no hay marcas usadas, podrías deshabilitarlo o dejarlo vacío
      // selectMarca.disabled = true; 
  }

  selectMarca.addEventListener("change", () => {
    filtrarPrendas({ marca: selectMarca.value });
    filtrarDropdown.classList.remove("show");
  });

  filtrarDropdown.appendChild(selectMarca);
}

// Abrir/cerrar desplegable
ordenarBtn.addEventListener("click", () => {
  ordenarDropdown.classList.toggle("show");
  filtrarDropdown.classList.remove("show"); //Ocultar el dropdown de filtrar
});

// Detectar opción seleccionada
document.querySelectorAll("#ordenarDropdown .opcion").forEach(opcion => {
  opcion.addEventListener("click", () => {
    const criterio = opcion.dataset.sort;
    ordenarPrendas(criterio);
    ordenarDropdown.classList.remove("show");
    ordenarBtn.textContent=`Ordenar: ${opcion.textContent}`;
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

// --- FUNCIÓN FILTRAR ---
function filtrarPrendas(filtro) {
  const prendas = Array.from(document.querySelectorAll(".prenda"));
  prendas.forEach(p => {
    let mostrar = true;

    if (filtro.color) {
      mostrar = p.dataset.colorPrincipal === filtro.color;
    }

    if (filtro.marca) {
      mostrar = mostrar && p.dataset.marca === filtro.marca;
    }

    p.style.display = mostrar ? "block" : "none";
  });
}

});