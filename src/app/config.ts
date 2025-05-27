// src/app/config.ts

// You can change this one IP anytime it changes
export const API_BASE_URL = "http://192.168.0.102:8000/api";


// Example usage api

// Tip for Later:
// Once your backend is up and running, just:

// Uncomment that fetch code

// Replace token with the real one (from login)

// Replace data with your form

// Code:

// import { API_BASE_URL } from "@/app/config";

// const response = await fetch(`${API_BASE_URL}/generate/`, {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${token}`, // if using auth
//   },
//   body: JSON.stringify(data),
// });

// const result = await response.json();
