// ============================================
// COURSE DATA
// ============================================
const COURSES = {
  'curso-01': {
    id: 'curso-01',
    title: 'Sistema Financeiro do Agronegocio Brasileiro',
    subtitle: 'Fundamentos',
    level: 'Introdutorio',
    description: 'Visao completa e estruturada do sistema de financiamento do agronegocio brasileiro, desde suas bases institucionais ate os instrumentos financeiros, riscos e tendencias de mercado.',
    modules: [
      {
        id: 'modulo-01',
        title: 'O Agronegocio na Economia Brasileira',
        objective: 'Compreender o peso do agronegocio na economia nacional e as razoes estruturais que tornam o credito rural indispensavel.',
        lessons: [
          { id: 'aula-01', title: 'Dimensao economica do agronegocio', number: '1.1' },
          { id: 'aula-02', title: 'Por que o agro precisa de credito estruturado', number: '1.2' },
          { id: 'aula-03', title: 'Origem historica do credito rural no Brasil', number: '1.3' },
        ]
      },
      {
        id: 'modulo-02',
        title: 'Estrutura Institucional do Financiamento Agro',
        objective: 'Conhecer os orgaos, entidades e agentes que compoem o sistema de financiamento do agronegocio.',
        lessons: [
          { id: 'aula-01', title: 'Sistema Nacional de Credito Rural (SNCR)', number: '2.1' },
          { id: 'aula-02', title: 'Agentes financeiros do agro', number: '2.2' },
          { id: 'aula-03', title: 'Plano Safra e programas governamentais', number: '2.3' },
        ]
      },
      {
        id: 'modulo-03',
        title: 'Fontes de Financiamento do Agronegocio',
        objective: 'Mapear as tres grandes fontes de recursos que financiam o agro brasileiro.',
        lessons: [
          { id: 'aula-01', title: 'Credito publico dirigido', number: '3.1' },
          { id: 'aula-02', title: 'Credito bancario comercial', number: '3.2' },
          { id: 'aula-03', title: 'Mercado de capitais agro', number: '3.3' },
        ]
      },
      {
        id: 'modulo-04',
        title: 'Instrumentos Financeiros do Agro',
        objective: 'Conhecer os principais titulos e instrumentos financeiros do agronegocio.',
        lessons: [
          { id: 'aula-01', title: 'CPR: Cedula de Produto Rural', number: '4.1' },
          { id: 'aula-02', title: 'CRA: Certificado de Recebiveis do Agronegocio', number: '4.2' },
          { id: 'aula-03', title: 'Outros instrumentos: LCA, CDCA, CDA/WA', number: '4.3' },
        ]
      },
      {
        id: 'modulo-05',
        title: 'Ciclo Financeiro e Fluxo de Capital no Agro',
        objective: 'Visualizar como o dinheiro circula no agronegocio, do investidor ao produtor.',
        lessons: [
          { id: 'aula-01', title: 'Fases do ciclo produtivo e financeiro', number: '5.1' },
          { id: 'aula-02', title: 'Fluxo real do capital: do investidor ao produtor', number: '5.2' },
          { id: 'aula-03', title: 'Ecossistema de participantes', number: '5.3' },
        ]
      },
      {
        id: 'modulo-06',
        title: 'Riscos, Tendencias e Inovacao',
        objective: 'Compreender os riscos do credito agro, a privatizacao do funding e a tokenizacao.',
        lessons: [
          { id: 'aula-01', title: 'Riscos do sistema de credito agro', number: '6.1' },
          { id: 'aula-02', title: 'Tendencia de privatizacao do funding agro', number: '6.2' },
          { id: 'aula-03', title: 'Introducao a tokenizacao no agro', number: '6.3' },
        ]
      },
    ]
  },
  'curso-02': {
    id: 'curso-02',
    title: 'Sistema Financeiro do Agronegocio Brasileiro',
    subtitle: 'Estruturacao e Mercado Avancado',
    level: 'Avancado',
    description: 'Aprofundamento em estruturacao de operacoes de credito agro, securitizacao, gestao de risco e veiculos de investimento.',
    modules: [
      {
        id: 'modulo-01',
        title: 'Arquitetura do Funding Agro',
        objective: 'Consolidar a visao macro das tres camadas de financiamento.',
        lessons: [
          { id: 'aula-01', title: 'As tres camadas de financiamento', number: '1.1' },
          { id: 'aula-02', title: 'Transicao estrutural: do publico ao privado', number: '1.2' },
          { id: 'aula-03', title: 'Regulacao e marcos legais relevantes', number: '1.3' },
        ]
      },
      {
        id: 'modulo-02',
        title: 'CPR: Estruturacao Avancada',
        objective: 'Aprofundar o conhecimento sobre a CPR como instrumento juridico e financeiro.',
        lessons: [
          { id: 'aula-01', title: 'Estrutura juridica da CPR moderna', number: '2.1' },
          { id: 'aula-02', title: 'Garantias e colaterais avancados', number: '2.2' },
          { id: 'aula-03', title: 'CPR como veiculo estruturado', number: '2.3' },
        ]
      },
      {
        id: 'modulo-03',
        title: 'Securitizacao Agro',
        objective: 'Dominar a mecanica de securitizacao de recebiveis do agronegocio.',
        lessons: [
          { id: 'aula-01', title: 'Anatomia de uma operacao de CRA', number: '3.1' },
          { id: 'aula-02', title: 'Patrimonio separado e protecao ao investidor', number: '3.2' },
          { id: 'aula-03', title: 'Waterfall: fluxo de pagamento e subordinacao', number: '3.3' },
          { id: 'aula-04', title: 'Overcollateral e credit enhancement', number: '3.4' },
        ]
      },
      {
        id: 'modulo-04',
        title: 'Gestao de Risco no Agro Estruturado',
        objective: 'Analisar riscos especificos e instrumentos de mitigacao.',
        lessons: [
          { id: 'aula-01', title: 'Risco climatico e instrumentos de mitigacao', number: '4.1' },
          { id: 'aula-02', title: 'Risco de preco e hedge de commodities', number: '4.2' },
          { id: 'aula-03', title: 'Risco de credito e contraparte na cadeia', number: '4.3' },
        ]
      },
      {
        id: 'modulo-05',
        title: 'Veiculos de Investimento e Mercado Global',
        objective: 'Conhecer FIAGRO, funding internacional e a mentalidade de estruturacao.',
        lessons: [
          { id: 'aula-01', title: 'FIAGRO: estrutura e estrategias', number: '5.1' },
          { id: 'aula-02', title: 'Funding internacional e estruturas cross-border', number: '5.2' },
          { id: 'aula-03', title: 'Mentalidade do structurer', number: '5.3' },
        ]
      },
      {
        id: 'modulo-06',
        title: 'Tokenizacao e Fronteira de Inovacao',
        objective: 'Analisar criticamente o papel da tokenizacao no agro estruturado.',
        lessons: [
          { id: 'aula-01', title: 'O que a tokenizacao resolve e o que nao resolve', number: '6.1' },
          { id: 'aula-02', title: 'Casos de uso e arquitetura tecnica', number: '6.2' },
          { id: 'aula-03', title: 'Competencias do especialista em agro estruturado', number: '6.3' },
        ]
      },
    ]
  }
};

