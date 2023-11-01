import MediaConverter, { MediaFile } from "./MediaConverter";

export default class FontMediaConverter extends MediaConverter {
  async convert(files: MediaFile[]): Promise<MediaFile[]> {
    const body = new FormData();

    for (const file of files) {
      body.append(file.filepath, file.data);
    }

    const response = await this.sendRequest("POST", body);

    if (!this.isMediaResponse(response)) {
      throw Error("Invalid Response");
    }

    return this.responseToMediaFileArray(response, "font/bcfnt");
  }
}
