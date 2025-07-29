export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  dob: string;
  profileImage?: string;
  isPro?: boolean;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface LoginData {
  phone: string;
  password: string;
}

export interface SignupData {
  phone: string;
  name: string;
  dob: string;
  email: string;
  password: string;
}

export interface ProfileData {
  name?: string;
  email?: string;
  phone?: string;
  dob?: string;
  profileImage?: string;
}

export interface CountryCode {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}
