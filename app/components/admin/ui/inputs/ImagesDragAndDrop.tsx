import {
  CSSProperties,
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { Form } from "react-bootstrap";
import { useDropzone } from "react-dropzone";

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

      setSelectedFiles((prevState) => [...prevState, ...filesWithPreview]);
    },
    [setSelectedFiles]
  );

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({ accept: { "image/*": [] }, onDrop: onFilesDrop });

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
        <div style={{ display: "flex", flexWrap: "wrap", marginTop: 16 }}>
          {files.map((file) => (
            <div key={file.name} style={{ margin: 8 }}>
              <img
                src={file.preview as string}
                alt={file.name}
                style={{ width: 100, height: 100, objectFit: "cover" }}
              />
            </div>
          ))}
        </div>
      </div>
    </Form.Group>
  );
};

export default ImagesDragAndDrop;
