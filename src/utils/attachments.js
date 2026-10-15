export const readAttachments = async (files, existingCount = 0) => {
  const selected = Array.from(files);
  if (selected.length + existingCount > 5) throw new Error('Please attach up to 5 files.');
  if (selected.some((file) => !['image/jpeg', 'image/png', 'application/pdf'].includes(file.type) || file.size > 15 * 1024 * 1024)) throw new Error('Choose JPG, PNG, or PDF files, up to 15 MB each.');
  return Promise.all(selected.map((file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ id: crypto.randomUUID(), name: file.name, type: file.type, size: `${(file.size / 1024 / 1024).toFixed(2)} MB`, url: reader.result });
    reader.onerror = () => reject(new Error('We could not read a file. Please try again.'));
    reader.readAsDataURL(file);
  })));
};
