import cn from 'classnames';
import { memo } from 'react';
import { useForm } from 'react-hook-form';

import { IPostCreate, IPostUpdate } from '../../interfaces/posts';

import styles from './styles.module.scss';

interface IPostEditorProps {
  post: IPostUpdate;
  onCancel: () => void;
  onSubmit: (data: IPostCreate) => void;
}

export const PostEditor = memo(({ post, onCancel, onSubmit }: IPostEditorProps): JSX.Element => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <div className={styles.root}>
      <form className={styles.form} onSubmit={handleSubmit((data: IPostCreate) => onSubmit(data))}>
        <div className={cn(styles.title, errors.title && styles.errorText)}>Title</div>
        <input
          type="text"
          className={cn(errors.title && styles.errorField)}
          {...register('title', { value: post?.title || '' })}
        />
        <div className={cn(styles.title, errors.alias && styles.errorText)}>Alias</div>
        <input
          type="text"
          className={cn(errors.title && styles.errorField)}
          {...register('alias', { value: post?.alias || '' })}
        />
        <div className={cn(styles.title, errors.content && styles.errorText)}>Content</div>
        <textarea
          className={cn(errors.content && styles.errorField)}
          {...register('content', { value: post?.content || '' })}
        />
        <div className={styles.controls}>
          <input className={styles.button} type="submit" value="Submit" />
          {onCancel && <span className={styles.button} onClick={onCancel}>Cancel</span>}
        </div>
      </form>
    </div>
  );
});
