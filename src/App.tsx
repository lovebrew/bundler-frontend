import Flask from "@components/Flask";
import Footer from "@components/Footer";
import { validateZip, sendZip, BundlerResponse } from "./services/bundler";
import { Toaster, toast } from "react-hot-toast";
import successSfx from "@assets/sound/success.ogg";
import errorSfx from "@assets/sound/error.ogg";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore Ignore broken library typings
import useSound from "use-sound";
import ImageMediaConverter from "./services/converters/ImageMediaConverter";
import JSZip from "jszip";
import MediaConverter, {
  MediaFile,
} from "./services/converters/MediaConverter";
import FontMediaConverter from "./services/converters/FontMediaConverter";

const downloadBlob = (blob: Blob) => {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `bundle-${+new Date()}.zip`;
  link.click();
  window.URL.revokeObjectURL(link.href);
};

const isImageFile = (file: File): boolean =>
  file.type === "image/png" || file.type === "image/jpeg";

const isFontFile = (file: File): boolean =>
  file.name.endsWith(".ttf") || file.name.endsWith(".otf");

function App() {
  const [playSuccess] = useSound(successSfx);
  const [playError] = useSound(errorSfx);
  const imageConverter = new ImageMediaConverter("/convert/t3x");
  const fontConverter = new FontMediaConverter("/convert/bcfnt");

  const handleUploadSuccess = (response: BundlerResponse) => {
    toast.promise(response.file as Promise<Blob>, {
      loading: "Downloading",
      success: (blob) => {
        playSuccess();
        downloadBlob(blob);
        return "Downloaded";
      },
      error: () => {
        playError();
        return "Something went wrong 😔";
      },
    });
    return response.message;
  };

  const handleUploadError = (error: BundlerResponse) => {
    playError();
    return `Error! ${error.status} [${error.message}]`;
  };

  const handleUpload = async (files: File[]) => {
    let converter: MediaConverter | undefined;
    console.log(files[0].type);
    if (isImageFile(files[0])) {
      converter = imageConverter;
    } else if (isFontFile(files[0])) {
      converter = fontConverter;
    }
    console.log(converter);
    if (converter !== undefined) {
      toast.promise(
        converter.convert(
          files.map((file: File) => ({ filepath: file.name, data: file }))
        ),
        {
          loading: "Uploading",
          success: (files: MediaFile[]) => {
            playSuccess();
            const zip = new JSZip();
            for (const file of files) {
              zip.file(file.filepath, file.data);
            }
            zip
              .generateAsync({ type: "blob" })
              .then((blob) => downloadBlob(blob));
            return "Downloaded";
          },
          error: handleUploadError,
        }
      );
      return;
    }
    const archive = files[0];

    try {
      await validateZip(archive);
    } catch (reason) {
      playError();
      if (typeof reason === "string") {
        toast.error(reason);
      } else {
        toast.error("Unknown error");
      }
      return;
    }

    toast.promise(sendZip(archive), {
      loading: "Uploading",
      success: handleUploadSuccess,
      error: handleUploadError,
    });
  };

  return (
    <>
      <Toaster
        toastOptions={{
          className: `
          bg-neutral-800
          text-white
          `,
          success: {
            className: `
            bg-green-600
            text-white
            `,
          },
          error: {
            className: `
            bg-red-600
            text-white
            `,
          },
        }}
      />
      <Flask
        uploadHandler={handleUpload}
        accept={[".zip", ".png", ".jpg", ".jpeg", ".otf", ".ttf"]}
      />
      <Footer />
    </>
  );
}

export default App;
