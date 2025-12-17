import { PlayMode } from '@/atoms/audio-player';
import { AnatomyCamera, PredictionModel } from '@/atoms/twin';
import { MediaLinkType } from '@/constants/links';
import { ModelType } from '@/components/twin/model/type';

export const GA_EVENT_NAMES = {
  // common
  SESSION_INVISIBLE_TIME: 'session_invisible_time',
  MUSIC_TOGGLE: 'music_toggle',
  SUBSCRIBE_LETTER: 'subscribe_letter',
  MEDIUM_CLICK: 'medium_click',
  ID_PAGE_VIEW: 'id_page_view',
  PAGE_LOAD_START: 'page_load_start',
  PAGE_LOAD_END: 'page_load_end',
  PAGE_LOAD_ITEM: 'page_load_item',
  SUBSCRIBE_SUBMIT: 'subscribe_submit',
  SUBSCRIBE_SHOW: 'subscribe_show',
  SUBSCRIBE_CLOSE: 'subscribe_close',

  SUBSCRIBE_POPUP_STORAGE: 'subscribe_popup_storage',

  // portfolio
  PORTFOLIO_VIEW: 'portfolio_view',
  CONTACT_EMAIL: 'contact_email',

  // spectrum
  SPECTRUM_HOVER: 'spectrum_hover',
  SPECTRUM_CLICK: 'spectrum_click',

  IN_INPUT: 'in_input',
  IN_SUBMIT: 'in_submit',
  IN_LINK: 'in_link',
  IN_DRAG: 'in_drag',
  IN_POPUP: 'in_popup',

  DMCS_SCROLL: 'dmcs_scroll',
  DMCS_DOWNLOAD: 'dmcs_download',

  // engagement
  PRESENCE_VIEW: 'presence_view',
  PRESENCE_DETAIL: 'presence_detail',
  PRESENCE_TALK_VIDEO: 'presence_talk_video',

  // digital twin
  DT_DEMO: 'dt_demo',
  TWIN_SWITCH: 'twin_switch',
  MODEL_SWITCH: 'model_switch',
  TWIN_DESCRIPTION: 'twin_description',
  ANATOMY_SWITCH: 'anatomy_switch',
  TWIN_LOAD_DURATION: 'twin_load_duration',
  MODEL_LOAD_DURATION: 'model_load_duration',
  ANATOMY_LOAD_DURATION: 'anatomy_load_duration',

  // value
  VALUE_VIEW: 'value_view',

  // music player
  MUSIC_PLAYER_START: 'music_player_start',
  MUSIC_PLAYER_END: 'music_player_end',
  MUSIC_SWITCH: 'music_switch',
  PODCAST_MENU: 'podcast_menu',
  PLAYER_MENU: 'player_menu',
  PLAYER_TYPE: 'player_type',
  PODCAST_LINK_XYZ: 'podcast_link_xyz',
  PODCAST_LINK_APPLE: 'podcast_link_apple',
  MUSIC_DOWNLOAD: 'music_download',
  MUSIC_AUTO_PLAY: 'music_auto_play',
  USER_INTERACT: 'user_interact',

  // podcast page
  PODCAST_PAGE_VIEW: 'podcast_page_view',
  ID_HOME_REDIRECT: 'id_home_redirect',
  EPISODE_ITEM_CLICK: 'episode_item_click',
  EPISODE_PAGE_VIEW: 'episode_page_view',
  SUBSCRIBE_VIEW: 'subscribe_view',
  SECTION_VIEW: 'section_view',
  EPISODE_PLAY: 'episode_play',
  EPISODE_END: 'episode_end',
  TIMELINE_JUMP: 'timeline_jump',
} as const;

export const GA_EVENT_LABELS = {
  MUSIC_TOGGLE: {
    ON: 'on',
    OFF: 'off',
  },
  MUSIC_AUTO_PLAY: {
    AUTO: 'auto',
    INTERACT: 'interact',
    TOGGLE: 'toggle',
  },
  SUBSCRIBE_LETTER: {
    FIRST: 'first',
    NAV: 'nav',
    FOOTER: 'footer',
    FOOTER_CONTACT: 'footer_contact',
  },
  SUBSCRIBE_SHOW: {
    FIRST: 'first',
    NAV: 'nav',
    FOOTER: 'footer',
    FOOTER_CONTACT: 'footer_contact',
  },
  SUBSCRIBE_CLOSE: {
    FIRST: 'first',
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
    PODCAST: 'podcast',
    XYZ: 'xyz',
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
  MUSIC_PLAYER_START: {
    START: 'start',
    PAUSE: 'pause',
  },
  PODCAST_MENU: {
    LONG_TALK: 'longtalk',
    IMMORTAL_DRAGONS: 'immortaldragons',
  },
  PLAYER_MENU: {
    MUSIC: 'music',
    PODCAST: 'podcast',
  },
  PLAYER_TYPE: {
    ORDER: 'order',
    REPEAT_ONE: 'repeat_one',
    REPEAT_ALL: 'repeat_all',
    SHUFFLE: 'shuffle',
  },
  SECTION_VIEW: {
    DETAIL: 'detail_page',
    COMMENT: 'comment_page',
  },
  EPISODE_PLAY: {
    START: 'start',
    PAUSE: 'pause',
  },
} satisfies Omit<
  Record<keyof typeof GA_EVENT_NAMES, Record<string, string>>,
  | 'SESSION_INVISIBLE_TIME'
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
  | 'SPECTRUM_HOVER'
  | 'SPECTRUM_CLICK'
  | 'MUSIC_PLAYER_END'
  | 'MUSIC_SWITCH'
  | 'PODCAST_LINK_XYZ'
  | 'PODCAST_LINK_APPLE'
  | 'MUSIC_DOWNLOAD'
  | 'PAGE_LOAD_START'
  | 'PAGE_LOAD_END'
  | 'PAGE_LOAD_ITEM'
  | 'TWIN_LOAD_DURATION'
  | 'MODEL_LOAD_DURATION'
  | 'ANATOMY_LOAD_DURATION'
  | 'PRESENCE_TALK_VIDEO'
  | 'IN_INPUT'
  | 'IN_SUBMIT'
  | 'IN_LINK'
  | 'IN_DRAG'
  | 'IN_POPUP'
  | 'DMCS_SCROLL'
  | 'DMCS_DOWNLOAD'
  | 'USER_INTERACT'
  | 'PODCAST_PAGE_VIEW'
  | 'ID_HOME_REDIRECT'
  | 'EPISODE_ITEM_CLICK'
  | 'EPISODE_PAGE_VIEW'
  | 'SUBSCRIBE_VIEW'
  | 'EPISODE_END'
  | 'TIMELINE_JUMP'
  | 'SUBSCRIBE_SUBMIT'
  | 'SUBSCRIBE_POPUP_STORAGE'
> & {
  TWIN_SWITCH: Record<keyof typeof PredictionModel, string>;
  MODEL_SWITCH: Record<Uppercase<keyof typeof ModelType>, string>;
  MEDIUM_CLICK: Record<Uppercase<keyof typeof MediaLinkType>, string>;
  ANATOMY_SWITCH: Record<keyof typeof AnatomyCamera, string>;
  PLAYER_TYPE: Record<keyof typeof PlayMode, string>;
};
