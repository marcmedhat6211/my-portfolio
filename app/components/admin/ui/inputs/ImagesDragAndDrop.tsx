import {
  CSSProperties,
  Dispatch,
  FC,
  MouseEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { Form } from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import styles from "./ImagesDragAndDrop.module.scss";
import { IoMdClose } from "react-icons/io";

export interface FileWithPreview extends File {
  preview: string;
}

type Props = {
  files: FileWithPreview[];
  setSelectedFiles: Dispatch<SetStateAction<FileWithPreview[]>>;
};

const baseStyle: CSSProperties = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const focusedStyle: CSSProperties = {
  borderColor: "#2196f3",
};

const acceptStyle: CSSProperties = {
  borderColor: "#00e676",
};

const rejectStyle: CSSProperties = {
  borderColor: "#ff1744",
};

const ImagesDragAndDrop: FC<Props> = ({ files, setSelectedFiles }) => {
  useEffect(() => {
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  const onFilesDrop = useCallback(
    (acceptedFiles: File[]) => {
      const filesWithPreview = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      ) as FileWithPreview[];

      setSelectedFiles((prevState) => {
        const allFiles = [...prevState, ...filesWithPreview];
        const uniqueFiles = Array.from(
          new Map(
            allFiles.map((file) => [file.name + file.size, file])
          ).values()
        );

        return uniqueFiles;
      });
    },
    [setSelectedFiles]
  );

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({ accept: { "image/*": [] }, onDrop: onFilesDrop });

  const removeImageHandler = (
    file: File,
    event: MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
    setSelectedFiles((prevState) =>
      prevState.filter((fileObj) => fileObj.name !== file.name)
    );
  };

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  return (
    <Form.Group>
      <Form.Label>Images</Form.Label>
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <p className="mb-0">
          Drag 'n' drop some files here, or click to select files
        </p>
        {files.length > 0 && (
          <div className={styles["images-container"]}>
            {files.map((file) => (
              <div className={styles["img-container"]} key={file.name}>
                <button
                  type="button"
                  className={styles["remove-img-btn"]}
                  onClick={removeImageHandler.bind(this, file)}
                >
                  <IoMdClose />
                </button>
                <img src={file.preview as string} alt={file.name} />
              </div>
            ))}
          </div>
        )}
      </div>
    </Form.Group>
  );
};

export default ImagesDragAndDrop;
