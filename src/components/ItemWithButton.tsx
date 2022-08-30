import { patchcordAPI } from '..';
import { getElements } from './getElements';

export default ({ title, description, buttonText, callback }) => {
  const React = patchcordAPI.common.React;
  const { FormItem, Flex, Margins, FormClasses, FormTextClasses, FormText, Markdown, Button } =
    getElements();

  return (
    <FormItem
      className={[
        Flex.Direction.VERTICAL,
        Flex.Justify.START,
        Flex.Align.STRETCH,
        Flex.Wrap.NO_WRAP,
        Margins.marginBottom20,
      ].join(' ')}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}>
        <div>
          <div className={FormClasses.labelRow} style={{ marginBottom: '4px' }}>
            <label className={FormClasses.title}>{title}</label>
          </div>
          <FormText className={FormTextClasses.description}>
            <Markdown>{description}</Markdown>
          </FormText>
        </div>
        <Button color={Button.Colors.BRAND} disabled={false} onClick={callback}>
          {buttonText}
        </Button>
      </div>
    </FormItem>
  );
};
