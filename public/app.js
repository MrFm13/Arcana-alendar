const arcNames=['Шут', 'Маг', 'Верховная жрица', 'Императрица', 'Император', 'Верховный жрец', 'Влюблённые', 'Колесница', 'Справедливость', 'Отшельник', 'Колесо Фортуны', 'Сила', 'Повешенный', 'Смерть', 'Умеренность', 'Дьявол', 'Башня', 'Звезда', 'Луна', 'Солнце', 'Суд', 'Мир'];
    const arcDescriptions=['Новые начинания и первый шаг', 'Создание, технологии и мастерство', 'Самопознание и интуиция', 'Забота, природа и рост', 'Планирование и лидерство', 'Обучение и наставничество', 'Отношения и сотрудничество', 'Путешествия и движение', 'Обязательства и честность', 'Исследования и самостоятельная учёба', 'Творчество и эксперименты', 'Спорт и дисциплина', 'Терпение и новый взгляд', 'Перемены и расхламление', 'Баланс и полезные привычки', 'Преодоление зависимостей', 'Решение срочных проблем', 'Мечты и долгосрочные цели', 'Дом, готовка и внутренний мир', 'Радость и общение', 'Итоги и важные решения', 'Завершение больших проектов'];
    const excludedArcIds=new Set([12, 13, 15]), availableArcIds=arcNames.map((_, i)=>i).filter(i=>!excludedArcIds.has(i)), legacyArcReplacement= {
      12:2, 13:14, 15:11
    };
    const arcKeywords=[['начать', 'новый', 'впервые'], ['код', 'программ', 'сайт', 'собрать', 'ремонт', 'разработ'], ['дневник', 'медита', 'чувств', 'рефлек'], ['растен', 'цвет', 'забот', 'полить'], ['план', 'организ', 'управ', 'расписан'], ['курс', 'лекци', 'настав', 'обуч'], ['друг', 'семь', 'свидан', 'встреч', 'команд'], ['поезд', 'прогул', 'путеше', 'велосип'], ['оплат', 'документ', 'срок', 'договор'], ['физик', 'математ', 'изуч', 'исслед', 'книг', 'прочит', 'повтор'], ['рис', 'твор', 'музык', 'иллюстра', 'дизайн', 'сцен', 'фото', 'стих'], ['спорт', 'тренир', 'бег', 'заряд', 'зал', 'отжим'], ['терпен', 'подожд', 'переосмысл'], ['убор', 'убрать', 'разобрать', 'выброс'], ['сон', 'спать', 'вод', 'режим', 'баланс'], ['курить', 'завис', 'привычк', 'скролл'], ['сроч', 'авари', 'исправ', 'полом'], ['мечт', 'цель', 'будущ'], ['ужин', 'готов', 'кух', 'обед', 'завтрак', 'дом'], ['празд', 'кино', 'игр', 'отдых', 'радост'], ['итог', 'решен', 'анализ', 'оцен'], ['заверш', 'законч', 'сдать', 'презента', 'защит']];
    const arcNumbers=['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI'];
    const arcSymbols=['◇', '✦', '☾', '♧', '♜', '✧', '♡', '➶', '⚖', '⌕', '✺', '♞', '▽', '✕', '◒', '♠', 'ϟ', '★', '☽', '☀', '♬', '◎'];
    const $=s=>document.querySelector(s), esc=s=>String(s).replace(/[&<>"']/g, c=>( {
      '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
    }
    [c]));
    function iso(d) {
      return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
    }
    let today=iso(new Date());
    const tomorrow=iso(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()+1));
    const seed=()=>( {
      base:arcNames.map(()=>0), tasks:[]
    });
    let state=seed(), storageAvailable=true;
    try {
      let saved=JSON.parse(localStorage.getItem('arc-day-v3'));
      if(saved&&Array.isArray(saved.tasks)&&saved.base?.length===22)state=saved
    }
    catch(e) {
      storageAvailable=false
    }
    for(const a of excludedArcIds) {
      state.base[legacyArcReplacement[a]]+=state.base[a];
      state.base[a]=0
    }
    for(const t of state.tasks) {
      if(excludedArcIds.has(t.arc))t.arc=legacyArcReplacement[t.arc]
    }
    try {
      localStorage.setItem('arc-day-v3', JSON.stringify(state))
    }
    catch(e) {
      storageAvailable=false
    }
    let tab='today', selectedDate=today, month=new Date(new Date().getFullYear(), new Date().getMonth(), 1), selectedArcId=10;
let arcDetailOpen = false;
if (!state.profile) state.profile = { name: 'Пользователь', about: 'Моя история только начинается' };
    function save() {
      try {
        localStorage.setItem('arc-day-v3', JSON.stringify(state))
      }
      catch(e) {
        storageAvailable=false
      }
    }
 function xp(arcId) {
  let points = state.base[arcId];
  for (let i = 0; i < state.tasks.length; i++) {
    let task = state.tasks[i];
    if (task.done && task.arc === arcId) {
      points = points + task.points;
    }
  }
  if (points > 1200) points = 1200;
  return points;
}
    function rank(arcId)  {
      const points = xp(arcId);
      if (points === 0) return 0;
      return Math.min(10, 1 + Math.floor(points / 120));
    }
    function progress(arcId)  {
      if (rank(arcId) === 10) return 120;
      return xp(arcId) % 120;
    }
    function stars(arcId)  {
      const level = rank(arcId);
      return '★'.repeat(level) + '☆'.repeat(10 - level);
    }
