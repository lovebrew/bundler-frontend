const ImageTypes = ["image/png", "image/jpeg", "image/jpg"];
const FontTypes = ["font/ttf", "font/otf"];

import mime from "mime";

export function isImageFile(file: File): boolean {
  return ImageTypes.includes(mime.getType(file.name));
}

export function isFontFile(file: File): boolean {
  return FontTypes.includes(mime.getType(file.name));
}

export function isZipFile(file: File): boolean {
  return file.type === "application/x-zip-compressed";
}

import ImageMediaConverter from "./converters/ImageMediaConverter";
import FontMediaConverter from "./converters/FontMediaConverter";
import { MediaFile } from "./converters/MediaConverter";

const imageConverter = new ImageMediaConverter("/convert/t3x");
const fontConverter = new FontMediaConverter("/convert/bcfnt");

export async function convertFiles(files: File[]): Promise<MediaFile[]> {
  let converter = undefined;
  if (files.every(isImageFile)) {
    converter = imageConverter;
  } else if (files.every(isFontFile)) {
    converter = fontConverter;
  } else {
    throw Error("Files are not all the same type.");
  }

  try {
    return await converter.convert(
      files.map((file: File) => ({ filepath: file.name, data: file }))
    );
  } catch (exception) {
    throw Error("Invalid Response");
  }
}
