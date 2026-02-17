 
   const LIBROS = [
  {n:'Génesis', id:'genesis', c:50}, {n:'Éxodo', id:'exodo', c:40}, {n:'Levítico', id:'levitico', c:27},
  {n:'Números', id:'numeros', c:36}, {n:'Deuteronomio', id:'deuteronomio', c:34}, {n:'Josué', id:'josue', c:24},
  {n:'Jueces', id:'jueces', c:21}, {n:'Rut', id:'rut', c:4}, {n:'1 Samuel', id:'1-samuel', c:31},
  {n:'2 Samuel', id:'2-samuel', c:24}, {n:'1 Reyes', id:'1-reyes', c:22}, {n:'2 Reyes', id:'2-reyes', c:25},
  {n:'1 Crónicas', id:'1-cronicas', c:29}, {n:'2 Crónicas', id:'2-cronicas', c:36}, {n:'Esdras', id:'esdras', c:10},
  {n:'Nehemías', id:'nehemias', c:13}, {n:'Ester', id:'ester', c:10}, {n:'Job', id:'job', c:42},
  {n:'Salmos', id:'salmos', c:150}, {n:'Proverbios', id:'proverbios', c:31}, {n:'Eclesiastés', id:'eclesiastes', c:12},
  {n:'Cantares', id:'cantares', c:8}, {n:'Isaías', id:'isaias', c:66}, {n:'Jeremías', id:'jeremias', c:52},
  {n:'Lamentaciones', id:'lamentaciones', c:5}, {n:'Ezequiel', id:'ezequiel', c:48}, {n:'Daniel', id:'daniel', c:12},
  {n:'Oseas', id:'oseas', c:14}, {n:'Joel', id:'joel', c:3}, {n:'Amós', id:'amos', c:9},
  {n:'Abdías', id:'abdias', c:1}, {n:'Jonás', id:'jonas', c:4}, {n:'Miqueas', id:'miqueas', c:7},
  {n:'Nahúm', id:'nahum', c:3}, {n:'Habacuc', id:'habacuc', c:3}, {n:'Sofonías', id:'sofonias', c:3},
  {n:'Hageo', id:'hageo', c:2}, {n:'Zacarías', id:'zacarias', c:14}, {n:'Malaquías', id:'malaquias', c:4},
  {n:'Mateo', id:'mateo', c:28}, {n:'Marcos', id:'marcos', c:16}, {n:'Lucas', id:'lucas', c:24},
  {n:'Juan', id:'juan', c:21}, {n:'Hechos', id:'hechos', c:28}, {n:'Romanos', id:'romanos', c:16},
  {n:'1 Corintios', id:'1-corintios', c:16}, {n:'2 Corintios', id:'2-corintios', c:13}, {n:'Gálatas', id:'galatas', c:6},
  {n:'Efesios', id:'efesios', c:6}, {n:'Filipenses', id:'filipenses', c:4}, {n:'Colosenses', id:'colosenses', c:4},
  {n:'1 Tesalonicenses', id:'1-tesalonicenses', c:5}, {n:'2 Tesalonicenses', id:'2-tesalonicenses', c:3},
  {n:'1 Timoteo', id:'1-timoteo', c:6}, {n:'2 Timoteo', id:'2-timoteo', c:4}, {n:'Tito', id:'tito', c:3},
  {n:'Filemón', id:'filemon', c:1}, {n:'Hebreos', id:'hebreos', c:13}, {n:'Santiago', id:'santiago', c:5},
  {n:'1 Pedro', id:'1-pedro', c:5}, {n:'2 Pedro', id:'2-pedro', c:3}, {n:'1 Juan', id:'1-juan', c:5},
  {n:'2 Juan', id:'2-juan', c:1}, {n:'3 Juan', id:'3-juan', c:1}, {n:'Judas', id:'judas', c:1},
  {n:'Apocalipsis', id:'apocalipsis', c:22}
];

let db = null;
let fecha = new Date();
let fontSize = 21;
let vSel = null;
let planFull = [];

LIBROS.forEach(l => {
  for(let i=1; i<=l.c; i++) {
    planFull.push({n:l.n, id:l.id, c:i});
  }
});

async function iniciar() {
  try {
    const res = await fetch('/biblia.json');
    db = await res.json();
    renderPlan();
  } catch(e) {
    console.error("Error cargando biblia:", e);
  }
}