// ============================================
// PROGRESS MANAGER
// ============================================
const Progress = {
  KEY: 'oken-curso-progress',

  _get() {
    try {
      return JSON.parse(localStorage.getItem(this.KEY)) || {};
    } catch { return {}; }
  },

  _save(data) {
    try { localStorage.setItem(this.KEY, JSON.stringify(data)); } catch {}
  },

  isCompleted(courseId, moduleId, lessonId) {
    const data = this._get();
    const key = `${moduleId}/${lessonId}`;
    return !!(data[courseId] && data[courseId][key]);
  },

  markCompleted(courseId, moduleId, lessonId) {
    const data = this._get();
    if (!data[courseId]) data[courseId] = {};
    data[courseId][`${moduleId}/${lessonId}`] = { completedAt: new Date().toISOString() };
    this._save(data);
  },

  getCourseProgress(courseId) {
    const course = COURSES[courseId];
    if (!course) return { completed: 0, total: 0 };
    let completed = 0, total = 0;
    for (const mod of course.modules) {
      for (const lesson of mod.lessons) {
        total++;
        if (this.isCompleted(courseId, mod.id, lesson.id)) completed++;
      }
    }
    return { completed, total };
  },

  getModuleProgress(courseId, moduleId) {
    const course = COURSES[courseId];
    if (!course) return { completed: 0, total: 0 };
    const mod = course.modules.find(m => m.id === moduleId);
    if (!mod) return { completed: 0, total: 0 };
    let completed = 0;
    for (const lesson of mod.lessons) {
      if (this.isCompleted(courseId, mod.id, lesson.id)) completed++;
    }
    return { completed, total: mod.lessons.length };
  },

  isCourseComplete(courseId) {
    const { completed, total } = this.getCourseProgress(courseId);
    return total > 0 && completed === total;
  },

  getNextLesson(courseId) {
    const course = COURSES[courseId];
    if (!course) return null;
    for (const mod of course.modules) {
      for (const lesson of mod.lessons) {
        if (!this.isCompleted(courseId, mod.id, lesson.id)) {
          return { courseId, moduleId: mod.id, lessonId: lesson.id, lesson };
        }
      }
    }
    return null;
  },

  getStudentName() {
    try { return localStorage.getItem('oken-student-name') || ''; } catch { return ''; }
  },

  setStudentName(name) {
    try { localStorage.setItem('oken-student-name', name); } catch {}
  }
};

