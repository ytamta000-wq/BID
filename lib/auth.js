export const AUTH_KEY = "bid_auth_v4";
export function getClientAuth(){
  if(typeof window === "undefined") return null;
  try{return JSON.parse(localStorage.getItem(AUTH_KEY)||"null")}catch{return null}
}
export function setClientAuth(data){if(typeof window!="undefined") localStorage.setItem(AUTH_KEY,JSON.stringify(data))}
export function clearClientAuth(){if(typeof window!="undefined") localStorage.removeItem(AUTH_KEY)}
export function strongPassword(){
 const chars="ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*";
 const a=new Uint32Array(18); crypto.getRandomValues(a); return Array.from(a,x=>chars[x%chars.length]).join("");
}
