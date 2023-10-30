import MediaConverter, { MediaFile } from "./MediaConverter";

export default class FontMediaConverter extends MediaConverter {
  async convert(files: MediaFile[]): Promise<MediaFile[]> {
    const body = new FormData();

    for (const file of files) {
      body.append(file.filepath, file.data);
    }

    const url = `${process.env.BASE_URL}${this.path}`;
    const request = fetch(url, {
      method: "POST",
      body,
    });

    const response = await (await request).json();
    if (!this.isMediaResponse(response)) {
      throw Error("Invalid Response");
    }

    return this.responseToMediaFileArray(response, "font/bcfnt");
  }
}
