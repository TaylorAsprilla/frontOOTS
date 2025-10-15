/**
 * Interface para la respuesta del backend al crear/obtener usuarios
 */
export interface UserBackendResponse {
  id: number;
  firstName: string;
  secondName?: string;
  firstLastName: string;
  secondLastName?: string;
  phoneNumber: string;
  email: string;
  documentNumber: string;
  address: string;
  city: string;
  birthDate: string; // ISO string from backend
  status: 'ACTIVE' | 'INACTIVE'; // Backend uses status instead of isActive
  createdAt: string; // ISO string from backend
  updatedAt: string; // ISO string from backend
}

/**
 * Clase modelo para Usuario
 * Define la estructura de datos y métodos para usuarios en el sistema
 */
export class UserModel {
  constructor(
    public id: number,
    public firstName: string,
    public secondName: string,
    public firstLastName: string,
    public secondLastName: string,
    public phoneNumber: string,
    public email: string,
    public password: string,
    public documentNumber: string,
    public address: string,
    public city: string,
    public birthDate: Date,
    public createdAt: Date,
    public updatedAt: Date,
    public isActive: boolean
  ) {}

  /**
   * Crea una instancia de UserModel desde la respuesta del backend
   */
  static fromBackendResponse(response: UserBackendResponse): UserModel {
    return new UserModel(
      response.id,
      response.firstName,
      response.secondName || '',
      response.firstLastName,
      response.secondLastName || '',
      response.phoneNumber,
      response.email,
      '', // password no viene en la respuesta
      response.documentNumber,
      response.address,
      response.city,
      new Date(response.birthDate),
      new Date(response.createdAt),
      new Date(response.updatedAt),
      response.status === 'ACTIVE'
    );
  }

  /**
   * Obtiene el nombre completo del usuario
   */
  getFullName(): string {
    const names = [this.firstName, this.secondName].filter(Boolean);
    const lastNames = [this.firstLastName, this.secondLastName].filter(Boolean);
    return [...names, ...lastNames].join(' ');
  }

  /**
   * Obtiene solo nombres (sin apellidos)
   */
  getFirstNames(): string {
    return [this.firstName, this.secondName].filter(Boolean).join(' ');
  }

  /**
   * Obtiene solo apellidos
   */
  getLastNames(): string {
    return [this.firstLastName, this.secondLastName].filter(Boolean).join(' ');
  }

  /**
   * Obtiene las iniciales del usuario
   */
  getInitials(): string {
    const firstInitial = this.firstName?.charAt(0)?.toUpperCase() || '';
    const lastInitial = this.firstLastName?.charAt(0)?.toUpperCase() || '';
    return firstInitial + lastInitial;
  }

