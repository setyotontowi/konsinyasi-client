import React from 'react'
import { jwtDecode } from "jwt-decode";

export default function Topbar() {

  let username = "";
  let unit = ""

  try {
    const token = localStorage.getItem("auth_token");
    if (token) {
      const decoded = jwtDecode(token);
      console.log(decoded);
      username = decoded.name || "";
      unit = decoded.unit_name ? ` - ${decoded.unit_name}` : "";
    }
  } catch (err) {
    console.error("JWT decode failed:", err);
  }


  return (
    <div className="flex items-center justify-between bg-white border-b border-b-gray-200 p-4">
      <h1 className="text-xl font-semibold"></h1>
      <div className="text-sm text-gray-600">{username ? username : "User"}{unit}</div>
    </div>
  )
}