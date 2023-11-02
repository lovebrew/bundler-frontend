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
    const image = await createImageBitmap(file);
    return image.width <= MAX_IMAGE_DIM && image.height <= MAX_IMAGE_DIM;
  }

  async convert(files: MediaFile[]): Promise<MediaFile[]> {
    const body = new FormData();

    for (const file of files) {
      try {
        if (!(await this.checkImage(file.data)))
          throw new ImageError("too large");

        body.append(file.filepath, file.data);
      } catch (error) {
        const reason = error instanceof ImageError ? error.reason : "invalid";
        throw Error(`Image ${file.filepath} is ${reason}!`);
      }
    }

    const response = await this.sendRequest("POST", body);

    if (!this.isMediaResponse(response)) {
      throw Error(response.toString());
    }

    return this.responseToMediaFileArray(response, "image/t3x");
  }
}
