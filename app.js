/**
 * Secure Compose Master - Motor Principal v2.0
 * Compatible con estructura dinámica de pestañas (#reto) y grid de tareas.
 */
const App = {
  state: {
    theme: localStorage.getItem('theme') || 'light',
    xp: parseInt(localStorage.getItem('xp') || '0'),
    // Estructura: { modulo: { indice: 'completed', indice_input: 'yaml...' } }
    progress: JSON.parse(localStorage.getItem('sc_progress') || '{}'),
    currentModule: null,
    activeTaskIndex: null
  },

  // 📚 Base de datos de ejercicios (7 módulos x 10 tareas)
  exercises: {
    mapas_y_listas: [
      { 
        id: 'ex_m_01', 
        title: 'Mapa Básico', 
        type: 'code', 
        instruction: 'Define un servicio llamado "mi-app" con versión "3.8" (string) y expón los puertos 80 y 443.',
        hint: 'Recuerda usar comillas para la versión y alinear los guiones de la lista.', 
        template: 'nombre:\nversion:\nports:\n  - \n  - ', 
        solution: 'nombre: mi-app\nversion: "3.8"\nports:\n  - "80"\n  - "443"', 
        keywords: ['nombre:', 'version:', '"3.8"', 'ports:', '-', '80', '443'], 
        xp: 100 
      },
      { 
        id: 'ex_m_02', 
        title: 'Mapa Anidado', 
        type: 'code', 
        instruction: 'Crea una configuración de servidor con host "192.168.1.10" y puerto 8080. Usa indentación de 2 espacios.',
        hint: 'La clave "host" y "puerto" deben estar sangradas respecto a "servicio".', 
        // Template corregido: usa 'servicio' como padre genérico
        template: 'service:\n  host:\n  port:', 
        // Solución corregida: indentación perfecta y clave singular 'puerto'
        solution: 'service:\n  host: 192.168.1.10\n  port: 8080', 
        // Keywords corregidas: deben coincidir EXACTAMENTE con la solución
        keywords: ['service:', '  host:', '  port:'], 
        xp: 100 
      },
      { 
        id: 'ex_m_03', 
        title: 'Booleanos Accidentales', 
        type: 'mcq', 
        question: '¿Cuál de estos valores YAML 1.1 se interpretará automáticamente como booleano FALSE?', 
        options: ['"off"', 'off', 'false_str', 'no_'], 
        answer: 'off', 
        hint: 'YAML convierte palabras como yes/no/on/off en booleanos si no llevan comillas.', 
        solution: 'off', 
        keywords: [], 
        xp: 50 
      },
      { 
        id: 'ex_m_04', 
        title: 'Lista de Mapas', 
        type: 'code', 
        instruction: 'Define una lista de alumnos. El primero es Ana (22 años) con cursos Docker y Kubernetes.',
        hint: 'Cada alumno empieza con "- ". Los cursos son una lista interna anidada.', 
        template: 'alumnos:\n  - nombre:\n    edad:\n    cursos:\n      - \n      - ', 
        solution: 'alumnos:\n  - nombre: Ana\n    edad: 22\n    cursos:\n      - Docker\n      - Kubernetes', 
        keywords: ['alumnos:', '- nombre:', 'edad:', 'cursos:', '  -'], 
        xp: 100 
      },
      { 
        id: 'ex_m_05', 
        title: 'Valores Nulos', 
        type: 'code', 
        instruction: 'Define la clave "comentario" con un valor nulo usando la sintaxis de tilde (~).',
        hint: 'El símbolo ~ representa null en YAML.', 
        template: 'comentario:', 
        solution: 'comentario: ~', 
        keywords: ['comentario:', '~'], 
        xp: 80 
      },
      { 
        id: 'ex_m_06', 
        title: 'Estándar de Indentación', 
        type: 'mcq', 
        question: '¿Cuántos espacios por nivel de indentación recomienda oficialmente Kubernetes y Docker Compose?', 
        options: ['1 espacio', '2 espacios', '4 espacios', 'Tabuladores'], 
        answer: '2 espacios', 
        hint: 'Es la convención estándar de la CNCF.', 
        solution: '2 espacios', 
        keywords: [], 
        xp: 50 
      },
      { 
        id: 'ex_m_07', 
        title: 'Lista de Objetos', 
        type: 'code', 
        instruction: 'Crea una lista de dos dispositivos: ID 1 (activo: true) e ID 2 (activo: false).',
        hint: 'Alinea los guiones verticales. "activo" es un booleano real (sin comillas).', 
        template: '- id:\n  activo:\n- id:\n  activo:', 
        solution: '- id: 1\n  activo: true\n- id: 2\n  activo: false', 
        keywords: ['- id:', 'activo: true', '- id:', 'activo: false'], 
        xp: 100 
      },
      { 
        id: 'ex_m_08', 
        title: 'Strings Especiales', 
        type: 'code', 
        instruction: 'Define la URL "http://ejemplo.com:8080". Recuerda que los dos puntos dentro del string requieren comillas.',
        hint: 'Sin comillas, YAML creerá que "8080" es un valor separado o dará error.', 
        template: 'url:', 
        solution: 'url: "http://ejemplo.com:8080"', 
        keywords: ['url:', '"http://'], 
        xp: 80 
      },
      { 
        id: 'ex_m_09', 
        title: 'Comentarios', 
        type: 'mcq', 
        question: '¿Qué carácter se utiliza para iniciar un comentario de línea en YAML?', 
        options: ['#', '//', '/*', '--'], 
        answer: '#', 
        hint: 'Similar a Python o Bash.', 
        solution: '#', 
        keywords: [], 
        xp: 50 
      },
      { 
        id: 'ex_m_10', 
        title: 'Estructura Compleja', 
        type: 'code', 
        instruction: 'Define una lista de servidores. El primero es "web01" con puertos 80 y 443.',
        hint: 'Combina mapa raíz (servidores), lista (- hostname) y lista interna (puertos).', 
        template: 'servidores:\n  - hostname:\n    ports:\n      - \n      - ', 
        solution: 'servidores:\n  - hostname: web01\n    ports:\n      - 80\n      - 443', 
        keywords: ['servidores:', '- hostname:', 'ports:', '  -'], 
        xp: 120 
      }
    ],
    detectar_errores: [
      { 
        id: 'ex_err_01', 
        title: 'Puertos Mal Indentados', 
        type: 'error_detect',
        level: 1,
        instruction: 'Identifica el error de sintaxis en este YAML:',
        broken_yaml: `services:
      web:
        image: nginx
        ports:
        - 8080:80`,
        question: '¿Cuál es el error principal?',
        options: [
          'Falta comillas en el puerto',
          'La lista de puertos no está correctamente indentada', // ✅
          'La clave "ports" no lleva dos puntos',
          'El servicio "web" no tiene imagen'
        ],
        answer: 'La lista de puertos no está correctamente indentada',
        hint: 'Los elementos de lista ("-") deben estar sangrados 2 espacios más que su clave padre.',
        solution: `services:
      web:
        image: nginx
        ports:
          - "8080:80"`,
        xp: 80 
      },
      { 
        id: 'ex_err_02', 
        title: 'Booleanos Accidentales', 
        type: 'error_detect',
        level: 1,
        instruction: 'Este YAML tiene valores que YAML interpretará como booleanos sin querer:',
        broken_yaml: `services:
      app:
        image: node:20
        restart: True
        environment:
          DEBUG: yes
          PROD: off`,
        question: '¿Qué problema tienen los valores "True", "yes" y "off"?',
        options: [
          'Son palabras reservadas de Docker y no se pueden usar',
          'YAML los parsea como booleanos, no como strings literales', // ✅
          'Deben ir siempre en mayúsculas para funcionar',
          'No hay problema, YAML los acepta tal cual'
        ],
        answer: 'YAML los parsea como booleanos, no como strings literales',
        hint: 'Si quieres que "yes" sea texto, usa comillas: "yes". Los booleanos reales van en minúscula: true/false.',
        solution: `services:
      app:
        image: node:20
        restart: true
        environment:
          DEBUG: "yes"
          PROD: "off"`,
        xp: 90 
      },
      { 
        id: 'ex_err_03', 
        title: 'Volúmenes: El Espacio Perdido', 
        type: 'error_detect',
        level: 2,
        instruction: 'La sintaxis de volúmenes tiene un error sutil pero crítico:',
        broken_yaml: `services:
      web:
        image: nginx
        volumes:
         -./html:/usr/share/nginx/html
         -db_data:/var/lib/mysql`,
        question: '¿Qué error de sintaxis impide que este YAML funcione?',
        options: [
          'Las rutas relativas no pueden empezar por "./"',
          'Falta un espacio después del guion "-" en cada elemento de la lista', // ✅
          'Los volúmenes con nombre no pueden usarse en bind mounts',
          'La ruta de destino debe ir antes que la del host'
        ],
        answer: 'Falta un espacio después del guion "-" en cada elemento de la lista',
        hint: 'Correcto: "- ./ruta:destino". Incorrecto: "-./ruta:destino". El espacio tras el guion es obligatorio.',
        solution: `services:
      web:
        image: nginx
        volumes:
          - ./html:/usr/share/nginx/html
          - db_data:/var/lib/mysql`,
        xp: 100 
      },
      { 
        id: 'ex_err_04', 
        title: 'Depends_on: Lista vs Mapa', 
        type: 'error_detect',
        level: 2,
        instruction: 'Se quiere usar "condition: service_healthy" pero la estructura es incorrecta:',
        broken_yaml: `services:
      api:
        image: node:20
        depends_on:
          - db
            condition: service_healthy`,
        question: '¿Por qué esta estructura de "depends_on" es inválida?',
        options: [
          'La clave "condition" solo funciona con Redis, no con bases de datos',
          '"depends_on" con condiciones debe ser un mapa anidado, no una lista', // ✅
          'Falta la clave "healthcheck" en el servicio "api"',
          'El guion "-" no puede usarse junto con claves anidadas'
        ],
        answer: '"depends_on" con condiciones debe ser un mapa anidado, no una lista',
        hint: 'Para usar "condition", la sintaxis es: depends_on: { db: { condition: service_healthy } }',
        solution: `services:
      api:
        image: node:20
        depends_on:
          db:
            condition: service_healthy`,
        xp: 110 
      },
      { 
        id: 'ex_err_05', 
        title: 'Environment: Sintaxis Mixta Prohibida', 
        type: 'error_detect',
        level: 2,
        instruction: 'No se pueden mezclar formatos en la misma clave "environment":',
        broken_yaml: `services:
      app:
        image: python:3.12
        environment:
          - APP_ENV=production
          DEBUG: "true"
          - API_KEY=${API_KEY}`,
        question: '¿Qué regla de YAML se está violando en "environment"?',
        options: [
          'No se pueden usar variables de entorno con ${...} en Docker Compose',
          'No se puede mezclar sintaxis de lista (- KEY=VAL) con sintaxis de mapa (KEY: VAL)', // ✅
          'Las claves con guion bajo no son válidas en YAML',
          'El valor "true" debe ir siempre sin comillas'
        ],
        answer: 'No se puede mezclar sintaxis de lista (- KEY=VAL) con sintaxis de mapa (KEY: VAL)',
        hint: 'Elige un formato: o todo lista (- KEY=VAL) o todo mapa (KEY: VAL). No los mezcles.',
        solution: `services:
      app:
        image: python:3.12
        environment:
          APP_ENV: production
          DEBUG: "true"
          API_KEY: ${API_KEY}`,
        xp: 100 
      },
      { 
        id: 'ex_err_06', 
        title: 'El Enemigo Invisible: Tabuladores', 
        type: 'error_detect',
        level: 1,
        instruction: 'Este YAML parece perfecto... pero tiene un carácter prohibido:',
        broken_yaml: `services:
    \tweb:
    \t\timage: nginx
    \t\tports:
    \t\t\t- "8080:80"`,
        question: '¿Qué carácter invisible está causando el error de parseo?',
        options: [
          'Caracteres Unicode no ASCII en los nombres de clave',
          'Tabuladores (\\t) en lugar de espacios para la indentación', // ✅
          'Saltos de línea estilo Windows (\\r\\n) en lugar de Unix (\\n)',
          'Espacios finales al final de cada línea'
        ],
        answer: 'Tabuladores (\\t) en lugar de espacios para la indentación',
        hint: 'YAML prohíbe explícitamente los tabuladores. Configura tu editor para usar 2 espacios.',
        solution: `services:
      web:
        image: nginx
        ports:
          - "8080:80"`,
        xp: 80 
      },
      { 
        id: 'ex_err_07', 
        title: 'Version: ¿String o Número?', 
        type: 'error_detect',
        level: 1,
        instruction: 'En Compose moderno "version" se omite, pero si se usa debe ser string:',
        broken_yaml: `version: 3.8
    services:
      web:
        image: nginx`,
        question: '¿Por qué "version: 3.8" sin comillas puede causar problemas?',
        options: [
          'YAML lo parsea como número float 3.8, no como la cadena "3.8"', // ✅
          'La versión 3.8 está obsoleta y Docker la rechaza',
          'Las versiones deben ser enteros: 3, 4, 5...',
          'No hay problema, 3.8 es válido tal cual'
        ],
        answer: 'YAML lo parsea como número float 3.8, no como la cadena "3.8"',
        hint: 'Si usas "version", ponla entre comillas: "3.8". En Compose v2+ mejor omitirla totalmente.',
        solution: `# En Compose moderno se omite "version"
    services:
      web:
        image: nginx`,
        xp: 70 
      },
      { 
        id: 'ex_err_08', 
        title: 'Healthcheck: El Array Olvidado', 
        type: 'error_detect',
        level: 3,
        instruction: 'El comando del healthcheck debe ser un array explícito en Docker Compose:',
        broken_yaml: `services:
      web:
        image: nginx
        healthcheck:
          test: curl -f http://localhost/
          interval: 30s`,
        question: '¿Qué formato debe tener el valor de "test" en un healthcheck?',
        options: [
          'Debe ser un string simple con el comando completo',
          'Debe ser un array JSON explícito: ["CMD", "curl", "-f", "url"]', // ✅
          'Debe referenciar un script externo con "script: /ruta/check.sh"',
          'Debe usar la sintaxis de shell: test: "bash -c \'curl -f...\'"'
        ],
        answer: 'Debe ser un array JSON explícito: ["CMD", "curl", "-f", "url"]',
        hint: 'Docker Compose requiere: test: ["CMD", "ejecutable", "arg1", "arg2"] o test: ["CMD-SHELL", "comando"]',
        solution: `services:
      web:
        image: nginx
        healthcheck:
          test: ["CMD", "curl", "-f", "http://localhost/"]
          interval: 30s`,
        xp: 120 
      },
      { 
        id: 'ex_err_09', 
        title: 'Redes: Booleano en Mayúscula', 
        type: 'error_detect',
        level: 2,
        instruction: 'La configuración de red tiene un valor booleano mal escrito:',
        broken_yaml: `services:
      api:
        image: node:20
        networks:
          - internal_net
    
    networks:
      internal_net:
        driver: bridge
        internal: True`,
        question: '¿Qué valor booleano está mal escrito en la configuración de red?',
        options: [
          'driver: bridge debe ir en minúsculas: "bridge"',
          'internal: True debe ser internal: true (booleano en minúscula)', // ✅
          'El nombre de la red no puede tener guion bajo',
          'La clave "internal" no existe en Docker Compose'
        ],
        answer: 'internal: True debe ser internal: true (booleano en minúscula)',
        hint: 'En YAML, los booleanos reales van en minúscula: true/false. "True" con mayúscula puede interpretarse como string.',
        solution: `services:
      api:
        image: node:20
        networks:
          - internal_net
    
    networks:
      internal_net:
        driver: bridge
        internal: true`,
        xp: 90 
      },
      { 
        id: 'ex_err_10', 
        title: 'Desafío Final: 5 Errores en 1', 
        type: 'error_detect',
        level: 3,
        instruction: 'Este YAML tiene múltiples errores. Identifica el MÁS CRÍTICO que impide el parseo:',
        broken_yaml: `services:
    web:
      image:nginx:latest
      ports:
      -8080:80
      environment:
        DEBUG:yes
      restart:Always`,
        question: '¿Cuál es el error que primero rompería el parseo de YAML?',
        options: [
          'La falta de espacio tras ":" en "image:nginx" y "DEBUG:yes"', // ✅
          'Usar la etiqueta :latest en producción',
          'El valor "Always" en restart debería ser "unless-stopped"',
          'Falta declarar el volumen db_data al final del archivo'
        ],
        answer: 'La falta de espacio tras ":" en "image:nginx" y "DEBUG:yes"',
        hint: 'En YAML, SIEMPRE debe haber un espacio después de los dos puntos: "clave: valor". Sin espacio, es error de sintaxis.',
        solution: `services:
      web:
        image: nginx:latest
        ports:
          - "8080:80"
        environment:
          DEBUG: "yes"
        restart: unless-stopped`,
        xp: 150 
      }
    ]
    ],
    validacion_herramientas: [
      { 
        id: 'ex_val_01', 
        title: 'Validar Compose', 
        type: 'cmd', 
        instruction: 'Escribe el comando de Docker Compose que valida la sintaxis y estructura del archivo sin llegar a arrancar los contenedores.',
        hint: 'Usa "docker compose config". Si quieres ver solo errores, añade "--quiet".', 
        template: '', 
        solution: 'docker compose config', 
        keywords: ['docker', 'compose', 'config'], 
        xp: 100 
      },
      { 
        id: 'ex_val_02', 
        title: 'Dry-run K8s Local', 
        type: 'cmd', 
        instruction: 'Escribe el comando para validar un manifiesto Kubernetes localmente contra el esquema API, sin contactar con el clúster.',
        hint: 'Usa kubectl apply con la bandera --dry-run=client.', 
        template: '', 
        solution: 'kubectl apply -f manifest.yml --dry-run=client', 
        keywords: ['kubectl', 'apply', '--dry-run=client'], 
        xp: 100 
      },
      { 
        id: 'ex_val_03', 
        title: 'Linting Puro', 
        type: 'mcq', 
        question: '¿Qué herramienta se utiliza exclusivamente para validar la sintaxis YAML pura (indentación, espacios, tabs)?', 
        options: ['docker compose config', 'yamllint', 'yq', 'kubectl dry-run'], 
        answer: 'yamllint', 
        hint: 'Es la herramienta estándar de linting para YAML, independiente de Docker o K8s.', 
        solution: 'yamllint', 
        keywords: [], 
        xp: 80 
      },
      { 
        id: 'ex_val_04', 
        title: 'Depurar con JSON', 
        type: 'cmd', 
        instruction: 'Escribe el comando usando "yq" para convertir un archivo YAML a formato JSON y así visualizar mejor su estructura jerárquica.',
        hint: 'La sintaxis es: yq -o=json archivo.yml', 
        template: '', 
        solution: 'yq -o=json archivo.yml', 
        keywords: ['yq', '-o=json'], 
        xp: 80 
      },
      { 
        id: 'ex_val_05', 
        title: 'Validación Remota', 
        type: 'mcq', 
        question: '¿Qué flag de "kubectl apply" envía el manifiesto al API Server para validarlo contra el estado real del clúster?', 
        options: ['--dry-run=client', '--dry-run=server', '--validate', '--check'], 
        answer: '--dry-run=server', 
        hint: '"Server" implica contacto con el clúster; "Client" es puramente local.', 
        solution: '--dry-run=server', 
        keywords: [], 
        xp: 100 
      },
      { 
        id: 'ex_val_06', 
        title: 'Modo Silencioso', 
        type: 'cmd', 
        instruction: 'Escribe el comando de Docker Compose que valida el archivo pero no muestra ninguna salida si todo es correcto (solo errores).',
        hint: 'Añade la bandera "--quiet" al comando de config.', 
        template: '', 
        solution: 'docker compose config --quiet', 
        keywords: ['docker', 'compose', 'config', '--quiet'], 
        xp: 90 
      },
      { 
        id: 'ex_val_07', 
        title: 'Herramientas Oficiales', 
        type: 'mcq', 
        question: '¿Cuál de las siguientes NO es una herramienta de validación de infraestructura YAML/Docker/K8s?', 
        options: ['yamllint', 'docker compose config', 'eslint', 'kubectl apply'], 
        answer: 'eslint', 
        hint: 'ESLint es un linter para código JavaScript/TypeScript, no para YAML.', 
        solution: 'eslint', 
        keywords: [], 
        xp: 50 
      },
      { 
        id: 'ex_val_08', 
        title: 'YAMLLint Básico', 
        type: 'cmd', 
        instruction: 'Escribe el comando básico para validar la sintaxis de un archivo llamado "archivo.yml" usando yamllint.',
        hint: 'Simplemente: yamllint nombre_del_archivo', 
        template: '', 
        solution: 'yamllint archivo.yml', 
        keywords: ['yamllint'], 
        xp: 70 
      },
      { 
        id: 'ex_val_09', 
        title: 'Client vs Server', 
        type: 'mcq', 
        question: '¿Cuál es la principal ventaja de usar "--dry-run=client" frente a "--dry-run=server"?', 
        options: ['Client es más rápido y no requiere conexión al clúster', 'Server es más estricto', 'No hay diferencia', 'Client requiere acceso admin'], 
        answer: 'Client es más rápido y no requiere conexión al clúster', 
        hint: 'Client valida contra el esquema local descargado, sin latencia de red.', 
        solution: 'Client es más rápido y no requiere conexión al clúster', 
        keywords: [], 
        xp: 100 
      },
      { 
        id: 'ex_val_10', 
        title: 'Apply Completo', 
        type: 'cmd', 
        instruction: 'Escribe el comando completo para aplicar un archivo "manifest.yml" en modo dry-run cliente.',
        hint: 'Combina kubectl apply, -f y --dry-run=client.', 
        template: '', 
        solution: 'kubectl apply -f manifest.yml --dry-run=client', 
        keywords: ['kubectl', 'apply', '-f', 'manifest.yml', '--dry-run=client'], 
        xp: 110 
      }
    ],
    ciclo_de_vida: [
      { 
        id: 'ex_ciclo_01', 
        title: 'Arranque Seguro', 
        type: 'code', 
        instruction: 'Configura el servicio "app" con reinicio "unless-stopped", un healthcheck contra "/health", dependencia condicional a "db" y init activado.',
        hint: 'Usa restart, healthcheck, depends_on (con condition) e init.', 
        template: 'services:\n  app:\n    image: node:20-alpine\n    restart:\n    init:\n    depends_on:\n      db:\n        condition:\n    healthcheck:\n      test:\n      interval:', 
        solution: 'services:\n  app:\n    image: node:20-alpine\n    restart: unless-stopped\n    init: true\n    depends_on:\n      db:\n        condition: service_healthy\n    healthcheck:\n      test: ["CMD", "curl", "-f", "http://localhost/health"]\n      interval: 30s', 
        keywords: ['restart: unless-stopped', 'init: true', 'depends_on:', 'condition: service_healthy', 'healthcheck:', 'test:'], 
        xp: 150 
      },
      { 
        id: 'ex_ciclo_02', 
        title: 'Periodo de Gracia', 
        type: 'code', 
        instruction: 'Añade un start_period de 20s al healthcheck para evitar fallos durante el arranque lento de una Java App.',
        hint: 'Clave start_period dentro de healthcheck.', 
        template: 'healthcheck:\n  test: ["CMD", "java", "-jar", "app.jar"]\n  interval: 10s\n  start_period:', 
        solution: 'healthcheck:\n  test: ["CMD", "java", "-jar", "app.jar"]\n  interval: 10s\n  start_period: 20s', 
        keywords: ['start_period: 20s'], 
        xp: 100 
      },
      { 
        id: 'ex_ciclo_03', 
        title: 'Política On-Failure', 
        type: 'mcq', 
        question: '¿Qué comportamiento define "restart: on-failure:3"?', 
        options: ['Reinicia siempre 3 veces', 'Solo si exit code != 0, máx 3 intentos', 'Espera 3 segundos', 'Nunca reinicia'], 
        answer: 'Solo si exit code != 0, máx 3 intentos', 
        hint: 'On-failure solo actúa ante errores, no paradas manuales.', 
        solution: 'Solo si exit code != 0, máx 3 intentos', 
        keywords: [], 
        xp: 80 
      },
      { 
        id: 'ex_ciclo_04', 
        title: 'Command Array', 
        type: 'code', 
        instruction: 'Sobrescribe el CMD del contenedor para ejecutar "python server.py" usando sintaxis de array (exec form).',
        hint: 'command: ["ejecutable", "arg1", "arg2"]', 
        template: 'command:', 
        solution: 'command: ["python", "server.py"]', 
        keywords: ['command: ["python", "server.py"]'], 
        xp: 100 
      },
      { 
        id: 'ex_ciclo_05', 
        title: 'Depends_on Corto', 
        type: 'mcq', 
        question: '¿Qué garantiza "depends_on: - db" en su forma corta?', 
        options: ['Que db está lista para recibir conexiones', 'Que db arranca antes que el servicio actual', 'Que db tiene salud óptima', 'Nada, es obsoleto'], 
        answer: 'Que db arranca antes que el servicio actual', 
        hint: 'La forma corta solo ordena el inicio, no espera salud.', 
        solution: 'Que db arranca antes que el servicio actual', 
        keywords: [], 
        xp: 90 
      },
      { 
        id: 'ex_ciclo_06', 
        title: 'Timeout y Retries', 
        type: 'code', 
        instruction: 'Define un healthcheck con timeout de 5s y 3 reintentos antes de marcar como unhealthy.',
        hint: 'Claves timeout y retries dentro de healthcheck.', 
        template: 'healthcheck:\n  test: ["CMD", "ping", "-c", "1", "localhost"]\n  timeout:\n  retries:', 
        solution: 'healthcheck:\n  test: ["CMD", "ping", "-c", "1", "localhost"]\n  timeout: 5s\n  retries: 3', 
        keywords: ['timeout: 5s', 'retries: 3'], 
        xp: 100 
      },
      { 
        id: 'ex_ciclo_07', 
        title: 'Proceso Init', 
        type: 'mcq', 
        question: '¿Qué proceso inyecta Docker cuando usas "init: true"?', 
        options: ['systemd', 'tini', 'bash', 'cron'], 
        answer: 'tini', 
        hint: 'Es un init ligero para reapar zombies y señales.', 
        solution: 'tini', 
        keywords: [], 
        xp: 70 
      },
      { 
        id: 'ex_ciclo_08', 
        title: 'Grace Period', 
        type: 'code', 
        instruction: 'Establece un periodo de gracia de 15s para que el contenedor termine limpiamente antes de ser matado.',
        hint: 'Clave stop_grace_period.', 
        template: 'stop_grace_period:', 
        solution: 'stop_grace_period: 15s', 
        keywords: ['stop_grace_period: 15s'], 
        xp: 90 
      },
      { 
        id: 'ex_ciclo_09', 
        title: 'Unless-Stopped', 
        type: 'mcq', 
        question: '¿Cuál es la diferencia clave entre "always" y "unless-stopped"?', 
        options: ['Always es más rápido', 'Unless-stopped respeta si tú lo paraste manualmente', 'Always no funciona en Linux', 'Son idénticos'], 
        answer: 'Unless-stopped respeta si tú lo paraste manualmente', 
        hint: 'Si haces docker stop, unless-stopped no lo levanta al reiniciar el demonio.', 
        solution: 'Unless-stopped respeta si tú lo paraste manualmente', 
        keywords: [], 
        xp: 80 
      },
      { 
        id: 'ex_ciclo_10', 
        title: 'Healthcheck MySQL', 
        type: 'code', 
        instruction: 'Escribe un healthcheck nativo para MySQL usando mysqladmin ping.',
        hint: 'test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]', 
        template: 'healthcheck:\n  test:', 
        solution: 'healthcheck:\n  test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]', 
        keywords: ['test: ["CMD", "mysqladmin", "ping"'], 
        xp: 120 
      }
    ],
    servicios_basicos: [
      { 
        id: 'ex_svc_01', 
        title: 'Stack WP+DB', 
        type: 'code', 
        instruction: 'Define un servicio "db" con imagen mysql:8.0 y un servicio "wp" con wordpress:6.4. Expón el puerto 8080 del host al 80 del contenedor en WP, usa restart unless-stopped y declara el volumen db_data.',
        hint: 'Recuerda declarar volumes: db_data: al final del archivo, fuera de services.', 
        template: 'services:\n  db:\n    image:\n  wp:\n    image:\n    ports:\n    restart:\nvolumes:\n  ', 
        solution: 'services:\n  db:\n    image: mysql:8.0\n  wp:\n    image: wordpress:6.4\n    ports:\n      - "8080:80"\n    restart: unless-stopped\nvolumes:\n  db_data:', 
        keywords: ['mysql:8.0', 'wordpress:6.4', 'restart: unless-stopped', 'ports:', '"8080:80"', 'volumes:', 'db_data:'], 
        xp: 200 
      },
      { 
        id: 'ex_svc_02', 
        title: 'Ports vs Expose', 
        type: 'mcq', 
        question: '¿Cuál es la diferencia fundamental entre "ports" y "expose" en Docker Compose?', 
        options: ['Ninguna, son sinónimos', 'ports mapea al host, expose solo red interna', 'expose es más seguro', 'ports es obsoleto'], 
        answer: 'ports mapea al host, expose solo red interna', 
        hint: 'Expose no publica el puerto en la máquina anfitriona, solo lo hace visible para otros servicios.', 
        solution: 'ports mapea al host, expose solo red interna', 
        keywords: [], 
        xp: 80 
      },
      { 
        id: 'ex_svc_03', 
        title: 'Env File', 
        type: 'code', 
        instruction: 'Configura el servicio para cargar variables de entorno desde un archivo externo llamado ".env".',
        hint: 'Usa la clave env_file.', 
        template: 'env_file:', 
        solution: 'env_file: .env', 
        keywords: ['env_file: .env'], 
        xp: 100 
      },
      { 
        id: 'ex_svc_04', 
        title: 'Latest Tag', 
        type: 'mcq', 
        question: '¿Por qué se considera mala práctica usar la etiqueta ":latest" en entornos de producción?', 
        options: ['Es más lenta de descargar', 'Es impredecible y rompe auditorías de seguridad', 'No existe esa etiqueta', 'Solo funciona en Linux'], 
        answer: 'Es impredecible y rompe auditorías de seguridad', 
        hint: 'No sabes qué versión exacta estás ejecutando ni puedes reproducir el entorno.', 
        solution: 'Es impredecible y rompe auditorías de seguridad', 
        keywords: [], 
        xp: 90 
      },
      { 
        id: 'ex_svc_05', 
        title: 'Env Booleano', 
        type: 'code', 
        instruction: 'Define la variable de entorno DEBUG con valor "false". Usa comillas para evitar que YAML lo interprete como booleano.',
        hint: 'Sin comillas, false es un tipo de dato, no un string.', 
        template: 'environment:\n  DEBUG:', 
        solution: 'environment:\n  DEBUG: "false"', 
        keywords: ['environment:', '  DEBUG: "false"'], 
        xp: 100 
      },
      { 
        id: 'ex_svc_06', 
        title: 'Volumen Nombrado', 
        type: 'code', 
        instruction: 'Monta un volumen nombrado llamado "db_data" en la ruta /var/lib/mysql dentro del contenedor.',
        hint: 'Sintaxis: nombre_volumen:ruta_destino.', 
        template: 'volumes:\n  - ', 
        solution: 'volumes:\n  - db_data:/var/lib/mysql', 
        keywords: ['volumes:', '  - db_data:/var/lib/mysql'], 
        xp: 110 
      },
      { 
        id: 'ex_svc_07', 
        title: 'Bind Mount RO', 
        type: 'mcq', 
        question: '¿Cuál es la sintaxis correcta para montar un directorio local "./html" en modo solo lectura?', 
        options: ['./html:/usr/share:ro', './html:/usr/share:rw', './html:/usr/share:read', './html:/usr/share:lock'], 
        answer: './html:/usr/share:ro', 
        hint: ':ro significa Read-Only al final de la ruta.', 
        solution: './html:/usr/share:ro', 
        keywords: [], 
        xp: 80 
      },
      { 
        id: 'ex_svc_08', 
        title: 'DNS Interno', 
        type: 'code', 
        instruction: 'Configura la variable WORDPRESS_DB_HOST para que apunte al servicio "db" por su nombre DNS interno en el puerto 3306.',
        hint: 'Docker resuelve automáticamente los nombres de servicio como hostnames.', 
        template: 'WORDPRESS_DB_HOST:', 
        solution: 'WORDPRESS_DB_HOST: db:3306', 
        keywords: ['WORDPRESS_DB_HOST: db:3306'], 
        xp: 100 
      },
      { 
        id: 'ex_svc_09', 
        title: 'Root Volumes', 
        type: 'mcq', 
        question: '¿En qué sección del docker-compose.yml se declaran los volúmenes nombrados (como db_data)?', 
        options: ['Bajo services/db', 'A nivel raíz del compose (fuera de services)', 'En el Dockerfile', 'En el archivo .env'], 
        answer: 'A nivel raíz del compose (fuera de services)', 
        hint: 'Es una sección de primer nivel, igual que networks o secrets.', 
        solution: 'A nivel raíz del compose (fuera de services)', 
        keywords: [], 
        xp: 80 
      },
      { 
        id: 'ex_svc_10', 
        title: 'Node Alpine', 
        type: 'code', 
        instruction: 'Define un servicio usando la imagen ligera node:20-alpine y expón el puerto 3000 del host al 3000 del contenedor.',
        hint: 'Usa tags específicos como -alpine para reducir tamaño.', 
        template: 'image:\nports:\n  - ', 
        solution: 'image: node:20-alpine\nports:\n  - "3000:3000"', 
        keywords: ['image: node:20-alpine', 'ports:', '"3000:3000"'], 
        xp: 100 
      }
    ],
    volumenes_redes_seguridad: [
      { 
        id: 'ex_sec_01', 
        title: 'Hardening Total', 
        type: 'code', 
        instruction: 'Aplica endurecimiento completo al servicio "app": sistema de ficheros solo lectura, elimina todas las capacidades Linux, monta /tmp en RAM, conecta a red interna aislada y limita memoria a 256m y CPU a 0.5.',
        hint: 'Usa read_only: true, cap_drop: ["ALL"], tmpfs: - /tmp, networks: - interna, mem_limit: 256m, cpus: "0.5". Define la red como internal: true.', 
        template: 'services:\n  app:\n    image: node:20-alpine\n    read_only:\n    cap_drop:\n    tmpfs:\n      - \n    networks:\n      - interna\n    mem_limit:\n    cpus:\nnetworks:\n  interna:\n    driver: bridge\n    internal:', 
        solution: 'services:\n  app:\n    image: node:20-alpine\n    read_only: true\n    cap_drop: ["ALL"]\n    tmpfs:\n      - /tmp\n    networks:\n      - interna\n    mem_limit: 256m\n    cpus: "0.5"\nnetworks:\n  interna:\n    driver: bridge\n    internal: true', 
        keywords: ['read_only: true', 'cap_drop: ["ALL"]', 'tmpfs:', '/tmp', 'internal: true', 'mem_limit: 256m', 'cpus: "0.5"'], 
        xp: 150 
      },
      { 
        id: 'ex_sec_02', 
        title: 'Red Interna', 
        type: 'mcq', 
        question: '¿Qué efecto tiene establecer "internal: true" en una red de Docker Compose?', 
        options: ['Aísla completamente del host', 'Corta la salida a Internet desde los contenedores', 'Encripta todo el tráfico', 'Requiere autenticación para conectar'], 
        answer: 'Corta la salida a Internet desde los contenedores', 
        hint: 'Los contenedores pueden comunicarse entre sí, pero no tienen gateway hacia fuera.', 
        solution: 'Corta la salida a Internet desde los contenedores', 
        keywords: [], 
        xp: 90 
      },
      { 
        id: 'ex_sec_03', 
        title: 'No New Privileges', 
        type: 'code', 
        instruction: 'Configura la opción de seguridad para impedir que el proceso dentro del contenedor gane nuevos privilegios mediante setuid o similar.',
        hint: 'Usa security_opt con no-new-privileges:true.', 
        template: 'security_opt:', 
        solution: 'security_opt: ["no-new-privileges:true"]', 
        keywords: ['security_opt: ["no-new-privileges:true"]'], 
        xp: 100 
      },
      { 
        id: 'ex_sec_04', 
        title: 'Tmpfs vs Bind Mount', 
        type: 'mcq', 
        question: '¿Cuál es la diferencia principal entre un volumen tmpfs y un bind mount?', 
        options: ['tmpfs reside en RAM y es volátil; bind mount usa el disco del host', 'Son idénticos en funcionamiento', 'tmpfs es más lento que bind mount', 'bind mount solo funciona en Linux'], 
        answer: 'tmpfs reside en RAM y es volátil; bind mount usa el disco del host', 
        hint: 'Tmpfs se borra al detener el contenedor. Bind mount persiste en el host.', 
        solution: 'tmpfs reside en RAM y es volátil; bind mount usa el disco del host', 
        keywords: [], 
        xp: 80 
      },
      { 
        id: 'ex_sec_05', 
        title: 'Conectar a Red', 
        type: 'code', 
        instruction: 'Conecta el servicio actual a una red personalizada llamada "backend".',
        hint: 'Dentro del servicio, usa la clave networks con una lista.', 
        template: 'networks:\n  - ', 
        solution: 'networks:\n  - backend', 
        keywords: ['networks:', '  - backend'], 
        xp: 90 
      },
      { 
        id: 'ex_sec_06', 
        title: 'RO + Tmpfs', 
        type: 'mcq', 
        question: '¿Por qué es necesario combinar "read_only: true" con montajes tmpfs en directorios como /tmp o /run?', 
        options: ['Para permitir escritura temporal donde la aplicación lo necesite', 'Para encriptar esos directorios', 'Para mejorar el rendimiento de E/S', 'No es necesario, son incompatibles'], 
        answer: 'Para permitir escritura temporal donde la aplicación lo necesite', 
        hint: 'Si el FS raíz es RO, la app fallará si intenta escribir en /tmp. Tmpfs soluciona esto.', 
        solution: 'Para permitir escritura temporal donde la aplicación lo necesite', 
        keywords: [], 
        xp: 100 
      },
      { 
        id: 'ex_sec_07', 
        title: 'Límites de Recursos', 
        type: 'code', 
        instruction: 'Establece un límite de memoria de 512MB y un límite de CPU de 1 núcleo completo para el servicio.',
        hint: 'Usa mem_limit: 512m y cpus: "1.0". Las comillas en cpus son opcionales pero recomendadas.', 
        template: 'mem_limit:\ncpus:', 
        solution: 'mem_limit: 512m\ncpus: "1.0"', 
        keywords: ['mem_limit: 512m', 'cpus: "1.0"'], 
        xp: 90 
      },
      { 
        id: 'ex_sec_08', 
        title: 'Cap Drop All', 
        type: 'mcq', 
        question: '¿Qué riesgo de seguridad mitiga principalmente la directiva "cap_drop: [ALL]"?', 
        options: ['Fuga de datos por red', 'Escalada de privilegios dentro del kernel Linux', 'Ataques DDoS', 'Inyección SQL en la base de datos'], 
        answer: 'Escalada de privilegios dentro del kernel Linux', 
        hint: 'Elimina capacidades como CAP_SYS_ADMIN que permiten acciones privilegiadas.', 
        solution: 'Escalada de privilegios dentro del kernel Linux', 
        keywords: [], 
        xp: 100 
      },
      { 
        id: 'ex_sec_09', 
        title: 'Privileged False', 
        type: 'code', 
        instruction: 'Asegúrate explícitamente de que el contenedor NO se ejecuta en modo privilegiado.',
        hint: 'Modo privilegiado da acceso casi total al host. Usa privileged: false.', 
        template: 'privileged:', 
        solution: 'privileged: false', 
        keywords: ['privileged: false'], 
        xp: 80 
      },
      { 
        id: 'ex_sec_10', 
        title: 'Persistencia de Volúmenes', 
        type: 'mcq', 
        question: '¿Dónde almacena Docker físicamente los datos de los volúmenes con nombre (named volumes)?', 
        options: ['/tmp', '/var/lib/docker/volumes', '/etc/docker', 'En la RAM del sistema'], 
        answer: '/var/lib/docker/volumes', 
        hint: 'Es el directorio gestionado por el demonio Docker para persistencia.', 
        solution: '/var/lib/docker/volumes', 
        keywords: [], 
        xp: 90 
      }
    ],
    kubernetes_vs_compose: [
      { 
        id: 'ex_k8s_01', 
        title: 'Deploy + Service', 
        type: 'code', 
        instruction: 'Crea un manifiesto multi-documento con un Deployment de Nginx (2 réplicas) y un Service tipo NodePort (puerto 30080). Usa "---" para separar los documentos.',
        hint: 'El Deployment necesita selector.matchLabels que coincida con template.metadata.labels. El Service usa selector para apuntar al pod.', 
        template: 'apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: web\nspec:\n  replicas:\n  selector:\n    matchLabels:\n      app: web\n  template:\n    metadata:\n      labels:\n        app: web\n    spec:\n      containers:\n      - name: web\n        image: nginx:1.27-alpine\n        ports:\n        - containerPort: 80\n---\napiVersion: v1\nkind: Service\nmetadata:\n  name: web-svc\nspec:\n  type:\n  selector:\n    app: web\n  ports:\n  - port: 80\n    targetPort: 80\n    nodePort:', 
        solution: 'apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: web\nspec:\n  replicas: 2\n  selector:\n    matchLabels:\n      app: web\n  template:\n    metadata:\n      labels:\n        app: web\n    spec:\n      containers:\n      - name: web\n        image: nginx:1.27-alpine\n        ports:\n        - containerPort: 80\n---\napiVersion: v1\nkind: Service\nmetadata:\n  name: web-svc\nspec:\n  type: NodePort\n  selector:\n    app: web\n  ports:\n  - port: 80\n    targetPort: 80\n    nodePort: 30080', 
        keywords: ['apiVersion: apps/v1', 'kind: Deployment', 'replicas: 2', 'matchLabels:', 'template:', 'kind: Service', 'type: NodePort', 'nodePort: 30080', '---'], 
        xp: 200 
      },
      { 
        id: 'ex_k8s_02', 
        title: 'Restart Policy K8s', 
        type: 'mcq', 
        question: '¿Cuál es la equivalencia en Kubernetes de "restart: unless-stopped" de Docker Compose?', 
        options: ['RestartPolicy: Never', 'Implícito en el comportamiento de un Deployment', 'LivenessProbe', 'InitContainer'], 
        answer: 'Implícito en el comportamiento de un Deployment', 
        hint: 'Un Deployment siempre intenta mantener el número deseado de réplicas, reiniciando pods caídos por defecto.', 
        solution: 'Implícito en el comportamiento de un Deployment', 
        keywords: [], 
        xp: 80 
      },
      { 
        id: 'ex_k8s_03', 
        title: 'ConfigMap', 
        type: 'code', 
        instruction: 'Define un ConfigMap llamado "app-config" con una variable APP_ENV establecida en "production".',
        hint: 'Los ConfigMaps almacenan configuración no sensible en pares clave-valor bajo data:.', 
        template: 'apiVersion: v1\nkind: ConfigMap\nmetadata:\n  name: app-config\ndata:', 
        solution: 'apiVersion: v1\nkind: ConfigMap\nmetadata:\n  name: app-config\ndata:\n  APP_ENV: production', 
        keywords: ['kind: ConfigMap', 'data:', 'APP_ENV: production'], 
        xp: 90 
      },
      { 
        id: 'ex_k8s_04', 
        title: 'Compose vs K8s', 
        type: 'mcq', 
        question: '¿Cuál es la diferencia fundamental de arquitectura entre Docker Compose y Kubernetes?', 
        options: ['Compose es multi-nodo, K8s mono-nodo', 'Compose gestiona contenedores en un solo host, K8s orquesta clústeres distribuidos', 'Son idénticos', 'K8s es más lento'], 
        answer: 'Compose gestiona contenedores en un solo host, K8s orquesta clústeres distribuidos', 
        hint: 'Kubernetes está diseñado para escalar horizontalmente en múltiples máquinas.', 
        solution: 'Compose gestiona contenedores en un solo host, K8s orquesta clústeres distribuidos', 
        keywords: [], 
        xp: 90 
      },
      { 
        id: 'ex_k8s_05', 
        title: 'Secret', 
        type: 'code', 
        instruction: 'Crea un Secret llamado "db-secret" para almacenar la contraseña de BD. Usa stringData para escribirlo en texto plano (K8s lo codifica automáticamente).',
        hint: 'Los Secrets son similares a ConfigMaps pero para datos sensibles. Usa type: Opaque.', 
        template: 'apiVersion: v1\nkind: Secret\nmetadata:\n  name: db-secret\ntype: Opaque\nstringData:', 
        solution: 'apiVersion: v1\nkind: Secret\nmetadata:\n  name: db-secret\ntype: Opaque\nstringData:\n  DB_PASSWORD: ejemplo', 
        keywords: ['kind: Secret', 'stringData:', 'DB_PASSWORD:'], 
        xp: 100 
      },
      { 
        id: 'ex_k8s_06', 
        title: 'Selector Match', 
        type: 'mcq', 
        question: '¿Qué función cumple "selector.matchLabels" en un Deployment o Service de Kubernetes?', 
        options: ['Expone puertos al exterior', 'Vincula el objeto con los Pods que tienen esas etiquetas', 'Crea volúmenes persistentes', 'Define el número de réplicas'], 
        answer: 'Vincula el objeto con los Pods que tienen esas etiquetas', 
        hint: 'Es el mecanismo de descubrimiento: el Service busca Pods con labels coincidentes.', 
        solution: 'Vincula el objeto con los Pods que tienen esas etiquetas', 
        keywords: [], 
        xp: 100 
      },
      { 
        id: 'ex_k8s_07', 
        title: 'Probes (Sondas)', 
        type: 'code', 
        instruction: 'Define sondas liveness y readiness usando httpGet contra la ruta /health en el puerto 3000.',
        hint: 'livenessProbe reinicia el pod si falla. readinessProbe lo saca del servicio si falla.', 
        template: 'livenessProbe:\n  httpGet:\n    path: /health\n    port: 3000\nreadinessProbe:', 
        solution: 'livenessProbe:\n  httpGet:\n    path: /health\n    port: 3000\nreadinessProbe:\n  httpGet:\n    path: /health\n    port: 3000', 
        keywords: ['livenessProbe:', 'readinessProbe:', 'httpGet:', 'path: /health', 'port: 3000'], 
        xp: 120 
      },
      { 
        id: 'ex_k8s_08', 
        title: 'Multi-Documento', 
        type: 'mcq', 
        question: '¿Por qué Kubernetes permite múltiples documentos YAML en un solo archivo separados por "---"?', 
        options: ['Para agrupar recursos relacionados (ej: Deploy+Service) y aplicarlos juntos', 'Para ahorrar espacio', 'Es obligatorio por sintaxis', 'Para comprimir datos'], 
        answer: 'Para agrupar recursos relacionados (ej: Deploy+Service) y aplicarlos juntos', 
        hint: 'Permite gestionar toda la aplicación con un solo comando kubectl apply -f archivo.yml.', 
        solution: 'Para agrupar recursos relacionados (ej: Deploy+Service) y aplicarlos juntos', 
        keywords: [], 
        xp: 90 
      },
      { 
        id: 'ex_k8s_09', 
        title: 'PVC (Almacenamiento)', 
        type: 'code', 
        instruction: 'Define un PersistentVolumeClaim llamado "pg-claim" que solicite 1Gi de almacenamiento.',
        hint: 'Los PVCs solicitan almacenamiento al clúster. Se usan en volumes del Pod.', 
        template: 'apiVersion: v1\nkind: PersistentVolumeClaim\nmetadata:\n  name: pg-claim\nspec:\n  resources:\n    requests:\n      storage:', 
        solution: 'apiVersion: v1\nkind: PersistentVolumeClaim\nmetadata:\n  name: pg-claim\nspec:\n  resources:\n    requests:\n      storage: 1Gi', 
        keywords: ['kind: PersistentVolumeClaim', 'resources:', 'requests:', 'storage: 1Gi'], 
        xp: 110 
      },
      { 
        id: 'ex_k8s_10', 
        title: 'Tipos de Service', 
        type: 'mcq', 
        question: '¿Qué tipo de Service expone la aplicación al exterior del clúster?', 
        options: ['ClusterIP', 'NodePort o LoadBalancer', 'ExternalName', 'Headless'], 
        answer: 'NodePort o LoadBalancer', 
        hint: 'ClusterIP es solo accesible dentro del clúster. NodePort abre un puerto en cada nodo.', 
        solution: 'NodePort o LoadBalancer', 
        keywords: [], 
        xp: 100 
      }
    ]
  },

  init() {
    this.applyTheme(this.state.theme);
    this.updateProgressUI();
    this.setupThemeToggle();
    this.setupTabs();
    this.checkOnboarding();
    this.detectModule();
  },

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.textContent = theme === 'dark' ? '🌙 Oscuro' : '☀️ Claro';
  },

  setupThemeToggle() {
    document.getElementById('theme-toggle')?.addEventListener('click', () => {
      const next = this.state.theme === 'dark' ? 'light' : 'dark';
      this.state.theme = next;
      this.applyTheme(next);
    });
  },

  updateProgressUI() {
    // Calcula progreso global (aproximado)
    let totalCompleted = 0;
    Object.values(this.state.progress).forEach(mod => {
      totalCompleted += Object.values(mod).filter(v => v === 'completed').length;
    });
    const totalTasks = 70; // 7 módulos * 10
    const pct = Math.min((totalCompleted / totalTasks) * 100, 100);
    
    document.querySelectorAll('.progress-fill').forEach(el => el.style.width = `${pct}%`);
    document.querySelectorAll('#xp-display').forEach(el => el.textContent = `${this.state.xp} XP`);
    
    // Actualizar contadores locales si existen
    const moduleCount = this.state.currentModule ? Object.values(this.state.progress[this.state.currentModule] || {}).filter(v => v === 'completed').length : 0;
    document.querySelectorAll('#completed-count').forEach(el => el.textContent = moduleCount);
    document.querySelectorAll('#xp-count').forEach(el => el.textContent = this.state.xp);
  },

  setupTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(target)?.classList.add('active');
        
        // Si entra en la pestaña de reto, renderizar el grid
        if (target === 'reto') {
          this.renderTaskGrid(this.state.currentModule);
        }
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
    // Si ya está en la pestaña reto al cargar, renderizar
    if (document.querySelector('.tab-btn[data-tab="reto"].active')) {
      this.renderTaskGrid(path);
    }
  },

  renderTaskGrid(module) {
    const container = document.getElementById('task-container');
    const editorArea = document.getElementById('task-editor');
    if (!container || !this.exercises[module]) return;

    // Limpiar área de editor al cambiar de vista
    if (editorArea) editorArea.innerHTML = '';
    if (editorArea) editorArea.classList.remove('active');

    const grid = document.createElement('div');
    grid.className = 'task-grid';

    this.exercises[module].forEach((ex, i) => {
      const status = this.getTaskStatus(module, i);
      const card = document.createElement('div');
      card.className = `task-card ${status === 'completed' ? 'completed' : ''}`;
      card.innerHTML = `
        <span class="task-badge">${status === 'completed' ? '✅ Completado' : '⏳ Pendiente'}</span>
        <h4>Tarea ${i + 1}</h4>
        <p>${ex.title}</p>
      `;
      card.addEventListener('click', () => this.openTask(module, i));
      grid.appendChild(card);
    });

    container.innerHTML = '';
    container.appendChild(grid);
  },

  openTask(module, index) {
    this.state.activeTaskIndex = index;
    const ex = this.exercises[module][index];
    const editorArea = document.getElementById('task-editor');
    const container = document.getElementById('task-container');
    
    if (!editorArea) return;

    // Marcar tarjeta activa visualmente
    if (container) {
      Array.from(container.children).forEach((c, i) => c.classList.toggle('active', i === index));
    }

    editorArea.classList.add('active');
    
    let html = `<h3>Tarea ${index + 1}: ${ex.title}</h3>`;
    
    // ✅ AÑADIDO: Mostrar instrucción clara si existe
    if (ex.instruction) {
      html += `<div style="background:var(--surface-alt); padding:1rem; border-radius:6px; margin-bottom:1rem; border-left:4px solid var(--primary);">
        <strong>📝 Instrucción:</strong><br>${ex.instruction}
      </div>`;
    }

    // 🆕 NUEVO: Renderizado para ejercicios de detección de errores (Opción C - Nivel 1)
    if (ex.type === 'error_detect') {
      html += `
        <div class="yaml-broken" style="background:#1e1e1e;color:#f8f8f2;padding:1rem;border-radius:6px;font-family:monospace;white-space:pre;overflow-x:auto;margin:1rem 0;border-left:4px solid #ff6b6b;">
          ${ex.broken_yaml.replace(/\n/g, '<br>')}
        </div>
        <p style="margin-bottom:1rem;font-weight:500;">${ex.question}</p>
        <div class="options-grid" style="display:grid;gap:0.5rem;">
          ${ex.options.map((opt, i) => `
            <label class="option-card" style="padding:0.8rem;border:2px solid var(--border);border-radius:6px;cursor:pointer;display:flex;align-items:center;gap:0.5rem;transition:all 0.2s;">
              <input type="radio" name="error_detect_${index}" value="${opt}" style="accent-color:var(--primary);">
              <span>${opt}</span>
            </label>
          `).join('')}
        </div>
      `;
    }

    html += `
      <div class="task-controls">
        ${ex.type !== 'mcq' ? '<button class="btn btn-outline" id="btn-template">📄 Cargar Plantilla</button>' : ''}
        <button class="btn btn-outline" id="btn-hint">💡 Pista</button>
        <button class="btn primary" id="btn-validate">✅ Validar</button>
        <button class="btn btn-outline" id="btn-solution">👁️ Ver Respuesta</button>
      </div>
      <div id="hint-box" class="hint-box"></div>
      <div id="feedback" class="feedback"></div>
      <div id="solution-box" class="solution-box"><pre><code></code></pre></div>
    `;

    editorArea.innerHTML = html;
    this.bindTaskButtons(module, index, ex);
  },

  bindTaskButtons(module, index, ex) {
    const editor = document.getElementById('yaml-input');
    
    // Botón Plantilla
    document.getElementById('btn-template')?.addEventListener('click', () => {
      const editor = document.getElementById('yaml-input');
      if (editor && ex.template) {
        editor.value = ex.template; // Aquí sí se llena con la plantilla
        // Opcional: Guardar inmediatamente como borrador
        this.saveInput(module, index, ex.template); 
      }
    });

    // Botón Pista
    document.getElementById('btn-hint')?.addEventListener('click', () => {
      const box = document.getElementById('hint-box');
      box.innerHTML = `💡 <strong>Pista:</strong> ${ex.hint}`;
      box.classList.toggle('show');
    });

    // Botón Ver Respuesta
    document.getElementById('btn-solution')?.addEventListener('click', () => {
      const box = document.getElementById('solution-box');
      const code = box.querySelector('code');
      code.textContent = ex.solution;
      box.classList.toggle('show');
    });

    // Botón Validar
    document.getElementById('btn-validate')?.addEventListener('click', () => {
      let input = '';
      if (ex.type === 'mcq') {
        const checked = document.querySelector(`input[name="mcq_${index}"]:checked`);
        input = checked ? checked.value : '';
      } else if (editor) {
        input = editor.value;
        this.saveInput(module, index, input);
      }

      const isCorrect = this.validateTask(ex, input);
      const fb = document.getElementById('feedback');
      if (!fb) return;

      fb.classList.add('show');
      
      if (isCorrect) {
        fb.className = 'feedback success';
        fb.innerHTML = '✅ ¡Correcto! Estructura y tipos válidos. +XP';
        this.setTaskStatus(module, index, 'completed');
        this.addXP(ex.xp, ex.id);
      } else {
        fb.className = 'feedback error';
        fb.innerHTML = `❌ Revisa: ${ex.hint}`;
      }
    });
  },

