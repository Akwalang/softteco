import React from 'react';

import { Loader } from '../Loader/Loader';
import { Error } from '../Error/Error';

interface IWaitingProps {
  queries: {
    isLoading: boolean;
    isError: boolean;
    isSuccess: boolean;
  }[];
  children?: React.ReactNode;
}

export const Waiting = ({ queries, children }: IWaitingProps): JSX.Element => {
  const isLoading = queries.some((query) => query.isLoading);
  const isError = queries.some((query) => query.isError);
  const isSuccess = queries.every((query) => query.isSuccess);

  switch (true) {
    case isError: return <Error />;
    case isLoading: return <Loader />;
    case isSuccess: return <>{children}</>;
    default: return <></>;
  }
};
