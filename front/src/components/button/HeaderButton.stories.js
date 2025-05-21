import { fn } from '@storybook/test';
import HeaderButton   from '@/components/button/HeaderButton';
import Localization   from '@/utils/Localization';
import Logger         from '@/utils/Logger';
import { Subtitle } from '@storybook/blocks';

export default {
  title: 'Example/HeaderButton',
  component: HeaderButton,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
  args: {
    // onCreateAccount: fn(),
    title: '',
    subtitle: '',
    additionalText: '',
    buttons: [],
    popupItems: [],
    openModal: fn(),
    togglePopup: fn(),
  },
};

export const ClusterHeaderButton = {
  args: {
    title: Localization.kr.CLUSTER,
    subtitle: '??????????',
    additionalText: '목록이름',
    buttons: [
      { id: 'edit_btn', label: Localization.kr.UPDATE, onClick: () => Logger.debug('Edit button clicked') },
      { id: 'delete_btn', label: Localization.kr.REMOVE, onClick: () => Logger.debug('Delete button clicked') },
    ],
    popupItems: [

    ]
  },
};

export const LoggedOut = {};