import { patchcordAPI } from '..';
import { getElements } from './getElements';

interface SwitchProps {
  title: string;
  description: string;
  setName: string;
  disabled?: boolean;
  onChange?: Function;
}
export default ({ title, description, setName, disabled = false, onChange }: SwitchProps) => {
  const React = patchcordAPI.common.React;
  const { SwitchItem, Markdown } = getElements();
  const [value, setValue] = React.useState(localStorage.getItem(`PATCHCORD_${setName}`) === 'true');

  const callback = (v: string) => {
    localStorage.setItem(`PATCHCORD_${setName}`, v);
    setValue(v);
    onChange?.(v);
  };

  return (
    <SwitchItem
      note={<Markdown>{description}</Markdown>}
      value={value}
      disabled={disabled}
      onChange={(v: string) => callback(v)}>
      {title}
    </SwitchItem>
  );
};
