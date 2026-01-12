// 01. PÁGINA PRINCIPAL - MOVIMIENTO DE BOTONES //

const mariquitaImage = document.getElementById("mariquitaImage");
const sectionsContainer = document.getElementById("sectionsContainer");

const sections = ["Amelia González Ortiz", "Proyectos", "Intereses", "Misceláneo"];

let visible = false;

// Guarda las posiciones usadas (rectángulos aproximados) para no solapar
const usedRects = [];

// ESTADO ANTERIOR para el botón de volver
let lastState = {
  sectionId: "home",
  scrollY: 0
};

// Comprueba si dos rectángulos se solapan
function rectsOverlap(a, b) {
  return !(
    a.right < b.left ||
    a.left > b.right ||
    a.bottom < b.top ||
    a.top > b.bottom
  );
}

// Genera una posición aleatoria fuera de la zona de la imagen y sin pisar otras palabras
function getRandomPositionAvoidingImageAndOthers(spanWidth, spanHeight) {
  const { innerWidth: w, innerHeight: h } = window;
  const imgRect = mariquitaImage.getBoundingClientRect();
  const paddingImg = 10;   // margen alrededor de la imagen
  const paddingWords = 10; // espacio mínimo entre palabras

  let x, y, tries = 0;

  while (tries < 800) {
    x = Math.random() * (w - spanWidth);
    y = Math.random() * (h - spanHeight);

    const rect = {
      left: x - paddingWords,
      top: y - paddingWords,
      right: x + spanWidth + paddingWords,
      bottom: y + spanHeight + paddingWords
    };

    // comprobar si solapa la imagen
    const insideImgX = rect.right > imgRect.left - paddingImg && rect.left < imgRect.right + paddingImg;
    const insideImgY = rect.bottom > imgRect.top - paddingImg && rect.top < imgRect.bottom + paddingImg;
    const overlapsImg = insideImgX && insideImgY;

    if (overlapsImg) {
      tries++;
      continue;
    }

    // comprobar si solapa alguna palabra ya colocada
    let overlapsWord = false;
    for (const used of usedRects) {
      if (rectsOverlap(rect, used)) {
        overlapsWord = true;
        break;
      }
    }

    if (!overlapsWord) {
      usedRects.push(rect);
      return { x, y };
    }

    tries++;
  }

  // Si no encuentra hueco “perfecto”, devuelve la última posición calculada
  return { x, y };
}


// 02. PÁGINAS SECUNDARIAS - ACCESO A OTRA PÁGINA //

// --- cambio de "páginas" internas --- //
function changePage(targetId) {
  // guardar desde qué sección y scroll venimos
  const currentSection = document.querySelector(".page-section.page-visible");
  if (currentSection) {
    lastState.sectionId = currentSection.id;
    lastState.scrollY = window.scrollY;
  }

  document.querySelectorAll(".page-section").forEach(sec => {
    sec.classList.remove("page-visible");
    sec.classList.add("page-hidden");
  });

  const target = document.getElementById(targetId);
  if (target) {
    target.classList.remove("page-hidden");
    target.classList.add("page-visible");
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    history.pushState(null, "", "#" + targetId);
  }
}

function placeSectionsRandom() {
  sectionsContainer.innerHTML = "";
  usedRects.length = 0;

  sections.forEach(text => {
    const link = document.createElement("a");
    link.textContent = text;
    link.classList.add("section-item");

    let destinoId = null; // ACCESO A OTROS LIKS DE APARTADOS

    if (text === "Amelia González Ortiz") destinoId = "acerca-de-mi";
    else if (text === "Proyectos") destinoId = "proyectos";
    else if (text === "Contacto") destinoId = "contacto";
    else if (text === "Intereses") destinoId = "intereses";
    else if (text === "Misceláneo") destinoId = "miscelaneo";

    if (destinoId) {
      link.href = "#" + destinoId;
      link.addEventListener("click", (e) => {
        e.preventDefault();
        changePage(destinoId);
      });
    }

    sectionsContainer.appendChild(link);

    const { width, height } = link.getBoundingClientRect();
    const { x, y } = getRandomPositionAvoidingImageAndOthers(width, height);
    link.style.left = `${x}px`;
    link.style.top = `${y}px`;
  });
}

// click en la mariquita
mariquitaImage.addEventListener("click", () => {
  placeSectionsRandom();
  visible = true;
});

// Recolocar al cambiar tamaño de ventana
window.addEventListener("resize", () => {
  if (visible) placeSectionsRandom();
});

