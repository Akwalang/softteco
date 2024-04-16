import { useForm } from 'react-hook-form';
import cn from 'classnames';

import { useSignIn } from '../../hooks/useAuth';

import styles from './styles.module.scss';

type FormValues = {
  email: string;
  password: string;
};

export const SignIn = (): JSX.Element => {
  const signInMutation = useSignIn();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  return (
    <div className={styles.root}>
      <div className={styles.description}>
        <p>Sign in to pick up right where you left off and continue enjoying all the great things we've prepared for you.</p>
      </div>
      <form className={styles.form} onSubmit={handleSubmit((data: FormValues) => signInMutation.mutate(data))}>
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
