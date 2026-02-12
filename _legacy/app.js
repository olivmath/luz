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
// READING TIME
// ============================================
const WORDS_PER_MINUTE = 200;
const readingTimeCache = {};

function estimateReadingTime(wordCount) {
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}

function getCourseTime(courseId) {
  const flat = getFlatLessons(courseId);
  let total = 0;
  for (const l of flat) {
    const key = `${l.courseId}/${l.moduleId}/${l.lessonId}`;
    total += readingTimeCache[key] || 8; // default 8 min per lesson
  }
  return total;
}

function formatTime(minutes) {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

// ============================================
// THEME
// ============================================
const Theme = {
  KEY: 'oken-theme',

  get() {
    try { return localStorage.getItem(this.KEY) || 'light'; } catch { return 'light'; }
  },

  set(theme) {
    try { localStorage.setItem(this.KEY, theme); } catch {}
    document.documentElement.setAttribute('data-theme', theme);
  },

  toggle() {
    const next = this.get() === 'light' ? 'dark' : 'light';
    this.set(next);
    this.updateButton();
  },

  init() {
    this.set(this.get());
    this.updateButton();
  },

  updateButton() {
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.textContent = this.get() === 'light' ? 'Escuro' : 'Claro';
  }
};

// ============================================
// PROGRESS MANAGER
// ============================================
const Progress = {
  KEY: 'oken-curso-progress',

  _get() {
    try { return JSON.parse(localStorage.getItem(this.KEY)) || {}; } catch { return {}; }
  },
  _save(data) {
    try { localStorage.setItem(this.KEY, JSON.stringify(data)); } catch {}
  },
  isCompleted(courseId, moduleId, lessonId) {
    const data = this._get();
    return !!(data[courseId] && data[courseId][`${moduleId}/${lessonId}`]);
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

function lp(courseId, moduleId, lessonId) {
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
  // Cache reading time
  const wordCount = text.split(/\s+/).length;
  readingTimeCache[`${courseId}/${moduleId}/${lessonId}`] = estimateReadingTime(wordCount);
  return text;
}

// ============================================
// READING PROGRESS
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
  if (scrollHandler) { window.removeEventListener('scroll', scrollHandler); scrollHandler = null; }
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
// SIDEBAR BUILDER
// ============================================
function buildSidebar(courseId, activeModuleId, activeLessonId) {
  const course = COURSES[courseId];
  const progress = Progress.getCourseProgress(courseId);

  let html = `<aside class="lesson-sidebar" id="lesson-sidebar">
    <div class="sidebar-header">
      <a href="#/${courseId}" class="sidebar-back">&larr; Curso</a>
      <div class="sidebar-progress">${progress.completed}/${progress.total}</div>
    </div>
    <nav class="sidebar-nav">`;

  for (const mod of course.modules) {
    const mi = course.modules.indexOf(mod);
    html += `<div class="sidebar-module">
      <div class="sidebar-module-label">Modulo ${String(mi + 1).padStart(2, '0')}</div>
      <div class="sidebar-module-title">${mod.title}</div>`;

    for (const lesson of mod.lessons) {
      const done = Progress.isCompleted(courseId, mod.id, lesson.id);
      const isActive = mod.id === activeModuleId && lesson.id === activeLessonId;
      let cls = 'sidebar-lesson';
      if (isActive) cls += ' active';
      else if (done) cls += ' completed-lesson';

      html += `<a href="${lp(courseId, mod.id, lesson.id)}" class="${cls}">
        <span class="sidebar-check">${done || isActive ? '&#10003;' : ''}</span>
        <span class="sidebar-num">${lesson.number}</span>
        <span class="sidebar-lesson-title">${lesson.title}</span>
      </a>`;
    }
    html += `</div>`;
  }
  html += `</nav></aside>`;
  return html;
}

// ============================================
// QUIZ SYSTEM
// ============================================

function parseQuiz(markdown) {
  const quizStart = markdown.indexOf('## Questionario');
  if (quizStart === -1) return null;

  const quizText = markdown.substring(quizStart);
  const questions = [];
  const blocks = quizText.split(/\*\*(\d+)\.\s/);

  for (let i = 1; i < blocks.length; i += 2) {
    const number = parseInt(blocks[i]);
    const rest = blocks[i + 1];
    if (!rest) continue;

    const textMatch = rest.match(/^(.*?)\*\*/);
    if (!textMatch) continue;
    const text = textMatch[1].trim();

    const options = [];
    const optionRegex = /^([a-d])\)\s*(.+)$/gm;
    let optMatch;
    while ((optMatch = optionRegex.exec(rest)) !== null) {
      options.push({ letter: optMatch[1], text: optMatch[2].trim() });
    }

    const answerMatch = rest.match(/\*\*Resposta:\s*(\w)\*\*/);
    if (!answerMatch) continue;

    questions.push({ number, text, options, correctAnswer: answerMatch[1].toLowerCase() });
  }

  return questions.length > 0 ? questions : null;
}

function stripQuizFromMarkdown(markdown) {
  const idx = markdown.indexOf('## Questionario');
  return idx === -1 ? markdown : markdown.substring(0, idx).trim();
}

function buildQuizHTML(questions, courseId, moduleId, lessonId, alreadyDone) {
  if (alreadyDone) {
    return `<div class="quiz-section quiz-done">
      <div class="quiz-header">
        <div class="quiz-title">Questionario</div>
        <div class="quiz-status-badge">&#10003; Concluido</div>
      </div>
    </div>`;
  }

  let html = `<div class="quiz-section" id="quiz-section">
    <div class="quiz-header">
      <div class="quiz-title">Questionario</div>
      <div class="quiz-subtitle">Responda corretamente para concluir esta aula</div>
    </div>
    <form id="quiz-form" onsubmit="return handleQuizSubmit(event,'${courseId}','${moduleId}','${lessonId}')">`;

  questions.forEach((q, i) => {
    html += `<div class="quiz-question" data-question="${i}" data-correct="${q.correctAnswer}">
      <div class="quiz-question-text"><span class="quiz-q-num">${q.number}.</span> ${q.text}</div>
      <div class="quiz-options">`;
    q.options.forEach(opt => {
      html += `<label class="quiz-option" data-letter="${opt.letter}">
        <input type="radio" name="q${i}" value="${opt.letter}" required>
        <span class="quiz-option-letter">${opt.letter})</span>
        <span class="quiz-option-text">${opt.text}</span>
      </label>`;
    });
    html += `</div><div class="quiz-feedback" id="feedback-${i}"></div></div>`;
  });

  html += `<div class="quiz-actions">
      <button type="submit" class="btn btn-primary quiz-submit-btn" id="quiz-submit">Verificar respostas</button>
    </div>
    <div class="quiz-result" id="quiz-result"></div>
  </form></div>`;
  return html;
}

function handleQuizSubmit(event, courseId, moduleId, lessonId) {
  event.preventDefault();
  const questions = document.querySelectorAll('.quiz-question');
  let allCorrect = true, correctCount = 0;

  questions.forEach((q, i) => {
    const correct = q.dataset.correct;
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    const feedback = document.getElementById(`feedback-${i}`);

    q.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('correct', 'incorrect'));

    if (!selected) { allCorrect = false; return; }

    const answer = selected.value;
    const selectedOpt = q.querySelector(`[data-letter="${answer}"]`);
    const correctOpt = q.querySelector(`[data-letter="${correct}"]`);

    if (answer === correct) {
      correctCount++;
      selectedOpt.classList.add('correct');
      feedback.innerHTML = '<span class="quiz-feedback-correct">&#10003; Correto</span>';
    } else {
      allCorrect = false;
      selectedOpt.classList.add('incorrect');
      correctOpt.classList.add('correct');
      feedback.innerHTML = '<span class="quiz-feedback-incorrect">&#10007; Incorreto</span>';
    }
  });

  const result = document.getElementById('quiz-result');
  if (allCorrect) {
    result.innerHTML = `<div class="quiz-success">
      <span class="quiz-success-icon">&#10003;</span>
      <span class="quiz-success-text">Parabens! Voce acertou todas as ${questions.length} questoes.</span>
    </div>`;
    handleQuizComplete(courseId, moduleId, lessonId);
  } else {
    result.innerHTML = `<div class="quiz-retry">
      <span class="quiz-retry-text">Voce acertou ${correctCount} de ${questions.length}. Revise e tente novamente.</span>
    </div>`;
    document.getElementById('quiz-submit').textContent = 'Verificar novamente';
  }
  result.scrollIntoView({ behavior: 'smooth', block: 'center' });
  return false;
}

function handleQuizComplete(courseId, moduleId, lessonId) {
  Progress.markCompleted(courseId, moduleId, lessonId);

  const active = document.querySelector('.sidebar-lesson.active');
  if (active) {
    active.classList.add('completed-lesson');
    const check = active.querySelector('.sidebar-check');
    if (check) check.innerHTML = '&#10003;';
  }
  const progress = Progress.getCourseProgress(courseId);
  const progressEl = document.querySelector('.sidebar-progress');
  if (progressEl) progressEl.textContent = `${progress.completed}/${progress.total}`;

  // Add completion badge to footer
  const footer = document.querySelector('.lesson-footer');
  if (footer && !footer.querySelector('.lesson-complete-btn')) {
    const badge = document.createElement('div');
    badge.className = 'lesson-complete-btn completed';
    badge.innerHTML = '&#10003; Aula concluida';
    footer.insertBefore(badge, footer.firstChild);
  }

  if (Progress.isCourseComplete(courseId)) {
    const adj = getAdjacentLessons(courseId, moduleId, lessonId);
    if (!adj.next) {
      const pagination = document.querySelector('.lesson-pagination');
      if (pagination && !pagination.querySelector('.next')) {
        const link = document.createElement('a');
        link.href = `#/certificado/${courseId}`;
        link.className = 'lesson-page-link next';
        link.innerHTML = '<span class="page-direction">Concluir &rarr;</span><span class="page-title">Ver certificado</span>';
        pagination.appendChild(link);
      }
    }
  }
}

// ============================================
// VIEWS
// ============================================
function renderCatalog() {
  disableReadingProgress();
  document.getElementById('header-meta').innerHTML =
    `<button id="theme-toggle" class="nav-link" onclick="Theme.toggle()">${Theme.get() === 'light' ? 'Escuro' : 'Claro'}</button>`;

  const app = document.getElementById('app');
  let html = `<div class="catalog">
    <div class="catalog-header animate-in">
      <div class="catalog-label">Plataforma de Cursos</div>
      <h1 class="catalog-title">Agronegocio Financeiro</h1>
      <p class="catalog-subtitle">Cursos especializados sobre o sistema de financiamento do agronegocio brasileiro.</p>
    </div>
    <div class="course-grid">`;

  Object.keys(COURSES).forEach((cid, i) => {
    const course = COURSES[cid];
    const progress = Progress.getCourseProgress(cid);
    const flat = getFlatLessons(cid);
    const hasContent = cid === 'curso-01';
    const isComplete = Progress.isCourseComplete(cid);
    const pct = progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0;
    const locked = !hasContent;
    const totalTime = getCourseTime(cid);

    html += `<div class="course-card animate-in delay-${i + 1} ${locked ? 'locked' : ''}" ${!locked ? `onclick="navigate('#/${cid}')"` : ''}>
      <div class="card-level"><span class="badge badge-primary">${course.level}</span></div>
      <div class="card-title">${course.title}</div>
      <div class="card-subtitle">${course.subtitle}</div>
      <div class="card-description">${course.description}</div>
      <div class="card-meta">${course.modules.length} modulos &middot; ${flat.length} aulas &middot; ~${formatTime(totalTime)}</div>`;

    if (!locked) {
      html += `<div class="card-progress">
        <div class="progress-bar-track"><div class="progress-bar-fill" style="width:${pct}%"></div></div>
        <div class="progress-label">${progress.completed} de ${progress.total} concluidas${isComplete ? ' — Completo' : ''}</div>
      </div>
      <div class="card-action">${isComplete ? 'Ver certificado' : progress.completed > 0 ? 'Continuar' : 'Comecar'} <span>&rarr;</span></div>`;
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
  const totalTime = getCourseTime(courseId);

  document.getElementById('header-meta').innerHTML =
    `<strong>${progress.completed}</strong>/${progress.total} aulas &nbsp;&middot;&nbsp; <button id="theme-toggle" class="nav-link" onclick="Theme.toggle()">${Theme.get() === 'light' ? 'Escuro' : 'Claro'}</button>`;

  const app = document.getElementById('app');
  let html = `<div class="course-view">
    <a href="#/" class="nav-link animate-in">&larr; Cursos</a>
    <div class="course-view-header animate-in delay-1">
      <div class="course-view-level"><span class="badge badge-primary">${course.level}</span></div>
      <h1 class="course-view-title">${course.title}</h1>
      <div class="course-view-subtitle">${course.subtitle}</div>
      <p class="course-view-description">${course.description}</p>
      <div class="course-view-stats">
        <span><strong>${course.modules.length}</strong> modulos</span>
        <span><strong>${flat.length}</strong> aulas</span>
        <span><strong>~${formatTime(totalTime)}</strong> total</span>
        <span><strong>${progress.completed}</strong> concluidas</span>
      </div>
    </div>`;

  if (isComplete) {
    html += `<div class="cert-banner animate-in delay-2">
      <span class="cert-banner-text">&#9670; Curso concluido com sucesso</span>
      <a href="#/certificado/${courseId}" class="btn btn-accent">Ver certificado</a>
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
        <div class="module-progress-badge ${modComplete ? 'complete' : ''}">${mp.completed}/${mp.total}${modComplete ? ' &#10003;' : ''}</div>
      </div>
      <div class="lesson-list">`;

    mod.lessons.forEach(lesson => {
      const done = Progress.isCompleted(courseId, mod.id, lesson.id);
      const timeKey = `${courseId}/${mod.id}/${lesson.id}`;
      const time = readingTimeCache[timeKey] || 8;
      html += `<div class="lesson-item ${done ? 'is-completed' : ''}" onclick="navigate('${lp(courseId, mod.id, lesson.id)}')">
        <div class="lesson-status ${done ? 'completed' : ''}">${done ? '&#10003;' : ''}</div>
        <div class="lesson-number-label">${lesson.number}</div>
        <div class="lesson-title-text">${lesson.title}</div>
        <div class="lesson-time" style="font-family:var(--font-mono);font-size:var(--text-xs);color:var(--text-disabled);flex-shrink:0">~${time}min</div>
      </div>`;
    });

    html += `</div></div>`;
  });
  html += `</div>`;

  if (!isComplete) {
    const next = Progress.getNextLesson(courseId);
    if (next) {
      html += `<div class="course-footer animate-in delay-6">
        <a href="${lp(next.courseId, next.moduleId, next.lessonId)}" class="btn btn-primary">
          ${progress.completed > 0 ? 'Continuar' : 'Comecar'} &mdash; Aula ${next.lesson.number} &rarr;
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
    `Aula <strong>${adj.currentIndex + 1}</strong> de ${adj.total} &nbsp;&middot;&nbsp; <button id="theme-toggle" class="nav-link" onclick="Theme.toggle()">${Theme.get() === 'light' ? 'Escuro' : 'Claro'}</button>`;

  const app = document.getElementById('app');
  const sidebar = buildSidebar(courseId, moduleId, lessonId);

  // Loading state
  app.innerHTML = `<div class="lesson-layout">
    ${sidebar}
    <div class="lesson-main">
      <div class="lesson-topbar">
        <button class="sidebar-toggle" onclick="document.getElementById('lesson-sidebar').classList.toggle('open')">&#9776; Aulas</button>
        <div class="lesson-topbar-title">Aula ${lesson.number} &mdash; ${mod.title}</div>
        <div class="lesson-topbar-count">${adj.currentIndex + 1}/${adj.total}</div>
      </div>
      <div class="lesson-loading">Carregando...</div>
    </div>
  </div>`;

  try {
    const markdown = await loadMarkdown(courseId, moduleId, lessonId);
    const quiz = parseQuiz(markdown);
    const cleanMd = quiz ? stripQuizFromMarkdown(markdown) : markdown;
    const htmlContent = marked.parse(cleanMd);
    const timeKey = `${courseId}/${moduleId}/${lessonId}`;
    const readTime = readingTimeCache[timeKey] || 8;
    const quizHTML = quiz ? buildQuizHTML(quiz, courseId, moduleId, lessonId, done) : '';
    const hasQuizGate = quiz && !done;

    const main = document.querySelector('.lesson-main');
    main.innerHTML = `
      <div class="lesson-topbar">
        <button class="sidebar-toggle" onclick="document.getElementById('lesson-sidebar').classList.toggle('open')">&#9776; Aulas</button>
        <div class="lesson-topbar-title">Aula ${lesson.number} &middot; ~${readTime} min de leitura</div>
        <div class="lesson-topbar-count">${adj.currentIndex + 1}/${adj.total}</div>
      </div>
      <article class="lesson-content">${htmlContent}</article>
      ${quizHTML}
      <div class="lesson-footer">
        ${hasQuizGate ? '' : done
          ? '<div class="lesson-complete-btn completed">&#10003; Aula concluida</div>'
          : `<button class="lesson-complete-btn" id="complete-btn" onclick="handleComplete('${courseId}','${moduleId}','${lessonId}')">Marcar como concluida</button>`
        }
        <div class="lesson-pagination">
          ${adj.prev ? `<a href="${lp(adj.prev.courseId, adj.prev.moduleId, adj.prev.lessonId)}" class="lesson-page-link">
            <span class="page-direction">&larr; Anterior</span>
            <span class="page-title">${adj.prev.lessonNumber} ${adj.prev.lessonTitle}</span>
          </a>` : '<span></span>'}
          ${adj.next ? `<a href="${lp(adj.next.courseId, adj.next.moduleId, adj.next.lessonId)}" class="lesson-page-link next">
            <span class="page-direction">Proxima &rarr;</span>
            <span class="page-title">${adj.next.lessonNumber} ${adj.next.lessonTitle}</span>
          </a>` : Progress.isCourseComplete(courseId) || done ? `<a href="#/certificado/${courseId}" class="lesson-page-link next">
            <span class="page-direction">Concluir &rarr;</span>
            <span class="page-title">Ver certificado</span>
          </a>` : ''}
        </div>
      </div>`;

    enableReadingProgress();

  } catch {
    const main = document.querySelector('.lesson-main');
    main.innerHTML = `
      <div class="lesson-topbar">
        <button class="sidebar-toggle" onclick="document.getElementById('lesson-sidebar').classList.toggle('open')">&#9776; Aulas</button>
        <div class="lesson-topbar-title">Aula ${lesson.number}</div>
        <div class="lesson-topbar-count">${adj.currentIndex + 1}/${adj.total}</div>
      </div>
      <div class="lesson-error">
        <p style="font-size:1.5rem;color:var(--text-disabled);margin-bottom:var(--space-4)">&#9671;</p>
        <p>Conteudo ainda nao disponivel.</p>
        <p style="color:var(--text-disabled);margin-top:var(--space-2)">Em breve</p>
      </div>
      <div class="lesson-footer">
        <div class="lesson-pagination">
          ${adj.prev ? `<a href="${lp(adj.prev.courseId, adj.prev.moduleId, adj.prev.lessonId)}" class="lesson-page-link"><span class="page-direction">&larr; Anterior</span></a>` : '<span></span>'}
          ${adj.next ? `<a href="${lp(adj.next.courseId, adj.next.moduleId, adj.next.lessonId)}" class="lesson-page-link next"><span class="page-direction">Proxima &rarr;</span></a>` : ''}
        </div>
      </div>`;
  }
}

function renderCertificate(courseId) {
  disableReadingProgress();
  const course = COURSES[courseId];
  if (!course) { navigate('#/'); return; }
  if (!Progress.isCourseComplete(courseId)) { navigate(`#/${courseId}`); return; }

  const flat = getFlatLessons(courseId);
  const savedName = Progress.getStudentName();
  const totalTime = getCourseTime(courseId);
  const now = new Date();
  const dateStr = now.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  document.getElementById('header-meta').innerHTML =
    `<button id="theme-toggle" class="nav-link" onclick="Theme.toggle()">${Theme.get() === 'light' ? 'Escuro' : 'Claro'}</button>`;

  const app = document.getElementById('app');
  app.innerHTML = `<div class="certificate-view">
    <a href="#/${courseId}" class="nav-link animate-in">&larr; Voltar ao curso</a>
    <div class="cert-form animate-in delay-1">
      <div class="cert-form-title">Certificado de Conclusao</div>
      <div class="cert-form-subtitle">Insira seu nome completo</div>
      <input type="text" class="cert-input" id="cert-name-input" placeholder="Seu nome completo" value="${savedName}" oninput="updateCertName(this.value)">
    </div>
    <div class="certificate animate-in delay-2" id="certificate-card">
      <div class="cert-diamond">&#9670;</div>
      <div class="cert-heading">Certificado de Conclusao</div>
      <div class="cert-preamble">Certificamos que</div>
      <div class="cert-name" id="cert-display-name">${savedName || '...'}</div>
      <div class="cert-body">concluiu com exito o curso</div>
      <div class="cert-course-name">${course.title}</div>
      <div class="cert-course-subtitle">${course.subtitle}</div>
      <div class="cert-details">${course.modules.length} modulos &middot; ${flat.length} aulas &middot; ~${formatTime(totalTime)} &middot; ${dateStr}</div>
      <div class="cert-divider"></div>
      <div class="cert-issuer">OKEN</div>
    </div>
    <div class="cert-actions animate-in delay-3">
      <button class="btn btn-primary" onclick="window.print()">Imprimir</button>
      <a href="#/${courseId}" class="btn btn-secondary">Voltar ao curso</a>
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
  if (btn) { btn.classList.add('completed'); btn.innerHTML = '&#10003; Aula concluida'; }

  // Update sidebar
  const sidebarLesson = document.querySelector(`.sidebar-lesson.active`);
  if (sidebarLesson) {
    sidebarLesson.classList.add('completed-lesson');
    const check = sidebarLesson.querySelector('.sidebar-check');
    if (check) check.innerHTML = '&#10003;';
  }

  // Update progress in sidebar
  const progress = Progress.getCourseProgress(courseId);
  const progressEl = document.querySelector('.sidebar-progress');
  if (progressEl) progressEl.textContent = `${progress.completed}/${progress.total}`;

  if (Progress.isCourseComplete(courseId)) {
    const adj = getAdjacentLessons(courseId, moduleId, lessonId);
    if (!adj.next) {
      const pagination = document.querySelector('.lesson-pagination');
      if (pagination && !pagination.querySelector('.next')) {
        const link = document.createElement('a');
        link.href = `#/certificado/${courseId}`;
        link.className = 'lesson-page-link next';
        link.innerHTML = '<span class="page-direction">Concluir &rarr;</span><span class="page-title">Ver certificado</span>';
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
function navigate(hash) { location.hash = hash; }

function route() {
  const hash = location.hash.slice(1) || '/';
  const parts = hash.split('/').filter(Boolean);

  if (parts.length === 0) transitionTo(() => renderCatalog());
  else if (parts[0] === 'certificado' && parts[1]) transitionTo(() => renderCertificate(parts[1]));
  else if (parts.length === 1) transitionTo(() => renderCourse(parts[0]));
  else if (parts.length === 3) transitionTo(() => renderLesson(parts[0], parts[1], parts[2]));
  else transitionTo(() => renderCatalog());
}

// Keyboard
document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT') return;
  const parts = (location.hash.slice(1) || '/').split('/').filter(Boolean);
  if (parts.length === 3) {
    const adj = getAdjacentLessons(parts[0], parts[1], parts[2]);
    if (e.key === 'ArrowRight' && adj.next) navigate(lp(adj.next.courseId, adj.next.moduleId, adj.next.lessonId));
    else if (e.key === 'ArrowLeft' && adj.prev) navigate(lp(adj.prev.courseId, adj.prev.moduleId, adj.prev.lessonId));
  }
});

// Click outside sidebar to close on mobile
document.addEventListener('click', (e) => {
  const sidebar = document.getElementById('lesson-sidebar');
  if (sidebar && sidebar.classList.contains('open')) {
    if (!sidebar.contains(e.target) && !e.target.classList.contains('sidebar-toggle')) {
      sidebar.classList.remove('open');
    }
  }
});

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  marked.setOptions({ breaks: true, gfm: true });
  Theme.init();
  window.addEventListener('hashchange', route);
  route();
});
