/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type { ViewProps } from '../View';

import * as React from 'react';
import ModalPortal from './ModalPortal';
import ModalAnimation from './ModalAnimation';
import ModalContent from './ModalContent';
import ModalFocusTrap from './ModalFocusTrap';
import ModalManager from './ModalManager';

export type ModalProps = {
  ...ViewProps,
  animationType?: 'none' | 'slide' | 'fade',
  children: any,
  hardwareAccelerated?: ?boolean,
  onDismiss?: ?() => mixed,
  onOrientationChange?: ?(e: {|
    orientation: 'portrait' | 'landscape'
  |}) => void,
  onRequestClose?: ?() => void,
  onShow?: ?() => void,
  presentationStyle?: ?(
    | 'fullScreen'
    | 'pageSheet'
    | 'formSheet'
    | 'overFullScreen'
  ),
  statusBarTranslucent?: ?boolean,
  supportedOrientations?: ?Array<
    | 'portrait'
    | 'portrait-upside-down'
    | 'landscape'
    | 'landscape-left'
    | 'landscape-right'
  >,
  transparent?: ?boolean,
  visible?: ?boolean
};

const Modal: React.AbstractComponent<
  ModalProps,
  React.ElementRef<typeof ModalContent>
> = React.forwardRef((props, forwardedRef) => {
  const {
    animationType,
    children,
    onDismiss,
    onRequestClose,
    onShow,
    transparent,
    visible = true,
    ...rest
  } = props;

  // Set a unique model identifier so we can correctly route
  // dismissals and check the layering of modals.
  const modalId = React.useMemo(() => ModalManager.generateId(), []);

  const [isActive, setIsActive] = React.useState(false);

  const onDismissCallback = React.useCallback(() => {
    ModalManager.removeActiveModal(modalId);
    if (onDismiss) {
      onDismiss();
    }
  }, [modalId, onDismiss]);

  const onShowCallback = React.useCallback(() => {
    ModalManager.addActiveModal(modalId, setIsActive);
    if (onShow) {
      onShow();
    }
  }, [modalId, onShow]);

  React.useEffect(() => {
    return () => ModalManager.removeActiveModal(modalId);
  }, [modalId]);

  return (
    <ModalPortal>
      <ModalAnimation
        animationType={animationType}
        onDismiss={onDismissCallback}
        onShow={onShowCallback}
        visible={visible}
      >
        <ModalFocusTrap active={isActive}>
          <ModalContent
            {...rest}
            active={isActive}
            onRequestClose={onRequestClose}
            ref={forwardedRef}
            transparent={transparent}
          >
            {children}
          </ModalContent>
        </ModalFocusTrap>
      </ModalAnimation>
    </ModalPortal>
  );
});

export default Modal;