// ============================================
// HELPERS
// ============================================
function getFlatLessons(courseId) {
  const course = COURSES[courseId];
  if (!course) return [];
  const flat = [];
  for (const mod of course.modules) {
    for (const lesson of mod.lessons) {
      flat.push({ courseId, moduleId: mod.id, moduleTitle: mod.title, lessonId: lesson.id, lessonTitle: lesson.title, lessonNumber: lesson.number });
    }
  }
  return flat;
}

function getAdjacentLessons(courseId, moduleId, lessonId) {
  const flat = getFlatLessons(courseId);
  const idx = flat.findIndex(l => l.moduleId === moduleId && l.lessonId === lessonId);
  return {
    prev: idx > 0 ? flat[idx - 1] : null,
    next: idx < flat.length - 1 ? flat[idx + 1] : null,
    currentIndex: idx,
    total: flat.length,
  };
}

function lessonPath(courseId, moduleId, lessonId) {
  return `#/${courseId}/${moduleId}/${lessonId}`;
}

// ============================================
// MARKDOWN LOADER
// ============================================
const mdCache = {};

async function loadMarkdown(courseId, moduleId, lessonId) {
  const path = `${courseId}/${moduleId}/${lessonId}.md`;
  if (mdCache[path]) return mdCache[path];
  const res = await fetch(path);
  if (!res.ok) throw new Error(`${res.status}`);
  const text = await res.text();
  mdCache[path] = text;
  return text;
}

// ============================================
// READING PROGRESS BAR
// ============================================
let scrollHandler = null;

function enableReadingProgress() {
  const bar = document.getElementById('reading-progress');
  disableReadingProgress();
  scrollHandler = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = docHeight > 0 ? `${(scrollTop / docHeight) * 100}%` : '0';
  };
  window.addEventListener('scroll', scrollHandler, { passive: true });
  scrollHandler();
}

function disableReadingProgress() {
  if (scrollHandler) {
    window.removeEventListener('scroll', scrollHandler);
    scrollHandler = null;
  }
  document.getElementById('reading-progress').style.width = '0';
}

// ============================================
// VIEW TRANSITION
// ============================================
async function transitionTo(renderFn) {
  const app = document.getElementById('app');
  app.classList.add('transitioning');
  await new Promise(r => setTimeout(r, 150));
  renderFn();
  window.scrollTo({ top: 0, behavior: 'instant' });
  app.classList.remove('transitioning');
}

