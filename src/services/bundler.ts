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
}

//TODO: Actually upload something
export function sendZip(file: File): Promise<BundlerResponse> {
  return new Promise(function (resolve, reject) {
    resolve({ message: "Success!", status: 200 });
  });
}
