import { patchcordAPI } from '..';

export const getElements = () => {
  const Button = patchcordAPI.webpack.findByProps('Sizes', 'Colors', 'Looks', 'DropdownSizes');

  const Markdown = patchcordAPI.webpack.find((x) => x.displayName === 'Markdown' && x.rules);

  const FormItem = patchcordAPI.webpack.findByDisplayName('FormItem');
  const FormText = patchcordAPI.webpack.findByDisplayName('FormText');

  const Flex = patchcordAPI.webpack.findByDisplayName('Flex');
  const Margins = patchcordAPI.webpack.findByProps('marginTop20', 'marginBottom20');

  const FormClasses = patchcordAPI.webpack.findByProps('title', 'dividerDefault');
  const FormTextClasses = patchcordAPI.webpack.findByProps('formText', 'placeholder');

  const SwitchItem = patchcordAPI.webpack.findByDisplayName('SwitchItem');

  return {
    Button,
    Markdown,
    SwitchItem,
    FormItem,
    FormText,
    Flex,
    Margins,
    FormClasses,
    FormTextClasses,
  };
};
