import { useForm } from 'react-hook-form';
import cn from 'classnames';

import { useSignUp } from '../../hooks/useAuth';

import styles from './styles.module.scss';

type FormValues = {
  name: string;
  email: string;
  password: string;
};

export const SignUp = (): JSX.Element => {
  const signUpMutation = useSignUp();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  return (
    <div className={styles.root}>
      <div className={styles.description}>
        <p>We're so excited to have you on board! Signing up is the first step to unlocking all the amazing features we have to offer.</p>
      </div>
      <form className={styles.form} onSubmit={handleSubmit((data: FormValues) => signUpMutation.mutate(data))}>
        <div className={cn(styles.title, errors.name && styles.errorText)}>Name</div>
        <input
          placeholder="Name"
          type="text"
          className={cn(errors.name && styles.errorField)}
          {...register('name', { required: true })}
        />

        <div className={cn(styles.title, errors.email && styles.errorText)}>Email</div>
        <input
          placeholder="Email"
          type="text"
          className={cn(errors.email && styles.errorField)}
          {...register('email', { required: true, pattern: /(\w*\.)*\w+@(\w*\.)+[a-z]{2,}/i })}
        />

        <div className={cn(styles.title, errors.password && styles.errorText)}>Password</div>
        <input
          placeholder="Password"
          type="password"
          className={cn(errors.password && styles.errorField)}
          {...register('password', { required: true })}
        />

        <div className={styles.controls}>
          <input type="submit" />
        </div>
      </form>
    </div>
  );
};
