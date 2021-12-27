# use-listbox

> A simple React Hook that Provides the behavior and accessibility implementation for a listbox component.

**[DEMO](https://example.xom)**

## FEATURES

- Exposed to assistive technology as a listbox using ARIA
- Zero dependencies
- Tiny size

## INSTALL

```bash
# with Yarn
yarn add @wakamsha/use-listbox

# with npm
npm install @wakamsha/use-listbox
```

### BASIC USAGE

```tsx
import { useListBox } from '@wakamsha/use-listbox';

export const App = () => {
  const menuItems = ['foo', 'bar', 'baz'];

  const { itemProps, active, triggerProps } = useListBox(menuItems.length);

  return (
    <section aria-expanded={active}>
      <button {...triggerProps}>Open</button>
      <ul className={styleMenu} role="menu" aria-hidden={!active}>
        {menuItems.map((item, index) => (
          <li key={item}>
            <button {...itemProps[index]} onClick={alert}>
              {item}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
};
```

## LICENSE

[MIT license](https://en.wikipedia.org/wiki/MIT_License).
