import Flask from "@components/Flask";
import Footer from "@components/Footer";
import { validateZip, sendZip, BundlerResponse } from "./services/bundler";
import { Toaster, toast } from "react-hot-toast";
import successSfx from "@assets/sound/success.ogg";
import errorSfx from "@assets/sound/error.ogg";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore Ignore broken library typings
import useSound from "use-sound";

function App() {
  const [playSuccess] = useSound(successSfx);
  const [playError] = useSound(errorSfx);

  const handleUploadSuccess = (response: BundlerResponse) => {
    toast.promise(response.file as Promise<Blob>, {
      loading: "Downloading",
      success: (blob) => {
        playSuccess();
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `bundle-${+new Date()}.zip`;
        link.click();
        window.URL.revokeObjectURL(link.href);
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
      <Flask uploadHandler={handleUpload} />
      <Footer />
    </>
  );
}

export default App;
