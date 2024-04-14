import React, { useState } from 'react';
import cn from 'classnames';

import styles from './styles.module.scss';

interface IControllItemProps {
  idx: number;
  name: string;
  isActive: boolean;
  toggle: (i: number) => void;
}

const ControlItem = (props: IControllItemProps): JSX.Element => {
  const { idx, name, isActive, toggle } = props;

  return (
    <li
      className={cn(styles.controlItem, isActive && styles.active)}
      onClick={() => toggle(idx)}
    >
      {name}
    </li>
  );
};

interface IToggleProps {
  items: string[];
  views: React.ReactNode[];
}

export const Toggle = ({ items, views }: IToggleProps): JSX.Element => {
  const [current, setCurrent] = useState<number>(0);

  const Component = views[current];

  return (
    <div className={styles.root}>
      <div className={styles.controls}>
        {items.map((name, i) =>
          <ControlItem
            key={i}
            idx={i}
            name={name}
            isActive={i === current}
            toggle={setCurrent}
          />
        )}
      </div>
      <div className={styles.scene}>
        <Component />
      </div>
    </div>
  );
}
