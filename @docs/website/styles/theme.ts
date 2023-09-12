import { mixin } from "taddy"

export const colors = {
  text: '#000',
  primary: '#103c4e',
  background: '#ffffff'
}

export const typography = {
  header1: mixin({
    fontSize: '72px',
    lineHeight: '88px',
    fontWeight: '700',
    fontFamily: 'Inter',
  }),
  header2: mixin({
    fontSize: '48px',
    lineHeight: '54px',
    fontWeight: '700',
    fontFamily: 'Inter'
  }),
  caption: mixin({
    fontSize: '24px',
    lineHeight: '30px',
    fontWeight: '400',
    fontFamily: 'Inter'
  }),
  body: mixin({
    fontSize: '18px',
    lineHeight: '22px',
    fontWeight: '500',
    fontFamily: 'Inter'
  }),
}