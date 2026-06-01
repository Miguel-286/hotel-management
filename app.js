// ==========================================
// GESTIÓN DE HOTELES Y HABITACIONES
// ==========================================

class HotelManager {
    constructor() {
        this.hoteles = this.cargarHoteles();
        this.habitaciones = this.cargarHabitaciones();
        this.init();
    }

    // ==========================================
    // INICIALIZACIÓN
    // ==========================================
    init() {
        this.setupEventListeners();
        this.renderHoteles();
        this.renderHabitaciones();
        this.cargarSelectHoteles();
    }

    // ==========================================
    // EVENT LISTENERS
    // ==========================================
    setupEventListeners() {
        // Navegación sidebar
        document.querySelectorAll('[data-section]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.cambiarSeccion(link.dataset.section);
            });
        });

        // Formularios
        document.getElementById('hotelForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.agregarHotel();
        });

        document.getElementById('habitacionForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.agregarHabitacion();
        });

        document.getElementById('editHotelForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.actualizarHotel();
        });

        document.getElementById('editHabitacionForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.actualizarHabitacion();
        });
    }

    // ==========================================
    // NAVEGACIÓN
    // ==========================================
    cambiarSeccion(seccion) {
        // Cambiar secciones visibles
        document.querySelectorAll('.section-content').forEach(section => {
            section.classList.add('d-none');
        });
        document.getElementById(`${seccion}-section`).classList.remove('d-none');

        // Actualizar nav links activos
        document.querySelectorAll('[data-section]').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-section="${seccion}"]`).classList.add('active');
    }

    // ==========================================
    // HOTELES - CRUD
    // ==========================================
    agregarHotel() {
        const nombre = document.getElementById('hotelNombre').value.trim();
        const ubicacion = document.getElementById('hotelUbicacion').value.trim();
        const estrellas = parseInt(document.getElementById('hotelEstrellas').value);

        if (!nombre || !ubicacion || !estrellas) {
            this.mostrarAlerta('Por favor complete todos los campos', 'warning');
            return;
        }

        const hotel = {
            id: Date.now(),
            nombre,
            ubicacion,
            estrellas,
            fechaRegistro: new Date().toLocaleDateString()
        };

        this.hoteles.push(hotel);
        this.guardarHoteles();
        this.renderHoteles();
        this.cargarSelectHoteles();
        this.limpiarFormulario('hotelForm');
        this.mostrarAlerta('Hotel agregado exitosamente', 'success');
    }

    editarHotel(id) {
        const hotel = this.hoteles.find(h => h.id === id);
        if (!hotel) return;

        document.getElementById('editHotelId').value = hotel.id;
        document.getElementById('editHotelNombre').value = hotel.nombre;
        document.getElementById('editHotelUbicacion').value = hotel.ubicacion;
        document.getElementById('editHotelEstrellas').value = hotel.estrellas;

        new bootstrap.Modal(document.getElementById('editHotelModal')).show();
    }

    actualizarHotel() {
        const id = parseInt(document.getElementById('editHotelId').value);
        const nombre = document.getElementById('editHotelNombre').value.trim();
        const ubicacion = document.getElementById('editHotelUbicacion').value.trim();
        const estrellas = parseInt(document.getElementById('editHotelEstrellas').value);

        const hotel = this.hoteles.find(h => h.id === id);
        if (hotel) {
            hotel.nombre = nombre;
            hotel.ubicacion = ubicacion;
            hotel.estrellas = estrellas;
            this.guardarHoteles();
            this.renderHoteles();
            this.cargarSelectHoteles();
            bootstrap.Modal.getInstance(document.getElementById('editHotelModal')).hide();
            this.mostrarAlerta('Hotel actualizado exitosamente', 'success');
        }
    }

    eliminarHotel(id) {
        if (confirm('¿Está seguro que desea eliminar este hotel?')) {
            this.hoteles = this.hoteles.filter(h => h.id !== id);
            this.habitaciones = this.habitaciones.filter(hab => hab.hotelId !== id);
            this.guardarHoteles();
            this.guardarHabitaciones();
            this.renderHoteles();
            this.renderHabitaciones();
            this.cargarSelectHoteles();
            this.mostrarAlerta('Hotel eliminado exitosamente', 'info');
        }
    }

    renderHoteles() {
        const tbody = document.getElementById('hotelTableBody');
        
        if (this.hoteles.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted py-5"><div class="empty-state"><div class="empty-state-icon">∅</div><p>No hay hoteles registrados</p><small>Agrega tu primer hotel para comenzar</small></div></td></tr>';
            return;
        }

        tbody.innerHTML = this.hoteles.map(hotel => `
            <tr>
                <td><strong>${hotel.nombre}</strong></td>
                <td>${hotel.ubicacion}</td>
                <td>
                    <span class="badge bg-warning">
                        ${this.renderEstrellas(hotel.estrellas)}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="manager.editarHotel(${hotel.id})">
                        Editar
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="manager.eliminarHotel(${hotel.id})">
                        Eliminar
                    </button>
                </td>
            </tr>
        `).join('');
    }

    renderEstrellas(cantidad) {
        return Array(cantidad).fill('★').join('');
    }

    // ==========================================
    // HABITACIONES - CRUD
    // ==========================================
    agregarHabitacion() {
        const hotelId = parseInt(document.getElementById('habitacionHotel').value);
        const codigo = document.getElementById('habitacionCodigo').value.trim();
        const piso = parseInt(document.getElementById('habitacionPiso').value);
        const capacidad = parseInt(document.getElementById('habitacionCapacidad').value);
        const tipo = document.getElementById('habitacionTipo').value;

        if (!hotelId || !codigo || !piso || !capacidad || !tipo) {
            this.mostrarAlerta('Por favor complete todos los campos', 'warning');
            return;
        }

        const habitacion = {
            id: Date.now(),
            hotelId,
            codigo,
            piso,
            capacidad,
            tipo,
            fechaRegistro: new Date().toLocaleDateString()
        };

        this.habitaciones.push(habitacion);
        this.guardarHabitaciones();
        this.renderHabitaciones();
        this.limpiarFormulario('habitacionForm');
        this.mostrarAlerta('Habitación agregada exitosamente', 'success');
    }

    editarHabitacion(id) {
        const habitacion = this.habitaciones.find(h => h.id === id);
        if (!habitacion) return;

        document.getElementById('editHabitacionId').value = habitacion.id;
        document.getElementById('editHabitacionCodigo').value = habitacion.codigo;
        document.getElementById('editHabitacionPiso').value = habitacion.piso;
        document.getElementById('editHabitacionCapacidad').value = habitacion.capacidad;
        document.getElementById('editHabitacionTipo').value = habitacion.tipo;

        new bootstrap.Modal(document.getElementById('editHabitacionModal')).show();
    }

    actualizarHabitacion() {
        const id = parseInt(document.getElementById('editHabitacionId').value);
        const codigo = document.getElementById('editHabitacionCodigo').value.trim();
        const piso = parseInt(document.getElementById('editHabitacionPiso').value);
        const capacidad = parseInt(document.getElementById('editHabitacionCapacidad').value);
        const tipo = document.getElementById('editHabitacionTipo').value;

        const habitacion = this.habitaciones.find(h => h.id === id);
        if (habitacion) {
            habitacion.codigo = codigo;
            habitacion.piso = piso;
            habitacion.capacidad = capacidad;
            habitacion.tipo = tipo;
            this.guardarHabitaciones();
            this.renderHabitaciones();
            bootstrap.Modal.getInstance(document.getElementById('editHabitacionModal')).hide();
            this.mostrarAlerta('Habitación actualizada exitosamente', 'success');
        }
    }

    eliminarHabitacion(id) {
        if (confirm('¿Está seguro que desea eliminar esta habitación?')) {
            this.habitaciones = this.habitaciones.filter(h => h.id !== id);
            this.guardarHabitaciones();
            this.renderHabitaciones();
            this.mostrarAlerta('Habitación eliminada exitosamente', 'info');
        }
    }

    renderHabitaciones() {
        const tbody = document.getElementById('habitacionTableBody');
        
        if (this.habitaciones.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-5"><div class="empty-state"><div class="empty-state-icon">∅</div><p>No hay habitaciones registradas</p><small>Registra tu primera habitación para comenzar</small></div></td></tr>';
            return;
        }

        tbody.innerHTML = this.habitaciones.map(habitacion => {
            const hotel = this.hoteles.find(h => h.id === habitacion.hotelId);
            const hotelNombre = hotel ? hotel.nombre : 'Hotel no encontrado';
            const tipoColor = habitacion.tipo === 'Suite' ? 'primary' : habitacion.tipo === 'Doble' ? 'info' : 'secondary';
            
            return `
                <tr>
                    <td><strong>${hotelNombre}</strong></td>
                    <td>${habitacion.codigo}</td>
                    <td>${habitacion.piso}</td>
                    <td>${habitacion.capacidad} personas</td>
                    <td><span class="badge bg-${tipoColor}">${habitacion.tipo}</span></td>
                    <td>
                        <button class="btn btn-sm btn-warning" onclick="manager.editarHabitacion(${habitacion.id})">
                            Editar
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="manager.eliminarHabitacion(${habitacion.id})">
                            Eliminar
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    // ==========================================
    // SELECTORES
    // ==========================================
    cargarSelectHoteles() {
        const select = document.getElementById('habitacionHotel');
        const currentValue = select.value;
        
        select.innerHTML = '<option value="">-- Seleccione un hotel --</option>';
        
        this.hoteles.forEach(hotel => {
            const option = document.createElement('option');
            option.value = hotel.id;
            option.textContent = hotel.nombre;
            select.appendChild(option);
        });

        select.value = currentValue;
    }

    // ==========================================
    // STORAGE - LOCAL
    // ==========================================
    cargarHoteles() {
        const datos = localStorage.getItem('hoteles');
        return datos ? JSON.parse(datos) : [];
    }

    guardarHoteles() {
        localStorage.setItem('hoteles', JSON.stringify(this.hoteles));
    }

    cargarHabitaciones() {
        const datos = localStorage.getItem('habitaciones');
        return datos ? JSON.parse(datos) : [];
    }

    guardarHabitaciones() {
        localStorage.setItem('habitaciones', JSON.stringify(this.habitaciones));
    }

    // ==========================================
    // UTILIDADES
    // ==========================================
    limpiarFormulario(idFormulario) {
        document.getElementById(idFormulario).reset();
    }

    mostrarAlerta(mensaje, tipo = 'info') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${tipo} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
        alertDiv.style.zIndex = '9999';
        alertDiv.innerHTML = `
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(alertDiv);
        
        setTimeout(() => {
            alertDiv.remove();
        }, 4000);
    }
}

// ==========================================
// INICIALIZAR LA APLICACIÓN
// ==========================================
let manager;

document.addEventListener('DOMContentLoaded', () => {
    manager = new HotelManager();
    console.log('Aplicación de Gestión Hotelera iniciada correctamente');
});