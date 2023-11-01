import MediaConverter, { MediaFile } from "./MediaConverter";

export default class FontMediaConverter extends MediaConverter {
  async checkFont(file: MediaFile) {
    const font = new FontFace("test", await file.data.arrayBuffer());
    await font.load();
  }

  async convert(files: MediaFile[]): Promise<MediaFile[]> {
    const body = new FormData();

    for (const file of files) {
      try {
        await this.checkFont(file);
        body.append(file.filepath, file.data);
      } catch (error) {
        throw new Error(`Font ${file.filepath} is invalid!`);
      }
    }

    const response = await this.sendRequest("POST", body);

    if (!this.isMediaResponse(response)) {
      throw Error("Invalid Response");
    }

    return this.responseToMediaFileArray(response, "font/bcfnt");
  }
}
