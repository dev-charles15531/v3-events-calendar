import { ref, type Ref } from "vue";
import {useFloating, autoUpdate, offset, flip, shift} from '@floating-ui/vue';
import { computePosition, autoPlacement } from '@floating-ui/dom';


export function usePopover(
  popoverRef: Ref<HTMLElement>
): {
  popoverShow: Ref<boolean>;
  todaysEvent: Ref<Record<string, unknown>>;
  togglePopover: (el: HTMLElement, todaysEvt: Record<string, unknown>) => void;
} {
  // state encapsulated and managed by the composable
  const popoverShow = ref<boolean>(false);
  const todaysEvent = ref<Record<string, unknown>>({});
  const elRef = ref<HTMLElement | null>(null);
  useFloating(elRef, popoverRef, {
    whileElementsMounted: autoUpdate,
  });
  const manualUpdate = async () => {
    if (!elRef.value || !popoverRef.value) return;
    
    const { x, y } = await computePosition(
      elRef.value,
      popoverRef.value,
      {
        middleware: [offset(-1), flip(), shift(), autoPlacement()]
      }
    );
  
    popoverRef.value.style.transform = `translate(${x}px, ${y}px)`;
  };

  /**
   * Open or closes the popover
   * @param {HTMLElement} el The click event handler
   * @param {Record<string, unknown>} todaysEvt The event for the current day
   * @returns
   */
  const togglePopover = async (el: HTMLElement, todaysEvt: Record<string, unknown>) => {    
    if (popoverShow.value == false) {
      elRef.value = el;
      todaysEvent.value = todaysEvt;
      
      await manualUpdate();

      popoverShow.value = true;

      return;
    }

    popoverShow.value = false;
    todaysEvent.value = {};
  };


  // expose managed state as return value
  return { popoverShow, todaysEvent, togglePopover };
}
