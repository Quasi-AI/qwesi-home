import { API_ROUTES } from './apiRoutes';

export async function loginWithCredentials(identifier, password) {
  try {
    const response = await fetch(`${API_ROUTES.LOGIN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identifier, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json();

    return {
      success: true,
      user: {
        ...data.user,
        expiresAt: new Date(Date.now() + 3600000).toISOString()
      },
      token: data.token,
      message: 'Login successful'
    };
  } catch (error) {
    console.error('Login error:', error);
    throw new Error(error.message || 'Invalid credentials');
  }
}

export async function signupWithCredentials({ phone, name, dob, email, password }) {
  // Client-side validations
  if (!phone || !name || !dob || !email || !password) {
    throw new Error('All fields are required: phone, name, dob, email, password');
  }
  if (!String(phone).startsWith('+')) {
    throw new Error('Phone number must start with +');
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }
  const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!dateRegex.test(dob)) {
    throw new Error('Date must be in DD/MM/YYYY format');
  }
  if (String(password).length < 4) {
    throw new Error('Password must be at least 4 characters long');
  }

  try {
    const response = await fetch(`${API_ROUTES.SIGNUP}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone, name, dob, email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Signup failed');
    }

    const data = await response.json();

    return {
      success: true,
      user: {
        ...data.user,
        expiresAt: new Date(Date.now() + 3600000).toISOString()
      },
      token: data.token,
      message: 'Account created and logged in successfully'
    };
  } catch (error) {
    console.error('Signup error:', error);
    throw new Error(error.message || 'Signup failed');
  }
}

export async function logoutUser(options = {}) {
  const { redirectTo } = options || {};
  if (redirectTo && typeof window !== 'undefined') {
    window.location.assign(redirectTo);
  }
}

// Firebase handles persistence automatically, but keep these for compatibility
export function persistAuth({ user, token }) {
  // Firebase manages auth state, but store in localStorage for quick access if needed
  try {
    localStorage.setItem('auth', JSON.stringify({ user, token }));
  } catch {}
}

export function clearAuth() {
  try { localStorage.removeItem('auth'); } catch {}
}

export function readAuth() {
  try {
    const raw = localStorage.getItem('auth');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function authFetch(url, options = {}) {
  const storedAuth = readAuth();
  if (!storedAuth || !storedAuth.token) {
    throw new Error('No authenticated user');
  }

  try {
    const headers = { 
      ... (options.headers || {}), 
      Authorization: `Bearer ${storedAuth.token}` 
    };
    const res = await fetch(url, { ...options, headers });
    if (res.status === 401 || res.status === 403) {
      logoutUser({ redirectTo: '/' });
      throw new Error('Unauthorized');
    }
    return res;
  } catch (error) {
    console.error('Auth fetch error:', error);
    throw error;
  }
}

export async function validateStoredToken({ onInvalid } = {}) {
  const storedAuth = readAuth();
  if (!storedAuth || !storedAuth.user || !storedAuth.user.expiresAt) {
    if (typeof onInvalid === 'function') { 
      try { onInvalid(new Error('No authenticated user')); } catch {} 
    }
    return { valid: false };
  }

  try {
    const expiresAt = new Date(storedAuth.user.expiresAt);
    if (new Date() >= expiresAt) {
      logoutUser({ redirectTo: '/' });
      return { valid: false };
    }
    return { valid: true };
  } catch (e) {
    logoutUser({ redirectTo: '/' });
    if (typeof onInvalid === 'function') { 
      try { onInvalid(e); } catch {} 
    }
    return { valid: false };
  }
}

export async function requestPasswordReset(email) {
  if (!email) throw new Error('Email is required');
  try {
    const response = await fetch(`${API_ROUTES.BASE_URL}user/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to send reset instructions');
    }
    return { success: true, message: 'Reset instructions sent to your email' };
  } catch (error) {
    console.error('Password reset error:', error);
    throw new Error(error.message || 'Failed to send reset instructions');
  }
}

export async function resetPassword({ token, newPassword, email }) {
  if (!token || !newPassword || !email) throw new Error('Token, new password, and email are required');
  try {
    const response = await fetch(`${API_ROUTES.BASE_URL}user/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword, email })
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to reset password');
    }
    return { success: true, message: 'Password reset successfully' };
  } catch (error) {
    console.error('Password reset error:', error);
    throw new Error(error.message || 'Failed to reset password');
  }
}
