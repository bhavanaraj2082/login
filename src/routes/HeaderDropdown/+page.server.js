
import PocketBase from 'pocketbase';
import { fetchProductName } from '$lib/server/actions'; 

export async function load() {
  const pb = new PocketBase("https://chemikartpb.partskeys.com");

  try {
    
    await pb.admins.authWithPassword("team@partskeys.com", "eICwDzXNaqXjtmD0qHEUpb7PxfgKtJva");

   
    const productNames = await fetchProductName();

    return { productNames }; 
  } catch (error) {
    console.error("Error loading page:", error);
    return { productNames: [] }; 
  }
}
