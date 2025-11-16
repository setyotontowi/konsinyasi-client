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

export function formatRupiah(value) {
  if (value === null || value === undefined) return "Rp 0";

  const number = typeof value === "string" ? Number(value) : value;

  if (isNaN(number)) return "Rp 0";

  return number.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });
}

export function parseRupiah(str) {
  if (!str) return 0;

  let cleaned = str
    .toString()
    .replace(/Rp/gi, "")
    .replace(/\s+/g, "")
    .replace(/\./g, "")
    .replace(/,/g, ".")
    .trim();

  const number = parseFloat(cleaned);

  return isNaN(number) ? 0 : number;
}