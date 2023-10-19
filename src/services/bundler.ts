import JSZip from "jszip";

const MAX_FILE_SIZE = 0x10000000; // 256MB

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
  status: number;
  file?: Promise<Blob>;
}

export function sendZip(file: File): Promise<BundlerResponse> {
  const body = new FormData();
  body.append("content", file);
  const url = `${import.meta.env.DEV ? "http://localhost:5000" : ""}/data`;
  const request = fetch(url, {
    method: "POST",
    body,
  });
  return new Promise((resolve, reject) => {
    request
      .then((response) => {
        if (response.status !== 200) {
          response.text().then((res) => {
            reject({ message: res, status: response.status });
          });
        } else {
          resolve({
            message: "Game packing successful! Downloading...",
            status: 200,
            file: response.blob(),
          });
        }
      })
      .catch((error) => {
        console.log(JSON.stringify(error));
        reject({ message: "Unknown error", status: 0 });
      });
  });
}
