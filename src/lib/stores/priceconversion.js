
import { writable } from 'svelte/store';
export const conversionRate = writable(90);
export const convertUsdToInr = (usd) => {
    let inr = usd * 90; 
  return inr.toFixed(2); 
};
