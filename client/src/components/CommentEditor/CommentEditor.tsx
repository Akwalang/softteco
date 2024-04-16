import cn from 'classnames';
import { memo } from 'react';
import { useForm } from 'react-hook-form';

import { ICommentUpdate } from '../../interfaces/comments';

import styles from './styles.module.scss';

interface ICommentEditorProps {
  title?: string;
  value?: string;
  onCancel?: () => void;
  onSubmit: (data: ICommentUpdate) => void;
}

type FormValues = {
  message: string;
};

export const CommentEditor = memo((props: ICommentEditorProps): JSX.Element => {
  const { title, value = '', onCancel, onSubmit } = props;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const createComment = (data: ICommentUpdate) => {
    onSubmit(data);
    reset();
  };

  return (
    <div className={styles.root}>
      <form className={styles.form} onSubmit={handleSubmit((data: FormValues) => createComment(data))}>
        {title && <div className={cn(styles.title, errors.message && styles.errorText)}>{title}</div>}
        <div className={styles.field}>
          <textarea {...register('message', { value, required: true })} />
        </div>
        <div className={styles.submit}>
          <input type="submit" value="Submit" />
          {onCancel && <span className={styles.cancelButton} onClick={onCancel}>Cancel</span>}
        </div>
      </form>
    </div>
  );
});