function classify(text) {
 
  let words = text.toLowerCase().replace(/ё/g, 'е');
  let bestScore = 0;
  let selectedId = 0;
  for (let i = 0; i < arcKeywords.length; i++) {
    let score = 0;
    for (let j = 0; j < arcKeywords[i].length; j++) {
      if (words.includes(arcKeywords[i][j])) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      selectedId = i;
    }
  }
  if (legacyArcReplacement[selectedId] !== undefined) {
    return legacyArcReplacement[selectedId];
  }
  return selectedId;
}
    function tasksOn(d) {
      return state.tasks.filter(t=>t.date===d).sort((a, b)=>a.time.localeCompare(b.time))
    }
    function dateText(d) {
      return new Date(d+'T12:00:00').toLocaleDateString('ru-RU',  {
        day:'numeric', month:'long', weekday:'long'
      })
    }

function deadline(task) { return new Date(task.date + 'T' + task.time + ':00').getTime(); }
function isFailed(task) { return !task.done && (Boolean(task.failedAt) || Date.now() >= deadline(task)); }
function markFailedTasks(now = Date.now()) {
  let changed = false;
  for (const task of state.tasks) {
    if (!task.done && !task.failedAt && now >= deadline(task)) {
      task.failedAt = new Date(now).toISOString();
      changed = true;
    }
  }
  if (changed) save();
  return changed;
}
function nextTaskTime() {
  const next = new Date(Date.now() + 30 * 60000);
  next.setSeconds(0, 0);
  return { date: iso(next), time: next.toTimeString().slice(0,5) };
}
function updateDateLimits() {
  const now = new Date();
  $('#date').min = iso(now);
  $('#time').min = $('#date').value === iso(now) ? new Date(now.getTime() + 60000).toTimeString().slice(0,5) : '';
  $('#date').setCustomValidity('');
  $('#time').setCustomValidity('');
}

// Фильтр
let taskFilter = 'all';
let taskQuery = '';
let editingTaskId = null;
function visibleTasks(date) {
  let tasks = tasksOn(date);
  let result = [];
  let search = taskQuery.toLowerCase().trim();
  for (let i = 0; i < tasks.length; i++) {
    let task = tasks[i];
    let failed = isFailed(task);
    if (taskFilter === 'done' && !task.done) continue;
    if (taskFilter === 'failed' && !failed) continue;
    if (taskFilter !== 'all' && taskFilter !== 'done' && taskFilter !== 'failed') {
      if (task.done || failed) continue;
    }
    let title = (task.title + ' ' + arcNames[task.arc]).toLowerCase();
    if (title.includes(search)) result.push(task);
  }
  return result;
}
function taskTools() {
  return `<div class="task-tools"><label class="search-label">Поиск заданий<input id="tasksearch" type="search" placeholder="Название или аркан" value="${esc(taskQuery)}" maxlength="160"></label>
    <div class="filter-tabs" aria-label="Фильтр заданий">${[['all','Все'],['active','В плане'],['done','Готово'],['failed','Провалено']].map(([value,label]) => `<button data-filter="${value}" aria-pressed="${taskFilter===value}" class="${taskFilter===value?'selected':''}">${label}</button>`).join('')}</div></div>`;
}
function taskHTML(t) {
  const failed = isFailed(t);
  return `<article class="task ${t.done?'done':failed?'failed':''}"><button class="check" data-complete="${esc(t.id)}" ${failed ? 'disabled' : ''} aria-pressed="${t.done}" aria-label="${failed?'Задание провалено':t.done?'Отменить выполнение':'Выполнить'}: ${esc(t.title)}">${t.done?'✓':failed?'×':''}</button>
    <div class="taskname"><div class="task-top"><span class="time">${esc(t.time)}</span><span class="task-status">${t.done?'Выполнено':failed?'Провалено':'В плане'}</span></div><span>${esc(t.title)}</span><div class="meta">${arcNumbers[t.arc]} · ${arcNames[t.arc]}</div>
    <div class="task-actions">${failed ? '' : '<button data-edit="' + esc(t.id) + '">Изменить</button>'}<button data-delete="${esc(t.id)}">Удалить</button></div></div><div class="reward">${failed ? '0' : '+' + t.points}<small>ОЧКОВ</small></div></article>`;
}
function taskList(date) {
  return `<div class="task-list" data-taskdate="${date}">${visibleTasks(date).map(taskHTML).join('')}</div>`;
}
function refreshTaskLists() {
  document.querySelectorAll('[data-taskdate]').forEach(list => {
    list.innerHTML = visibleTasks(list.dataset.taskdate).map(taskHTML).join('');
  });
}
function overdueTasks() {
  const tasks = state.tasks.filter(task => isFailed(task)).sort((a,b) => a.date.localeCompare(b.date));
  if (!tasks.length) return '';
  return `<section class="overdue-section"><div class="band">ПРОВАЛЕННЫЕ ЗАДАНИЯ · ${tasks.length}</div>${tasks.map(task => '<div class="overdue-date">' + dateText(task.date) + '</div>' + taskHTML(task)).join('')}</section>`;
}

