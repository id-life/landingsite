import { AnatomyCamera, PredictionModel } from '@/atoms/twin';
import { MediaLinkType } from '@/components/layout/footer/FooterContact';
import { ModelType } from '@/components/twin/model/type';

export const GA_EVENT_NAMES = {
  // common
  MUSIC_TOGGLE: 'music_toggle',
  SUBSCRIBE_LETTER: 'subscribe_letter',
  MEDIUM_CLICK: 'medium_click',
  ID_PAGE_VIEW: 'id_page_view',

  // portfolio
  PORTFOLIO_VIEW: 'portfolio_view',
  CONTACT_EMAIL: 'contact_email',

  // engagement
  PRESENCE_VIEW: 'presence_view',
  PRESENCE_DETAIL: 'presence_detail',

  // digital twin
  DT_DEMO: 'dt_demo',
  TWIN_SWITCH: 'twin_switch',
  MODEL_SWITCH: 'model_switch',
  TWIN_DESCRIPTION: 'twin_description',
  ANATOMY_SWITCH: 'anatomy_switch',

  // value
  VALUE_VIEW: 'value_view',
} as const;

export const GA_EVENT_LABELS = {
  MUSIC_TOGGLE: {
    ON: 'on',
    OFF: 'off',
  },
  SUBSCRIBE_LETTER: {
    NAV: 'nav',
    FOOTER: 'footer',
    FOOTER_CONTACT: 'footer_contact',
  },
  TWIN_SWITCH: {
    M0: 'ORG',
    M1: 'C01',
    M2: 'C02',
    M3: 'C03',
  },
  MODEL_SWITCH: {
    SKIN: 'skin',
    ANATOMY: 'anatomy',
  },
  TWIN_DESCRIPTION: {
    C01: 'C01',
    C02: 'C02',
    C03: 'C03',
  },
  MEDIUM_CLICK: {
    YOUTUBE: 'youtube',
    LINKEDIN: 'linkedin',
    MEDIA: 'drive',
  },
  ANATOMY_SWITCH: {
    CAMERA0: '0',
    CAMERA1: '1',
    CAMERA2: '2',
    CAMERA3: '3',
    CAMERA4: '4',
    CAMERA5: '5',
    CAMERA6: '6',
    CAMERA7: '7',
    CAMERA8: '8',
    CAMERA9: '9',
    CAMERA10: '10',
  },
} satisfies Omit<
  Record<keyof typeof GA_EVENT_NAMES, Record<string, string>>,
  | 'PORTFOLIO_VIEW'
  | 'CONTACT_EMAIL'
  | 'PRESENCE_VIEW'
  | 'PRESENCE_DETAIL'
  | 'DT_DEMO'
  | 'TWIN_SWITCH'
  | 'MODEL_SWITCH'
  | 'MEDIUM_CLICK'
  | 'ANATOMY_SWITCH'
  | 'ID_PAGE_VIEW'
  | 'VALUE_VIEW'
> & {
  TWIN_SWITCH: Record<keyof typeof PredictionModel, string>;
  MODEL_SWITCH: Record<Uppercase<keyof typeof ModelType>, string>;
  MEDIUM_CLICK: Record<Uppercase<keyof typeof MediaLinkType>, string>;
  ANATOMY_SWITCH: Record<keyof typeof AnatomyCamera, string>;
};
