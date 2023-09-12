import React from 'react';

import { css } from 'taddy';
import { colors, typography } from 'styles/theme';



export const MadeFor = () => {
  return (
    <div {...styles.wrapper}>
      <h3 {...styles.title}>Made for</h3>
      <div {...styles.names}>
        {['React Native', 'React', 'Svelte', 'Next.js', 'Nuxt', 'Vue', 'Parcel', 'Remix', 'Solid'].map((name) => (
          <span {...styles.name} key={name}>{name}</span>
        ))}
      </div>
    </div>
  );
};

const styles = {
  wrapper: css({
    margin: '120px 84px 0 84px',
    padding: '70px 120px',
  }),
  title: css({
    textAlign: 'center',
    ...typography.header2,
    color: colors.primary
  }),
  names: css({
    marginTop: '24px',
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap'
  }),
  name: css({
    marginRight: '42px',
    marginBottom: '24px',
    padding: '15px 36px',
    border: `1px solid #aed3e5`,
    borderRadius: '64px',
    color: colors.primary,
    ...typography.body
  }),
}