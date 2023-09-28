// TODO: Validate archive
export function validateZip(file: File): boolean {
  if (file) {
    return true;
  } else {
    return false;
  }
}

interface BundlerResponse {
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
