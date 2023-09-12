import React from 'react';
import Image from 'next/image';

import { css } from 'taddy';

import taddy from '@docs/website/public/logo/taddy_new.svg';
import label from '@docs/website/public/logo/taddy_label.svg';
import { colors, typography } from 'styles/theme';


const links = {
  docs: {
    title: 'Docs',
    href: 'https://github.com/lttb/taddy'
  },
  github: {
    title: 'Github',
    href: 'https://github.com/lttb/taddy'
  },
  twitter: {
    title: 'Twitter',
    href: 'https://twitter.com/_lttb'
  }
}

export const Header = () => {
  return (
    <header {...styles.header}>
      <div {...styles.left}>
        <Image src={taddy.src} width='63' height='60' alt='taddy logo' />
        <Image src={label.src} width='76' height='60' alt='taddy logo' {...styles.label} />
      </div>
      <nav {...styles.right}>
        {Object.keys(links).map(key => (
          <a key={key} href={links[key].href} target='_blank' {...styles.link}>{links[key].title}</a>
        ))}
      </nav>
    </header>
  );
};


const styles = {
  header: css({
    display: 'flex',
    flexWrap: 'wrap',
    padding: '0 42px',
    justifyContent: 'space-between',
    // '@media': {
    //   'min-width: 768px': {
    //     padding: '0 42px',
    //     justifyContent: 'space-between',
    //   }
    // },
  }),
  left: css({
    display: 'flex'
  }),
  right: css({
    alignSelf: 'center',
    display: 'flex',
    alignItems: 'center'
  }),
  label: css({
    marginLeft: '12px',
    marginTop: '4px'
  }),
  link: css({
    ...typography.body,
    color: colors.text,
    marginLeft: '48px',
    transition: 'all 0.2s ease',

    ':hover': {
      color: '#247eab'
    }
  })
}