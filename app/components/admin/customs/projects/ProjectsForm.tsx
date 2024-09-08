import { ProjectInterface } from "@/app/interfaces/ProjectInterface";
import { Project } from "@/app/models/Project";
import { FC } from "react";
import { Form } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { WithContext as ReactTags, SEPARATORS } from "react-tag-input";

const ProjectsForm: FC = () => {
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ProjectInterface>({
    defaultValues: Project,
  });

  const keyCodes = {
    comma: 188,
    enter: [10, 13],
  };

  const formSubmitHandler = (data: ProjectInterface) => {};

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
      {/* <ReactTags /> */}
    </Form>
  );
};

export default ProjectsForm;
