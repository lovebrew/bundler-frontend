const ImageTypes = ["image/png", "image/jpeg", "image/jpg"];
const FontTypes = ["font/ttf", "font/otf"];
const ZipTypes = ["application/x-zip-compressed", "application/zip"];

import mime from "mime";

export function isImageFile(file: File): boolean {
  const type: string | null = mime.getType(file.name);
  return type !== null && ImageTypes.includes(type);
}

export function isFontFile(file: File): boolean {
  const type: string | null = mime.getType(file.name);
  return type !== null && FontTypes.includes(type);
}

export function isMediaFile(file: File): boolean {
  return isImageFile(file) || isFontFile(file);
}

export function isZipFile(file: File): boolean {
  const type: string | null = mime.getType(file.name);
  return type != null && ZipTypes.includes(type);
}

export function isValidFile(file: File): boolean {
  return isImageFile(file) || isFontFile(file) || isZipFile(file);
}

import MediaConverter, { MediaFile } from "./MediaConverter";

const converter = new MediaConverter("/convert");

const MAX_IMAGE_DIM = 0x400;

export async function validateTexture(file: Blob): Promise<boolean> {
  const image = await createImageBitmap(file);
  return image.width <= MAX_IMAGE_DIM && image.height <= MAX_IMAGE_DIM;
}

export async function validateFont(file: Blob): Promise<boolean> {
  const font = new FontFace("test", await file.arrayBuffer());
  await font.load();

  return true;
}

export async function convertFiles(files: File[]): Promise<MediaFile[]> {
  if (files.length === 0) return Array<MediaFile>();

  return await converter.convert(
    files.map((file: File) => ({ filepath: file.name, data: file }))
  );
}

export function getConversionLog(): File {
  return converter.log;
}
