import MediaConverter, { MediaFile } from "./MediaConverter";

const MAX_IMAGE_DIM = 1024;

type ImageErrorReason = "invalid" | "too large";

class ImageError extends Error {
  public readonly reason: ImageErrorReason;
  __proto__ = Error;
  constructor(m: ImageErrorReason) {
    super(m);
    this.reason = m;
    Object.setPrototypeOf(this, ImageError.prototype);
  }
}

export default class ImageMediaConverter extends MediaConverter {
  async checkImage(file: Blob): Promise<boolean> {
    try {
      const image = await createImageBitmap(file);
      return image.width <= MAX_IMAGE_DIM && image.height <= MAX_IMAGE_DIM;
    } catch (error) {
      throw new ImageError("invalid");
    }
  }
  async convert(files: MediaFile[]): Promise<MediaFile[]> {
    const body = new FormData();

    for (const file of files) {
      try {
        if (!(await this.checkImage(file.data))) {
          throw new ImageError("too large");
        } else {
          body.append(file.filepath, file.data);
        }
      } catch (error) {
        const reason: ImageErrorReason =
          error instanceof ImageError ? error.reason : "invalid";
        throw Error(`Image ${file.filepath} is ${reason}!`);
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
