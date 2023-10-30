export function isImageFile(file: File): boolean {
  return file.type === "image/png" || file.type === "image/jpeg";
}

export function isFontFile(file: File): boolean {
  return file.name.endsWith(".ttf") || file.name.endsWith(".otf");
}

export function isZipFile(file: File): boolean {
  return file.type === "application/x-zip-compressed";
}
