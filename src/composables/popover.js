import { ref } from "vue";
import { createPopper } from "@popperjs/core";

export function usePopover(popoverRef) {
  // state encapsulated and managed by the composable
  const popoverShow = ref(false);

  /**
   * Open or closes the popover
   * @param {event} evt The click event handler
   * @returns
   */
  const togglePopover = (evt) => {
    if (popoverShow.value == false) {
      popoverShow.value = true;
      createPopper(evt.target, popoverRef.value, {
        placement: "top",
      });
      return;
    }

    popoverShow.value = false;
  };

  // expose managed state as return value
  return { popoverShow, togglePopover };
}