function renderPlan() {
  const start = new Date(fecha.getFullYear(), 0, 0);
  const diff = fecha - start;
  const diaAnio = Math.floor(diff / 86400000);

  document.getElementById('numDia').innerText = diaAnio;

  const hoy = planFull.slice((diaAnio-1)*3, (diaAnio-1)*3 + 3);
  dibujarLectura(hoy);
}

function dibujarLectura(items) {
  let html = "";

  items.forEach((it, idx) => {
    const cap = db[it.id] ? db[it.id][it.c] : null;

    if(cap) {
      html += `
      <div class="acordeon-item ${idx===0?'active':''}" id="ac-${idx}">
        <div class="acordeon-header" onclick="window.toggleAc(${idx})">
          <h2>${it.n} ${it.c}</h2><span>▼</span>
        </div>
        <div class="acordeon-content">
      `;

      Object.entries(cap).forEach(([n, t]) => {
        const limpio = t.replace(/^\d+\n/, '').replace(/\n/g, '<br>');

        html += `
        <span class="v-txt" onclick="window.seleccionarV(this, '${it.n} ${it.c}:${n}')">
          <span class="v-num">${n}</span>${limpio}
        </span>
        `;
      });

      html += `</div></div>`;
    }
  });

  document.getElementById('contenedor-lectura').innerHTML = html;
}

/* ==== FUNCIONES GLOBALES ==== */

window.toggleAc = (i) =>
  document.getElementById(`ac-${i}`).classList.toggle('active');

window.zoom = (n) => {
  fontSize += n;
  document.documentElement.style.setProperty('--f-size', fontSize+'px');
};

window.modoNoche = () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('tema', isDark ? 'oscuro' : 'claro');
};

window.cambiarDia = (n) => {
  fecha.setDate(fecha.getDate()+n);
  renderPlan();
  window.scrollTo(0,0);
};

window.irHoy = () => {
  fecha = new Date();
  renderPlan();
  window.scrollTo(0,0);
};

window.abrirBib = () => {
  const modal = document.getElementById('contenidoModal');

  modal.innerHTML = `
  <h2 style="text-align:center;">Biblioteca</h2>
  <div class="grid-libros">
    ${LIBROS.map(l =>
      `<button class="btn-lib" onclick="window.verCaps('${l.id}', '${l.n}', ${l.c})">${l.n}</button>`
    ).join('')}
  </div>
  `;

  document.getElementById('modalBib').style.display = 'grid';
};

window.verCaps = (id, n, total) => {
  const modal = document.getElementById('contenidoModal');
  let capsHtml = "";

  for(let i=1; i<=total; i++) {
    capsHtml += `<button class="btn-lib" onclick="window.irACap('${id}','${n}',${i})">${i}</button>`;
  }

  modal.innerHTML = `
    <button onclick="window.abrirBib()">◀ Volver</button>
    <h2 style="text-align:center;">${n}</h2>
    <div class="grid-caps">${capsHtml}</div>
  `;
};

window.irACap = (id, n, c) => {
  window.cerrarBib();
  dibujarLectura([{id, n, c}]);
  window.scrollTo(0,0);
};

window.cerrarBib = () =>
  document.getElementById('modalBib').style.display = 'none';

window.seleccionarV = (el, ref) => {
  vSel = {
    el,
    texto: el.innerText.replace(/^\d+/, '').trim(),
    ref
  };

  document.getElementById('menuAcciones').style.display = 'flex';

  document.querySelectorAll('.v-txt').forEach(v => v.style.background = 'none');
  el.style.background = 'rgba(212,165,116,0.2)';
};

window.resaltar = () => {
  vSel.el.style.backgroundColor = '#fef08a';
  vSel.el.style.color = '#000';
  window.cerrarMenu();
};

window.copiar = () => {
  navigator.clipboard.writeText(`${vSel.texto} (${vSel.ref})`);
  window.cerrarMenu();
};

window.descargarImg = () => {
  document.getElementById('render-texto').innerText = vSel.texto;
  document.getElementById('render-ref').innerText = vSel.ref;

  const target = document.getElementById('canvas-render');

  html2canvas(target, { scale: 3 }).then(canvas => {
    const a = document.createElement('a');
    a.download = `Biblia365-${vSel.ref}.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
  });

  window.cerrarMenu();
};

window.cerrarMenu = () => {
  document.getElementById('menuAcciones').style.display = 'none';

  if(vSel && !vSel.el.style.backgroundColor.includes('rgb(254')) {
    vSel.el.style.background = 'none';
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if(localStorage.getItem('tema') === 'oscuro')
    document.body.classList.add('dark-mode');

  iniciar();
});
 