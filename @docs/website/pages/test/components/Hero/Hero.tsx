import React from 'react';

import { css } from 'taddy';
import { colors, typography } from 'styles/theme';

import { motion } from 'framer-motion';

import taddy from '@docs/website/public/logo/taddy_new.svg';
import label from '@docs/website/public/logo/taddy_label.svg';

import polygon1 from '@docs/website/public/logo/polygons/Polygon 1.svg';
import polygon2 from '@docs/website/public/logo/polygons/Polygon 2.svg';
import polygon3 from '@docs/website/public/logo/polygons/Polygon 3.svg';
import polygon5 from '@docs/website/public/logo/polygons/Polygon 5.svg';
import polygon6 from '@docs/website/public/logo/polygons/Polygon 6.svg';
import polygon7 from '@docs/website/public/logo/polygons/Polygon 7.svg';

import Image from 'next/image';


export const Hero = () => {
  return (
    <div {...styles.wrapper} >
      <h1 {...styles.h1}>
        <span {...styles.blue}>Minimal</span> bundle sizes and{' '}
        <span {...styles.blue}>maximum</span> performance with taddy,
        atomic compile-time CSS-in-JS library for any framework.
      </h1>
      <div {...styles.mainContainer}>
        <Image src={label.src} width='375' height='188' alt='taddy label' />
        <motion.div initial="hidden" animate="visible" variants={{
          hidden: {
            y: 80,
            opacity: 0.9
          },
          visible: {
            y: 40,
            opacity: 1,
            transition: {
              duration: 4,
              type: 'spring'
            }
          },
        }}>
          <Image src={taddy.src} width='382' height='354' alt='taddy logo' {...styles.logo} />
        </motion.div>
        <div {...styles.buttons}>
          <div {...styles.install}>$ npm install --save taddy</div>
          <a href='https://github.com/lttb/taddy' target='_blank' {...styles.button}>Github</a>
          <a href='https://github.com/lttb/taddy' target='_blank' {...styles.button}>Get ready</a>
        </div>
      </div>
      <div>
        <Image src={polygon1.src} width='45' height='70' alt='polygon' {...css(polygons.common, polygons.one)} />
        <Image src={polygon2.src} width='45' height='70' alt='polygon' {...css(polygons.common, polygons.two)} />
        <Image src={polygon3.src} width='45' height='70' alt='polygon' {...css(polygons.common, polygons.three)} />
        <Image src={polygon5.src} width='45' height='70' alt='polygon' {...css(polygons.common, polygons.five)} />
        <Image src={polygon6.src} width='45' height='70' alt='polygon' {...css(polygons.common, polygons.six)} />
        <Image src={polygon7.src} width='45' height='70' alt='polygon' {...css(polygons.common, polygons.seven)} />
      </div>
    </div>
  );
};

const styles = {
  wrapper: css({
    position: 'relative',
    '@media': {
      'min-width: 768px': {
        padding: '0 42px',
      }
    },
  }),
  h1: css({
    ...typography.caption,
    color: colors.text,
    margin: 0,
    marginTop: '60px',
    maxWidth: '690px'
  }),
  blue: css({
    color: '#247eab'
  }),
  mainContainer: css({
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    height: '380px',
  }),
  logo: css({
    flex: '0 0 33%',
    animation: 'float 7s ease-in-out infinite'
  }),
  buttons: css({
    alignSelf: 'flex-end',
    '@media': {
      'min-width: 768px': {
        flex: '0 0 33%',
      }
    },
  }),
  button: css({
    display: 'inline-block',
    marginRight: '12px',
    marginTop: '12px',
    padding: '15px 42px',
    ...typography.body,
    color: colors.primary,
    borderRadius: '50px',
    background: 'linear-gradient(90deg, #aed3e5 0%, #e7f0fd 100%)',
    backgroundColor: '#3596ff',
    transition: 'all 0.2s ease',

    ':hover': {
      color: colors.background
    }
  }),
  install: css({
    ...typography.body,
    color: '#e55454'
  })
}


const polygons = {
  one: css.mixin({
    top: '256px',
    left: '239px'
  }),
  two: css.mixin({
    top: '320px',
    left: '340px'
  }),
  three: css.mixin({
    top: '332px',
    left: '94px'
  }),
  five: css.mixin({
    top: '54px',
    right: '269px'
  }),
  six: css.mixin({
    top: '175px',
    right: '225px'
  }),
  seven: css.mixin({
    top: '45px',
    right: '110px'
  }),
  common: css.mixin({
    position: 'absolute',
    animation: 'rotate 7s ease-in-out infinite'
  })
}