// ============================================
// VIEWS
// ============================================
function renderCatalog() {
  disableReadingProgress();
  document.getElementById('header-meta').innerHTML = '';

  const app = document.getElementById('app');
  let html = `<div class="catalog">
    <div class="catalog-header animate-in">
      <div class="catalog-label">Plataforma de Cursos</div>
      <h1 class="catalog-title">Agronegocio Financeiro</h1>
    </div>
    <div class="course-grid">`;

  const courseIds = Object.keys(COURSES);
  courseIds.forEach((cid, i) => {
    const course = COURSES[cid];
    const progress = Progress.getCourseProgress(cid);
    const flat = getFlatLessons(cid);
    const hasContent = cid === 'curso-01';
    const isComplete = Progress.isCourseComplete(cid);
    const pct = progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0;
    const locked = !hasContent;

    html += `<div class="course-card animate-in delay-${i + 1} ${locked ? 'locked' : ''}" ${!locked ? `onclick="navigate('#/${cid}')"` : ''}>
      <div class="card-level">${course.level}</div>
      <div class="card-title">${course.title}</div>
      <div class="card-subtitle">${course.subtitle}</div>
      <div class="card-description">${course.description}</div>
      <div class="card-meta">${course.modules.length} modulos &middot; ${flat.length} aulas</div>`;

    if (!locked) {
      html += `<div class="card-progress">
        <div class="progress-bar-bg"><div class="progress-bar-fill" style="width:${pct}%"></div></div>
        <div class="progress-text">${progress.completed} de ${progress.total} aulas concluidas${isComplete ? ' &mdash; Completo' : ''}</div>
      </div>`;
      if (isComplete) {
        html += `<div class="card-action">Ver certificado <span class="arrow">&rarr;</span></div>`;
      } else if (progress.completed > 0) {
        html += `<div class="card-action">Continuar <span class="arrow">&rarr;</span></div>`;
      } else {
        html += `<div class="card-action">Comecar <span class="arrow">&rarr;</span></div>`;
      }
    } else {
      html += `<div class="card-locked-text">Em breve</div>`;
    }

    html += `</div>`;
  });

  html += `</div></div>`;
  app.innerHTML = html;
}

function renderCourse(courseId) {
  disableReadingProgress();
  const course = COURSES[courseId];
  if (!course) { navigate('#/'); return; }

  const progress = Progress.getCourseProgress(courseId);
  const flat = getFlatLessons(courseId);
  const isComplete = Progress.isCourseComplete(courseId);

  document.getElementById('header-meta').innerHTML =
    `<strong>${progress.completed}</strong> / ${progress.total} aulas`;

  const app = document.getElementById('app');
  let html = `<div class="course-view">
    <a href="#/" class="back-link animate-in">&larr; Cursos</a>
    <div class="course-view-header animate-in delay-1">
      <div class="course-view-level">${course.level}</div>
      <h1 class="course-view-title">${course.title}</h1>
      <div class="course-view-subtitle">${course.subtitle}</div>
      <p class="course-view-description">${course.description}</p>
      <div class="course-view-stats">
        <span><strong>${course.modules.length}</strong> modulos</span>
        <span><strong>${flat.length}</strong> aulas</span>
        <span><strong>${progress.completed}</strong> concluidas</span>
      </div>
    </div>`;

  if (isComplete) {
    html += `<div class="cert-banner animate-in delay-2">
      <span class="cert-banner-text">&#9670; Curso concluido com sucesso</span>
      <a href="#/certificado/${courseId}" class="btn btn-accent-ghost">Ver certificado</a>
    </div>`;
  }

  html += `<div class="module-list">`;

  course.modules.forEach((mod, mi) => {
    const mp = Progress.getModuleProgress(courseId, mod.id);
    const modComplete = mp.completed === mp.total;

    html += `<div class="module-card animate-in delay-${Math.min(mi + 2, 6)}">
      <div class="module-top">
        <div class="module-number">${String(mi + 1).padStart(2, '0')}</div>
        <div class="module-info">
          <div class="module-title">${mod.title}</div>
          <div class="module-objective">${mod.objective}</div>
        </div>
        <div class="module-progress-badge ${modComplete ? 'complete' : ''}">
          ${mp.completed}/${mp.total}${modComplete ? ' &#10003;' : ''}
        </div>
      </div>
      <div class="lesson-list">`;

    mod.lessons.forEach(lesson => {
      const done = Progress.isCompleted(courseId, mod.id, lesson.id);
      html += `<div class="lesson-item ${done ? 'is-completed' : ''}" onclick="navigate('${lessonPath(courseId, mod.id, lesson.id)}')">
        <div class="lesson-status ${done ? 'completed' : ''}">${done ? '&#10003;' : ''}</div>
        <div class="lesson-number-label">${lesson.number}</div>
        <div class="lesson-title-text">${lesson.title}</div>
      </div>`;
    });

    html += `</div></div>`;
  });

  html += `</div>`;

  // Continue button
  if (!isComplete) {
    const next = Progress.getNextLesson(courseId);
    if (next) {
      html += `<div class="course-footer animate-in delay-6">
        <a href="${lessonPath(next.courseId, next.moduleId, next.lessonId)}" class="btn btn-primary">
          ${progress.completed > 0 ? 'Continuar' : 'Comecar'} &mdash; Aula ${next.lesson.number} <span>&rarr;</span>
        </a>
      </div>`;
    }
  }

  html += `</div>`;
  app.innerHTML = html;
}

