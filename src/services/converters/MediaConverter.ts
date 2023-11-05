export type MediaResponse = Array<MediaResponseFile>;
export type MediaResponseFile = {
  data: string;
  filepath: string;
};
export type MediaFile = { data: Blob; filepath: string };

export default abstract class MediaConverter {
  protected url: string;

  constructor(path: string) {
    this.url = `${import.meta.env.DEV ? process.env.BASE_URL : ""}${path}`;
  }

  abstract convert(files: MediaFile[]): Promise<MediaFile[]>;

  protected isMediaResponse(response: unknown): response is MediaResponse {
    return (
      Array.isArray(response) &&
      response.length > 0 &&
      "data" in response[0] &&
      "filepath" in response[0]
    );
  }

  protected isMediaFile(file: unknown): file is MediaFile {
    return (
      typeof file === "object" &&
      file !== null &&
      "data" in file &&
      "filepath" in file
    );
  }

  protected async sendRequest(method: string, body: FormData): Promise<any> {
    try {
      const request = await fetch(this.url, { method, body });
      const json = await request.json();

      return json;
    } catch (exception) {
      throw Error("Failed to send request.");
    }
  }

  protected responseToMediaFileArray(
    response: MediaResponse,
    type: string
  ): Promise<MediaFile[]> {
    return Promise.all<MediaFile>(
      response.map((file: MediaResponseFile): Promise<MediaFile> => {
        return new Promise<MediaFile>((resolve, reject) => {
          fetch(`data:${type};base64,${file.data}`)
            .then((res) => res.blob())
            .then((data) => {
              resolve({ filepath: file.filepath, data });
            })
            .catch((error) => {
              reject(error);
            });
        });
      })
    );
  }
}
