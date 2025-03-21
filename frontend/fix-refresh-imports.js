const fs = require('fs');
const path = require('path');

// src дотор байгаа бүх JS файлуудыг авах
function getAllJsFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory() && file !== 'node_modules') {
      // Хэрэв директори бол рекурсив давтах
      fileList = getAllJsFiles(filePath, fileList);
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      // JS/JSX файл л авах
      fileList.push(filePath);
    }
  });

  return fileList;
}

// Файлаас react-refresh/runtime импортуудыг засах
function fixImportsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Импортуудыг засах
    const oldImport = /from\s+['"]..\/..\/node_modules\/react-refresh\/runtime['"]/g;
    const newImport = 'from \'react-refresh/runtime\'';
    
    // Өөрчлөлт хийгдсэн эсэхийг шалгах
    if (oldImport.test(content)) {
      content = content.replace(oldImport, newImport);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed imports in ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
    return false;
  }
}

// Үндсэн функц
function main() {
  const srcDir = path.join(__dirname, 'src');
  const jsFiles = getAllJsFiles(srcDir);
  
  console.log(`Found ${jsFiles.length} JS/JSX files to check.`);
  
  let fixedCount = 0;
  jsFiles.forEach(file => {
    if (fixImportsInFile(file)) {
      fixedCount++;
    }
  });
  
  console.log(`Fixed imports in ${fixedCount} files.`);
}

main(); 