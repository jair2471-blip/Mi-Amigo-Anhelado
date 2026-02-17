 
    let db = null;

    let fecha = new Date();

    let fontSize = 21;

    let vSel = null;

    let planFull = [];

    LIBROS.forEach(l => { for(let i=1; i<=l.c; i++) planFull.push({n:l.n, id:l.id, c:i}); });



    async function iniciar() {

      try {

        const res = await fetch('/biblia.json');

        db = await res.json();

        renderPlan();

      } catch(e) { console.error("Error", e); }

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

          html += `<div class="acordeon-item ${idx===0?'active':''}" id="ac-${idx}">

            <div class="acordeon-header" onclick="window.toggleAc(${idx})">

              <h2>${it.n} ${it.c}</h2><span>▼</span>

            </div>

            <div class="acordeon-content">`;

          Object.entries(cap).forEach(([n, t]) => {

            const limpio = t.replace(/^\d+\/n/, '').replace(/\/n/g, '<br>');

            html += `<span class="v-txt" onclick="window.seleccionarV(this, '${it.n} ${it.c}:${n}')">

              <span class="v-num">${n}</span>${limpio}

            </span>`;

          });

          html += `</div></div>`;

        }

      });

      document.getElementById('contenedor-lectura').innerHTML = html;

    }



    window.toggleAc = (i) => document.getElementById(`ac-${i}`).classList.toggle('active');

    window.zoom = (n) => { fontSize += n; document.documentElement.style.setProperty('--f-size', fontSize+'px'); };

    window.modoNoche = () => {

      document.body.classList.toggle('dark-mode');

      const isDark = document.body.classList.contains('dark-mode');

      localStorage.setItem('tema', isDark ? 'oscuro' : 'claro');

    };



    window.cambiarDia = (n) => { fecha.setDate(fecha.getDate()+n); renderPlan(); window.scrollTo(0,0); };

    window.irHoy = () => { fecha = new Date(); renderPlan(); window.scrollTo(0,0); };

    

    window.abrirBib = () => {

      const modal = document.getElementById('contenidoModal');

      modal.innerHTML = `<h2 style="font-family:'Playfair Display'; text-align:center; color:var(--primary);">Biblioteca</h2>

        <div class="grid-libros">

          ${LIBROS.map(l => `<button class="btn-lib" onclick="window.verCaps('${l.id}', '${l.n}', ${l.c})">${l.n}</button>`).join('')}

        </div>`;

      document.getElementById('modalBib').style.display = 'grid';

    };



    window.verCaps = (id, n, total) => {

      const modal = document.getElementById('contenidoModal');

      let capsHtml = "";

      for(let i=1; i<=total; i++) capsHtml += `<button class="btn-lib" onclick="window.irACap('${id}','${n}',${i})">${i}</button>`;

      modal.innerHTML = `<button onclick="window.abrirBib()" style="margin-bottom:15px; color:var(--accent); background:none; border:none; cursor:pointer; font-weight:bold;">◀ Volver</button>

        <h2 style="font-family:'Playfair Display'; text-align:center; color:var(--primary);">${n}</h2>

        <div class="grid-caps">${capsHtml}</div>`;

    };



    window.irACap = (id, n, c) => { window.cerrarBib(); dibujarLectura([{id, n, c}]); window.scrollTo(0,0); };

    window.cerrarBib = () => document.getElementById('modalBib').style.display = 'none';



    window.seleccionarV = (el, ref) => {

      vSel = { el, texto: el.innerText.replace(/^\d+/, '').trim(), ref };

      document.getElementById('menuAcciones').style.display = 'flex';

      document.querySelectorAll('.v-txt').forEach(v => v.style.background = 'none');

      el.style.background = 'rgba(212, 165, 116, 0.2)';

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

      // Preparamos el renderizador invisible

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

      if(vSel && !vSel.el.style.backgroundColor.includes('rgb(254, 240, 138)')) {

        vSel.el.style.background='none'; 

      }

    };



    document.addEventListener('DOMContentLoaded', () => {

      if(localStorage.getItem('tema') === 'oscuro') document.body.classList.add('dark-mode');

      iniciar();

    });
export {};
