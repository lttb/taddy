import {expect, describe, it} from '@jest/globals';

import {NameGenerator} from '.';

describe('api', () => {
    it('should return class names', () => {
        const nameGenerator = new NameGenerator();

        expect(nameGenerator.getName('display', 'block'))
            .toMatchInlineSnapshot(`
            [
              "",
              "",
              "",
              "_15b0",
              "_3278",
            ]
        `);

        expect(nameGenerator.getName('display', 'inline-block'))
            .toMatchInlineSnapshot(`
            [
              "",
              "",
              "",
              "_15b0",
              "_ffcd",
            ]
        `);

        expect(nameGenerator.getName('color', 'red')).toMatchInlineSnapshot(`
            [
              "",
              "",
              "",
              "_9bfd",
              "_4da4",
            ]
        `);
    });

    it('should not have hash collisions', () => {
        const testers =
            'alignContent,alignItems,alignSelf,backfaceVisibility,borderCollapse,borderImageRepeat,boxDecorationBreak,boxSizing,breakInside,captionSide,clear,colorAdjust,colorInterpolation,colorInterpolationFilters,columnCount,columnFill,columnSpan,contain,direction,display,dominantBaseline,emptyCells,flexDirection,flexWrap,cssFloat,float,fontKerning,fontOpticalSizing,fontSizeAdjust,fontStretch,fontStyle,fontSynthesis,fontVariantCaps,fontVariantEastAsian,fontVariantLigatures,fontVariantNumeric,fontVariantPosition,fontWeight,gridAutoFlow,hyphens,imageOrientation,imageRendering,imeMode,isolation,justifyContent,justifyItems,justifySelf,lineBreak,listStylePosition,maskType,mixBlendMode,objectFit,offsetRotate,outlineStyle,overflowAnchor,overflowWrap,paintOrder,pointerEvents,position,resize,rubyAlign,rubyPosition,scrollBehavior,scrollSnapAlign,scrollSnapType,scrollbarWidth,shapeRendering,strokeLinecap,strokeLinejoin,tableLayout,textAlign,textAlignLast,textAnchor,textCombineUpright,textDecorationLine,textDecorationSkipInk,textDecorationStyle,textEmphasisPosition,textJustify,textOrientation,textRendering,textTransform,textUnderlinePosition,touchAction,transformBox,transformStyle,unicodeBidi,userSelect,vectorEffect,visibility,whiteSpace,wordBreak,writingMode,zIndex,breakAfter,breakBefore,clipRule,fillRule,fillOpacity,strokeOpacity,order,flexGrow,flexShrink,strokeMiterlimit,overflowBlock,overflowInline,overflowX,overflowY,overscrollBehaviorBlock,overscrollBehaviorInline,overscrollBehaviorX,overscrollBehaviorY,floodOpacity,opacity,shapeImageThreshold,stopOpacity,borderBlockEndStyle,borderBlockStartStyle,borderBottomStyle,borderInlineEndStyle,borderInlineStartStyle,borderLeftStyle,borderRightStyle,borderTopStyle,columnRuleStyle,animationDelay,animationDirection,animationDuration,animationFillMode,animationIterationCount,animationName,animationPlayState,animationTimingFunction,backgroundAttachment,backgroundBlendMode,backgroundClip,backgroundImage,backgroundOrigin,backgroundPositionX,backgroundPositionY,backgroundRepeat,backgroundSize,borderImageOutset,borderImageSlice,borderImageSource,borderImageWidth,borderSpacing,boxShadow,caretColor,clipPath,color,columnWidth,content,counterIncrement,cursor,filter,flexBasis,fontFamily,fontFeatureSettings,fontLanguageOverride,fontSize,fontVariantAlternates,fontVariationSettings,gridTemplateAreas,letterSpacing,lineHeight,listStyleImage,listStyleType,maskClip,maskComposite,maskImage,maskMode,maskOrigin,maskPositionX,maskPositionY,maskRepeat,maskSize,offsetAnchor,offsetPath,perspective,quotes,rotate,scale,scrollbarColor,shapeOutside,strokeDasharray,strokeDashoffset,strokeWidth,textDecorationThickness,textEmphasisStyle,textOverflow,textShadow,transitionDelay,transitionDuration,transitionProperty,transitionTimingFunction,translate,verticalAlign,willChange,wordSpacing,clip,objectPosition,perspectiveOrigin,fill,stroke,transformOrigin,counterReset,counterSet,gridTemplateColumns,gridTemplateRows,gridAutoColumns,gridAutoRows,transform,columnGap,rowGap,markerEnd,markerMid,markerStart,gridColumnEnd,gridColumnStart,gridRowEnd,gridRowStart,maxBlockSize,maxHeight,maxInlineSize,maxWidth,cx,cy,offsetDistance,textIndent,x,y,blockSize,height,inlineSize,minBlockSize,minHeight,minInlineSize,minWidth,width,outlineOffset,scrollMarginBlockEnd,scrollMarginBlockStart,scrollMarginBottom,scrollMarginInlineEnd,scrollMarginInlineStart,scrollMarginLeft,scrollMarginRight,scrollMarginTop,paddingBlockEnd,paddingBlockStart,paddingBottom,paddingInlineEnd,paddingInlineStart,paddingLeft,paddingRight,paddingTop,r,shapeMargin,rx,ry,scrollPaddingBlockEnd,scrollPaddingBlockStart,scrollPaddingBottom,scrollPaddingInlineEnd,scrollPaddingInlineStart,scrollPaddingLeft,scrollPaddingRight,scrollPaddingTop,borderBlockEndWidth,borderBlockStartWidth,borderBottomWidth,borderInlineEndWidth,borderInlineStartWidth,borderLeftWidth,borderRightWidth,borderTopWidth,columnRuleWidth,outlineWidth,borderBottomLeftRadius,borderBottomRightRadius,borderEndEndRadius,borderEndStartRadius,borderStartEndRadius,borderStartStartRadius,borderTopLeftRadius,borderTopRightRadius,bottom,insetBlockEnd,insetBlockStart,insetInlineEnd,insetInlineStart,left,marginBlockEnd,marginBlockStart,marginBottom,marginInlineEnd,marginInlineStart,marginLeft,marginRight,marginTop,right,textUnderlineOffset,top,backgroundColor,borderBlockEndColor,borderBlockStartColor,borderBottomColor,borderInlineEndColor,borderInlineStartColor,borderLeftColor,borderRightColor,borderTopColor,columnRuleColor,floodColor,lightingColor,outlineColor,stopColor,textDecorationColor,textEmphasisColor,background,backgroundPosition,borderColor,borderStyle,borderWidth,borderTop,borderRight,borderBottom,borderLeft,borderBlockStart,borderBlockEnd,borderInlineStart,borderInlineEnd,border,borderRadius,borderImage,borderBlockWidth,borderBlockStyle,borderBlockColor,borderInlineWidth,borderInlineStyle,borderInlineColor,borderBlock,borderInline,overflow,transition,animation,overscrollBehavior,pageBreakBefore,pageBreakAfter,offset,columns,columnRule,font,fontVariant,marker,textEmphasis,listStyle,margin,marginBlock,marginInline,scrollMargin,scrollMarginBlock,scrollMarginInline,outline,padding,paddingBlock,paddingInline,scrollPadding,scrollPaddingBlock,scrollPaddingInline,flexFlow,flex,gap,gridRow,gridColumn,gridArea,gridTemplate,grid,placeContent,placeSelf,placeItems,inset,insetBlock,insetInline,mask,maskPosition,textDecoration,all,pageBreakInside,wordWrap,gridColumnGap,gridRowGap,gridGap'.split(
                ',',
            );
        const generator = new NameGenerator();

        const hashes = new Map();
        const collisions: {[key: string]: any[]} = {};

        for (const test of testers) {
            const name = generator.getName(test, '').join('');

            if (hashes.has(name)) {
                collisions[name] = collisions[name] || [];
                collisions[name].push(test);
            }

            hashes.set(name, test);
        }

        expect(collisions).toEqual({});
    });
});
