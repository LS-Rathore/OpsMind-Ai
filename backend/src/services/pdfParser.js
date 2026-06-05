import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 150;

export const parsePDFToChunks = async (filePath, filename) => {
  let isTempFile = false;
  let targetFilePath = filePath;

  // If filePath is a buffer, we need to save it to a temp file first for PDFLoader
  if (Buffer.isBuffer(filePath)) {
    targetFilePath = path.join(process.cwd(), `temp-${uuidv4()}.pdf`);
    fs.writeFileSync(targetFilePath, filePath);
    isTempFile = true;
  }

  try {
    const loader = new PDFLoader(targetFilePath, {
      splitPages: true,
    });
    
    const rawDocs = await loader.load();

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: CHUNK_SIZE,
      chunkOverlap: CHUNK_OVERLAP,
    });

    const splitDocs = await splitter.splitDocuments(rawDocs);

    const chunks = splitDocs.map((doc, index) => ({
      chunkIndex: index,
      text: doc.pageContent,
      pageNumber: doc.metadata.loc?.pageNumber || 1,
    }));

    console.log(`✓ ${filename}: ${chunks.length} chunks produced`);
    return chunks;
  } finally {
    if (isTempFile && fs.existsSync(targetFilePath)) {
      fs.unlinkSync(targetFilePath);
    }
  }
};
