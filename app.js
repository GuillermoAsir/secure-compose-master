/**
 * Secure Compose Master - Motor Principal
 * Gestiona: Tema, Progreso, Validación YAML, Ejercicios y UX
 * Compatible con todos los módulos HTML proporcionados.
 */
const App = {
  state: {
    theme: localStorage.getItem('theme') || 'light',
    xp: parseInt(localStorage.getItem('xp') || '0'),
    completed: JSON.parse(localStorage.getItem('completed') || '[]'),
    currentModule: null,
    activeTab: 'teoria',
    hintUsed: false
  },

  // 📚 Registro completo de ejercicios (7 módulos × 10 ejercicios)
  exercises: {
    mapas_y_listas: [
      { id: 'ex_mapas_01', type: 'code', keywords: ['nombre:', 'version:', '"3.8"', 'puertos:', '-', '80', '443'], hint: 'Usa comillas para la versión y alinea los guiones de puertos.', xp: 100 },
      { id: 'ex_mapas_02', type: 'code', keywords: ['servicio:', '  host:', '  puerto:'], hint: '2 espacios exactos por nivel. No tabuladores.', xp: 100 },
      { id: 'ex_mapas_03', type: 'mcq', question: '¿Qué valor YAML se convierte en booleano false?', options: ['"off"', 'off', 'false_str', 'no_'], answer: 'off', xp: 50 },
      { id: 'ex_mapas_04', type: 'code', keywords: ['alumno:', '  nombre:', '  edad:', '  cursos:', '    -'], hint: 'Mapa dentro de lista, con lista interna anidada.', xp: 100 },
      { id: 'ex_mapas_05', type: 'code', keywords: ['comentario:', '~'], hint: 'Usa ~ o null para valores nulos.', xp: 80 },
      { id: 'ex_mapas_06', type: 'mcq', question: '¿Cuál es la convención oficial de indentación en K8s/Docker?', options: ['1 espacio', '2 espacios', '4 espacios', 'Tabuladores'], answer: '2 espacios', xp: 50 },
      { id: 'ex_mapas_07', type: 'code', keywords: ['- id:', '  activo: true', '- id:', '  activo: false'], hint: 'Lista de mapas. Alinea los guiones y respeta la jerarquía.', xp: 100 },
      { id: 'ex_mapas_08', type: 'code', keywords: ['url:', '"http://'], hint: 'Los : dentro de strings requieren comillas.', xp: 80 },
      { id: 'ex_mapas_09', type: 'mcq', question: '¿Qué carácter inicia un comentario en YAML?', options: ['#', '//', '/*', '--'], answer: '#', xp: 50 },
      { id: 'ex_mapas_10', type: 'code', keywords: ['servidores:', '  - hostname:', '    puertos:', '      -'], hint: 'Combina mapa raíz, lista de servicios, y lista interna.', xp: 120 }
    ],
    detectar_errores: [
      { id: 'ex_err_01', type: 'fix', keywords: ['ports:', '  - "8080:80"'], hint: 'Falta espacio tras ":" y sangría en lista. Usa comillas para puertos.', xp: 100 },
      { id: 'ex_err_02', type: 'fix', keywords: ['restart: true', 'DEBUG: "true"'], hint: 'Booleanos en minúsculas. Strings reservados entre comillas.', xp: 100 },
      { id: 'ex_err_03', type: 'fix', keywords: ['- ./html:/usr/share/nginx/html'], hint: 'Siempre espacio tras "- ". Rutas relativas deben empezar con "./".', xp: 100 },
      { id: 'ex_err_04', type: 'mcq', question: '¿Por qué falla `version: 3.8`?', options: ['Falta comillas', 'YAML lo parsea como float', 'Versión obsoleta', 'A y B'], answer: 'D', xp: 80 },
      { id: 'ex_err_05', type: 'fix', keywords: ['depends_on:', '  db:', '    condition: service_healthy'], hint: 'depends_on es un mapa, no lista. Anida correctamente.', xp: 120 },
      { id: 'ex_err_06', type: 'fix', keywords: ['ports:', '  - "8080:80"'], hint: 'No mezcles sintaxis lista con valores sueltos. Mantén consistencia.', xp: 100 },
      { id: 'ex_err_07', type: 'fix', keywords: ['internal: true'], hint: 'Booleanos en YAML van en minúsculas sin comillas.', xp: 80 },
      { id: 'ex_err_08', type: 'mcq', question: '¿Qué causa `mapping values are not allowed`?', options: ['Falta "-"', 'Tabuladores mezclados', 'Clave sin ":"', 'Indentación inconsistente'], answer: 'B', xp: 80 },
      { id: 'ex_err_09', type: 'fix', keywords: ['APP_ENV: production', 'DEBUG: "true"'], hint: 'No mezcles sintaxis lista (- KEY=V) y mapa (KEY: V) en environment.', xp: 120 },
      { id: 'ex_err_10', type: 'fix', keywords: ['test: ["CMD", "curl"'], hint: 'healthcheck.test requiere formato array explícito en Compose.', xp: 120 }
    ],
    validacion_herramientas: [
      { id: 'ex_val_01', type: 'cmd', keywords: ['docker', 'compose', 'config'], hint: 'Comando de Compose que valida sin arrancar.', xp: 100 },
      { id: 'ex_val_02', type: 'cmd', keywords: ['kubectl', 'apply', 'dry-run=client'], hint: 'Validación local contra esquema K8s.', xp: 100 },
      { id: 'ex_val_03', type: 'mcq', question: '¿Qué herramienta valida SOLO sintaxis YAML pura?', options: ['docker compose config', 'yamllint', 'yq', 'kubectl dry-run'], answer: 'yamllint', xp: 80 },
      { id: 'ex_val_04', type: 'cmd', keywords: ['yq', '-o=json'], hint: 'Convierte YAML a JSON para depurar jerarquía.', xp: 80 },
      { id: 'ex_val_05', type: 'mcq', question: '¿Qué flag valida contra el API server de K8s?', options: ['--dry-run=client', '--dry-run=server', '--validate', '--check'], answer: '--dry-run=server', xp: 100 },
      { id: 'ex_val_06', type: 'cmd', keywords: ['docker', 'compose', 'config', '--quiet'], hint: 'Solo muestra errores, sin output completo.', xp: 90 },
      { id: 'ex_val_07', type: 'mcq', question: '¿Cuál NO es un validador oficial de infraestructura?', options: ['yamllint', 'docker compose config', 'eslint', 'kubectl apply'], answer: 'eslint', xp: 50 },
      { id: 'ex_val_08', type: 'cmd', keywords: ['yamllint'], hint: 'Herramienta de linting puro para YAML.', xp: 70 },
      { id: 'ex_val_09', type: 'mcq', question: '¿Por qué usar --dry-run=client vs server?', options: ['Client es más rápido y no toca el clúster', 'Server es más estricto', 'No hay diferencia', 'Client requiere K8s'], answer: 'A', xp: 100 },
      { id: 'ex_val_10', type: 'cmd', keywords: ['kubectl', 'apply', 'f', 'manifest.yml', 'dry-run'], hint: 'Ruta completa a archivo + validación.', xp: 110 }
    ],
    ciclo_de_vida: [
      { id: 'ex_ciclo_01', type: 'code', keywords: ['restart: unless-stopped', 'healthcheck:', 'test:', 'depends_on:', 'condition: service_healthy', 'init: true'], hint: 'Política segura, healthcheck válido, espera condicional y tini.', xp: 150 },
      { id: 'ex_ciclo_02', type: 'code', keywords: ['start_period:'], hint: 'Margen inicial antes de contar fallos.', xp: 100 },
      { id: 'ex_ciclo_03', type: 'mcq', question: '¿Qué hace `restart: on-failure:5`?', options: ['Reinicia siempre 5 veces', 'Solo si sale != 0, máx 5', 'Espera 5s', 'Nunca reinicia'], answer: 'Solo si sale != 0, máx 5', xp: 80 },
      { id: 'ex_ciclo_04', type: 'code', keywords: ['command: ["node", "server.js"]'], hint: 'Array CMD evita problemas con shell.', xp: 100 },
      { id: 'ex_ciclo_05', type: 'mcq', question: '¿Por qué `depends_on` corto no garantiza conexión?', options: ['Es aleatorio', 'Solo espera arranque, no salud', 'K8s no lo soporta', 'Falta red'], answer: 'Solo espera arranque, no salud', xp: 90 },
      { id: 'ex_ciclo_06', type: 'code', keywords: ['timeout: 5s', 'retries: 3'], hint: 'Límite de espera y fallos consecutivos.', xp: 100 },
      { id: 'ex_ciclo_07', type: 'mcq', question: '¿Qué proceso inyecta `init: true`?', options: ['systemd', 'tini', 'cron', 'supervisord'], answer: 'tini', xp: 70 },
      { id: 'ex_ciclo_08', type: 'code', keywords: ['stop_grace_period: 15s'], hint: 'Tiempo antes de SIGKILL forzado.', xp: 90 },
      { id: 'ex_ciclo_09', type: 'mcq', question: '¿Cuál política respeta tu `stop` manual?', options: ['always', 'unless-stopped', 'no', 'on-failure'], answer: 'unless-stopped', xp: 80 },
      { id: 'ex_ciclo_10', type: 'code', keywords: ['healthcheck:', 'test: ["CMD", "mysqladmin", "ping"'], hint: 'Healthcheck nativo de MySQL.', xp: 120 }
    ],
    servicios_basicos: [
      { id: 'ex_svc_01', type: 'code', keywords: ['mysql:8.0', 'wordpress:6.4', 'restart: unless-stopped', 'ports:', '"8080:80"', 'volumes:', 'db_data:'], hint: 'Stack completo: imágenes fijas, restart, port mapping, volumen raíz.', xp: 200 },
      { id: 'ex_svc_02', type: 'mcq', question: '¿Diferencia entre `ports` y `expose`?', options: ['Ninguna', 'ports mapea al host, expose solo red interna', 'expose es más seguro', 'ports es obsoleto'], answer: 'ports mapea al host, expose solo red interna', xp: 80 },
      { id: 'ex_svc_03', type: 'code', keywords: ['env_file: .env'], hint: 'Carga variables desde archivo externo.', xp: 100 },
      { id: 'ex_svc_04', type: 'mcq', question: '¿Por qué evitar `:latest` en producción?', options: ['Es más lento', 'Impredecible, rompe auditorías', 'No existe', 'Solo funciona en Linux'], answer: 'Impredecible, rompe auditorías', xp: 90 },
      { id: 'ex_svc_05', type: 'code', keywords: ['environment:', '  DEBUG: "false"'], hint: 'Comillas para evitar booleano accidental.', xp: 100 },
      { id: 'ex_svc_06', type: 'code', keywords: ['volumes:', '  - db_data:/var/lib/mysql'], hint: 'Volumen nombrado persistente.', xp: 110 },
      { id: 'ex_svc_07', type: 'mcq', question: '¿Sintaxis correcta para bind mount solo lectura?', options: ['./html:/usr/share:ro', './html:/usr/share:rw', './html:/usr/share:read', './html:/usr/share:lock'], answer: './html:/usr/share:ro', xp: 80 },
      { id: 'ex_svc_08', type: 'code', keywords: ['WORDPRESS_DB_HOST: db:3306'], hint: 'Resolución DNS interna por nombre de servicio.', xp: 100 },
      { id: 'ex_svc_09', type: 'mcq', question: '¿Dónde se declara `db_data:`?', options: ['Bajo services/db', 'A nivel raíz del compose', 'En el Dockerfile', 'En .env'], answer: 'A nivel raíz del compose', xp: 80 },
      { id: 'ex_svc_10', type: 'code', keywords: ['image: node:20-alpine', 'ports:', '"3000:3000"'], hint: 'Imagen ligera + mapeo directo.', xp: 100 }
    ],
    volumenes_redes_seguridad: [
      { id: 'ex_sec_01', type: 'code', keywords: ['read_only: true', 'cap_drop: ["ALL"]', 'tmpfs:', '/tmp', 'internal: true', 'mem_limit: 256m', 'cpus: "0.5"'], hint: 'Hardening completo: RO, drop caps, tmpfs, red aislada, límites.', xp: 150 },
      { id: 'ex_sec_02', type: 'mcq', question: '¿Qué hace `internal: true`?', options: ['Aísla del host', 'Corta salida a Internet', 'Encripta tráfico', 'Requiere auth'], answer: 'Corta salida a Internet', xp: 90 },
      { id: 'ex_sec_03', type: 'code', keywords: ['security_opt: ["no-new-privileges:true"]'], hint: 'Impide escalada de privilegios.', xp: 100 },
      { id: 'ex_sec_04', type: 'mcq', question: '¿Diferencia entre tmpfs y bind mount?', options: ['tmpfs es RAM volátil, bind es host persistente', 'Son iguales', 'tmpfs es más lento', 'bind es solo Linux'], answer: 'tmpfs es RAM volátil, bind es host persistente', xp: 80 },
      { id: 'ex_sec_05', type: 'code', keywords: ['networks:', '  - backend'], hint: 'Conecta servicio a red personalizada.', xp: 90 },
      { id: 'ex_sec_06', type: 'mcq', question: '¿Por qué combinar `read_only` con `tmpfs`?', options: ['Para permitir escritura temporal donde se necesite', 'Para encriptar', 'Para mejorar rendimiento', 'No se pueden combinar'], answer: 'Para permitir escritura temporal donde se necesite', xp: 100 },
      { id: 'ex_sec_07', type: 'code', keywords: ['mem_limit: 512m', 'cpus: "1.0"'], hint: 'Límites estrictos de recursos.', xp: 90 },
      { id: 'ex_sec_08', type: 'mcq', question: '¿Qué riesgo mitiga `cap_drop: ["ALL"]`?', options: ['Fuga de datos', 'Escalada de privilegios Linux', 'DDoS', 'Inyección SQL'], answer: 'Escalada de privilegios Linux', xp: 100 },
      { id: 'ex_sec_09', type: 'code', keywords: ['privileged: false'], hint: 'Nunca true en prod salvo justificación extrema.', xp: 80 },
      { id: 'ex_sec_10', type: 'mcq', question: '¿Dónde persisten los volúmenes nombrados?', options: ['/tmp', '/var/lib/docker/volumes', '/etc/docker', 'RAM'], answer: '/var/lib/docker/volumes', xp: 90 }
    ],
    kubernetes_vs_compose: [
      { id: 'ex_k8s_01', type: 'code', keywords: ['apiVersion: apps/v1', 'kind: Deployment', 'replicas: 2', 'matchLabels:', 'template:', 'kind: Service', 'type: NodePort', 'nodePort: 30080', '---'], hint: 'Multi-documento: Deployment(2 replicas) + Service(NodePort 30080).', xp: 200 },
      { id: 'ex_k8s_02', type: 'mcq', question: '¿Equivalencia de `restart: unless-stopped` en K8s?', options: ['RestartPolicy: Never', 'Implícito en Deployment', 'LivenessProbe', 'InitContainer'], answer: 'Implícito en Deployment', xp: 80 },
      { id: 'ex_k8s_03', type: 'code', keywords: ['kind: ConfigMap', 'data:'], hint: 'Configuración no sensible.', xp: 90 },
      { id: 'ex_k8s_04', type: 'mcq', question: '¿Diferencia principal Compose vs K8s?', options: ['Compose es multi-nodo, K8s mono-nodo', 'Compose mono-nodo, K8s clúster distribuido', 'Son iguales', 'K8s es más lento'], answer: 'Compose mono-nodo, K8s clúster distribuido', xp: 90 },
      { id: 'ex_k8s_05', type: 'code', keywords: ['kind: Secret', 'stringData:'], hint: 'Datos sensibles (codificados en base64 por K8s).', xp: 100 },
      { id: 'ex_k8s_06', type: 'mcq', question: '¿Qué hace `selector.matchLabels`?', options: ['Expone puertos', 'Vincula Service/Deployment con pods por etiquetas', 'Crea volúmenes', 'Define réplicas'], answer: 'Vincula Service/Deployment con pods por etiquetas', xp: 100 },
      { id: 'ex_k8s_07', type: 'code', keywords: ['livenessProbe:', 'readinessProbe:'], hint: 'Sondas de salud K8s.', xp: 120 },
      { id: 'ex_k8s_08', type: 'mcq', question: '¿Por qué usar multi-documento en K8s?', options: ['Para agrupar recursos relacionados en un solo apply', 'Para ahorrar espacio', 'Es obligatorio', 'Para compresión'], answer: 'Para agrupar recursos relacionados en un solo apply', xp: 90 },
      { id: 'ex_k8s_09', type: 'code', keywords: ['kind: PersistentVolumeClaim', 'resources: requests: storage: 1Gi'], hint: 'Solicitud de almacenamiento persistente.', xp: 110 },
      { id: 'ex_k8s_10', type: 'mcq', question: '¿Qué `type` de Service expone al exterior?', options: ['ClusterIP', 'NodePort/LoadBalancer', 'ExternalName', 'Headless'], answer: 'NodePort/LoadBalancer', xp: 100 }
    ]
  },

  init() {
    this.applyTheme(this.state.theme);
    this.updateProgressUI();
    this.setupThemeToggle();
    this.setupTabs();
    this.checkOnboarding();
    this.detectModule();
    this.bindExerciseSystem();
  },

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    const label = document.getElementById('theme-label');
    const toggle = document.getElementById('theme-toggle');
    if (label) label.textContent = theme === 'dark' ? '☀️ Claro' : '🌙 Oscuro';
    if (toggle) toggle.textContent = theme === 'dark' ? '🌙 Oscuro' : '☀️ Claro';
  },

  setupThemeToggle() {
    document.getElementById('theme-toggle')?.addEventListener('click', () => {
      const next = this.state.theme === 'dark' ? 'light' : 'dark';
      this.state.theme = next;
      this.applyTheme(next);
    });
  },

  updateProgressUI() {
    const total = 70;
    const pct = Math.min((this.state.completed.length / total) * 100, 100);
    document.querySelectorAll('.progress-fill').forEach(el => el.style.width = `${pct}%`);
    document.querySelectorAll('#xp-display').forEach(el => el.textContent = `${this.state.xp} XP`);
    document.querySelectorAll('#completed-count').forEach(el => el.textContent = this.state.completed.length);
  },

  addXP(amount, exerciseId) {
    if (!this.state.completed.includes(exerciseId)) {
      this.state.completed.push(exerciseId);
      this.state.xp += amount;
      localStorage.setItem('xp', this.state.xp);
      localStorage.setItem('completed', JSON.stringify(this.state.completed));
      this.updateProgressUI();
      this.showNotification(`+${amount} XP 🏆`, 'success');
    }
  },

  setupTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const panel = document.getElementById(target);
        if (panel) panel.classList.add('active');
      });
    });
  },

  checkOnboarding() {
    if (!localStorage.getItem('onboarded')) {
      const modal = document.getElementById('onboarding');
      if (modal) modal.classList.add('show');
    }
    document.getElementById('btn-close-modal')?.addEventListener('click', () => {
      document.getElementById('onboarding')?.classList.remove('show');
      localStorage.setItem('onboarded', 'true');
    });
  },

  detectModule() {
    const path = window.location.pathname.split('/').pop().replace('.html', '');
    this.state.currentModule = path;
    // Auto-vincula el ejercicio por defecto si existe
    const defaultEx = this.exercises[path]?.[0];
    if (defaultEx && document.getElementById('yaml-editor')) {
      this.setupExerciseUI(defaultEx);
    }
  },

  bindExerciseSystem() {
    // Vinculación automática de botones y editores
    document.getElementById('btn-validate')?.addEventListener('click', () => this.runValidation());
    document.getElementById('btn-hint')?.addEventListener('click', () => this.showHint());
    document.getElementById('btn-clear')?.addEventListener('click', () => {
      const ed = document.getElementById('yaml-editor');
      if (ed) ed.value = '';
    });
    // Permitir Ctrl+Enter para validar
    document.getElementById('yaml-editor')?.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'Enter') this.runValidation();
    });
  },

  setupExerciseUI(ex) {
    const editor = document.getElementById('yaml-editor');
    if (editor && !editor.value) editor.placeholder = `// Ejercicio ${ex.id}\n${ex.hint || ''}`;
  },

  runValidation() {
    const module = this.state.currentModule;
    if (!module || !this.exercises[module]) return;

    const input = document.getElementById('yaml-editor')?.value || '';
    const feedback = document.getElementById('feedback');
    const hintBox = document.getElementById('hint-box');
    
    // Detecta índice activo por pestaña o usa el primero
    const activeTab = document.querySelector('.tab-btn.active')?.dataset.tab || 'teoria';
    const isEditor = activeTab === 'reto' || activeTab === 'editor';
    if (!isEditor) {
      this.showFeedback(feedback, '⚠️ Cambia a la pestaña "Reto" o "Editor" para validar.', 'warning');
      return;
    }

    // Busca ejercicio correspondiente (simplificado al primero si no hay selector)
    const ex = this.exercises[module]?.[0] || this.exercises[module][Math.floor(Math.random() * this.exercises[module].length)];
    if (!ex) return;

    const normalized = this.normalizeYAML(input);
    const checks = this.validate(input, ex);
    
    if (checks.isCorrect) {
      this.showFeedback(feedback, checks.feedback, 'success');
      this.addXP(ex.xp, ex.id);
      if (hintBox) hintBox.classList.remove('show');
    } else {
      this.showFeedback(feedback, checks.feedback, 'error');
    }
  },

  validate(input, exercise) {
    const normalized = this.normalizeYAML(input);
    const structural = this.checkYAMLStructure(normalized);
    
    if (structural.error) return { isCorrect: false, feedback: `❌ Error estructural: ${structural.error}` };

    if (exercise.type === 'cmd') {
      const matches = exercise.keywords.every(k => normalized.includes(k.toLowerCase()));
      return {
        isCorrect: matches,
        feedback: matches ? '✅ Comando correcto. Sintaxis y flags válidos.' : `❌ Revisa: faltan argumentos clave. Pista: ${exercise.hint}`
      };
    }

    if (exercise.type === 'mcq') {
      const sel = document.querySelector('input[name="mcq"]:checked');
      const matches = sel && sel.value === exercise.answer;
      return {
        isCorrect: matches,
        feedback: matches ? '✅ Respuesta correcta.' : `❌ Incorrecto. Revisa la documentación de YAML/K8s.`
      };
    }

    // type: code | fix
    const keywordMatches = exercise.keywords.every(k => normalized.includes(k.toLowerCase()));
    return {
      isCorrect: keywordMatches,
      feedback: keywordMatches ? '✅ ¡Estructura válida! Claves y jerarquía correctas.' : `⚠️ Faltan claves o la indentación es incorrecta. ${exercise.hint}`
    };
  },

  normalizeYAML(str) {
    return str.replace(/\r\n/g, '\n').replace(/\t/g, '  ').replace(/\s+/g, ' ').trim().toLowerCase();
  },

  checkYAMLStructure(normalized) {
    if (/\t/.test(normalized.replace(/  /g, ''))) return { error: 'Se detectaron tabuladores. Usa SOLO 2 espacios.' };
    if (/:\w/.test(normalized)) return { error: 'Falta espacio después de los dos puntos (:).' };
    return { error: null };
  },

  showHint() {
    const module = this.state.currentModule;
    const ex = this.exercises[module]?.[0];
    const box = document.getElementById('hint-box');
    if (box && ex) {
      box.innerHTML = `💡 <strong>Pista:</strong> ${ex.hint}`;
      box.classList.add('show');
    }
  },

  showFeedback(element, message, type) {
    if (!element) return;
    element.className = `feedback show ${type}`;
    element.innerHTML = message;
    // Auto-scroll al feedback
    element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  },

  showNotification(msg, type) {
    // Simple toast overlay
    const toast = document.createElement('div');
    toast.style.cssText = `position:fixed;bottom:20px;right:20px;padding:12px 20px;background:var(--${type==='success'?'success':'error'});color:white;border-radius:8px;z-index:9999;font-weight:600;animation:fadeIn 0.3s;`;
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());