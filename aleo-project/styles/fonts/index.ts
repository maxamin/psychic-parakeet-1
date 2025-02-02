import localFont from 'next/font/local'

const londrinaSolid = localFont({
  variable: '--font-londrina-solid',
  src: [
    {
      path: './Londrina_Solid/LondrinaSolid-Thin.ttf',
      weight: '100',
      style: 'normal',
    },
    {
      path: './Londrina_Solid/LondrinaSolid-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: './Londrina_Solid/LondrinaSolid-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './Londrina_Solid/LondrinaSolid-Black.ttf',
      weight: '900',
      style: 'normal',
    },
  ],
})

const ptRootUI = localFont({
  variable: '--font-pt-root-ui',
  src: [
    {
      path: './PT-Root-UI/pt-root-ui_light.ttf',
      weight: '100',
      style: 'normal',
    },
    {
      path: './PT-Root-UI/pt-root-ui_regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './PT-Root-UI/pt-root-ui_medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './PT-Root-UI/pt-root-ui_bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
})

export { londrinaSolid, ptRootUI }
