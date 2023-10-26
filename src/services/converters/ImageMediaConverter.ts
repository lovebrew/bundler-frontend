import MediaConverter, { MediaFile } from "./MediaConverter";

const MAX_IMAGE_DIM = 1024;

export default class ImageMediaConverter extends MediaConverter {
  checkImage(file: Blob): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      createImageBitmap(file)
        .then((image: ImageBitmap) => {
          if (image.width > MAX_IMAGE_DIM || image.height > MAX_IMAGE_DIM) {
            resolve(false);
          } else {
            resolve(true);
          }
        })
        .catch(() => {
          resolve(false);
        });
    });
  }
  async convert(files: MediaFile[]): Promise<MediaFile[]> {
    const body = new FormData();

    for (const file of files) {
      if (!(await this.checkImage(file.data))) {
        throw Error("not an image");
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
    console.log("fetched");
    if (!this.isMediaResponse(response)) {
      throw Error("invalid data");
    }
    return this.responseToMediaFileArray(response, "image/t3x");
  }
}
