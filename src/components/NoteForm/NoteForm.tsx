
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { createNote } from '../../services/noteService';
import type { NoteTag } from '../../types/note';
import css from './NoteForm.module.css';

interface NoteFormProps {
  onCancel: () => void;
}

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  content: Yup.string().required('Content is required'),
  tag: Yup.mixed<NoteTag>()
    .oneOf(['Work', 'Personal', 'Study'])
    .required('Tag is required'),
});

const initialValues = {
  title: '',
  content: '',
  tag: 'personal' as NoteTag,
};

export default function NoteForm({ onCancel }: NoteFormProps) {
  const queryClient = useQueryClient();

  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      toast.success('Note created successfully!');
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onCancel(); 
    },
    onError: (error) => {
      toast.error(`Error creating note: ${error.message}`);
    },
  });

  const handleSubmit = (values: typeof initialValues) => {
    createNoteMutation.mutate(values);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <label className={css.label}>
            Title
            <Field className={css.input} type="text" name="title" />
            <ErrorMessage className={css.error} name="title" component="div" />
          </label>
          <label className={css.label}>
            Content
            <Field className={css.textarea} as="textarea" name="content" />
            <ErrorMessage className={css.error} name="content" component="div" />
          </label>
          <label className={css.label}>
            Tag
            <Field className={css.select} as="select" name="tag">
              <option value="personal">Personal</option>
              <option value="work">Work</option>
              <option value="study">Study</option>
            </Field>
            <ErrorMessage className={css.error} name="tag" component="div" />
          </label>
          <div className={css.buttonGroup}>
            <button
              className={css.submitButton}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Note'}
            </button>
            <button className={css.cancelButton} type="button" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
