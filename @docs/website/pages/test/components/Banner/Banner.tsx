import React from 'react';
import Image from 'next/image';

import { css } from 'taddy';

import banner from '@docs/website/public/logo/banner.svg';
import label from '@docs/website/public/logo/taddy_label.svg';
import { colors, typography } from 'styles/theme';

export const Banner = () => {
  return (
    <div {...styles.wrapper}>
      <div {...styles.banner}>
        <div {...styles.text}>
          <h4 {...styles.title}>Start developing with</h4>
          <Image src={label.src} width='160' height='50' alt='taddy label' {...styles.label} />
        </div>
        <a href='https://github.com/lttb/taddy' target='_blank' {...styles.link}>Go to docs</a>
      </div>
    </div>
  );
};


const styles = {
  wrapper: css({
    margin: '100px auto 220px auto',
  }),
  banner: css({
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    padding: '65px',
    height: '240px',
    backgroundImage: `url(${banner.src})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
  }),
  label: css({
    marginTop: '8px',
    marginLeft: '16px'
  }),
  text: css({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }),
  title: css({
    textAlign: 'center',
    ...typography.header2,
    color: colors.background,
  }),
  link: css({
    margin: '16px auto 0 auto',
    padding: '15px 42px',
    ...typography.body,
    color: colors.text,
    borderRadius: '50px',
    background: colors.background,
    transition: 'all 0.2s ease',

    ':hover': {
      color: '#247eab'
    }
  })
}