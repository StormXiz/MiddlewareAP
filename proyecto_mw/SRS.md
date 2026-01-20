# Especificación de Requisitos de Software (SRS)
**Proyecto**: Sistema del Centro de Apoyo y Co-creación para Emprendimientos (UID)

## 1. Introducción

### 1.1 Propósito
El propósito de este documento es definir los requisitos funcionales y no funcionales para el sistema web del Centro de Apoyo y Co-creación para Emprendimientos de la UID. Este sistema busca centralizar, organizar y visibilizar los emprendimientos de la comunidad universitaria, así como facilitar el acceso a servicios de asesoría y mentoría.

### 1.2 Alcance
El sistema permitirá:
*   A los **emprendedores (estudiantes)**: Registrar sus negocios, exhibir productos, solicitar mentorías, y acceder a recursos educativos.
*   A los **administradores/coordinadores**: Gestionar el catálogo de emprendimientos, coordinar mentorías y eventos, y monitorear la actividad del centro.
*   Al **público general**: Visualizar el catálogo de emprendimientos y productos, y contactar con los vendedores.
*   Al **área de marketing**: Gestionar campañas, promociones y eventos para impulsar los negocios.

## 2. Descripción General

### 2.1 Perspectiva del Producto
Este sistema es una solución basada en web que servirá como:
1.  **Vitrina Comercial**: Un catálogo digital (Marketplace) para dar visibilidad a los productos.
2.  **Plataforma de Gestión**: Herramienta para formalizar y profesionalizar los emprendimientos mediante rutas de aprendizaje y mentoría.
3.  **Red de Conexiones**: Punto de encuentro entre emprendedores, mentores y clientes.

### 2.2 Características de los Usuarios
*   **Emprendedor (Estudiante)**: Conocimientos básicos de tecnología. Busca visibilidad y guía. Necesita una interfaz intuitiva para cargar productos y gestionar su perfil.
*   **Administrador (Staff Centro)**: Gestiona usuarios, valida emprendimientos, asigna mentores.
*   **Mentor/Colaborador**: Expertos (docentes/externos) que ofrecen horas de asesoría en áreas específicas (legal, finanzas, marketing).
*   **Cliente/Visitante**: Usuario final que navega el catálogo para comprar o conocer productos.
*   **Equipo de Marketing**: Usuario con permisos para crear campañas, destacar productos y publicar noticias.

## 3. Requerimientos Específicos

### 3.1 Requerimientos Funcionales

#### 3.1.1 Gestión de Usuarios y Perfiles
*   **RF-01 Registro y Autenticación**: El sistema debe permitir registro mediante correo institucional y gestión de roles (Administrador, Emprendedor, Mentor, Cliente).
*   **RF-02 Perfil de Emprendedor**: El usuario debe poder completar información personal y académica.

#### 3.1.2 Gestión de Emprendimientos (El "Producto")
*   **RF-03 Registro de Negocio**: Formulario para crear un emprendimiento con: Nombre, Descripción, Logo, Rubro (Categoría).
*   **RF-04 Catálogo de Productos**: Capacidad de agregar múltiples productos/servicios asociados a un emprendimiento (Nombre, Foto, Precio, Descripción).
*   **RF-05 Enlaces Externos**: Campos obligatorios/opcionales para Redes Sociales (Instagram, WhatsApp, TikTok) y sitio web propio.
*   **RF-06 Estado del Negocio**: Sistema automático o manual para marcar emprendimientos como "Activo", "Inactivo" o "En Incubación".

#### 3.1.3 Módulo de Mentoría y Formación
*   **RF-07 Solicitud de Mentorías**: Los emprendedores deben poder solicitar sesiones con expertos según especialidad (Legal, Finanzas, Marketing).
*   **RF-08 Agenda de Tutores**: Los mentores deben poder definir disponibilidad y gestionar citas.
*   **RF-09 Ruta de Formalización**: Checklist o guía paso a paso para trámites legales (RUC, permisos), marcando progreso.

#### 3.1.4 Visualización y Marketing (Vitrina)
*   **RF-10 Catálogo Público**: Buscador y listado de emprendimientos filtrable por Categoría (Rubro).
*   **RF-11 Ranking/Destacados**: Algoritmo o gestión manual para mostrar emprendimientos destacados en la página de inicio (basado en ventas, valoraciones o decisión administrativa).
*   **RF-12 Reseñas y Calificaciones**: Sistema para que usuarios autenticados califiquen productos/emprendimientos y dejen comentarios.
*   **RF-13 Promociones y Eventos**: Sección para visualizar campañas activas (ej. "Cyber UID", cupones de descuento).

#### 3.1.5 Módulo de Contenido (Blog/Noticias)
*   **RF-14 Noticias Institucionales**: Sección administrable para publicar artículos, tips de emprendimiento y novedades de la universidad para mantener el tráfico en el sitio.

### 3.2 Requerimientos No Funcionales

#### 3.2.1 Usabilidad y Diseño
*   **RNF-01 Interfaz Atractiva**: El diseño debe ser moderno ("Wow factor"), visualmente rico y responsivo (móvil y escritorio), superior a un simple CRUD académico.
*   **RNF-02 Facilidad de Uso**: Procesos de registro y carga de productos simplificados (máximo 3 pasos).

#### 3.2.2 Rendimiento y Escalabilidad
*   **RNF-03 Tiempos de Carga**: El catálogo público debe cargar en menos de 2 segundos.
*   **RNF-04 Escalabilidad**: La base de datos debe soportar el crecimiento de histórico de emprendimientos sin degradar el rendimiento.

#### 3.2.3 Disponibilidad
*   **RNF-05 Disponibilidad**: El sistema debe estar disponible 99.9% durante periodos de ferias o campañas de marketing.

## 4. Matriz de Trazabilidad (Gap Analysis)
*   **Cubierto por SQL Actual**: RF-01, RF-02, RF-03, RF-07, RF-08.
*   **Pendiente de Implementación (Cambios a BD)**: RF-04 (Tabla Productos), RF-05 (Redes Sociales), RF-11 (Ranking/Stats), RF-12 (Reseñas), RF-13 (Promociones).
