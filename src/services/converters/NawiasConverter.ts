import MediaConverter, { MediaFile } from "./MediaConverter";

export default class NawiasConverter extends MediaConverter {
  async convert(files: MediaFile[]): Promise<MediaFile[]> {
    const blurredFiles: MediaFile[] = [];

    for (const file of files) {
      const image = await createImageBitmap(file.data);
      const canvas = document.createElement("canvas");
      canvas.height = image.height;
      canvas.width = image.width;
      const ctx = canvas.getContext("2d");
      if (ctx === null) {
        canvas.remove();
        throw Error("Context was null!");
      } else {
        const blurLength = Math.min(canvas.width, canvas.height) * 0.02;
        ctx.filter = `blur(${Math.floor(blurLength)}px)`;
        ctx.drawImage(image, 0, 0);
        const data = await (await fetch(canvas.toDataURL())).blob();
        canvas.remove();
        blurredFiles.push({ filepath: file.filepath, data });
      }
    }

    return blurredFiles;
  }
}
