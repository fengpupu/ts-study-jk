const { PDFDocument } = require('pdf-lib');
const fs = require('fs')
const path = require('path')

const getCopyPages = async (doc,newDoc)=>{
  const indices = doc.getPageIndices()
  const copiedPages = await newDoc.copyPages(doc, indices)
  for(let page of copiedPages){
    newDoc.addPage(page)
  }

}
// async function mergePdfs(sourcePdfPath1, sourcePdfPath2, destinationPdfPath) {
//   // 读取源PDF文件
//   const pdfDoc1 = await PDFDocument.load(fs.readFileSync(__dirname+sourcePdfPath1));
//   const pdfDoc2 = await PDFDocument.load(fs.readFileSync(__dirname+sourcePdfPath2));
//   // 创建一个新的 PDF 文档并添加内容
//   const pdfDoc = await PDFDocument.create();
//   await getCopyPages(pdfDoc1,pdfDoc)
//   await getCopyPages(pdfDoc2,pdfDoc) 
//   // 写入目标 PDF 文件
//   fs.writeFileSync(__dirname+destinationPdfPath, await pdfDoc.save());
//   console.log('---down')
// }
async function mergePdfs(sourcePdfArr, destinationPdfPath) {
   // 创建一个新的 PDF 文档并添加内容
  const pdfDocNew = await PDFDocument.create();
  for(const path of sourcePdfArr){
    const pdfDoc = await PDFDocument.load(fs.readFileSync(__dirname + path));
    await getCopyPages(pdfDoc,pdfDocNew)
  }
  // 写入目标 PDF 文件
  fs.writeFileSync(__dirname+destinationPdfPath, await pdfDocNew.save());
  console.log('---down')
}
// console.log(path.join('./','00.pdf'))
// 使用示例
const pathArr = []
for(let i = 0;i <= 59;i++){
  const path = i < 10 ? '0' + i : i
  pathArr.push('/' + path + '.pdf')
}
mergePdfs(pathArr, '/tsStudy.pdf');
