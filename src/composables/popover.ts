import { ref, type Ref } from "vue";
import { useFloating, autoUpdate, flip, shift } from "@floating-ui/vue";
import { computePosition, autoPlacement, inline } from "@floating-ui/dom";

export function usePopover(popoverRef: Ref<HTMLElement>): {
  popoverShow: Ref<boolean>;
  todaysEvent: Ref<Record<string, unknown>>;
  openPopover: (el: HTMLElement, todaysEvt: Record<string, unknown>) => void;
  closePopover: () => void;
} {
  // state encapsulated and managed by the composable
  const popoverShow = ref<boolean>(false);
  const todaysEvent = ref<Record<string, unknown>>({});
  const elRef = ref<HTMLElement | null>(null);
  let cleanup: () => void = null;

  useFloating(elRef, popoverRef, {
    whileElementsMounted: autoUpdate,
  });

  /**
   * Run the autoUpdate function to reposition the popover
   * after the element and popover have been mounted.
   *
   * @returns A cleanup function that can be called to
   * stop the autoUpdate loop.
   */
  const runUpdate = async () => {
    if (!elRef.value || !popoverRef.value) return;

    cleanup = autoUpdate(elRef.value, popoverRef.value, () => {
      computePosition(elRef.value, popoverRef.value, {
        placement: "right",
        middleware: [flip({fallbackPlacements: ["right", "left"]}), shift(), inline()],
      }).then(({ x, y }) => {
        Object.assign(popoverRef.value.style, {
          left: `${x}px`,
          top: `${y}px`,
        });
      });
    });
  };

  /**
   * Open or closes the popover
   * @param {HTMLElement} el The click event handler
   * @param {Record<string, unknown>} todaysEvt The event for the current day
   * @returns
   */
  const openPopover = async (
    el: HTMLElement,
    todaysEvt: Record<string, unknown>
  ) => {
    if (popoverShow.value == false) {
      elRef.value = el;
      todaysEvent.value = todaysEvt;

      await runUpdate();

      popoverShow.value = true;

      return;
    }
  };

  /**
   * Closes the popover
   *
   * Sets the popoverShow state to false, removes the current event
   * from the todaysEvent state, and stops the autoUpdate loop.
   */
  const closePopover = () => {
    popoverShow.value = false;
    todaysEvent.value = {};

    cleanup?.();
  };

  // expose managed state as return value
  return { popoverShow, todaysEvent, openPopover, closePopover };
}
