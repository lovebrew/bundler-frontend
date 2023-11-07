import JSZip, { JSZipObject } from "jszip";

import {
  convertFiles,
  validateZip,
  isFontFile,
  isImageFile,
  ConfigFile,
} from "./utilities";
import { MediaFile } from "./converters/MediaConverter";

export interface BundlerResponse {
  message: string;
  file?: Promise<Blob>;
}

const extensions = {
  ctr: "3dsx",
  hac: "nro",
  cafe: "wuhb",
};

async function findDefinedIcons(
  config: ConfigFile,
  zip: JSZip
): Promise<Record<string, Blob>> {
  const result: Record<string, Blob> = {};

  for (const key in config.metadata.icons) {
    const path = config.metadata.icons[key];
    if (zip.file(path) === null) continue;

    const keyKey = key as keyof ConfigFile["metadata"]["icons"];
    result[keyKey] = await zip.files[path].async("blob");
  }

  return result;
}

async function convertCtrFiles(files: File[]): Promise<Array<MediaFile>> {
  const textures = await convertFiles(
    files.filter((file: File) => isImageFile(file))
  );

  const fonts = await convertFiles(
    files.filter((file: File) => isFontFile(file))
  );

  const main = files
    .filter((file: File) => !isImageFile(file) && !isFontFile(file))
    .map((file: File) => ({ filepath: file.name, data: file }));

  return [...main, ...textures, ...fonts];
}

async function getSourceFiles(
  zip: JSZip,
  source: string
): Promise<Array<File>> {
  /* find ALL files within source directory */
  const files = await Promise.all(
    zip.file(new RegExp(`^${source}/.+`)).map(async (file: JSZipObject) => {
      const blob = await file.async("blob");
      const length = source.length + 1;

      return new File([blob], file.name.slice(length));
    })
  );

  return files;
}

async function fetchGameZip(
  zip: JSZip,
  source: string,
  target: string
): Promise<JSZip> {
  const sourceFiles = await getSourceFiles(zip, source);

  let content: Array<MediaFile> = [];

  /* if we have a ctr target, we need to convert the files */
  if (target === "ctr") {
    content = await convertCtrFiles(sourceFiles);
  } else
    content = sourceFiles.map((file: File) => {
      return { filepath: file.name, data: file };
    });

  const gameZip = new JSZip();

  for (const file of content) {
    gameZip.file(file.filepath, file.data);
  }

  return gameZip;
}

export async function sendContent(archive: File): Promise<BundlerResponse> {
  const [zip, config] = await validateZip(archive);

  const iconFiles = await findDefinedIcons(config, zip);
  const gameZips: Record<string, JSZip> = {};

  const source = config.build.source;
  for (const target of config.build.targets) {
    gameZips[target] = await fetchGameZip(zip, source, target);
  }

  /* resulting bundle */
  const bundle: JSZip = new JSZip();

  if (!config.build.packaged) {
    for (const key in gameZips) {
      const keyKey = key as keyof typeof extensions;
      bundle.file(
        `${config.metadata.title}-${extensions[keyKey]}-assets.zip`,
        await gameZips[key].generateAsync({ type: "blob" })
      );
    }

    return {
      message: "Success.",
      file: bundle.generateAsync({ type: "blob" }),
    };
  }

  const body: FormData = new FormData();
  const endpoint = `${import.meta.env.DEV ? process.env.BASE_URL : ""}/compile`;

  /* add icons to form data */
  for (const key in iconFiles) {
    body.append(`icon-${key}`, iconFiles[key]);
  }

  /* create the URL parameters */
  const query: URLSearchParams = new URLSearchParams();
  for (const key of Object.keys(config.metadata)) {
    if (key === "icons") continue;

    const keyKey = key as keyof ConfigFile["metadata"];
    query.append(key, config.metadata[keyKey] as string);
  }
  query.append("targets", config.build.targets.join(","));

  try {
    const request = fetch(`${endpoint}?${query}`, { method: "POST", body });

    const response = await request;
    const json = await response.json();

    for (const key in json) {
      const decoded = await fetch(`data:file/${key};base64,${json[key]}`);

      const binary = await decoded.blob();
      const gameData: Blob = await gameZips[key].generateAsync({
        type: "blob",
      });

      const file = new File([binary, gameData], key);

      const keyKey = key as keyof typeof extensions;
      bundle.file(`${config.metadata.title}.${extensions[keyKey]}`, file);
    }

    return {
      message: "Success.",
      file: bundle.generateAsync({ type: "blob" }),
    };
  } catch (exception) {
    throw Error("Failed to send request.");
  }
}
