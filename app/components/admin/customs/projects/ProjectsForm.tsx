import { ProjectInterface } from "@/app/interfaces/ProjectInterface";
import { Project } from "@/app/models/Project";
import { FC, useEffect, useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { WithContext as ReactTags, SEPARATORS } from "react-tag-input";
import ImagesDragAndDrop, {
  FileWithPreview,
} from "../../ui/inputs/ImagesDragAndDrop";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { db } from "@/app/firebase/db";
import { listAll, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/app/firebase/storage";
import { useParams, useRouter } from "next/navigation";
import { convertToFileWithPreview } from "@/app/services/firebase-service";

type TechStack = { id: string; text?: string; className: string };

const ProjectsForm: FC = () => {
  // constants
  const params = useParams();
  const router = useRouter();

  // react hook form
  const {
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<ProjectInterface>({
    defaultValues: Project,
  });

  // states
  const [techStacks, setTechStacks] = useState<TechStack[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);
  console.log(selectedFiles);
  const [submittingForm, setSubmittingForm] = useState(false);

  useEffect(() => {
    setValue(
      "techStacks",
      techStacks.map((techStack) => techStack.id)
    );
  }, [techStacks]);

  useEffect(() => {
    if ("projectId" in params) {
      const fetchProject = async () => {
        const projectDocRef = doc(db, "projects", params.projectId as string);
        const projectDocSnap = await getDoc(projectDocRef);
        if (projectDocSnap.exists()) {
          const projectData: ProjectInterface =
            projectDocSnap.data() as ProjectInterface;
          reset({ id: projectDocSnap.id, ...projectData });
          setTechStacks(
            projectData.techStacks.map((techStack) => ({
              id: techStack,
              text: techStack,
              className: "",
            }))
          );

          // getting images
          const filesListRef = ref(storage, `projects/${projectDocSnap.id}`);
          const res = await listAll(filesListRef);

          const convertedFiles = await Promise.all(
            res.items.map(async (imageRef) => {
              const convertedFile = (await convertToFileWithPreview(
                imageRef
              )) as FileWithPreview;
              return convertedFile;
            })
          );

          setSelectedFiles(convertedFiles);
        } else {
          console.log("project does not exist");
        }
      };

      fetchProject();
    }
  }, [params.projectId]);

  const onTagUpdate = (index: number, newTag: TechStack) => {
    const updatedTechStacks = [...techStacks];
    updatedTechStacks.splice(index, 1, newTag);
    setTechStacks(updatedTechStacks);
  };

  const handleTagDrag = (
    techStack: TechStack,
    currPos: number,
    newPos: number
  ) => {
    const newTechStacks = techStacks.slice();
    newTechStacks.splice(currPos, 1);
    newTechStacks.splice(newPos, 0, techStack);
    setTechStacks(newTechStacks);
  };

  const formSubmitHandler = (data: ProjectInterface) => {
    const submitForm = async () => {
      try {
        setSubmittingForm(true);
        const projectDocRef = await addDoc(collection(db, "projects"), data);
        if (
          projectDocRef &&
          typeof projectDocRef === "object" &&
          "id" in projectDocRef
        ) {
          const uploadPromises = selectedFiles.map((file) => {
            const storageRef = ref(
              storage,
              `projects/${projectDocRef.id}/${file.name}`
            );
            return uploadBytes(storageRef, file);
          });

          const snapshots = await Promise.all(uploadPromises);
          console.log(snapshots);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setSubmittingForm(false);
      }
    };

    submitForm();
  };

  return (
    <Form onSubmit={handleSubmit(formSubmitHandler)}>
      {/* name */}
      <Form.Group className="mb-3">
        <Form.Label>Name</Form.Label>
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <Form.Control type="text" isInvalid={!!errors.name} {...field} />
          )}
        />
        <Form.Control.Feedback type="invalid">
          {errors.name?.message}
        </Form.Control.Feedback>
      </Form.Group>

      {/* description */}
      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <Form.Control
              as="textarea"
              rows={3}
              type="text"
              isInvalid={!!errors.description}
              {...field}
            />
          )}
        />
        <Form.Control.Feedback type="invalid">
          {errors.description?.message}
        </Form.Control.Feedback>
      </Form.Group>

      {/* featured */}
      <Form.Group className="mb-3">
        <Controller
          control={control}
          name="featured"
          render={({ field }) => (
            <Form.Check
              id="featured"
              type="switch"
              label="Featured"
              onChange={field.onChange}
              checked={field.value}
            />
          )}
        />
        <Form.Control.Feedback type="invalid">
          {errors.featured?.message}
        </Form.Control.Feedback>
      </Form.Group>

      {/* techStacks */}
      <ReactTags
        placeholder="Please enter the tech stacks you used in this project..."
        tags={techStacks}
        separators={[SEPARATORS.ENTER, SEPARATORS.COMMA]}
        editable
        onTagUpdate={onTagUpdate}
        onClearAll={() => setTechStacks([])}
        handleAddition={(techStackObj: TechStack) =>
          setTechStacks((prevState) => [...prevState, techStackObj])
        }
        handleDrag={handleTagDrag}
        handleDelete={(index) =>
          setTechStacks(techStacks.filter((_, i) => i !== index))
        }
        inputFieldPosition="top"
      />

      {/* images */}
      <ImagesDragAndDrop
        files={selectedFiles}
        setSelectedFiles={setSelectedFiles}
      />

      <div className="d-flex justify-content-end mt-3">
        <Button
          type="submit"
          variant="success"
          className="w-25"
          disabled={submittingForm}
        >
          {submittingForm ? (
            <Spinner animation="border" size="sm" variant="dark" />
          ) : (
            "Submit"
          )}
        </Button>
      </div>
    </Form>
  );
};

export default ProjectsForm;
