ARCHIVO DE ARQUITECTURA

* **Resumen ejecutivo**

El Álbum de Fotos en Línea es una aplicación web desarrollada como proyecto escolar para la materia de Diseño y Aplicaciones Web en nivel bachillerato. La aplicación permite a los usuarios autenticados crear álbumes, subir fotografías, organizarlas visualmente y administrarlas desde una interfaz moderna e intuitiva.

El sistema está construido con React \+ JavaScript en el frontend. La navegación entre vistas se gestiona mediante estado interno de la aplicación (sin enrutador externo), y los datos se manejan con estructuras mockeadas que simulan una base de datos real.

El objetivo principal del proyecto es demostrar la aplicación de conceptos de diseño web moderno: componentización, gestión de estado, diseño responsivo y arquitectura de software organizada por capas. El resultado final es una SPA (Single Page Application) funcional y visualmente consistente, lista para ser desplegada en plataformas de hosting estático como Vercel o GitHub Pages.

Alcance del proyecto: — Autenticación real de usuarios — CRUD de álbumes y fotografías — Visualización en grid responsivo — Selección y filtrado de fotos por favoritos — Modal de detalle de foto — Papelera de reciclaje con eliminación definitiva

* **Visión y objetivos (problema, usuarios y restricciones)**

Problema Los usuarios no cuentan con una plataforma propia y personalizada para almacenar y organizar sus fotografías de forma estructurada. Las soluciones existentes como Google Fotos o iCloud son servicios de terceros que no ofrecen control total sobre la organización ni permiten personalización del flujo de uso. Este proyecto resuelve esa necesidad creando una aplicación propia, ligera y directa.

Usuarios objetivo El sistema está pensado para cualquier persona que desee guardar y organizar fotos personales desde un navegador web, sin necesidad de instalar ninguna aplicación. El perfil principal es un usuario con conocimientos básicos de tecnología que busca una interfaz clara y sin distracciones.

Objetivos del proyecto — Construir una SPA funcional con React y JavaScript — Implementar autenticación real de usuarios con sesión persistente — Permitir la creación, edición y eliminación de álbumes y fotos — Ofrecer filtrado por favoritos para acceso rápido a contenido destacado — Mantener una arquitectura de código limpia, ordenada y escalable — Desplegar la aplicación en un entorno público accesible desde cualquier dispositivo

Restricciones — El proyecto debe completarse dentro del ciclo escolar — No se utilizarán librerías de componentes externas; el diseño se construye desde cero — El equipo está conformado por un equipo de desarrolladores con conocimientos de nivel bachillerato — El presupuesto es cero; todas las herramientas y plataformas usadas son gratuitas — La aplicación debe funcionar correctamente en navegadores modernos de escritorio

* **Inventario del estado actual (bases de datos)**

Base de datos El proyecto utiliza Firebase Firestore como base de datos en la nube, en su plan gratuito (Spark Plan). Firestore es una base de datos NoSQL orientada a documentos, lo que significa que la información se organiza en colecciones y documentos con estructura JSON. Además, al formar parte del ecosistema de Firebase, se integra de forma nativa con Firebase Authentication, eliminando la necesidad de construir un backend independiente.

Colecciones

Colección: usuarios Almacena el perfil de cada persona registrada en la aplicación. Se crea automáticamente cuando un usuario se registra por primera vez. — uid: identificador único generado por Firebase Auth — nombre: nombre completo del usuario — email: correo electrónico usado para iniciar sesión — fecha\_registro: fecha en que se creó la cuenta

Colección: albumes Almacena los álbumes creados por cada usuario. — id: identificador único del álbum generado por Firestore — usuario\_uid: referencia al uid del usuario dueño del álbum — nombre: nombre del álbum — descripcion: texto opcional que describe el contenido — portada\_url: URL de la imagen usada como portada — fecha\_creacion: fecha en que se creó el álbum

