import MediaConverter, { MediaFile } from "./MediaConverter";

const MAX_IMAGE_DIM = 1024;

export default class ImageMediaConverter extends MediaConverter {
  async checkImage(file: Blob): Promise<boolean> {
    const image = await createImageBitmap(file);
    return image.width <= MAX_IMAGE_DIM && image.height <= MAX_IMAGE_DIM;
  }
  async convert(files: MediaFile[]): Promise<MediaFile[]> {
    const body = new FormData();

    for (const file of files) {
      if (!(await this.checkImage(file.data))) {
        throw Error(`Image ${file.filepath} is too large!`);
      } else {
        body.append(file.filepath, file.data);
      }
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
    return this.responseToMediaFileArray(response, "image/t3x");
  }
}
