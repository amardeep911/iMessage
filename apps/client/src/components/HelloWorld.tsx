import { Button } from 'ui';

const HelloWorld = () => (
  <>
    <h1 className="font-bold">Hello There!</h1>
    <label htmlFor="name">
      <input id="name" name="name" type="text" />
    </label>
    <Button text="hey there welcome to syled components" />
  </>
);

export default HelloWorld;