function renderToday() {
      let ts=tasksOn(today), done=ts.filter(t=>t.done).length;
      return `<div class="topline"><h1 class="section-title">СЕГОДНЯ</h1><button class="btn" data-add="${today}">+ Новое задание</button></div><div class="hero"><div class="bigdate">${Number(today.slice(-2))}</div><div><p class="label">${dateText(today).toUpperCase()}</p></div></div><div class="layout"><section><div class="band">ЗАДАНИЯ ДНЯ · ${ts.length}</div>${taskTools()}${taskList(today)}</section><aside><div class="summary"><h2>ТВОЙ ПРОГРЕСС</h2><div class="fraction">${done}<small> / ${ts.length}</small></div><div class="bar"><i style="width:${ts.length?done/ts.length*100:0}%"></i></div><p>Выполнено сегодня<br>Получено ${ts.filter(t=>t.done).reduce((v,t)=>v+t.points,0)} очков связи</p></div></aside></div>${overdueTasks()}`
    }
    function renderCalendar() {
      let y=month.getFullYear(), m=month.getMonth(), count=new Date(y, m+1, 0).getDate(), offset=(new Date(y, m, 1).getDay()+6)%7;
      let cells='<div></div>'.repeat(offset);
      for(let d=1; d<=count; d++) {
        let dt=iso(new Date(y, m, d)), wd=new Date(y, m, d).getDay(), ts=tasksOn(dt);
        cells+=`<button class="day ${wd===0?'sun':wd===6?'sat':''} ${dt===today?'today':''} ${dt===selectedDate?'selected':''}" data-day="${dt}" aria-label="${dateText(dt)}, заданий: ${ts.length}" aria-pressed="${dt===selectedDate}">${d}${ts.length?'<span class="dot"></span>':''}</button>`
      }
      return `<div class="topline"><h1 class="section-title">КАЛЕНДАРЬ</h1><button class="btn light" id="backtoday">К текущему дню</button></div><div class="calendar-layout"><section><div class="monthhead"><button class="arrow" data-month="-1" aria-label="Предыдущий месяц">‹</button><div><span class="monthnumber">${String(m+1).padStart(2,'0')}</span> <span class="monthname">${month.toLocaleDateString('ru-RU',{month:'long'})} <small>${y}</small></span></div><button class="arrow" data-month="1" aria-label="Следующий месяц">›</button></div><div class="cal">${['ПН','ВТ','СР','ЧТ','ПТ','СБ','ВС'].map(w=>`<div class="weekday">${w}</div>`).join('')}${cells}</div><p class="muted">● Есть задания · Жёлтый контур — сегодня</p></section><aside class="cal-side"><h2>${dateText(selectedDate)}</h2><div class="band">МОИ ЗАДАНИЯ</div>${taskTools()}${taskList(selectedDate)}${selectedDate >= today ? '<button class="btn" data-add="' + selectedDate + '" style="margin-top:20px">+ Запланировать</button>' : ''}</aside></div>`
    }
    
function completedTasksForArc(arcId) {
  return state.tasks
    .filter(task => task.done && task.arc === arcId)
    .sort((first, second) => {
      const firstDate = first.completedAt || first.date + 'T' + first.time;
      const secondDate = second.completedAt || second.date + 'T' + second.time;
      return secondDate.localeCompare(firstDate);
    });
}

function renderArcana() {
  if (arcDetailOpen) return renderArcDetail();

  const openedCount = availableArcIds.filter(id => rank(id) > 0).length;
  const cards = availableArcIds.map(id => {
    const level = rank(id);
    const compatibility = Math.min(Math.round(xp(id) / 1080 * 100), 100);
    return `<button class="arc ${level ? '' : 'locked'}" data-arc="${id}">
      <span class="roman">${arcNumbers[id]}</span>
      ${level ? '' : '<svg class="arc-lock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 018 0v3"/><path d="M12 14v3"/></svg>'}
      <b>${arcNames[id]}</b>
      ${level ? '<div class="arc-card-progress"><small>Уровень ' + level + ' / 10</small><small>' + compatibility + '%</small></div><div class="bar"><i style="width:' + compatibility + '%"></i></div>' : '<small class="arc-state">Связь закрыта</small>'}
    </button>`;
  }).join('');

  return `<div class="topline"><h1 class="section-title">АРКАНЫ</h1>
    <span class="label">${openedCount} / 19 ОТКРЫТО</span></div>
    <section class="arcgrid arc-list">${cards}</section>`;
}

