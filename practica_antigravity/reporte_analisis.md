# Reporte de Análisis: Modelo de Datos vs. Entrevista

## 1. Coincidencias con la Entrevista
Estos elementos del modelo de datos (`grupo2.sql`) reflejan correctamente los requisitos mencionados en la entrevista:

*   **Gestión de Usuarios y Roles**: La estructura de `usuarios`, `Autenticación` y `roles` permite diferenciar entre administradores, emprendedores y posiblemente estudiantes/visitantes, lo cual es base para los distintos actores mencionados (coordinadores, estudiantes emprendedores, clientes).
*   **Emprendimientos y Categorización**:
    *   La tabla `emprendimientos` permite registrar los negocios.
    *   La tabla `categoria` responde directamente a la sugerencia del entrevistado de clasificar por "rubros" (artesanías, alimentos, moda, etc.) en lugar de "niveles de crecimiento".
*   **Mentorías**: La tabla `mentorias` cubre el requisito de registrar el acompañamiento y asesoría ("Asesorías", "tutorías"), que fue identificado como uno de los servicios principales del centro.
*   **Colaboradores y Especialidades**: Las tablas `colaboradores` y `especialidad` parecen alinearse con la necesidad de ofrecer "servicios complementarios" (legales, financieros, marketing) y conectar con expertos de esos sectores.

## 2. No Coincide (Discrepancias Técnicas o de Diseño)
Elementos presentes en el modelo que podrían no estar optimizados según lo conversado:

*   **Tabla `estado`**: Su estructura actual (`creacion`, `revision`, `publicacion` como columnas VARCHAR) es confusa.
    *   *Por qué no coincide*: El entrevistado mencionó que el estado "activo" de un emprendimiento es dinámico (ej. basado en actividad en redes sociales) y no solo un trámite administrativo. Un campo simple `estado` (ENUM: 'Activo', 'Inactivo', etc.) en la tabla principal o una lógica basada en fecha de última actualización sería más acorde que una tabla separada con diseño de columnas extraño.
*   **Falta de Tabla de "Productos"**: El modelo tiene `emprendimientos`, pero el entrevistado habló mucho de "productos" específicos (chocolates, bebidas) y de un "Marketplace" o "Store". Actualmente, el modelo parece limitar al emprendimiento a ser una sola entidad sin un inventario de ítems vendibles o exhibibles por separado.

## 3. No Coincide pero DEBERÍA (Funcionalidades Faltantes Detectadas)
Requisitos explícitos o implícitos en la entrevista que NO están presentes en el modelo de datos y son críticos:

*   **Redes Sociales y Enlaces Externos**:
    *   *Razón*: El entrevistado enfatizó que para validar si un negocio está activo, él revisa sus redes sociales. Además, para la "comercialización", sugirió linkear a los espacios digitales del emprendedor.
    *   *Faltante*: Columnas para Instagram, WhatsApp, Web, TikTok en la tabla `emprendimientos`.
*   **Módulo de Marketing y Promociones**:
    *   *Razón*: Se mencionó explícitamente la necesidad de campañas tipo "Cyber Monday", cupones, descuentos y eventos para mantener el tráfico ("Cyber Model").
    *   *Faltante*: Tablas para `promociones`, `eventos`, `cupones` o `campañas`.
*   **Reseñas y Calificaciones (Feedback)**:
    *   *Razón*: Se validó como útil permitir puntuar y dejar reseñas para dar seguridad al comprador.
    *   *Faltante*: Tabla de `resenas` (reviews) vinculada a emprendimientos o productos.
*   **Contenido de Valor (Blog/Noticias)**:
    *   *Razón*: Para evitar que la plataforma muera por falta de uso, se sugirió incluir contenido que no sea solo de compra/venta (noticias de la UID, beneficios estudiantiles, blogs).
    *   *Faltante*: Tabla de `noticias` o `blog`.
*   **Detalles Formales del Negocio**:
    *   *Razón*: El centro tiene un rol educativo sobre qué permisos (RUC, vigilancia sanitaria) se necesitan.
    *   *Faltante*: Campos específicos o una tabla de `requisitos_legales` vinculada al emprendimiento para trackear si cumplen con la formalización.
*   **Métricas de Visibilidad/Ventas**:
    *   *Razón*: Para generar el "Ranking" sugerido (Top emprendimientos), se necesita registrar visualizaciones (clics) o intenciones de compra.
    *   *Faltante*: Tablas o campos de `estadisticas`, `visitas` o `interacciones`.
