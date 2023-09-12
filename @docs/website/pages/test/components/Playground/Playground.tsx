import React from 'react';
import dynamic from 'next/dynamic';

import { css } from 'taddy';
import { colors, typography } from 'styles/theme';


const Playground = dynamic(
  () => import('@docs/website/components/playground'),
  {
    ssr: false,
    loading: () => <p {...css({ textAlign: 'center' })}>loading ...</p>,
  },
);



export const PlaygroundSection = () => {
  return (
    <div {...styles.wrapper}>
      <h3 {...styles.title}>Playground</h3>
      <span {...styles.subtitle}>You can try taddy right now</span>

      <div {...styles.container}>
        <Playground
          useTest
          persistent
          showOptions
          showCompiledCode
          showRender
          showCompiledCSS
          initialCode={`
      import React from 'react';
      import { css } from 'taddy';

      const taddyButtonStyles = css({
        padding: '10px 20px',
        borderRadius: '8px',
        fontSize: '18px',
        color: 'white',
        backgroundColor: 'brown',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        ':hover': {
          backgroundColor: 'chocolate',
          transform: 'scale(1.1)',
        },
      });

      export default () => {
        return (
          <button {...taddyButtonStyles}>
            Hello, taddy!
          </button>
        );
      };
      `}
        />
      </div>
    </div>
  );
};

const styles = {
  wrapper: css({
    marginTop: '120px',
    padding: '0 120px',
    textAlign: 'center'
  }),
  title: css({
    ...typography.header2,
    color: colors.primary
  }),
  subtitle: css({
    fontFamily: 'Inter',
    fontSize: '20px',
    fontWeight: 400,
  }),
  container: css({
    marginTop: '24px'
  })
}