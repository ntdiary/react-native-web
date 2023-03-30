import * as React from 'react';

let uniqueModalIdentifier = 0;

const activeModalStack = [];
const activeModalListeners = {};

function generateId() {
  return uniqueModalIdentifier++;
}

function notifyActiveModalListeners() {
  if (activeModalStack.length === 0) {
    return;
  }
  const activeModalId = activeModalStack[activeModalStack.length - 1];
  activeModalStack.forEach((modalId) => {
    if (modalId in activeModalListeners) {
      activeModalListeners[modalId](modalId === activeModalId);
    }
  });
}

function removeActiveModal(modalId) {
  if (modalId in activeModalListeners) {
    // Before removing this listener we should probably tell it
    // that it's no longer the active modal for sure.
    activeModalListeners[modalId](false);
    delete activeModalListeners[modalId];
  }
  const index = activeModalStack.indexOf(modalId);
  if (index !== -1) {
    activeModalStack.splice(index, 1);
    notifyActiveModalListeners();
  }
}

function addActiveModal(modalId, listener) {
  removeActiveModal(modalId);
  activeModalStack.push(modalId);
  activeModalListeners[modalId] = listener;
  notifyActiveModalListeners();
}

function disableTrap() {
  const activeModalId = activeModalStack[activeModalStack.length - 1];
  activeModalListeners[activeModalId](false);
}

const triggerElementRef = React.createRef();

export default {
  generateId,
  removeActiveModal,
  addActiveModal,
  disableTrap,
  triggerElementRef
};
