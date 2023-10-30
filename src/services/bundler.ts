import JSZip, { JSZipObject } from "jszip";
import toml from "toml";

import { convertFiles, isFontFile, isImageFile } from "./utilities";

export async function validateZip(file: File) {
  const zip = await JSZip.loadAsync(file);

  if (zip.files["lovebrew.toml"] === undefined) {
    return Promise.reject("Missing configuration file.");
  }

  return Promise.resolve();
}

export interface BundlerResponse {
  message: string;
  file?: Promise<Blob>;
}

interface ConfigFile {
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
  };
}

const extensions = {
  ctr: "3dsx",
  hac: "nro",
  cafe: "wuhb",
};

export async function sendContent(archive: File): Promise<BundlerResponse> {
  const iconFiles: Record<string, Promise<Blob>> = {};
  let config: ConfigFile;

  const zip = await JSZip.loadAsync(archive);
  const content = await zip.files["lovebrew.toml"].async("string");

  const bundle: JSZip = new JSZip();

  let defaultZip: JSZip | null = null;
  let conversionZip: JSZip | null = null;

  try {
    config = toml.parse(content);

    // find defined icons
    for (const key in config.metadata.icons) {
      if (config.metadata.icons[key] === "") continue;

      const path = config.metadata.icons[key];
      if (zip.file(path) === null) continue;

      console.log("found icon", key);
      iconFiles[key] = zip.files[path].async("blob");
    }

    if (zip.file(new RegExp(`^${config.build.source}/.+`)).length === 0) {
      return Promise.reject({
        message: `Source folder '${config.build.source}' not found.`,
      });
    }

    const files = await Promise.all(
      zip
        .file(new RegExp(`^${config.build.source}/.+`))
        .map(async (file: JSZipObject) => {
          console.log(file.name);

          const blob = await file.async("blob");
          const length = config.build.source.length + 1;

          return new File([blob], file.name.slice(length));
        })
    );

    let convertedTextures,
      convertedFonts = undefined;

    defaultZip = new JSZip();
    for (const file of files) {
      defaultZip.file(file.name, file);
    }

    if (config.build.targets.includes("ctr")) {
      conversionZip = new JSZip();

      convertedTextures = await convertFiles(
        files.filter((file: File) => isImageFile(file))
      );

      convertedFonts = await convertFiles(
        files.filter((file: File) => isFontFile(file))
      );

      const main = files.filter(
        (file: File) => !isImageFile(file) && !isFontFile(file)
      );

      const converted = [...main, ...convertedTextures, ...convertedFonts];

      for (const file of converted) {
        let name: string, data: Blob;
        if (file instanceof File) {
          (name = file.name), (data = file);
        } else {
          (name = file.filepath), (data = file.data);
        }

        conversionZip.file(name, data);
      }
    }
  } catch (exception: unknown) {
    throw Error((exception as Error).message);
  }

  const body: FormData = new FormData();
  const endpoint = `${process.env.BASE_URL}/compile`;

  for (const key in iconFiles) {
    const file = await iconFiles[key];
    body.append(`icon-${key}`, file);
  }

  const query: URLSearchParams = new URLSearchParams();
  for (const key of Object.keys(config.metadata)) {
    if (key === "icons") continue;

    const keyKey = key as keyof ConfigFile["metadata"];
    query.append(key, config.metadata[keyKey] as string);
  }
  query.append("targets", config.build.targets.join(","));

  const request = fetch(`${endpoint}?${query}`, {
    method: "POST",
    body,
  });

  try {
    const response = await request;
    if (!response.ok) throw Error(response.statusText);

    const json = await response.json();
    if (json.error) throw Error(json.error);

    let convertedBlob: Blob | null = null;
    if (conversionZip != null)
      convertedBlob = await conversionZip.generateAsync({ type: "blob" });

    const defaultBlob = await defaultZip.generateAsync({ type: "blob" });

    let gameData: Blob;

    for (const key in json) {
      const decoded = await fetch(`data:file/${key};base64,${json[key]}`);

      if (key === "ctr") gameData = convertedBlob as Blob;
      else gameData = defaultBlob;

      const binary = await decoded.blob();
      const file = new File([binary, gameData], key);

      const keyKey = key as keyof typeof extensions;
      bundle.file(`${config.metadata.title}.${extensions[keyKey]}`, file);
    }

    return {
      message: "Success.",
      file: bundle.generateAsync({ type: "blob" }),
    };
  } catch (exception) {
    throw Error((exception as Error).message);
  }
}
