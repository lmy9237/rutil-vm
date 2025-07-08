// check whether the current event is paste event Ctrl+v or Cmd+v
function isPasteKeydownEvent(e) {
  return e.keyCode === 86 && (e.ctrlKey || e.metaKey);
}

// defined all function keys status
const functionKeyDownStatus = {
  "ShiftLeft": false,
  "ShiftRight": false,
  "ControlLeft": false,
  "ControlRight": false,
  "AltLeft": false,
  "AltRight": false,
  "MetaLeft": false,
  "MetaRight": false,
}

// before paste, up all function keys
function upAllFunctionKeys(rfb) {
  const allFunctionKeys = Object.keys(functionKeyDownStatus);
  for (const functionKey of allFunctionKeys) {
    if (functionKeyDownStatus[functionKey]) {
      rfb.sendKey(0, functionKey, false);
      functionKeyDownStatus[functionKey] = false;
    }
  }
}

// paste keydown event listener
function pasteKeyDownListener(e) {
  if (e.code in functionKeyDownStatus) {
    // record function key status
    functionKeyDownStatus[e.code] = true;
  }
  if (!isPasteKeydownEvent(e)) {
    return;
  }
  if (navigator.clipboard) {
    e.stopPropagation();
    navigator.clipboard.readText().then(function (text) {
      if (rfb._rfbConnectionState === 'connected') {
        pasteText(text)
      }
    });
  }
}

// paste keyup event listener
function pasteKeyUpListener(e) {
  if (e.code in functionKeyDownStatus) {
    functionKeyDownStatus[e.code] = false;
  }
}

// import KeyTable from './core/input/keysym.js'
// keyTable is the core/input/keysym.js
// paste text
export function pasteText(rfb, text) {
  // we need up all function keys first
  upAllFunctionKeys(rfb);
  for (const character of text) {
    const code = character.charCodeAt();
    const needs_shift = /[!@#$%^&*()_+{}:\"<>?~|]/.test(character) || (rfb._remoteCapsLock ? /[a-z]/.test(character) : /[A-Z]/.test(character))
    if (needs_shift) {
      rfb.sendKey(KeyTable.XK_Shift_L, character, true);
    }
    if (code === 10) {
      // newline symbol \n
      rfb.sendKey(KeyTable.XK_Return, character, true);
      rfb.sendKey(KeyTable.XK_Return, character, false);
    } else {
      rfb.sendKey(code, character, true);
      rfb.sendKey(code, character, false);
    }
    if (needs_shift) {
      rfb.sendKey(KeyTable.XK_Shift_L, character, false);
    }
  }
}