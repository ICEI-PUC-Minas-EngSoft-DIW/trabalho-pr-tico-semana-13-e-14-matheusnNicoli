const dados = [
  {
    id: 1,
    titulo: "Exposição de Arte Moderna",
    descricao: "Conheça artistas que revolucionaram o século XX.",
    imagem: "https://picsum.photos/id/1025/800/400",
    categoria: "Arte",
    data: "2025-03-12",
    autor: "Curadoria do Museu Horizonte",
    conteudo: "A exposição de arte moderna apresenta obras icônicas que marcaram o início do século XX, explorando movimentos como o expressionismo e o cubismo. O visitante poderá conhecer pinturas, esculturas e instalações que redefiniram o conceito de arte na modernidade."
  },
  {
    id: 2,
    titulo: "Visita Guiada com Curadores",
    descricao: "Descubra segredos e bastidores das exposições.",
    imagem: "https://picsum.photos/id/1035/800/400",
    categoria: "Experiência",
    data: "2025-04-05",
    autor: "Equipe de Curadores",
    conteudo: "Durante a visita guiada, os curadores do museu compartilham histórias fascinantes e curiosidades sobre as obras em exibição. É uma oportunidade única de compreender a visão por trás das coleções e o processo de montagem das exposições."
  },
  {
    id: 3,
    titulo: "Oficina Infantil de Criatividade",
    descricao: "Atividades educativas e divertidas para crianças.",
    imagem: "https://picsum.photos/id/1043/800/400",
    categoria: "Educação",
    data: "2025-05-20",
    autor: "Departamento Educativo",
    conteudo: "Uma oficina lúdica que estimula a imaginação e a expressão artística das crianças, com materiais recicláveis e muita diversão. Ideal para famílias e escolas que buscam atividades culturais e criativas."
  }
];

function montarHome() {
  const container = document.getElementById('cards-container');
  if (!container) return;
  container.innerHTML = '';
  dados.forEach(item => {
    const col = document.createElement('div');
    col.classList.add('col-md-4');
    col.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${item.imagem}" class="card-img-top" alt="${item.titulo}">
        <div class="card-body text-center">
          <h3 class="h5">${item.titulo}</h3>
          <p>${item.descricao}</p>
          <a href="detalhes.html?id=${item.id}" class="btn btn-outline-primary">Saiba mais</a>
        </div>
      </div>
    `;
    container.appendChild(col);
  });
}

function montarDetalhes() {
  const container = document.getElementById('detalhes-container');
  if (!container) return;
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'));
  const item = dados.find(d => d.id === id);
  if (!item) {
    container.innerHTML = `
      <div class="alert alert-warning text-center" role="alert">
        Item não encontrado. <a href="index.html" class="alert-link">Voltar à Home</a>
      </div>
    `;
    return;
  }
  container.innerHTML = `
    <article class="card shadow-sm p-4">
      <img src="${item.imagem}" class="img-fluid rounded mb-3" alt="${item.titulo}">
      <h2 class="h4 mb-2">${item.titulo}</h2>
      <p class="text-muted mb-2"><strong>Categoria:</strong> ${item.categoria}</p>
      <p class="text-muted"><strong>Data:</strong> ${item.data}</p>
      <hr>
      <p>${item.conteudo}</p>
      <p class="mt-3"><em>Autor:</em> ${item.autor}</p>
      <a href="index.html" class="btn btn-outline-primary mt-3">← Voltar para a Home</a>
    </article>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('cards-container')) montarHome();
  if (document.getElementById('detalhes-container')) montarDetalhes();
});

const API_URL = 'http://localhost:3000/exposicoes';

function el(id){return document.getElementById(id)}
function qs(s){return document.querySelector(s)}
function qsa(s){return Array.from(document.querySelectorAll(s))}
function fmtDataStr(s){return new Date(s+'T00:00:00').toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit',year:'numeric'})}

async function apiList(q){
  const url = new URL(API_URL);
  url.searchParams.set('_sort','data');
  url.searchParams.set('_order','desc');
  if(q) url.searchParams.set('q', q);
  const r = await fetch(url);
  return r.json();
}

async function apiGet(id){
  const r = await fetch(`${API_URL}/${id}`);
  if(!r.ok) throw new Error('not found');
  return r.json();
}

async function apiCreate(payload){
  const r = await fetch(API_URL,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(payload)
  });
  return r.json();
}

async function apiUpdate(id,payload){
  const r = await fetch(`${API_URL}/${id}`,{
    method:'PUT',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(payload)
  });
  return r.json();
}

async function apiDelete(id){
  await fetch(`${API_URL}/${id}`,{method:'DELETE'});
}

function readForm(){
  return {
    titulo: el('titulo').value.trim(),
    categoria: el('categoria').value.trim(),
    data: el('data').value,
    autor: el('autor').value.trim(),
    descricao: el('descricao').value.trim(),
    imagem: el('imagem').value.trim(),
    conteudo: el('conteudo').value.trim()
  }
}

function fillForm(obj){
  el('id').value = obj?.id ?? '';
  el('titulo').value = obj?.titulo ?? '';
  el('categoria').value = obj?.categoria ?? '';
  el('data').value = obj?.data ?? '';
  el('autor').value = obj?.autor ?? '';
  el('descricao').value = obj?.descricao ?? '';
  el('imagem').value = obj?.imagem ?? '';
  el('conteudo').value = obj?.conteudo ?? '';
}

