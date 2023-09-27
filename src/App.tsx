import Flask from "@components/Flask";
import Footer from "@components/Footer";
import { validateZip, sendZip } from "./services/bundler";
import { Toaster, toast } from "react-hot-toast";

function App() {
  const handleUpload = (files: File[]) => {
    const archive = files[0];
    const valid = validateZip(archive);
    if (!valid) {
      toast("Invalid archive. Refer to the documentation");
    }

    //start uploading toast
    sendZip(archive)
      .then((response) => {
        console.log();
        //download the thing and complete the toast
        toast(response.message);
      })
      .catch((error) => {
        toast(error);
      });
  };
  return (
    <>
      <Toaster />
      <Flask uploadHandler={handleUpload} />
      <Footer />
    </>
  );
}

export default App;