function renderArcDetail() {
  const arcId = selectedArcId;
  const level = rank(arcId);
  const compatibility = Math.min(Math.round(xp(arcId) / 1080 * 100), 100);
  const completedTasks = completedTasksForArc(arcId);
  const earnedPoints = completedTasks.reduce((total, task) => total + task.points, 0);

  const history = completedTasks.map(task => {
    const completionDate = task.completedAt
      ? new Date(task.completedAt).toLocaleDateString('ru-RU')
      : '';
    return `<article class="history-task">
      <div class="history-title">✓ ${esc(task.title)}</div>
      <div class="meta">Запланировано: ${dateText(task.date)} · ${task.time}</div>
      ${completionDate ? '<div class="meta">Выполнено: ' + completionDate + '</div>' : ''}
      <div class="history-points">+${task.points} очков связи</div>
    </article>`;
  }).join('');

  return `<button class="btn light" id="arcsback">‹ Все Арканы</button>
    <section class="arc-detail personal-arc">
      <div class="label">АРКАН ${arcNumbers[arcId]}</div>
      <h1>${arcNames[arcId]}</h1>
      <p>${arcDescriptions[arcId]}</p>
      <div class="rank">${level} <small>УРОВЕНЬ СВЯЗИ / 10</small></div>
      <div class="stars">${stars(arcId)}</div>
      <div class="compatibility-heading"><b>Совместимость</b><strong>${compatibility}%</strong></div>
      <div class="bar"><i style="width:${compatibility}%"></i></div>
      <div class="muted">${level === 10 ? 'Максимальная совместимость достигнута' : xp(arcId) + ' / 1080 очков до максимальной совместимости'}</div>
      <p class="muted">${level === 10 ? 'Связь развита до 10 звёзд.' : level ? progress(arcId) + ' / 120 очков до следующей звезды.' : 'Выполните первое задание этого Аркана, чтобы открыть связь.'}</p>
      <button class="btn" data-add="${today}" data-forarc="${arcId}">+ Задание Аркана</button>
    </section>
    <section class="arc-history">
      <div class="band">ВЫПОЛНЕННЫЕ ЗАДАНИЯ · ${completedTasks.length}</div>
      <p class="muted">Всего получено: ${earnedPoints} очков связи</p>
      ${history || '<div class="empty">Здесь появятся выполненные задания этого Аркана.</div>'}
    </section>`;
}


// Друзья
const demoFriends = [
  { name: 'Аня', initials: 'А', focus: 'Колесо Фортуны', level: 4,
    achievements: ['Творческий старт: первая иллюстрация', 'Пять завершённых творческих задач'] },
  { name: 'Максим', initials: 'М', focus: 'Сила', level: 3,
    achievements: ['Первая тренировка', 'Три спортивные задачи за неделю'] },
  { name: 'Соня', initials: 'С', focus: 'Отшельник', level: 5,
    achievements: ['Первое прочитанное произведение', 'Десять завершённых учебных задач'] }
];

if (!Array.isArray(state.friendSuggestions)) state.friendSuggestions = [];
let suggestionFriendIndex = null;
function renderFriends() {
  const cards = demoFriends.map((friend, index) => `<article class="friend-card">
    <div class="friend-heading"><div class="avatar" aria-hidden="true">${friend.initials}</div>
      <div><h2>${friend.name}</h2><p class="muted">${friend.focus} · уровень ${friend.level}</p></div>
    </div>
    <ul class="achievement-list" aria-label="Достижения">${friend.achievements.map(item => '<li><span aria-hidden="true">★</span> ' + esc(item) + '</li>').join('')}</ul>
    <button class="btn suggest-button" data-suggestfriend="${index}">Предложить задание</button>
    ${state.friendSuggestions.filter(item => item.friendIndex === index).map(item => `<div class="friend-suggestion"><b>${esc(item.title)}</b><div class="meta">На ${dateText(item.date)}</div></div>`).join('')}
  </article>`).join('');
  return `<div class="topline"><h1 class="section-title">ДРУЗЬЯ</h1><span class="label">ДЕМО</span></div>
    <section class="friends-list">${cards}</section>`;
}

