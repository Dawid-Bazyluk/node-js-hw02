const path = require("path");
const fs = require("fs").promises;

const isAccessible = (path) => {
  return fs
    .access(path)
    .then(() => true)
    .catch(() => false);
};

const createFolderIsNotExist = async (folder) => {
  if (!(await isAccessible(folder))) {
    await fs.mkdir(folder, { recursive: true });
  }
};

const verifyFolders = async () => {
  const uploadDir = path.join(process.cwd(), "tmp");
  const storeImage = path.join(process.cwd(), "public", "avatars");

  await createFolderIsNotExist(uploadDir);
  await createFolderIsNotExist(storeImage);
};

module.exports = verifyFolders;
