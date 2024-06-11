import { ref } from "vue";
import { createPopper } from '@popperjs/core/lib/popper-lite.js';
import preventOverflow from '@popperjs/core/lib/modifiers/preventOverflow.js';

export function usePopover(popoverRef) {
  // state encapsulated and managed by the composable
  const popoverShow = ref(false);
  const todaysEvent = ref({});

  /**
   * Open or closes the popover
   * @param {event} evt The click event handler
   * @returns
   */
  const togglePopover = (evt, todaysEvt) => {
    if (popoverShow.value == false) {
      todaysEvent.value = todaysEvt;
      popoverShow.value = true;
      createPopper(evt.target, popoverRef.value, {
        modifiers: [preventOverflow],
        placement: "auto"
      });
      return;
    }

    popoverShow.value = false;
    todaysEvent.value = {};
  };

  // expose managed state as return value
  return { popoverShow, todaysEvent, togglePopover };
}
