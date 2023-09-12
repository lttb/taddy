import React from 'react';

import { css } from 'taddy';
import { colors, typography } from 'styles/theme';

const texts = [
  {
    title: 'Compile-time Atomic Style',
    text: 'generates optimized atomic styles during the build process, resulting in minimal'
  },
  {
    title: 'Mixins and Composes',
    text: 'create reusable styling objects and easily apply and combine them to your styles'
  },
  {
    title: 'Framework-Agnostic',
    text: 'can be used with any JS framework or environment, making it highly versatile and adaptable'
  },
  {
    title: 'Efficient and Performant',
    text: 'optimizes the CSS output by reducing duplication and generating atomic class names'
  },
  {
    title: 'Autocomplete',
    text: 'with TypeScript support, taddy ensures type safety, allowing you to catch errors and get code suggestions for styles'
  },
  {
    title: 'Developer Experience',
    text: 'intuitive API and powerful features make it easy to write clean and maintainable styles for your components'
  }
]



export const KeyFeatures = () => {
  return (
    <div {...styles.wrapper}>
      <h3 {...styles.title}>Key features</h3>
      <div {...styles.blocks}>
        {texts.map(({ title, text }, index) => (
          <div key={index} {...styles.block}>
            <span {...styles.taddy}>🧸</span>
            <div {...styles.right}>
              <h4 {...styles.feature}>{title}</h4>
              <span {...styles.text}>{text}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  wrapper: css({
    padding: '80px 180px 120px 180px',
    background: 'linear-gradient(180deg, #aed3e5 0%, #e7f0fd 100%)',
  }),
  title: css({
    textAlign: 'center',
    ...typography.header2,
    color: colors.primary,
    marginBottom: '45px'
  }),
  blocks: css({
    display: 'grid',
    gridGap: '36px 95px',
    gridTemplateColumns: '1fr 1fr',
    maxWidth: '900px',
    margin: 'auto'
  }),
  block: css({
    display: 'flex',
    padding: '16px 20px',
    background: 'rgba(255, 255, 255, 0.90)',
    borderRadius: '16px',
    color: colors.primary,
    boxShadow: '0px 3px 10px 0px rgba(16, 60, 78, 0.15)'
  }),
  taddy: css({
    marginTop: '-6px',
    fontSize: '24px'
  }),
  right: css({
    marginLeft: '12px'
  }),
  feature: css({
    marginBottom: '4px',
    ...typography.body,
    fontWeight: 700,
  }),
  text: css({
    fontSize: '16px',
    fontWeight: '400',
    color: colors.text
  })
}