import Button from '../components/Button/Button';

import { Meta, Story } from '@storybook/react';

export default {
  title: 'hey',
  component: Button,
} as Meta;

export const Primary: Story = args => <Button text="hey" {...args} />;
Primary.args = {
  label: 'Button',
  primary: true,
  text: 'he',
};
