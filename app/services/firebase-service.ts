import { getDownloadURL } from "firebase/storage";

const convertToFileWithPreview = async (firebaseRef: any) => {
  try {
    const downloadUrl = await getDownloadURL(firebaseRef);

    const response = await fetch(downloadUrl);
    const blob = await response.blob();

    const fileName = firebaseRef._location.path_.split("/").pop() || "unknown";
    const file = new File([blob], fileName, { type: blob.type });

    const preview = URL.createObjectURL(file);

    return { ...file, preview };
  } catch (error) {
    console.error("Error converting Firebase ref to File:", error);
    return null;
  }
};

export { convertToFileWithPreview };