// тут должно было быть 22 оригинальных старших аркана но пришлось убрать Дьявола, Повешаного и Смерть, тк цензура и мне по шапке от учителя прилетело, когда буду кодить обычное приложение для себя верну как было
const tarotPortraits = [
  'Шут символизирует открытость новому. В ваших делах заметна готовность начинать.',
  'Маг символизирует мастерство. Вы уделяете внимание созданию и практическим решениям.',
  'Верховная жрица символизирует внутренний мир. Вы находите время для самопознания.',
  'Императрица символизирует заботу и рост. Ваша активность связана с поддержкой и созиданием.',
  'Император символизирует порядок. Вы уделяете внимание организации и планированию.',
  'Верховный жрец символизирует обучение. Вам близки знания и обмен опытом.',
  'Влюблённые символизируют связь. Вы находите время для отношений и совместных дел.',
  'Колесница символизирует движение. В ваших делах заметны активность и новые маршруты.',
  'Справедливость символизирует ответственность. Вы уделяете внимание обязательствам.',
  'Отшельник символизирует поиск знаний. Ваша активность связана с учёбой и исследованиями.',
  'Колесо Фортуны символизирует возможности. В ваших делах заметны творчество и эксперименты.',
  'Сила символизирует дисциплину. Вы вкладываете усилия в тренировки и работу над собой.',
  '', '',
  'Умеренность символизирует баланс. Вы уделяете внимание режиму и полезным привычкам.',
  '',
  'Башня символизирует перестройку. Вы решаете сложные ситуации и исправляете проблемы.',
  'Звезда символизирует надежду. Вы делаете шаги к личным целям и мечтам.',
  'Луна символизирует внутренний мир. В ваших делах заметны забота о доме и повседневный уют.',
  'Солнце символизирует радость. Вы находите время для отдыха и общения.',
  'Суд символизирует осмысление. Вы подводите итоги и принимаете решения.',
  'Мир символизирует завершение. Вы доводите большие дела до результата.'
];

function renderStatistics() {
  const completed = state.tasks.filter(task => task.done);
  const total = state.tasks.length;
  const points = completed.reduce((sum, task) => sum + task.points, 0);
  const opened = availableArcIds.filter(id => rank(id) > 0);
  const leading = [...opened].sort((first, second) => xp(second) - xp(first)).slice(0, 3);
  const completionRate = total ? Math.round(completed.length / total * 100) : 0;
  const milestones = [
    { title: 'Первый шаг', description: 'Выполнить первое задание', unlocked: completed.length >= 1 },
    { title: 'Пять побед', description: 'Выполнить пять заданий', unlocked: completed.length >= 5 },
    { title: 'Разные грани', description: 'Открыть три Аркана', unlocked: opened.length >= 3 },
    { title: 'Крепкая связь', description: 'Достичь 5 уровня любого Аркана', unlocked: opened.some(id => rank(id) >= 5) }
  ];
  const portrait = leading.map(id => `<button class="tarot-portrait" data-portraitarc="${id}">
      <span class="social-label">${arcNumbers[id]} · УРОВЕНЬ ${rank(id)}</span>
      <h3>${arcNames[id]}</h3><p>${tarotPortraits[id]}</p>
      <span class="muted">${xp(id)} очков связи · открыть Аркан ›</span>
    </button>`).join('');
  return `<div class="topline"><h1 class="section-title stats-title">МОЯ СТАТИСТИКА</h1></div>
    <section class="profile-card">
      <div class="friend-heading"><div class="avatar">${esc(state.profile.name.trim().charAt(0).toUpperCase() || 'Я')}</div>
        <div class="profile-copy"><h2>${esc(state.profile.name)}</h2><p>${esc(state.profile.about)}</p></div></div>
      <button class="btn light" id="editprofile">Изменить профиль</button>
    </section>
    <section class="backup-card"><div class="social-label">КОПИЯ ПРОГРЕССА</div><div class="backup-actions"><button class="btn light" id="exportdata">Скачать копию</button><button class="btn light" id="importdata">Восстановить</button></div></section><section class="stats-grid" aria-label="Результаты пользователя">
      <div><strong>${completed.length}</strong><span>Заданий выполнено</span></div>
      <div><strong>${points}</strong><span>Очков получено</span></div>
      <div><strong>${opened.length} / 19</strong><span>Арканов открыто</span></div>
      <div><strong>${completionRate}%</strong><span>Заданий завершено</span></div>
    </section>
    <section class="milestones"><div class="band">МОИ ДОСТИЖЕНИЯ</div>
      ${milestones.map(item => `<div class="milestone ${item.unlocked ? 'earned' : ''}"><span>${item.unlocked ? '★' : '☆'}</span><div><b>${item.title}</b><p>${item.description}</p><small>${item.unlocked ? 'Получено' : 'Ещё впереди'}</small></div></div>`).join('')}
    </section>
    <section class="tarot-section"><div class="band">МОЙ ПОРТРЕТ ЧЕРЕЗ АРКАНЫ</div>
      
      ${portrait || '<div class="empty">Выполните первое задание, чтобы здесь появилась карта вашего прогресса.</div>'}
    </section>`;
}

function saveFriendSuggestion(event) {
  event.preventDefault();
  const title = $('#suggesttitle').value.trim();
  if (!title) {
    $('#suggesttitle').setCustomValidity('Введите название задания');
    $('#suggesttitle').reportValidity();
    return;
  }
  if ($('#suggestdate').value < iso(new Date())) {
    $('#suggestdate').setCustomValidity('Выберите сегодняшний или будущий день');
    $('#suggestdate').reportValidity();
    return;
  }
  if (suggestionFriendIndex === null || !demoFriends[suggestionFriendIndex]) return;
  state.friendSuggestions.push({
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    friendIndex: suggestionFriendIndex,
    title,
    date: $('#suggestdate').value
  });
  save();
  $('#suggesteditor').close();
  render();
  $('#notice').textContent = 'Предложение для ' + demoFriends[suggestionFriendIndex].name + ' сохранено в демоверсии.';
}

