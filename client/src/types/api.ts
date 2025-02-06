export interface User {
  username: string;
  email: string;
  role?: 'admin' | 'user';  // Optionnel car non spécifié dans les consignes
  password?: string;        // Uniquement pour la création/modification
  _id: string;
  nom?: string;
  prenom?: string;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface CatwayReference {
  _id: string;
  catwayNumber: number;
  catwayType: 'long' | 'short';
}

export interface ReservationFormData {
  catwayId: string;
  clientName: string;
  boatName: string;
  startDate: string;
  endDate: string;
  status?: 'pending' | 'confirmed' | 'cancelled';
  _id?: string;
}

export interface Reservation {
  _id: string;
  catwayNumber: string;
  clientName: string;
  boatName: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  user: {
    _id: string;
    username: string;
    email: string;
  };
}

// Interface pour un nouveau catway (création)
export interface NewCatway {
  catwayNumber: number;
  catwayType: 'long' | 'short';
  catwayState: string;
}

// Interface pour un catway existant (avec toutes les propriétés)
export interface Catway {
  _id: string;
  catwayNumber: number;
  catwayType: 'long' | 'short';
  catwayState: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
} 