validateTask(ex, input) {
  if (!input) return false;
  const norm = input.toLowerCase();
  
  // 🆕 Validación para error_detect (comparación exacta de opción seleccionada)
  if (ex.type === 'error_detect') {
    return input === ex.answer;
  }
  
  // 1. Rechazar tabuladores inmediatamente
  if (norm.includes('\t')) return false; 
  
  // 2. Rechazar falta de espacio tras dos puntos (ej: "clave:valor")
  if (/:[a-z0-9_-]/.test(norm)) return false; 

  if (ex.type === 'mcq') {
    return norm.includes(ex.answer.toLowerCase());
  }
  
  return ex.keywords.every(k => {
    const cleanKeyword = k.trim().toLowerCase();
    return norm.includes(cleanKeyword);
  });
},

  getTaskStatus(module, index) {
    return this.state.progress[module]?.[index] || 'pending';
  },

  setTaskStatus(module, index, status) {
    if (!this.state.progress[module]) this.state.progress[module] = {};
    this.state.progress[module][index] = status;
    localStorage.setItem('sc_progress', JSON.stringify(this.state.progress));
    this.renderTaskGrid(this.state.currentModule); // Refrescar grid
    this.updateProgressUI();
  },

  getSavedInput(module, index) {
    return this.state.progress[module]?.[`${index}_input`] || '';
  },

  saveInput(module, index, value) {
    if (!this.state.progress[module]) this.state.progress[module] = {};
    this.state.progress[module][`${index}_input`] = value;
    localStorage.setItem('sc_progress', JSON.stringify(this.state.progress));
  },

  addXP(amount, exerciseId) {
    // Evitar doble XP por mismo ejercicio en misma sesión si ya estaba completado
    // Pero como setTaskStatus ya marca completado, simplificamos:
    // Solo sumamos si no estaba completado antes de este click (lógica manejada en setTaskStatus idealmente, pero aquí basta con sumar si es correcto)
    // Para ser estrictos, comprobamos si ya estaba en completed array global si usáramos ese sistema, 
    // pero con el nuevo sistema de progress object, podemos confiar en que el usuario gana XP al completar.
    
    // Nota: Para evitar spam de XP recargando, deberíamos guardar XP ganada por ID.
    // Simplificación: Sumamos XP siempre que valide correctamente y marque como completado por primera vez en la sesión.
    
    const xpKey = `xp_${exerciseId}`;
    if (!sessionStorage.getItem(xpKey)) {
      this.state.xp += amount;
      localStorage.setItem('xp', this.state.xp);
      sessionStorage.setItem(xpKey, 'true');
      this.showNotification(`+${amount} XP 🏆`, 'success');
      this.updateProgressUI();
    }
  },

  showNotification(msg, type) {
    const toast = document.createElement('div');
    toast.style.cssText = `position:fixed;bottom:20px;right:20px;padding:12px 20px;background:var(--${type==='success'?'success':'error'});color:white;border-radius:8px;z-index:9999;font-weight:600;animation:fadeIn 0.3s;box-shadow:0 4px 12px rgba(0,0,0,0.2);`;
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