Colección: fotos Almacena cada fotografía subida por los usuarios. Las imágenes en sí se guardan en Firebase Storage y esta colección guarda únicamente sus metadatos. — id: identificador único de la foto — album\_id: referencia al id del álbum al que pertenece — usuario\_uid: referencia al usuario que subió la foto — url: dirección de descarga generada por Firebase Storage — titulo: nombre o descripción corta de la foto — favorito: booleano que indica si la foto está marcada como favorita — eliminada: booleano que indica si la foto se encuentra en la papelera — fecha\_subida: fecha en que se subió la foto

Relaciones entre colecciones Un usuario puede tener muchos álbumes. Cada álbum pertenece a un solo usuario. Un álbum puede contener muchas fotos. Cada foto pertenece a un álbum y a un usuario. El campo favorito permite filtrar fotos destacadas sin importar el álbum al que pertenezcan. El campo eliminada permite implementar la papelera de reciclaje sin borrar el documento de inmediato, conservando la posibilidad de restaurarlo.

* **Arquitectura (diagrama de capas, patrón de archivos, carpetas)**

Diagrama de capas La aplicación se divide en tres capas principales que se comunican de forma ordenada y unidireccional.

— Capa de presentación: contiene todos los componentes de React que el usuario ve e interactúa. Se encarga únicamente de mostrar datos y capturar acciones del usuario. — Capa de lógica: contiene los hooks personalizados y las funciones que procesan la información, gestionan el estado de la aplicación y deciden qué mostrar en cada momento. — Capa de datos: contiene los servicios que se comunican directamente con Firebase Firestore, Firebase Auth y Firebase Storage. Ningún componente de la capa de presentación habla directamente con Firebase.

Patrón de archivos y estructura de carpetas

src/ — components/: componentes reutilizables de la interfaz como botones, tarjetas, modales y la barra lateral — pages/: una carpeta por cada pantalla principal de la aplicación (LoginPage, AlbumsPage, PhotoGrid, PhotoModal, TrashPage) — hooks/: hooks personalizados que encapsulan la lógica de negocio, como useAuth, useAlbums y usePhotos — services/: funciones que se comunican con Firebase, organizadas por entidad (authService.js, albumService.js, photoService.js) — firebase/: archivo de configuración e inicialización de Firebase (firebase.js) — context/: contexto global de React para compartir el estado del usuario autenticado entre componentes — assets/: imágenes estáticas, íconos y recursos visuales del proyecto — App.js: componente raíz que define qué página se renderiza según el estado de autenticación y la navegación actual

Flujo general de datos El usuario interactúa con un componente de la capa de presentación. Ese componente llama a un hook de la capa de lógica. El hook llama al servicio correspondiente en la capa de datos. El servicio ejecuta la operación en Firebase y devuelve el resultado. El hook actualiza el estado y React re-renderiza la interfaz automáticamente.

* **API y dashboard (cada endpoint con método)**

Dado que la aplicación usa Firebase directamente desde el frontend sin un backend propio, no existe una API REST tradicional con servidor. En su lugar, Firebase SDK actúa como la capa de comunicación con la base de datos. Los siguientes endpoints representan las operaciones que realiza la aplicación, organizadas por módulo y equivalentes a lo que serían rutas de una API convencional.

Autenticación (Firebase Auth)

— POST /auth/register: crea una cuenta nueva con correo y contraseña, y genera el documento del usuario en Firestore — POST /auth/login: inicia sesión con correo y contraseña, devuelve el token de sesión del usuario — POST /auth/logout: cierra la sesión activa del usuario — GET /auth/session: verifica si hay una sesión activa al cargar la aplicación

Álbumes

— GET /albumes: obtiene todos los álbumes del usuario autenticado — POST /albumes: crea un nuevo álbum con nombre, descripción y portada — PUT /albumes/:id: actualiza el nombre, descripción o portada de un álbum existente — DELETE /albumes/:id: elimina un álbum y todas las fotos que contiene

Fotos

