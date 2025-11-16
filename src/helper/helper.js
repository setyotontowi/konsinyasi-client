import { jwtDecode } from "jwt-decode";

export function getLocalNow() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  // Convert to "YYYY-MM-DD HH:mm"
  return local.toISOString().slice(0, 16).replace("T", " ");
}

export function formatToReadableLocal(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (isNaN(date)) return ""; // guard against invalid date

  // Shift UTC → local timezone
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

  // Format into "YYYY-MM-DD HH:mm"
  return local.toISOString().slice(0, 16).replace("T", " ");
}

export function formatToReadableDate(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (isNaN(date)) return ""; // guard against invalid date

  // Shift UTC → local timezone
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

  // Format into "YYYY-MM-DD"
  return local.toISOString().slice(0, 10);
}

export const getAuthUser = () => {
  const token = localStorage.getItem("auth_token");
  if (!token) return {};

  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("Invalid or expired JWT token:", error);
    return {};
  }
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('auth_token')
  if (!token) return false

  try {
    const decoded = jwtDecode(token)

    // exp is in seconds, convert to ms
    if (decoded.exp * 1000 < Date.now()) {
      // expired → remove token
      localStorage.removeItem('auth_token')
      return false
    }

    return true
  } catch (err) {
    // corrupted token → remove token
    localStorage.removeItem('auth_token')
    return false
  }
}