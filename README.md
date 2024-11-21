# Sistema de Gestión para Clínica Online (Trabajo Práctico)

#### Materia: Laboratorio de Computación IV
#### Alumno: Mateo Spatola

---

## 1. Descripción del Proyecto
Este sistema fue desarrollado para gestionar las operaciones de la Clínica Online, ofreciendo funcionalidades como el registro de usuarios, asignación de turnos, gestión de historias clínicas, y reportes. Está diseñado para facilitar la interacción entre pacientes, especialistas y administradores, promoviendo una experiencia de usuario eficiente e intuitiva.

**URL del sistema:** [https://spatolamateo-clinicaonline.web.app/](https://spatolamateo-clinicaonline.web.app/)  
**Alojamiento:** Firebase (incluye autenticación y base de datos).

---

## 2. Requerimientos del Sistema
El sistema incluye las siguientes funcionalidades:  
- **Registro y autenticación de usuarios:** Pacientes, especialistas y administradores.  
- **Gestión de turnos:** Solicitud, aceptación, cancelación, y finalización de turnos.  
- **Historias clínicas:** Creación, visualización y descarga de reportes en PDF.  
- **Administración:** Gestión de usuarios y turnos por parte de los administradores.  
- **Animaciones:** Transiciones fluidas entre componentes para mejorar la experiencia del usuario.

---

## 3. Funcionalidades por Sprint

### Sprint 1:
- Página de bienvenida con accesos a registro y login.  
- Registro diferenciado para pacientes y especialistas.  
- Login con validación de roles y estado de activación.  
- Gestión de usuarios para administradores, con permisos para habilitar o inhabilitar cuentas.  

### Sprint 2:
- Solicitud de turnos por especialidad, profesional y disponibilidad horaria.  
- Visualización de turnos con filtros avanzados para pacientes, especialistas y administradores.  
- Gestión de disponibilidad horaria por parte de los especialistas.  

### Sprint 3:
- Historias clínicas asociadas a cada paciente.  
- Descarga de reportes en PDF con logo, título y fecha.  
- Exportación de datos de usuarios a Excel por parte de administradores.  
- Mejoras en los filtros y animaciones de navegación.  

---

## 4. Modificaciones Realizadas

### Sprint 1:
- **Botones de acceso rápido** con imágenes de perfil de los usuarios.  
- **Registro simplificado** con botones iniciales que diferencian entre paciente y especialista.  

### Sprint 2:
- **Solicitud de turnos con botones visuales:**  
  - Especialidades como botones redondos con imágenes.  
  - Profesionales como botones redondos con nombres debajo.  
  - Fechas y horarios en formatos claros y rectangulares.  

### Sprint 3:
- **Visualización de pacientes atendidos** para especialistas, con acceso a detalles de turnos y reseñas.  
- **Exportación de datos en Excel** desde la sección de usuarios para administradores.  
- **Mejora de la sección "Mi Perfil"** para pacientes con descarga de historias clínicas en PDF.  
- **Animaciones de transición** entre componentes, como desplazamiento desde arriba hacia abajo.  

---

## 5. Guía de Usuario

### Página de inicio:
- Acceso al sistema mediante botones de login o registro.  
- Botones de acceso rápido para usuarios registrados (3 pacientes, 2 especialistas, 1 administrador).  

### Registro:
- Selección inicial entre paciente o especialista.  
- Formularios adaptados a cada rol, con validación de campos y reCAPTCHA.  

### Gestión de Turnos:
- Solicitar un turno:  
  1. Seleccionar especialidad (botones redondos).  
  2. Elegir profesional (botones redondos con nombres).  
  3. Seleccionar día y horario (botones rectangulares).  
- Visualización de turnos según el rol del usuario (paciente, especialista o administrador).  

### Historias Clínicas:
- Acceso desde el perfil del paciente o la sección de usuarios para administradores.  
- Creación y edición de historias clínicas por parte de los especialistas.  
- Descarga en PDF para pacientes.  

### Administración:
- Gestión de usuarios con exportación de datos a Excel.  
- Control total sobre las cuentas de usuarios y turnos de la clínica.  

---

## 6. Imágenes Representativas

### **Inicio**
![Inicio](Imagenes_readme/inicio.png)  
Pantalla inicial del sistema.

![Inicio Logueado](Imagenes_readme/inicio_logueado.png)  
Pantalla inicial del sistema (estando logueado).

### **Ingreso de Usuarios**
![Ingreso](Imagenes_readme/ingreso.png)  
Formulario de ingreso al sistema.

![Ingreso Acceso Rápido](Imagenes_readme/ingreso_acceso_rapido.png)  
Acceso rápido.

### **Registro de Usuarios**
![Registro](Imagenes_readme/registro.png)  
Página de registro.

![Registro de Pacientes](Imagenes_readme/registro_paciente.png)  
Formulario de registro para pacientes.

![Registro de Especialistas](Imagenes_readme/registro_especialista.png)  
Formulario de registro para especialistas.

![Registro de Administradores](Imagenes_readme/registro_administrador.png)  
Formulario de registro para administradores (solo desde un admin).

### **Gestión de Turnos**
![Solicitar Turno - Especialidad](Imagenes_readme/solicitar_turno_desde_paciente.png)  
Pantalla para seleccionar especialidad al solicitar un turno desde un paciente.  

![Solicitar Turno desde Admin 1](Imagenes_readme/solicitar_turno_desde_admin_1.png)  
Pantalla para seleccionar paciente al solicitar un turno desde un administrador (1)

![Solicitar Turno desde Admin 2](Imagenes_readme/solicitar_turno_desde_admin_2.png) 
Pantalla para seleccionar paciente al solicitar un turno desde un administrador (2)

![Solicitar Turno desde Admin 3](Imagenes_readme/solicitar_turno_desde_admin_3.png)  
Pantalla para seleccionar paciente al solicitar un turno desde un administrador (3)

### **Listados**
![Listado Turnos](Imagenes_readme/listado_turnos.png)  
Listado de turnos desde un administrador.

![Listado de Turnos](Imagenes_readme/listado_turnos_paciente.png)  
Listado de turnos solicitados por el paciente.

![Listado Turnos Especialista](Imagenes_readme/listado_turnos_especialista.png)
Listado de turnos del especialista. 

![Listado Usuarios](Imagenes_readme/listado_usuarios.png) 
Listado de usuarios desde un administrador.

### **Historias Clínicas**
![Historia Clínica](Imagenes_readme/ver_historia_clinica_paciente.png)  
Visualización de la historia clínica de un paciente.

![Ver Historia Clínica desde Especialista](Imagenes_readme/ver_historia_clinica_desde_especialista.png)   
Visualización de la historia clínica de un especialista.

![PDF Historia Clínica](Imagenes_readme/pdf_historia_clinica.png)  
Informe en PDF de la historia clínica del paciente.

### **Otras imágenes**
- ![Validaciones Registro](Imagenes_readme/validaciones_registro.png)  
- ![Seleccion Especialidades](Imagenes_readme/seleccion_especialidades.png)  
- ![Aceptar Turno](Imagenes_readme/aceptar_turno.png)  
- ![Completar Historia Clínica](Imagenes_readme/completar_historia_clinica.png)  
- ![Completar Historia Clínica Datos Dinámicos](Imagenes_readme/completar_historia_clinica_datos_dinamicos.png)  
- ![Filtrar Historia Clínica desde Especialista](Imagenes_readme/filtrar_historia_clinica_desde_especialista.png)  
- ![Filtro Listado Usuarios](Imagenes_readme/filtro_listado_usuarios.png)  
- ![Historias Clínicas Vacías](Imagenes_readme/historias_clinicas_vacias.png)  
- ![Modal Cancelación](Imagenes_readme/modal_cancelacion.png)  
- ![Modal Información](Imagenes_readme/modal_info.png)  
- ![Modificar Horarios Especialista](Imagenes_readme/modificar_horarios_especialista.png)  
- ![Notificación Exitosa](Imagenes_readme/notificacion_exitosa.png)  
- ![Pacientes Atendidos Especialista](Imagenes_readme/pacientes_atendidos_especialista.png)  
- ![Perfil Especialista](Imagenes_readme/perfil_especialista.png)  
- ![Perfil Paciente](Imagenes_readme/perfil_paciente.png)  
- ![Seleccion Usuario](Imagenes_readme/seleccion_usuario.png)  
