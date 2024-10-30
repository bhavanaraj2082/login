import fs from 'fs';
import path from 'path';

export async function load() {
    console.log("Loading favourites from JSON file...");

    const filePath = path.resolve('C:/Users/DELL/Desktop/fav/fav/src/lib/data/favourites.json'); // Adjust the path as necessary
    let favouriteItems = [];

    try {
        const fileData = await fs.promises.readFile(filePath, 'utf8');
        favouriteItems = JSON.parse(fileData);
        //console.log("FFFFFFFFFFFFFF");
        
        //console.log(fileData);
        console.log(favouriteItems);
        
        
    } catch (error) {
        console.error('Error reading favourites from JSON file:', error);
    }

    return { favouriteItems };
}