async function renderLesson(courseId, moduleId, lessonId) {
  const course = COURSES[courseId];
  if (!course) { navigate('#/'); return; }

  const mod = course.modules.find(m => m.id === moduleId);
  if (!mod) { navigate(`#/${courseId}`); return; }

  const lesson = mod.lessons.find(l => l.id === lessonId);
  if (!lesson) { navigate(`#/${courseId}`); return; }

  const adj = getAdjacentLessons(courseId, moduleId, lessonId);
  const done = Progress.isCompleted(courseId, moduleId, lessonId);

  document.getElementById('header-meta').innerHTML =
    `Aula <strong>${adj.currentIndex + 1}</strong> de ${adj.total}`;

  const app = document.getElementById('app');

  // Show loading
  app.innerHTML = `<div class="lesson-view">
    <div class="lesson-nav">
      <a href="#/${courseId}" class="lesson-nav-back">&larr; ${mod.title}</a>
      <div class="lesson-nav-count">${adj.currentIndex + 1} / ${adj.total}</div>
    </div>
    <div class="lesson-loading">Carregando aula...</div>
  </div>`;

  try {
    const markdown = await loadMarkdown(courseId, moduleId, lessonId);
    const htmlContent = marked.parse(markdown);

    let lessonHtml = `<div class="lesson-view">
      <div class="lesson-nav">
        <a href="#/${courseId}" class="lesson-nav-back">&larr; ${mod.title}</a>
        <div class="lesson-nav-count">${adj.currentIndex + 1} / ${adj.total}</div>
      </div>
      <article class="lesson-content">${htmlContent}</article>
      <div class="lesson-footer">
        <button class="lesson-complete-btn ${done ? 'completed' : ''}" id="complete-btn"
          onclick="handleComplete('${courseId}','${moduleId}','${lessonId}')">
          ${done ? '&#10003; Aula concluida' : 'Marcar como concluida'}
        </button>
        <div class="lesson-pagination">`;

    if (adj.prev) {
      lessonHtml += `<a href="${lessonPath(adj.prev.courseId, adj.prev.moduleId, adj.prev.lessonId)}" class="lesson-page-link">&larr; ${adj.prev.lessonNumber} ${adj.prev.lessonTitle}</a>`;
    } else {
      lessonHtml += `<span></span>`;
    }
    if (adj.next) {
      lessonHtml += `<a href="${lessonPath(adj.next.courseId, adj.next.moduleId, adj.next.lessonId)}" class="lesson-page-link next">${adj.next.lessonNumber} ${adj.next.lessonTitle} &rarr;</a>`;
    } else if (Progress.isCourseComplete(courseId) || (done && !adj.next)) {
      lessonHtml += `<a href="#/certificado/${courseId}" class="lesson-page-link next">Ver certificado &rarr;</a>`;
    }

    lessonHtml += `</div></div></div>`;
    app.innerHTML = lessonHtml;
    enableReadingProgress();

  } catch (err) {
    app.innerHTML = `<div class="lesson-view">
      <div class="lesson-nav">
        <a href="#/${courseId}" class="lesson-nav-back">&larr; ${mod.title}</a>
        <div class="lesson-nav-count">${adj.currentIndex + 1} / ${adj.total}</div>
      </div>
      <div class="lesson-error">
        <div style="font-size:1.5rem;color:var(--text-faint);margin-bottom:1rem;">&#9671;</div>
        <p>Conteudo desta aula ainda nao disponivel.</p>
        <p style="color:var(--text-faint);margin-top:0.5rem;">Em breve</p>
      </div>
      <div class="lesson-footer">
        <div class="lesson-pagination">
          ${adj.prev ? `<a href="${lessonPath(adj.prev.courseId, adj.prev.moduleId, adj.prev.lessonId)}" class="lesson-page-link">&larr; Anterior</a>` : '<span></span>'}
          ${adj.next ? `<a href="${lessonPath(adj.next.courseId, adj.next.moduleId, adj.next.lessonId)}" class="lesson-page-link next">Proxima &rarr;</a>` : ''}
        </div>
      </div>
    </div>`;
  }
}

