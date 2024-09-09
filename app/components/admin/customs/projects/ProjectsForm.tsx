import { ProjectInterface } from "@/app/interfaces/ProjectInterface";
import { Project } from "@/app/models/Project";
import { FC, useCallback, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import Dropzone, { useDropzone } from "react-dropzone";
import { Controller, useForm } from "react-hook-form";
import { WithContext as ReactTags, SEPARATORS } from "react-tag-input";

type TechStack = { id: string; text?: string; className: string };

const ProjectsForm: FC = () => {
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

  const onFilesDrop = useCallback((acceptedFiles: File[]) => {
    // Do something with the files
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onFilesDrop,
  });

  // states
  const [techStacks, setTechStacks] = useState<TechStack[]>([]);

  useEffect(() => {
    setValue(
      "techStacks",
      techStacks.map((techStack) => techStack.id)
    );
  }, [techStacks]);

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
    console.log(data);
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
      <Dropzone>
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <p>Drag 'n' drop some files here, or click to select files</p>
          </div>
        )}
      </Dropzone>

      <div className="d-flex justify-content-end mt-3">
        <Button type="submit" variant="success" className="w-25">
          Submit
        </Button>
      </div>
    </Form>
  );
};

export default ProjectsForm;