— GET /fotos/:album\_id: obtiene todas las fotos de un álbum específico — GET /fotos/favoritos: obtiene todas las fotos marcadas como favoritas del usuario — GET /fotos/papelera: obtiene todas las fotos con el campo eliminada en true — POST /fotos: sube una nueva foto a Firebase Storage y registra sus metadatos en Firestore — PUT /fotos/:id/favorito: alterna el valor del campo favorito de una foto — PUT /fotos/:id/eliminar: marca una foto como eliminada enviándola a la papelera — PUT /fotos/:id/restaurar: restaura una foto de la papelera cambiando eliminada a false — DELETE /fotos/:id: elimina definitivamente una foto de Firestore y de Firebase Storage

Dashboard El dashboard principal de la aplicación es la vista de álbumes. Desde ahí el usuario puede ver de un vistazo cuántos álbumes tiene, acceder a cualquiera de ellos, crear nuevos o navegar a su sección de favoritos y papelera desde la barra lateral. No existe un panel de administración separado ya que la aplicación está diseñada para uso personal de un solo usuario por cuenta.

Despliegue (donde se va a mostrar)

Plataforma La aplicación se desplegará en GitHub Pages, el servicio de hosting estático gratuito integrado directamente en GitHub. Al estar el repositorio ya alojado en GitHub, no se requiere ninguna plataforma externa adicional. GitHub Pages publica el contenido de una rama o carpeta específica del repositorio y lo hace accesible mediante una URL pública.

Repositorio El código fuente se aloja en GitHub en un repositorio compartido entre los tres integrantes del equipo. Cada desarrollador trabaja en su propia rama y los cambios se integran a la rama principal mediante pull requests revisados por el equipo.

Proceso de despliegue — El desarrollador sube sus cambios a la rama principal del repositorio — Se ejecuta el comando de construcción del proyecto (npm run build) de forma manual o mediante GitHub Actions — La carpeta generada (dist o build) se publica en la rama gh-pages del repositorio — GitHub Pages detecta la rama y actualiza automáticamente la URL pública — La aplicación queda disponible desde cualquier navegador moderno en desktop o móvil

Variables de entorno Las credenciales de Firebase se configuran como secretos en el repositorio de GitHub mediante GitHub Secrets, de modo que no queden expuestas en el código fuente público. GitHub Actions las inyecta automáticamente durante el proceso de construcción.

URL de acceso Una vez desplegada, la aplicación estará disponible en una URL del formato usuario.github.io/nombre-del-repositorio, accesible desde cualquier dispositivo con conexión a internet sin necesidad de instalación.

Decisiones técnicas(por qué usamos lo q usamos)

React y JavaScript Se eligió React porque permite construir interfaces divididas en componentes reutilizables, lo que facilita el trabajo en equipo ya que cada integrante puede desarrollar una sección de la app de forma independiente. Se optó por JavaScript en lugar de TypeScript para reducir la complejidad del proyecto, dado que el equipo está en nivel bachillerato y el tiempo de entrega es limitado.

Firebase Se eligió Firebase como plataforma de backend por tres razones principales. Primero, incluye autenticación real de usuarios lista para usar sin necesidad de construir un servidor propio. Segundo, Firestore permite leer y escribir datos directamente desde React sin una API intermedia, simplificando la arquitectura del proyecto. Tercero, Firebase Storage resuelve el almacenamiento de imágenes de forma nativa dentro del mismo ecosistema. Todo esto en un plan completamente gratuito que cubre las necesidades del proyecto.

GitHub y GitHub Pages Se eligió GitHub como repositorio porque el equipo ya está familiarizado con él desde otras materias y permite colaborar en el mismo código sin conflictos. GitHub Pages se eligió para el despliegue porque está integrado directamente en el repositorio, es gratuito y no requiere configurar ninguna plataforma externa adicional.

CSS propio sin librerías Se decidió no utilizar librerías de componentes externas para que el equipo desarrolle criterio propio de diseño y demuestre dominio de CSS desde cero, que es uno de los objetivos de aprendizaje de la materia.