// --- BOTÓN/FLECHA DE REGRESO (imagen con clase .back-icon) --- //
document.addEventListener("click", (e) => {
  const backIcon = e.target.closest(".back-icon");
  if (!backIcon) return;

  e.preventDefault();

  // ocultar todas las secciones
  document.querySelectorAll(".page-section").forEach(sec => {
    sec.classList.remove("page-visible");
    sec.classList.add("page-hidden");
  });

  // mostrar la sección previa (o home por defecto)
  const prev = document.getElementById(lastState.sectionId) || document.getElementById("home");
  prev.classList.remove("page-hidden");
  prev.classList.add("page-visible");

  // restaurar la posición de scroll
  window.scrollTo({
    top: lastState.scrollY,
    left: 0,
    behavior: "smooth"
  });

});

// Tabs de PROYECTOS: Representación digital / Fabricación
const projectLinks = document.querySelectorAll(".section-link[data-tab]");
const tabDigital = document.querySelector(".projects-tab-digital");
const tabFabricacion = document.querySelector(".projects-tab-fabricacion");

projectLinks.forEach(link => {
  link.addEventListener("click", () => {
    const tab = link.dataset.tab;

    // cerrar todas las tarjetas abiertas
    document.querySelectorAll(".project-overlay.open").forEach(overlay => {
      overlay.classList.remove("open");
    });

    // marcar link activo
    projectLinks.forEach(l => l.classList.remove("section-link-activa"));
    link.classList.add("section-link-activa");

    // mostrar/ocultar contenido
    if (tab === "digital") {
      tabDigital.classList.remove("page-hidden");
      tabFabricacion.classList.add("page-hidden");
    } else if (tab === "fabricacion") {
      tabFabricacion.classList.remove("page-hidden");
      tabDigital.classList.add("page-hidden");
    }
  });
});  


// HAMBURGUESA

    //  PROYECTOS
    document.addEventListener('DOMContentLoaded', () => {
      const menuToggle = document.querySelector('#proyectos .menu-toggle');
      const mobileMenu = document.querySelector('#projectsMobileMenu');
      const mobileLinks = document.querySelectorAll('#projectsMobileMenu .section-link');

      if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
          mobileMenu.classList.toggle('open');
        });

        mobileLinks.forEach(link => {
          link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
          });
        });
      }
    });

    // MISC
      document.addEventListener('DOMContentLoaded', () => {
    const menuToggleMisc = document.querySelector('#miscelaneo .menu-toggle');
    const mobileMenuMisc = document.querySelector('#miscMobileMenu');
    const mobileLinksMisc = document.querySelectorAll('#miscMobileMenu .section-link');

    if (menuToggleMisc && mobileMenuMisc) {
      menuToggleMisc.addEventListener('click', () => {
        mobileMenuMisc.classList.toggle('open');
      });

      mobileLinksMisc.forEach(link => {
        link.addEventListener('click', () => {
          mobileMenuMisc.classList.remove('open');
        });
      });
    }
  });

// CLICK SOBRE LA FOTO DE PROYECTO

const projectMedias = document.querySelectorAll('.project-media');

projectMedias.forEach(media => {
  const img = media.querySelector('.project-image');
  const overlay = media.querySelector('.project-overlay');
  if (!img || !overlay) return;

  img.addEventListener('click', () => {
    // 1. Cerrar cualquier tarjeta que esté abierta
    document.querySelectorAll('.project-overlay.open').forEach(openOverlay => {
      if (openOverlay !== overlay) {
        openOverlay.classList.remove('open');
      }
    });

    // 2. Abrir/cerrar solo la tarjeta de este proyecto
    overlay.classList.toggle('open');
  });

  // Opcional: cerrar al hacer clic dentro de la tarjeta
  overlay.addEventListener('click', () => {
    overlay.classList.remove('open');
  });
});


// Tabs de MISC: 

  const miscLinks = document.querySelectorAll('#miscelaneo .section-link[data-misc]');
  const miscGeneral = document.getElementById('misc-general');
  const miscViews = {
    bocetos: document.getElementById('misc-bocetos'),
    libro: document.getElementById('misc-libro'),
    maquetacion: document.getElementById('misc-maquetacion')
  };

  miscLinks.forEach(link => {
    link.addEventListener('click', () => {
      const tab = link.dataset.misc;

      // marcar link activo
      miscLinks.forEach(l => l.classList.remove('section-link-activa'));
      link.classList.add('section-link-activa');

      // si es CONJUNTO, mostramos el grid general
      if (tab === 'conjunto') {
        miscGeneral.classList.remove('page-hidden');
        Object.values(miscViews).forEach(view => {
          if (view) view.classList.add('page-hidden');
        });
        return;
      }

      // si es una categoría: ocultar general y mostrar solo esa vista
      miscGeneral.classList.add('page-hidden');

      Object.values(miscViews).forEach(view => {
        if (view) view.classList.add('page-hidden');
      });

      const viewToShow = miscViews[tab];
      if (viewToShow) {
        viewToShow.classList.remove('page-hidden');
      }
    });
  });