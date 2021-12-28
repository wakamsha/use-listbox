import type {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  Dispatch,
  KeyboardEvent,
  MouseEvent,
  RefObject,
  SetStateAction,
} from 'react';
import { createRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';

type TriggerProps = {
  ref: RefObject<HTMLButtonElement>;
} & Pick<
  DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
  'onKeyDown' | 'onClick' | 'tabIndex' | 'role' | 'aria-haspopup' | 'aria-expanded'
>;

type Response = Readonly<{
  /**
   * An object used as a property of an HTML element that controls
   * the activation and deactivation of ListBox.
   */
  triggerProps: TriggerProps;
  /**
   * An array of objects used as properties of HTML elements
   * that function as menu items in ListBox.
   */
  itemProps: {
    /**
     * This function controls the behavior of the list box menu
     * when a key is pressed while the menu item is focused.
     */
    onKeyDown: (e: KeyboardEvent<HTMLElement>) => void;
    /**
     * Set to `-1` to disable the browser's native focus logic.
     */
    tabIndex: -1;
    /**
     * Set `menuitem` to comply with WAI-ARIA guidelines.
     */
    role: 'menuitem';
    /**
     * RefObject to be applied to each menu item, used to control the focus handling.
     */
    ref: RefObject<any>;
  }[];
  /**
   * A Boolean value indicating whether or not ListBox is active.
   * The application developer uses this value to set whether or not to display the menu.
   */
  active: boolean;
  /**
   * It is used by application developers to control the activation
   * and deactivation of menus in their programs.
   */
  setActive: Dispatch<SetStateAction<boolean>>;
}>;

export function useListBox(itemCount: number): Response {
  const [active, setActive] = useState(false);

  const [focusIndex, setFocusIndex] = useState(0);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useMemo(() => [...Array(itemCount).keys()].map(() => createRef<HTMLElement>()), [itemCount]);

  /** Determine if it is a keyboard event. */
  const isKeyboardEvent = (e: KeyboardEvent | MouseEvent): e is KeyboardEvent => !!(e as KeyboardEvent).key;

  /** Move the focus of a menu item. */
  const moveFocus = useCallback(
    (itemIndex: number) => {
      setFocusIndex(itemIndex);
      itemRefs[itemIndex].current?.focus();
    },
    [itemRefs],
  );

  const handleTrigger = useCallback(
    (e: KeyboardEvent<HTMLButtonElement> | MouseEvent<HTMLButtonElement>) => {
      if (isKeyboardEvent(e)) {
        if (![KeyMaps.ArrowDown, KeyMaps.Escape, KeyMaps.Enter, KeyMaps.Space, KeyMaps.Tab].includes(e.key)) return;

        if ([KeyMaps.ArrowDown, KeyMaps.Tab].includes(e.key) && active) {
          e.preventDefault();
          moveFocus(0);
        }

        if ([KeyMaps.Enter, KeyMaps.Space].includes(e.key)) {
          e.preventDefault();
          setActive(true);
        }

        if (e.key === KeyMaps.Escape) {
          e.preventDefault();
          setActive(false);
        }

        return;
      }

      setActive(active => !active);
    },
    [active, moveFocus],
  );

  /**
   * Define the process to be executed in response to
   * the keyboard event fired by the menu item.
   */
  const handleItemKeyDown = useCallback(
    (e: KeyboardEvent<HTMLElement>) => {
      if (Object.values(KeyMaps).includes(e.key)) {
        switch (e.key) {
          case KeyMaps.Escape:
            setActive(false);
            triggerRef.current?.focus();
            break;
          case KeyMaps.Tab:
            setActive(false);
            break;
          case KeyMaps.Enter:
            if (!['BUTTON', 'INPUT', 'A'].includes(e.currentTarget.nodeName)) {
              e.currentTarget.click();
            }
            setActive(false);
            break;
          case KeyMaps.Space:
            e.currentTarget.click();
            setActive(false);
            break;
        }

        const newFocusIndex = (() => {
          switch (e.key) {
            case KeyMaps.ArrowUp:
              return focusIndex + (focusIndex > 0 ? -1 : itemRefs.length - 1);
            case KeyMaps.ArrowDown:
              return focusIndex + (focusIndex < itemRefs.length - 1 ? 1 : (itemRefs.length - 1) * -1);
            default:
              return focusIndex;
          }
        })();
        moveFocus(newFocusIndex);

        return;
      }

      // Moves the focus to the menu item whose label starts
      // with the letter of the key you entered.
      if (/[a-zA-Z0-9./<>?;:"'`!@#$%^&*()\\[\]{}_+=|\\-~,]/.test(e.key)) {
        const index = itemRefs.findIndex(ref => {
          const key = e.key.toLowerCase();
          return (
            ref.current?.innerText.toLowerCase().startsWith(key) ||
            ref.current?.textContent?.toLowerCase().startsWith(key) ||
            ref.current?.getAttribute('aria-label')?.toLowerCase().startsWith(key)
          );
        });

        if (index > -1) {
          moveFocus(index);
        }
      }
    },
    [focusIndex, itemRefs, moveFocus],
  );

  // When the menu opens, focus in on the first item.
  useEffect(() => {
    if (active) {
      moveFocus(0);
    }
  }, [moveFocus, active]);

  // Listens for all click events and forces the click target
  // to close if it is outside the menu area.
  useEffect(() => {
    if (!active) return;

    const handleEveryClick = (e: globalThis.MouseEvent) => {
      if (!(e.target instanceof Element) || e.target.closest('[role="menu"]') instanceof Element) return;
      setActive(false);
    };

    document.addEventListener('click', handleEveryClick);

    return () => {
      document.removeEventListener('click', handleEveryClick);
    };
  }, [active]);

  // Suppresses page scrolling using the arrow keys while the menu is displayed.
  useEffect(() => {
    const handleDisableArrowScroll = (e: globalThis.KeyboardEvent) => {
      if (active && [KeyMaps.ArrowDown, KeyMaps.ArrowUp].includes(e.key)) {
        e.preventDefault();
      }
    };

    document.addEventListener('keydown', handleDisableArrowScroll);

    return () => {
      document.removeEventListener('keydown', handleDisableArrowScroll);
    };
  }, [active]);

  return {
    active,
    setActive,
    triggerProps: {
      onClick: handleTrigger,
      onKeyDown: handleTrigger,
      tabIndex: 0,
      ref: triggerRef,
      role: 'button',
      'aria-haspopup': true,
      'aria-expanded': active,
    },
    itemProps: [...Array(itemCount).keys()].map(index => ({
      onKeyDown: handleItemKeyDown,
      tabIndex: -1,
      role: 'menuitem',
      ref: itemRefs[index],
    })),
  };
}

const KeyMaps = {
  Tab: 'Tab',
  Shift: 'Shift',
  Enter: 'Enter',
  Escape: 'Escape',
  ArrowUp: 'ArrowUp',
  ArrowDown: 'ArrowDown',
  Space: ' ',
};