Navegación sin enrutador externo Se decidió manejar la navegación mediante estado interno de React en lugar de instalar una librería de enrutamiento como React Router. Dado que las pantallas de la aplicación son pocas y el flujo es lineal, esta solución es suficiente y evita agregar dependencias innecesarias al proyecto.

Glosario (metadatos, def y tecnicismos )

SPA (Single Page Application) Tipo de aplicación web que carga una sola página HTML y actualiza el contenido dinámicamente sin recargar el navegador completo. El álbum de fotos es una SPA porque la navegación entre pantallas se gestiona desde JavaScript sin hacer nuevas peticiones al servidor.

Componente Bloque de código reutilizable en React que representa una parte de la interfaz, como un botón, una tarjeta de álbum o la barra lateral. Cada componente tiene su propia lógica y apariencia.

Hook Función especial de React que permite agregar lógica a un componente, como gestionar estado, ejecutar efectos o consumir un contexto. En el proyecto se usan hooks como useAuth, useAlbums y usePhotos para separar la lógica del resto del código.

Estado Información que React almacena internamente en un componente y que, cuando cambia, provoca que la interfaz se actualice automáticamente. Por ejemplo, la lista de fotos de un álbum es un estado.

Contexto (Context API) Mecanismo de React para compartir información entre componentes sin necesidad de pasarla manualmente por cada nivel. En el proyecto se usa para compartir el usuario autenticado con todas las pantallas.

Firebase Plataforma de Google que ofrece servicios de backend listos para usar, como autenticación, base de datos en tiempo real, almacenamiento de archivos y hosting, todo desde el frontend sin necesidad de un servidor propio.

Firebase Auth Servicio de Firebase que gestiona el registro e inicio de sesión de usuarios. Soporta autenticación con correo y contraseña, entre otros métodos.

Firestore Base de datos NoSQL de Firebase orientada a documentos. La información se organiza en colecciones que contienen documentos con estructura JSON. Permite leer y escribir datos en tiempo real desde el frontend.

Firebase Storage Servicio de Firebase para almacenar archivos binarios como imágenes, videos y documentos. En el proyecto se usa para guardar las fotografías subidas por los usuarios.

NoSQL Tipo de base de datos que no usa tablas ni filas como las bases de datos relacionales tradicionales. En su lugar organiza la información en documentos, colecciones o pares clave-valor. Firestore es una base de datos NoSQL.

Colección En Firestore, una colección es un contenedor de documentos, equivalente a una tabla en bases de datos relacionales. El proyecto usa tres colecciones: usuarios, albumes y fotos.

Documento Unidad básica de almacenamiento en Firestore. Es un conjunto de pares clave-valor con estructura JSON. Equivale a un registro o fila en una base de datos relacional.

Metadatos Información que describe a otro dato. En el proyecto, los metadatos de una foto son todos los campos almacenados en Firestore sobre ella (título, fecha, favorito, eliminada, url) sin incluir la imagen en sí, que vive en Firebase Storage.

URL de descarga Dirección web generada por Firebase Storage que apunta directamente a un archivo almacenado. En el proyecto, cada foto tiene una URL de descarga que React usa para mostrar la imagen en la interfaz.

Booleano Tipo de dato que solo puede tener dos valores: verdadero (true) o falso (false). En el proyecto los campos favorito y eliminada son booleanos que determinan si una foto aparece en favoritos o en la papelera.

Pull Request Solicitud que hace un desarrollador en GitHub para integrar los cambios de su rama al código principal. Permite que el equipo revise y apruebe los cambios antes de que se fusionen.

GitHub Actions Herramienta de automatización integrada en GitHub que permite ejecutar tareas de forma automática, como construir el proyecto y desplegarlo en GitHub Pages cada vez que se sube un cambio a la rama principal.

gh-pages Rama especial del repositorio de GitHub donde se publica el resultado final del proceso de construcción. GitHub Pages lee esta rama y la sirve como sitio web público.

Rama (Branch) Versión paralela del código dentro de un repositorio de GitHub. Permite trabajar en nuevas funcionalidades sin afectar el código principal hasta que los cambios estén listos para integrarse.

