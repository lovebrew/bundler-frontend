import Flask from "@components/Flask";
import Footer from "@components/Footer";
import { validateZip, sendZip } from "./services/bundler";
import { Toaster, toast } from "react-hot-toast";

function App() {
  const handleUpload = (files: File[]) => {
    const archive = files[0];
    const valid = validateZip(archive);
    if (!valid) {
      toast.error("Invalid archive. Refer to the documentation");
    }

    //start uploading toast
    const gamePromise = sendZip(archive);
    toast.promise(gamePromise, {
      loading: "Uploading",
      success: (response) => {
        toast.promise(response.file as Promise<Blob>, {
          loading: "Downloading",
          success: (blob) => {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `bundle-${+new Date()}.zip`;
            link.click();
            window.URL.revokeObjectURL(link.href);
            return "Downloaded";
          },
          error: "Something went wrong 😔",
        });
        return response.message;
      },
      error: (error) => {
        return `Error! ${error.status} [${error.message}]`;
      },
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
