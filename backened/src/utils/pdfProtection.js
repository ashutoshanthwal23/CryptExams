import { Recipe } from 'muhammara';
import createHttpError from 'http-errors';


export const addPasswordToPdf = (srcPath, destPath, password) => {

  return new Promise((resolve, reject) => {
    try{
      const pdfDoc = new Recipe(srcPath, destPath);
      pdfDoc
        .encrypt({
          userPassword: password,
          ownerPassword: password,
          userProtectionFlag: 4,
        })
        .endPDF();
        resolve("success");
        
    } catch(err){
      reject(createHttpError(500, err.message));
    }

  })
}

