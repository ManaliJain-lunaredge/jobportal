import multer from "multer"

const storage = multer.memoryStorage();

const uploadFile = multer({ storage }).fields([
  { name: "resume", maxCount: 1 },
  { name: "profile_pic", maxCount: 1 },
]);

export default uploadFile