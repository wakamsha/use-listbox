# use-listbox

> A simple React Hook that Provides the behavior and accessibility implementation for a listbox component.

**[Demo and Document](https://wakamsha.github.io/use-listbox/?path=/docs/uselistbox--basic)**

![mv](https://user-images.githubusercontent.com/2629981/147489862-a9f6d7c1-6ea6-41e8-8472-a50d768c0c7f.gif)

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

### GETTING STARTED

```tsx
import { useListBox } from '@wakamsha/use-listbox';

export const App = () => {
  const menuItems = ['foo', 'bar', 'baz'];

  const { itemProps, active, triggerProps } = useListBox(menuItems.length);

  return (
    <section aria-expanded={active}>
      <button {...triggerProps}>Open</button>
      <ul role="menu" aria-hidden={!active}>
        {menuItems.map((item, index) => (
          <li key={item}>
            <button {...itemProps[index]} onClick={alert}>
              {item}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};
```

## LICENSE

[MIT license](https://en.wikipedia.org/wiki/MIT_License).
