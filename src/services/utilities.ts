const ImageTypes = ["image/png", "image/jpeg", "image/jpg"];
const FontTypes = ["font/ttf", "font/otf"];

import mime from "mime";

export function isImageFile(file: File): boolean {
  const type: string | null = mime.getType(file.name);
  return type !== null && ImageTypes.includes(type);
}

export function isFontFile(file: File): boolean {
  const type: string | null = mime.getType(file.name);
  return type !== null && FontTypes.includes(type);
}

export function isZipFile(file: File): boolean {
  return file.type === "application/x-zip-compressed";
}

export function isValidFile(file: File): boolean {
  return isImageFile(file) || isFontFile(file) || isZipFile(file);
}

import ImageMediaConverter from "./converters/ImageMediaConverter";
import FontMediaConverter from "./converters/FontMediaConverter";
import MediaConverter, { MediaFile } from "./converters/MediaConverter";

import JSZip from "jszip";
import toml from "toml";

const imageConverter = new ImageMediaConverter("/convert/t3x");
const fontConverter = new FontMediaConverter("/convert/bcfnt");

export interface ConfigFile {
  metadata: {
    title: string;
    author: string;
    description: string;
    version: string;
    icons: Record<string, string>;
  };

  build: {
    targets: string[];
    source: string;
    packaged?: boolean;
  };
}

export async function validateZip(file: File): Promise<[JSZip, ConfigFile]> {
  const zip = await JSZip.loadAsync(file);

  if (zip.files["lovebrew.toml"] === undefined) {
    throw Error("Missing configuration file.");
  }

  const content = await zip.files["lovebrew.toml"].async("string");
  const config = toml.parse(content);

  if (zip.file(new RegExp(`^${config.build.source}/.+`)).length === 0) {
    throw Error(`Source folder '${config.build.source}' not found.`);
  }

  return [zip, config];
}

export async function convertFiles(files: File[]): Promise<MediaFile[]> {
  let converter: MediaConverter | undefined = undefined;

  if (files.length === 0) return [];

  if (files.every(isImageFile)) {
    converter = imageConverter;
  } else if (files.every(isFontFile)) {
    converter = fontConverter;
  } else {
    throw Error("Files are not all the same type.");
  }

  return await converter.convert(
    files.map((file: File) => ({ filepath: file.name, data: file }))
  );
}
