const places = [
  {id:'colegio', x:70,  y:305, e:'🏫', n:'Colegio',
   clue:'Está donde niñas y niños aprenden y juegan en el recreo.',
   ok:'¡Aquí está Lupita! Revisa que el dinero llegue a las escuelas para que todos puedan aprender.'},
  {id:'biblio',  x:258, y:120, e:'🚠', n:'Parque biblioteca',
   clue:'Se esconde junto a unos libros, en una biblioteca de la montaña a la que se llega en cable.',
   ok:'¡La encontraste leyendo! Cuida que el dinero para libros y espacios de lectura se use bien.'},
  {id:'rio',     x:118, y:165, e:'🌳', n:'Parque del río',
   clue:'Se esconde donde hay árboles y pasto junto al río, y la gente sale a pasear.',
   ok:'¡Ahí está! Vigila que el dinero para los parques se use bien.'},
  {id:'hosp',    x:205, y:215, e:'🏥', n:'Hospital',
   clue:'Está donde cuidan a las personas cuando se enferman. ¡Busca la cruz roja!',
   ok:'¡Bien visto! Revisa que el dinero de la salud se use bien.'},
  {id:'metro',   x:140, y:275, e:'🚇', n:'Metro',
   clue:'Se mezcla entre los pasajeros, donde llegan los trenes que van por encima de la ciudad.',
   ok:'¡Subió al metro! Cuida que el dinero del transporte se use bien.'},
  {id:'obra',    x:235, y:372, e:'🚧', n:'Obra en construcción',
   clue:'Se esconde donde trabajan con casco amarillo, construyendo algo nuevo.',
   ok:'¡Con casco y todo! Revisa que el dinero de las obras se use bien.'}
];

const NS = 'http://www.w3.org/2000/svg';
const spots = document.getElementById('spots');
const clue  = document.getElementById('clue');
const stars = document.getElementById('stars');
const found = document.getElementById('found');
const fmsg  = document.getElementById('fmsg');
const next  = document.getElementById('next');

let cur = 0, miss = 0, finished = false;
const els = {};

places.forEach(p => {
  const g = document.createElementNS(NS, 'g');
  g.setAttribute('class', 'spot');
  g.setAttribute('tabindex', '0');
  g.setAttribute('role', 'button');
  g.setAttribute('aria-label', p.n);
  g.innerHTML = `<circle cx="${p.x}" cy="${p.y}" r="17"/><text class="e" x="${p.x}" y="${p.y}">${p.e}</text><text class="l" x="${p.x}" y="${p.y + 29}">${p.n}</text>`;
  g.onclick = () => pick(p, g);
  g.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(p, g); } };
  spots.appendChild(g);
  els[p.id] = g;
});

function drawStars() {
  stars.innerHTML = places.map((_, i) => `<span class="${i < cur ? 'on' : ''}">⭐</span>`).join('');
}

function show() {
  drawStars();
  miss = 0;
  if (cur >= places.length) {
    finished = true;
    clue.innerHTML = '<span class="big">🎉 ¡Encontraste a Lupita en los 6 lugares!</span><small style="color:inherit">Ahora Medellín tiene una gran detective del dinero.</small>';
    fmsg.textContent = '¡Eres una gran detective! ¿Quieres jugar de nuevo?';
    next.textContent = 'Jugar otra vez';
    found.classList.add('show');
    return;
  }
  found.classList.remove('show');
  clue.textContent = '🔍 ' + places[cur].clue;
  next.textContent = 'Siguiente pista';
}

function pick(p, g) {
  if (finished || found.classList.contains('show')) return;
  const t = places[cur];
  if (p.id === t.id) {
    g.classList.add('done');
    g.classList.remove('hint');
    cur++;
    drawStars();
    fmsg.textContent = t.ok;
    next.textContent = cur >= places.length ? '¡Ver mi premio!' : 'Siguiente pista';
    found.classList.add('show');
    found.scrollIntoView({behavior:'smooth', block:'nearest'});
  } else {
    g.classList.remove('no');
    void g.getBoundingClientRect();
    g.classList.add('no');
    miss++;
    let h = clue.querySelector('small');
    if (!h) { h = document.createElement('small'); clue.appendChild(h); }
    h.textContent = miss >= 2 ? 'Mira el lugar que brilla. ¡Ahí está!' : 'Ahí no está. Lee la pista otra vez.';
    if (miss >= 2) els[t.id].classList.add('hint');
  }
}

next.onclick = () => {
  if (finished) {
    finished = false;
    cur = 0;
    Object.values(els).forEach(g => g.classList.remove('done', 'hint'));
  }
  show();
};

show();