  /**
   * Calcula la edad del usuario basada en la fecha de nacimiento
   */
  getAge(): number | null {
    if (!this.birthDate) return null;

    const birthDate = new Date(this.birthDate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  /**
   * Valida si el email tiene un formato válido
   */
  isValidEmail(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }

  /**
   * Valida si el número de teléfono es válido (formato colombiano)
   */
  isValidPhoneNumber(): boolean {
    const phoneRegex = /^(\+57)?[3][0-9]{9}$/;
    return phoneRegex.test(this.phoneNumber);
  }

  /**
   * Valida si la fecha de nacimiento es válida (no futura y mayor de edad)
   */
  isValidBirthDate(): boolean {
    if (!this.birthDate) return false;

    const birthDate = new Date(this.birthDate);
    const today = new Date();
    const age = this.getAge();

    return birthDate <= today && age !== null && age >= 0;
  }

  /**
   * Verifica si el usuario es mayor de edad
   */
  isAdult(): boolean {
    const age = this.getAge();
    return age !== null && age >= 18;
  }

  /**
   * Valida todos los campos requeridos del usuario
   */
  isValid(): boolean {
    return !!(
      this.firstName &&
      this.firstLastName &&
      this.phoneNumber &&
      this.email &&
      this.documentNumber &&
      this.address &&
      this.city &&
      this.birthDate &&
      this.isValidEmail() &&
      this.isValidPhoneNumber() &&
      this.isValidBirthDate()
    );
  }

  /**
   * Obtiene los errores de validación
   */
  getValidationErrors(): string[] {
    const errors: string[] = [];

    if (!this.firstName) errors.push('El primer nombre es requerido');
    if (!this.firstLastName) errors.push('El primer apellido es requerido');
    if (!this.phoneNumber) errors.push('El número de teléfono es requerido');
    if (!this.email) errors.push('El email es requerido');
    if (!this.documentNumber) errors.push('El número de documento es requerido');
    if (!this.address) errors.push('La dirección es requerida');
    if (!this.city) errors.push('La ciudad es requerida');
    if (!this.birthDate) errors.push('La fecha de nacimiento es requerida');

    if (this.email && !this.isValidEmail()) {
      errors.push('El formato del email no es válido');
    }

    if (this.phoneNumber && !this.isValidPhoneNumber()) {
      errors.push('El formato del número de teléfono no es válido');
    }

    if (this.birthDate && !this.isValidBirthDate()) {
      errors.push('La fecha de nacimiento no es válida');
    }

    return errors;
  }

  /**
   * Formatea el teléfono para mostrar
   */
  getFormattedPhone(): string {
    if (!this.phoneNumber) return '';

    // Si el número no tiene +57, agregarlo
    let phone = this.phoneNumber;
    if (!phone.startsWith('+57')) {
      phone = `+57${phone}`;
    }

    // Formatear como +57 3XX XXX XXXX
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 12 && cleaned.startsWith('57')) {
      return `+57 ${cleaned.substring(2, 5)} ${cleaned.substring(5, 8)} ${cleaned.substring(8)}`;
    }

    return phone;
  }

  /**
   * Formatea la fecha de nacimiento para mostrar
   */
  getFormattedBirthDate(): string {
    if (!this.birthDate) return '';

    const date = new Date(this.birthDate);
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  /**
   * Convierte la instancia a un objeto plano para envío a API
   */
  toPlainObject(): Partial<UserModel> {
    return {
      id: this.id,
      firstName: this.firstName,
      secondName: this.secondName,
      firstLastName: this.firstLastName,
      secondLastName: this.secondLastName,
      phoneNumber: this.phoneNumber,
      email: this.email,
      documentNumber: this.documentNumber,
      address: this.address,
      city: this.city,
      birthDate: this.birthDate,
      isActive: this.isActive,
    };
  }
}

/**
 * Interface para la creación de usuarios (incluye password)
 */
export interface CreateUserRequest {
  firstName: string;
  secondName?: string;
  firstLastName: string;
  secondLastName?: string;
  phoneNumber: string;
  email: string;
  password: string;
  documentNumber: string;
  address: string;
  city: string;
  birthDate: string;
}

/**
 * Interface para la actualización de usuarios (campos opcionales)
 */
export interface UpdateUserRequest {
  firstName?: string;
  secondName?: string;
  firstLastName?: string;
  secondLastName?: string;
  phoneNumber?: string;
  email?: string;
  documentNumber?: string;
  address?: string;
  city?: string;
  birthDate?: string;
}

/**
 * Interface para la respuesta de la API
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

/**
 * Interface para la respuesta paginada de usuarios
 */
export interface PaginatedUsersResponse {
  users: UserModel[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Interface para filtros de búsqueda de usuarios
 */
export interface UserFilters {
  search?: string;
  city?: string;
  isActive?: boolean;
  ageMin?: number;
  ageMax?: number;
  documentType?: DocumentType;
  createdAfter?: string;
  createdBefore?: string;
}

/**
 * Interface para opciones de ordenamiento
 */
export interface UserSortOptions {
  field: keyof UserModel;
  direction: 'asc' | 'desc';
}

/**
 * Interface para respuesta de verificación de existencia
 */
export interface ExistenceCheckResponse {
  exists: boolean;
  message?: string;
}

/**
 * Type para campos requeridos en la creación de usuario
 */
export type RequiredUserFields = Pick<
  UserModel,
  | 'firstName'
  | 'firstLastName'
  | 'phoneNumber'
  | 'email'
  | 'password'
  | 'documentNumber'
  | 'address'
  | 'city'
  | 'birthDate'
>;

/**
 * Type para campos opcionales en la actualización de usuario
 */
export type UpdatableUserFields = Partial<Omit<UserModel, 'id' | 'createdAt' | 'updatedAt' | 'password'>>;

/**
 * Interface para estadísticas de usuarios
 */
export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  newThisMonth: number;
  averageAge: number;
  citiesCount: number;
  topCities: Array<{ city: string; count: number }>;
}

/**
 * Clase utilitaria para operaciones con usuarios
 */
export class UserUtils {
  /**
   * Filtra usuarios por criterios múltiples
   */
  static filterUsers(users: UserModel[], filters: UserFilters): UserModel[] {
    return users.filter((user) => {
      // Filtro por término de búsqueda
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch =
          user.firstName.toLowerCase().includes(searchTerm) ||
          user.firstLastName.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm) ||
          user.phoneNumber.includes(searchTerm) ||
          user.documentNumber.includes(searchTerm) ||
          (user.secondName && user.secondName.toLowerCase().includes(searchTerm)) ||
          (user.secondLastName && user.secondLastName.toLowerCase().includes(searchTerm));

        if (!matchesSearch) return false;
      }

      // Filtro por ciudad
      if (filters.city && user.city.toLowerCase() !== filters.city.toLowerCase()) {
        return false;
      }

      // Filtro por estado activo
      if (filters.isActive !== undefined && user.isActive !== filters.isActive) {
        return false;
      }

      // Filtro por edad mínima
      if (filters.ageMin !== undefined) {
        const age = user.getAge();
        if (age === null || age < filters.ageMin) return false;
      }

      // Filtro por edad máxima
      if (filters.ageMax !== undefined) {
        const age = user.getAge();
        if (age === null || age > filters.ageMax) return false;
      }

      // Filtro por fecha de creación
      if (filters.createdAfter && user.createdAt) {
        if (new Date(user.createdAt) < new Date(filters.createdAfter)) return false;
      }

      if (filters.createdBefore && user.createdAt) {
        if (new Date(user.createdAt) > new Date(filters.createdBefore)) return false;
      }

      return true;
    });
  }

  /**
   * Ordena usuarios por el campo especificado
   */
  static sortUsers(users: UserModel[], sortOptions: UserSortOptions): UserModel[] {
    return [...users].sort((a, b) => {
      const aValue = a[sortOptions.field];
      const bValue = b[sortOptions.field];

      if (aValue === undefined && bValue === undefined) return 0;
      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;

      let comparison = 0;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return sortOptions.direction === 'desc' ? -comparison : comparison;
    });
  }

  /**
   * Calcula estadísticas de una lista de usuarios
   */
  static calculateStats(users: UserModel[]): UserStats {
    const total = users.length;
    const active = users.filter((u) => u.isActive).length;
    const inactive = total - active;

    // Usuarios nuevos este mes
    const thisMonth = new Date();
    thisMonth.setDate(1);
    const newThisMonth = users.filter((u) => u.createdAt && new Date(u.createdAt) >= thisMonth).length;

    // Edad promedio
    const agesSum = users.reduce((sum, user) => {
      const age = user.getAge();
      return age !== null ? sum + age : sum;
    }, 0);
    const usersWithAge = users.filter((u) => u.getAge() !== null).length;
    const averageAge = usersWithAge > 0 ? Math.round(agesSum / usersWithAge) : 0;

    // Ciudades más comunes
    const cityCounts = users.reduce((counts, user) => {
      const city = user.city.trim();
      counts[city] = (counts[city] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);

    const topCities = Object.entries(cityCounts)
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      total,
      active,
      inactive,
      newThisMonth,
      averageAge,
      citiesCount: Object.keys(cityCounts).length,
      topCities,
    };
  }

  /**
   * Agrupa usuarios por ciudad
   */
  static groupByCity(users: UserModel[]): Record<string, UserModel[]> {
    return users.reduce((groups, user) => {
      const city = user.city.trim();
      if (!groups[city]) {
        groups[city] = [];
      }
      groups[city].push(user);
      return groups;
    }, {} as Record<string, UserModel[]>);
  }

  /**
   * Encuentra duplicados potenciales por email o documento
   */
  static findPotentialDuplicates(users: UserModel[]): Array<{ type: 'email' | 'document'; users: UserModel[] }> {
    const duplicates: Array<{ type: 'email' | 'document'; users: UserModel[] }> = [];

    // Duplicados por email
    const emailGroups = users.reduce((groups, user) => {
      const email = user.email.toLowerCase().trim();
      if (!groups[email]) groups[email] = [];
      groups[email].push(user);
      return groups;
    }, {} as Record<string, UserModel[]>);

    Object.values(emailGroups).forEach((group) => {
      if (group.length > 1) {
        duplicates.push({ type: 'email', users: group });
      }
    });

    // Duplicados por documento
    const documentGroups = users.reduce((groups, user) => {
      const doc = user.documentNumber.trim();
      if (!groups[doc]) groups[doc] = [];
      groups[doc].push(user);
      return groups;
    }, {} as Record<string, UserModel[]>);

    Object.values(documentGroups).forEach((group) => {
      if (group.length > 1) {
        duplicates.push({ type: 'document', users: group });
      }
    });

    return duplicates;
  }

  /**
   * Valida un lote de usuarios y retorna errores
   */
  static validateBatch(users: UserModel[]): Array<{ user: UserModel; errors: string[] }> {
    return users
      .map((user) => ({
        user,
        errors: user.getValidationErrors(),
      }))
      .filter((result) => result.errors.length > 0);
  }

  /**
   * Exporta usuarios a formato CSV
   */
  static exportToCSV(users: UserModel[]): string {
    const headers = [
      'ID',
      'Primer Nombre',
      'Segundo Nombre',
      'Primer Apellido',
      'Segundo Apellido',
      'Teléfono',
      'Email',
      'Documento',
      'Dirección',
      'Ciudad',
      'Fecha Nacimiento',
      'Edad',
      'Activo',
      'Fecha Creación',
    ];

    const rows = users.map((user) => [
      user.id || '',
      user.firstName,
      user.secondName || '',
      user.firstLastName,
      user.secondLastName || '',
      user.getFormattedPhone(),
      user.email,
      user.documentNumber,
      user.address,
      user.city,
      user.getFormattedBirthDate(),
      user.getAge() || '',
      user.isActive ? 'Sí' : 'No',
      user.createdAt ? new Date(user.createdAt).toLocaleDateString('es-CO') : '',
    ]);

    return [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
  }
}
