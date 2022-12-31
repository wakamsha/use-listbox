import { css } from '@emotion/css';
import { useState } from 'react';
import { useListBox } from '.';

export const Basic = () => {
  const menuItems = ['One', 'Two', 'Three', 'foo', 'bar', 'baz', 'hello', 'world'];

  const { itemProps, active, setActive, triggerProps } = useListBox(menuItems.length);

  const [value, setValue] = useState('');

  const handleSelect = (value: string) => {
    setValue(value);
    setActive(false);
  };

  return (
    <div className={styleSection} aria-expanded={active}>
      <button
        className={styleTrigger}
        ref={triggerProps.ref}
        onKeyDown={triggerProps.onKeyDown}
        onClick={triggerProps.onClick}
        tabIndex={triggerProps.tabIndex}
        role={triggerProps.role}
        aria-haspopup={triggerProps['aria-haspopup']}
        aria-expanded={triggerProps['aria-expanded']}
      >
        <span>Menu</span>
      </button>
      <ul className={styleMenu} role="menu" aria-hidden={!active}>
        {menuItems.map((item, index) => (
          <li key={item}>
            <button
              className={styleMenuItem}
              onClick={() => handleSelect(item)}
              onKeyDown={itemProps[index].onKeyDown}
              tabIndex={itemProps[index].tabIndex}
              role={itemProps[index].role}
              ref={itemProps[index].ref}
            >
              {item}
            </button>
          </li>
        ))}
      </ul>

      <hr style={{ marginTop: 160 }} />

      <pre className={styleLog}>
        <code>{JSON.stringify({ value }, null, 2)}</code>
      </pre>
    </div>
  );
};

const styleSection = css`
  position: relative;
`;

const styleTrigger = css`
  padding: 8px 16px;
  font-size: 18px;
  cursor: pointer;
`;

const styleMenu = css`
  position: absolute;
  display: none;
  width: 240px;
  max-height: 120px;
  padding: 8px;
  margin: 0;
  overflow: auto;
  font-size: 16px;
  background-color: white;
  box-shadow: 0 10px 40px 0 rgba(0, 0, 0, 0.2);

  &[aria-hidden='false'] {
    display: block;
  }
`;

const styleMenuItem = css`
  display: block;
  width: 100%;
  padding: 8px;
  text-align: left;
  cursor: pointer;
  background: transparent;
  border: none;
  appearance: none;

  &:focus {
    background-color: #e3e3e7;
  }

  &:hover {
    background-color: #7e808c;
  }
`;

const styleLog = css`
  display: block;
  max-width: 100%;
  padding: 16px;
  overflow: auto;
  font-size: 16px;
  background-color: #f6f6f8;
  border: 1px solid #bfc1c9;
`;