function cardTemplate(d){
  return `
  <div class="col-12 col-md-6 col-lg-4">
    <div class="card h-100 shadow-sm">
      <img src="${d.imagem}" class="card-img-top" alt="${d.titulo}">
      <div class="card-body d-flex flex-column">
        <div class="d-flex justify-content-between align-items-center mb-1">
          <span class="badge bg-secondary">${d.categoria}</span>
          <small class="text-muted">${fmtDataStr(d.data)}</small>
        </div>
        <h5 class="card-title mb-1">${d.titulo}</h5>
        <p class="card-text text-muted small flex-grow-1">${d.descricao}</p>
        <div class="d-flex gap-2 mt-2">
          <a href="detalhes.html?id=${d.id}" class="btn btn-outline-primary w-100">Detalhes</a>
          <button class="btn btn-outline-secondary w-100 btn-editar" data-id="${d.id}">Editar</button>
          <button class="btn btn-outline-danger w-100 btn-excluir" data-id="${d.id}">Excluir</button>
        </div>
      </div>
    </div>
  </div>`;
}

async function initIndex(){
  const listEl = el('cards-container');
  const vazio = el('estado-vazio') || {classList:{toggle(){}}};
  const formBusca = el('form-busca');
  const btnNova = el('btnNova');
  const modal = new bootstrap.Modal(el('modalForm'));
  const form = el('formItem');
  const btnExcluir = el('btnExcluir');
  let editingId = null;

  async function load(q){
    const data = await apiList(q);
    listEl.innerHTML = data.map(cardTemplate).join('');
    vazio.classList.toggle('d-none', data.length>0);
    qsa('.btn-editar').forEach(b=>b.onclick = async e=>{
      const id = e.currentTarget.dataset.id;
      const obj = await apiGet(id);
      editingId = obj.id;
      el('tituloModal').textContent = 'Editar Exposição';
      btnExcluir.classList.remove('d-none');
      fillForm(obj);
      modal.show();
    });
    qsa('.btn-excluir').forEach(b=>b.onclick = async e=>{
      const id = e.currentTarget.dataset.id;
      if(!confirm('Excluir este item?')) return;
      await apiDelete(id);
      load(el('q')?.value?.trim());
    });
  }

  if(btnNova){
    btnNova.onclick = ()=>{
      editingId = null;
      el('tituloModal').textContent = 'Nova Exposição';
      btnExcluir.classList.add('d-none');
      fillForm({});
    };
  }

  btnExcluir.onclick = async ()=>{
    const id = el('id').value;
    if(!id) return;
    if(!confirm('Excluir este item?')) return;
    await apiDelete(id);
    modal.hide();
    load(el('q')?.value?.trim());
  };

  form.onsubmit = async e=>{
    e.preventDefault();
    const payload = readForm();
    if(editingId){
      await apiUpdate(editingId, {id: Number(editingId), ...payload});
    }else{
      await apiCreate(payload);
    }
    modal.hide();
    load(el('q')?.value?.trim());
  };

  if(formBusca){
    formBusca.onsubmit = e=>{
      e.preventDefault();
      const q = el('q').value.trim();
      load(q);
    };
  }

  load();
}

async function initDetalhes(){
  const container = el('detalhes-container');
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  if(!id){
    container.innerHTML = `<div class="alert alert-warning">Item não encontrado.</div>`;
    return;
  }
  let data = await apiGet(id);

  function render(){
    container.innerHTML = `
      <div class="row g-4 align-items-start">
        <div class="col-lg-7">
          <img src="${data.imagem}" class="img-fluid rounded shadow-sm" alt="${data.titulo}">
        </div>
        <div class="col-lg-5">
          <div class="d-flex align-items-center justify-content-between mb-2">
            <span class="badge bg-secondary">${data.categoria}</span>
            <small class="text-muted">${fmtDataStr(data.data)}</small>
          </div>
          <h2 class="mb-2">${data.titulo}</h2>
          <p class="text-muted">${data.descricao}</p>
          <p class="mb-2"><strong>Autor:</strong> ${data.autor}</p>
          <p>${data.conteudo}</p>
          <div class="d-flex gap-2 mt-3">
            <button class="btn btn-primary" id="btnEditarLocal" data-bs-toggle="modal" data-bs-target="#modalForm">Editar</button>
            <button class="btn btn-outline-danger" id="btnExcluirLocal">Excluir</button>
            <a href="index.html" class="btn btn-outline-secondary">Voltar</a>
          </div>
        </div>
      </div>
    `;
  }

  render();

  const modal = new bootstrap.Modal(el('modalForm'));
  const form = el('formItem');
  const btnExcluir = el('btnExcluir');
  el('tituloModal').textContent = 'Editar Exposição';
  el('btnSalvar').textContent = 'Salvar';
  fillForm(data);

  qs('#btnEditarLocal').onclick = ()=>{
    fillForm(data);
    modal.show();
  };

  qs('#btnExcluirLocal').onclick = async ()=>{
    if(!confirm('Excluir este item?')) return;
    await apiDelete(id);
    location.href = 'index.html';
  };

  btnExcluir.onclick = async ()=>{
    if(!confirm('Excluir este item?')) return;
    await apiDelete(id);
    modal.hide();
    location.href = 'index.html';
  };

  form.onsubmit = async e=>{
    e.preventDefault();
    const payload = readForm();
    const updated = await apiUpdate(id, {id: Number(id), ...payload});
    data = updated;
    modal.hide();
    render();
  };
}

document.addEventListener('DOMContentLoaded', ()=>{
  if(el('cards-container')) initIndex();
  if(el('detalhes-container')) initDetalhes();
});