function renderCertificate(courseId) {
  disableReadingProgress();
  const course = COURSES[courseId];
  if (!course) { navigate('#/'); return; }

  const isComplete = Progress.isCourseComplete(courseId);
  if (!isComplete) { navigate(`#/${courseId}`); return; }

  const flat = getFlatLessons(courseId);
  const savedName = Progress.getStudentName();
  const now = new Date();
  const dateStr = now.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const dateStrFull = now.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  document.getElementById('header-meta').innerHTML = '';

  const app = document.getElementById('app');
  app.innerHTML = `<div class="certificate-view">
    <a href="#/${courseId}" class="back-link animate-in">&larr; Voltar ao curso</a>

    <div class="cert-form animate-in delay-1">
      <div class="cert-form-title">Certificado de Conclusao</div>
      <div class="cert-form-subtitle">Insira seu nome completo para gerar o certificado</div>
      <input type="text" class="cert-input" id="cert-name-input"
        placeholder="Seu nome completo" value="${savedName}"
        oninput="updateCertName(this.value)">
    </div>

    <div class="certificate animate-in delay-2" id="certificate-card">
      <div class="cert-diamond">&#9670;</div>
      <div class="cert-heading">Certificado de Conclusao</div>
      <div class="cert-preamble">Certificamos que</div>
      <div class="cert-name" id="cert-display-name">${savedName || '...'}</div>
      <div class="cert-body">concluiu com exito o curso</div>
      <div class="cert-course-name">${course.title}</div>
      <div class="cert-course-subtitle">${course.subtitle}</div>
      <div class="cert-details">${course.modules.length} modulos &middot; ${flat.length} aulas &middot; ${dateStrFull}</div>
      <div class="cert-divider"></div>
      <div class="cert-issuer">OKEN</div>
    </div>

    <div class="cert-actions animate-in delay-3">
      <button class="btn btn-primary" onclick="window.print()">Imprimir</button>
      <a href="#/${courseId}" class="btn btn-ghost">Voltar ao curso</a>
    </div>
  </div>`;
}

// ============================================
// EVENT HANDLERS
// ============================================
function handleComplete(courseId, moduleId, lessonId) {
  if (Progress.isCompleted(courseId, moduleId, lessonId)) return;

  Progress.markCompleted(courseId, moduleId, lessonId);

  const btn = document.getElementById('complete-btn');
  if (btn) {
    btn.classList.add('completed');
    btn.innerHTML = '&#10003; Aula concluida';
  }

  // Check if course is now complete
  if (Progress.isCourseComplete(courseId)) {
    const adj = getAdjacentLessons(courseId, moduleId, lessonId);
    if (!adj.next) {
      // Add certificate link
      const pagination = document.querySelector('.lesson-pagination');
      if (pagination && !pagination.querySelector('.next')) {
        const link = document.createElement('a');
        link.href = `#/certificado/${courseId}`;
        link.className = 'lesson-page-link next';
        link.innerHTML = 'Ver certificado &rarr;';
        pagination.appendChild(link);
      }
    }
  }
}

function updateCertName(name) {
  const display = document.getElementById('cert-display-name');
  if (display) display.textContent = name || '...';
  Progress.setStudentName(name);
}

// ============================================
// ROUTER
// ============================================
function navigate(hash) {
  location.hash = hash;
}

function route() {
  const hash = location.hash.slice(1) || '/';
  const parts = hash.split('/').filter(Boolean);

  if (parts.length === 0) {
    transitionTo(() => renderCatalog());
  } else if (parts[0] === 'certificado' && parts[1]) {
    transitionTo(() => renderCertificate(parts[1]));
  } else if (parts.length === 1) {
    transitionTo(() => renderCourse(parts[0]));
  } else if (parts.length === 3) {
    transitionTo(() => renderLesson(parts[0], parts[1], parts[2]));
  } else {
    transitionTo(() => renderCatalog());
  }
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT') return;
  const hash = location.hash.slice(1) || '/';
  const parts = hash.split('/').filter(Boolean);

  if (parts.length === 3) {
    const adj = getAdjacentLessons(parts[0], parts[1], parts[2]);
    if (e.key === 'ArrowRight' && adj.next) {
      navigate(lessonPath(adj.next.courseId, adj.next.moduleId, adj.next.lessonId));
    } else if (e.key === 'ArrowLeft' && adj.prev) {
      navigate(lessonPath(adj.prev.courseId, adj.prev.moduleId, adj.prev.lessonId));
    }
  }
});

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  marked.setOptions({ breaks: true, gfm: true });
  window.addEventListener('hashchange', route);
  route();
});
