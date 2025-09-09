import multer from 'multer';

const storage = multer.memoryStorage();

export const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

export const validateFiles = (files: Express.Multer.File[]) => {
  const validMimeTypes = [
    'image/jpeg',
    'image/png',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpg'
  ];

  const invalidFiles = files.filter((file) => !validMimeTypes.includes(file.mimetype));

  if (invalidFiles.length > 0) {
    return "Only PDF, XLSX, XLS, DOC, DOCX, JPEG, JPG, and PNG formats are allowed.";
  }
  return null;
};