function saveProfile(event) {
  event.preventDefault();
  const name = $('#profilename').value.trim();
  if (!name) {
    $('#profilename').setCustomValidity('Введите имя');
    $('#profilename').reportValidity();
    return;
  }
  state.profile = { name, about: $('#profileabout').value.trim() };
  save();
  $('#profileeditor').close();
  render();
}


let previousScreen = '';
function motionAllowed() {
  return typeof matchMedia !== 'function' || !matchMedia('(prefers-reduced-motion: reduce)').matches;
}
function animateScreen() {
  const screen = [tab, arcDetailOpen, selectedArcId].join(':');
  if (screen !== previousScreen && motionAllowed()) {
    $('#view').animate?.([
      { opacity: .35, transform: 'translateY(6px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], { duration: 180, easing: 'ease-out' });
  }
  previousScreen = screen;
}
function render() {
  today = iso(new Date());
  markFailedTasks();
  $('#notice').textContent = ''; 
      document.querySelectorAll('button[data-tab]').forEach(b=> {
        b.classList.toggle('active', b.dataset.tab===tab); b.setAttribute('aria-current', b.dataset.tab===tab?'page':'false')
      });
      const screens = { today: renderToday, calendar: renderCalendar, arcana: renderArcana, friends: renderFriends, stats: renderStatistics };
  $('#view').innerHTML = (screens[tab] || renderToday)();
  animateScreen();
  if(!storageAvailable)$('#notice').textContent='Браузер запретил сохранение. Изменения доступны до закрытия страницы.'
    }
    function openTaskForm(date, arc = 'auto')  {
      editingTaskId = null;
      $('#form').reset();
      $('#form h2').textContent = 'НОВОЕ ЗАДАНИЕ';
      $('#form button[type=submit]').textContent = 'Добавить';
      $('#title').setCustomValidity('');
      const suggested = nextTaskTime();
      $('#date').value = date < today ? today : date;
      $('#time').value = $('#date').value === suggested.date ? suggested.time : '18:00';
      updateDateLimits();
      $('#arcselect').value = arc;
      $('#prediction').textContent = 'Введите задание — классификатор предложит Аркан.';
      $('#editor').showModal();
      $('#title').focus();
    }
    function toggleTask(taskId)  {
      const task = state.tasks.find(item => item.id === taskId);
      if (!task) return;
      if (isFailed(task)) { markFailedTasks(); render(); $('#notice').textContent = 'Срок задания прошёл. Задание провалено, очки не начислены.'; return; }
      const previousRank = rank(task.arc);
      task.done = !task.done;
  if (task.done) task.completedAt = new Date().toISOString();
  else delete task.completedAt;
      save();
      render();
      if (task.done && motionAllowed()) {
        document.querySelector('[data-complete="' + task.id + '"]')?.animate?.([
          { transform: 'scale(.85)' }, { transform: 'scale(1.08)' }, { transform: 'scale(1)' }
        ], { duration: 220, easing: 'ease-out' });
      }
      if (!task.done)  {
        $('#notice').textContent = 'Выполнение отменено. Очки пересчитаны.';
      }
      else if (rank(task.arc) > previousRank)  {
        $('#notice').textContent = `Связь с Арканом «${arcNames[task.arc]}» укрепилась! Уровень ${rank(task.arc)} / 10.`;
      }
      else  {
        $('#notice').textContent = `Задание выполнено. +${task.points} очков: ${arcNames[task.arc]}.`;
      }
    }
    function deleteTask(taskId)  {
      const task = state.tasks.find(item => item.id === taskId);
      if (!task) return;
      const warning = task.done ? ' Начисленные очки будут сняты.' : '';
      if (!confirm(`Удалить задание «${task.title}»?${warning}`)) return;
      state.tasks = state.tasks.filter(item => item.id !== taskId);
      save();
      render();
    }
    function handleClick(event)  {
      const button = event.target.closest('button');
      if (!button) return;
      const action = button.dataset;
  if (action.filter) { taskFilter = action.filter; render(); return; }
  if (action.edit) { editTask(action.edit); return; }
  if (button.id === 'exportdata') { exportData(); return; }
  if (button.id === 'importdata') { $('#backupfile').click(); return; }
  if (action.tab)  {
        tab = action.tab;
    if (tab === 'arcana') arcDetailOpen = false;
        $('#notice').textContent = '';
        render();
      }
      else if (action.suggestfriend !== undefined) {
    suggestionFriendIndex = Number(action.suggestfriend);
    if (!demoFriends[suggestionFriendIndex]) return;
    $('#suggestform').reset();
    $('#suggesttitle').setCustomValidity('');
    $('#suggestdate').setCustomValidity('');
    $('#suggestdate').value = today;
    $('#suggestdate').min = iso(new Date());
    $('#suggestrecipient').textContent = 'Для друга: ' + demoFriends[suggestionFriendIndex].name;
    $('#suggesteditor').showModal();
    $('#suggesttitle').focus();
  }
  else if (button.id === 'cancelsuggest') {
    $('#suggesteditor').close();
  }
  else if (button.id === 'editprofile') {
    $('#profilename').value = state.profile.name;
    $('#profileabout').value = state.profile.about;
    $('#profilename').setCustomValidity('');
    $('#profileeditor').showModal();
    $('#profilename').focus();
  }
  else if (button.id === 'cancelprofile') {
    $('#profileeditor').close();
  }
  else if (action.portraitarc !== undefined) {
    tab = 'arcana';
    selectedArcId = Number(action.portraitarc);
    arcDetailOpen = true;
    render();
  }
  else if (action.add)  {
        openTaskForm(action.add, action.forarc ?? 'auto');
      }
      else if (action.complete)  {
        toggleTask(action.complete);
      }
      else if (action.delete)  {
        deleteTask(action.delete);
      }
      else if (action.day)  {
        selectedDate = action.day;
        render();
      }
      else if (action.arc !== undefined)  {
        selectedArcId = Number(action.arc);
    arcDetailOpen = true;
        render();
      }
      else if (action.month) {
    month = new Date(month.getFullYear(), month.getMonth() + Number(action.month), 1);
    selectedDate = iso(month);
    render();
  }
  else if (button.id === 'arcsback') {
    arcDetailOpen = false;
    render();
  }
  else if (button.id === 'backtoday')  {
        const now = new Date();
        month = new Date(now.getFullYear(), now.getMonth(), 1);
        selectedDate = today;
        render();
      }
      else if (button.id === 'cancel')  {
        $('#editor').close();
      }
    }
    function updatePrediction()  {
      const title = $('#title').value.trim();
      $('#title').setCustomValidity('');
      if (!title)  {
        $('#prediction').textContent = 'Введите задание — классификатор предложит Аркан.';
        return;
      }
      const choice = $('#arcselect').value;
      const arc = choice === 'auto' ? classify(title) : Number(choice);
      $('#prediction').textContent = `${choice === 'auto' ? 'Предложение' : 'Выбран аркан'}: ${arcNames[arc]} · ${arcDescriptions[arc]}`;
    }
    function addTask(event)  {
      event.preventDefault();
      const title = $('#title').value.trim();
      if (!title)  {
        $('#title').setCustomValidity('Введите название задания');
        $('#title').reportValidity();
        return;
      }
      const planned = { date: $('#date').value, time: $('#time').value };
      if (!Number.isFinite(deadline(planned)) || deadline(planned) <= Date.now() || planned.date < iso(new Date())) {
        $('#time').setCustomValidity('Выберите дату и время в будущем');
        $('#time').reportValidity();
        return;
      }
      const oldTask = state.tasks.find(item => item.id === editingTaskId);
      if (oldTask && isFailed(oldTask)) {
        markFailedTasks(); $('#editor').close(); render();
        $('#notice').textContent = 'Срок задания прошёл. Изменить проваленное задание нельзя.';
        return;
      }
      const arcChoice = $('#arcselect').value;
      const arc = arcChoice === 'auto' ? classify(title) : Number(arcChoice);
      const task =  {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7), title, date: $('#date').value, time: $('#time').value, points: Number($('#points').value), arc, done: false
      };
      if (editingTaskId) {
        const existing = state.tasks.find(item => item.id === editingTaskId);
        if (!existing) return;
        Object.assign(existing, { title: task.title, date: task.date, time: task.time, points: task.points, arc: task.arc });
      } else state.tasks.push(task);
      selectedDate = task.date;
  if (tab === 'calendar') {
    const [year, monthNumber] = task.date.split('-').map(Number);
    month = new Date(year, monthNumber - 1, 1);
  }
      save();
      $('#editor').close();
      render();
      $('#notice').textContent = ''; 
    }
    function initializeApp()  {
  $('#suggestform').addEventListener('submit', saveFriendSuggestion);
  $('#suggesttitle').addEventListener('input', () => $('#suggesttitle').setCustomValidity(''));
  $('#suggestdate').addEventListener('input', () => $('#suggestdate').setCustomValidity(''));
  $('#profileform').addEventListener('submit', saveProfile);
  $('#profilename').addEventListener('input', () => $('#profilename').setCustomValidity(''));
      $('#arcselect').innerHTML = '<option value="auto">Автоматически по тексту</option>' + availableArcIds.map(index => `<option value="${index}">${arcNumbers[index]} · ${arcNames[index]}</option>`).join('');
      document.addEventListener('click', handleClick);
      document.addEventListener('input', event => {
        if (event.target.id === 'tasksearch') { taskQuery = event.target.value; refreshTaskLists(); }
      });
      $('#backupfile').addEventListener('change', importData);
      $('#title').addEventListener('input', updatePrediction);
      $('#arcselect').addEventListener('change', updatePrediction);
      $('#date').addEventListener('change', updateDateLimits);
      $('#time').addEventListener('input', () => $('#time').setCustomValidity(''));
      $('#form').addEventListener('submit', addTask);
      render();
    }


function editTask(id) {
  const task = state.tasks.find(item => item.id === id);
  if (!task || isFailed(task)) return;
  openTaskForm(task.date, String(task.arc));
  editingTaskId = id;
  $('#form h2').textContent = 'ИЗМЕНИТЬ ЗАДАНИЕ';
  $('#form button[type=submit]').textContent = 'Сохранить';
  $('#title').value = task.title;
  $('#time').value = task.time;
  $('#points').value = String(task.points);
  updateDateLimits();
  updatePrediction();
}

function exportData() {
  const backup = { application: 'arcana-calendar', version: 1, exportedAt: new Date().toISOString(), data: state };
  const url = URL.createObjectURL(new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'arcana-calendar-' + iso(new Date()) + '.json';
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function validateBackup(backup) {
  const invalid = () => { throw new Error('Файл не похож на корректную копию «Календаря Аркана».'); };
  if (!backup || backup.application !== 'arcana-calendar' || backup.version !== 1) invalid();
  const data = backup.data;
  if (!data || !Array.isArray(data.tasks) || data.tasks.length > 10000 ||
      !Array.isArray(data.base) || data.base.length !== 22 ||
      !data.base.every(value => Number.isFinite(value) && value >= 0 && value <= 1200)) invalid();
  const text = (value, max) => typeof value === 'string' && value.length <= max;
  const date = value => text(value, 10) && /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(new Date(value + 'T12:00:00').getTime()) && iso(new Date(value + 'T12:00:00')) === value;
  const ids = new Set();
  const tasks = data.tasks.map(task => {
    if (!task || !text(task.id, 80) || !/^[\w-]+$/.test(task.id) || ids.has(task.id) ||
        !text(task.title, 160) || !task.title.trim() || !date(task.date) ||
        !text(task.time, 5) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(task.time) ||
        ![15,30,50].includes(task.points) || !availableArcIds.includes(task.arc) || typeof task.done !== 'boolean') invalid();
    ids.add(task.id);
    const result = { id: task.id, title: task.title.trim(), date: task.date, time: task.time, points: task.points, arc: task.arc, done: task.done };
    if (task.done && task.completedAt !== undefined) {
      if (!text(task.completedAt, 40) || Number.isNaN(Date.parse(task.completedAt))) invalid();
      result.completedAt = task.completedAt;
    }
    if (task.failedAt !== undefined) {
      if (task.done || !text(task.failedAt,40) || Number.isNaN(Date.parse(task.failedAt))) invalid();
      result.failedAt = task.failedAt;
    }
    return result;
  });
  if (!data.profile || !text(data.profile.name, 40) || !data.profile.name.trim() || !text(data.profile.about, 160)) invalid();
  const suggestions = data.friendSuggestions || [];
  if (!Array.isArray(suggestions) || suggestions.length > 10000) invalid();
  const friendSuggestions = suggestions.map(item => {
    if (!item || !text(item.id, 80) || !text(item.title,160) || !item.title.trim() || !date(item.date) || !Number.isInteger(item.friendIndex) || !demoFriends[item.friendIndex]) invalid();
    return { id: item.id, title: item.title, date: item.date, friendIndex: item.friendIndex };
  });
  const base = [...data.base];
  for (const id of excludedArcIds) {
    base[legacyArcReplacement[id]] = Math.min(1200, base[legacyArcReplacement[id]] + base[id]);
    base[id] = 0;
  }
  return { base, tasks, profile: { name: data.profile.name.trim(), about: data.profile.about }, friendSuggestions };
}

async function importData(event) {
  const input = event.target;
  const file = input.files[0];
  if (!file) return;
  try {
    if (file.size > 2 * 1024 * 1024) throw new Error('Выберите файл размером до 2 МБ.');
    const nextState = validateBackup(JSON.parse(await file.text()));
    if (!confirm('Восстановить ' + nextState.tasks.length + ' заданий из копии? Текущие данные будут заменены.')) return;
    localStorage.setItem('arc-day-v3', JSON.stringify(nextState));
    state = nextState;
    storageAvailable = true;
    taskFilter = 'all'; taskQuery = '';
    render();
    $('#notice').textContent = 'Прогресс восстановлен из копии.';
  } catch (error) {
    $('#notice').textContent = error instanceof SyntaxError ? 'Не удалось прочитать JSON. Выберите файл копии приложения.' : error.message;
  } finally { input.value = ''; }
}

initializeApp();


// Проверка сроков сдачи задания
let deadlineRefreshPending = false;
function checkDeadlines() {
  const dayChanged = today !== iso(new Date());
  const changed = markFailedTasks();
  deadlineRefreshPending = deadlineRefreshPending || dayChanged || changed;
  if (deadlineRefreshPending) {
    if ($('#editor').open || $('#profileeditor').open || $('#suggesteditor').open) return;
    deadlineRefreshPending = false;
    render();
  }
}
if (typeof setInterval === 'function') setInterval(checkDeadlines, 15000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) checkDeadlines(); });
