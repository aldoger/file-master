import { convert } from 'docx2pdf-converter'; 
import path from 'path';

export async function convertDocsToPDF(filePath, outName) {
    try {
        const outPath = path.join(__dirname, outName);
        convert(filePath, outPath);
        return true;
    } catch (err) {
        return false;
    }
}