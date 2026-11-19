import { apiRequest } from '../../../helpers/apiHelper'

export async function registerUser(payload) {
  return apiRequest('/api/auth/register', {
    method: 'POST',
    body: payload,
  })
}

export async function loginUser(payload) {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    body: payload,
  })
}

export async function logoutUser() {
  return apiRequest('/api/auth/logout', {
    method: 'POST',
  })
}

export async function fetchProfile() {
  return apiRequest('/api/auth/profile', {
    method: 'GET',
  })
}

export async function updateProfile(payload) {
  return apiRequest('/api/auth/profile', {
    method: 'PUT',
    body: payload,
  })
}
