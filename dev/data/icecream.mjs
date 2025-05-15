import fs from "fs/promises";
// promises?
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const jsonFile = path.join(__dirname, "baskin.json");

export async function loadIcecreamData() {
    const raw = await fs.readFile(jsonFile,'utf8')
    const arr = JSON.parse(raw)
    return arr.map(({_idx,ice_name,Image_Url,Description})=>({_idx,ice_name,Image_Url,Description}))
}