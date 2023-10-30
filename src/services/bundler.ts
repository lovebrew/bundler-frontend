import JSZip from "jszip";

import toml from "toml";

/* 32MB */
const MAX_FILE_SIZE = 32 * 1024 * 1024;

import { isImageFile, isFontFile } from "./utilities";

export function validateZip(file: File): Promise<string | void> {
  const jszip = new JSZip();
  return new Promise((resolve, reject) => {
    if (file.size > MAX_FILE_SIZE) {
      reject("Your archive is too big!");
      return;
    }
    jszip
      .loadAsync(file)
      .then((zip: JSZip) => {
        if (zip.files["lovebrew.toml"] === undefined) {
          reject("Missing configuration file");
        } else {
          resolve();
        }
      })
      .catch(() => {
        resolve("Invalid archive. Refer to the documentation.");
      });
  });
}

export interface BundlerResponse {
  message: string;
  file?: Promise<Blob>;
}

interface ConfigFile {
  metadata: {
    name: string;
    version: string;
    description: string;
    icons: Record<string, string>;
  };

  build: {
    targets: string[];
    source: string;
  };
}

export async function sendContent(archive: File): Promise<BundlerResponse> {
  const iconFiles: Record<string, Promise<Blob>> = {};
  let config: ConfigFile;

  new JSZip().loadAsync(archive).then((zip: JSZip) => {
    zip.files["lovebrew.toml"].async("string").then((content) => {
      try {
        config = toml.parse(content);

        /*
         ** Find our icons that were defined.
         ** If they don't exist, we'll just ignore them.
         ** The backend will handle the missing icons and use a default.
         */
        for (const key in config.metadata.icons) {
          if (config.metadata.icons[key] === "") continue;
          if (zip.file(config.metadata.icons[key]) === null) continue;

          console.log("found icon", key);
          iconFiles[key] = zip.files[config.metadata.icons[key]].async("blob");
        }

        console.log(config.build.source);
        if (zip.folder(`/${config.build.source}/`) === null) {
          console.error("source not found");
          return;
        }

        /* iterate the source directory and send files to convert */
        const entries = Object.keys(zip.files)
          .map((name: string) => {
            return zip.files[name].async("blob");
          })
          .filter((fileBlob: Promise<Blob>) => {
            fileBlob.then((blob: Blob) => {
              const file = new File([blob], "file");
              return isImageFile(file) || isFontFile(file);
            });
          });
        console.log(entries);
      } catch (exception) {
        console.log(exception);
      }
    });
  });

  const body: FormData = new FormData();
  const url = `${import.meta.env.DEV ? "http://localhost:5000" : ""}/content`;

  return Promise.reject({ message: "not implemented" });

  // const request = fetch(url, {
  //   method: "POST",
  //   body,
  // });
}
