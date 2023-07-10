import styled, { css } from 'styled-components';

interface styledPropTypes {
  variant?: 'filled' | 'outlined';
  size?: 'xl' | 'lg' | 'md' | 'sm';
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  iconPosition?: 'start' | 'end';
  borderRadius?: 'round' | 'none';
  borderRadiusFor?: 'all' | 'left' | 'right';
  width?: string;
  fontWeight?: number;
}
interface componentPropTypes extends styledPropTypes {
  text: string;
  icon?: string;
}

const StyledButton = styled.button<styledPropTypes>`
  --backgroundColor: ${props =>
    props.backgroundColor ? props.backgroundColor : '#0C3597'};
  --textColor: ${props => (props.textColor ? props.textColor : '#fff')};
  --borderColor: ${props => (props.borderColor ? props.borderColor : '#fff')};
  --fontWeight: ${props => (props.fontWeight ? props.fontWeight : 600)};
  --borderRadius: ${props => (props.borderRadius === 'none' ? '0px' : '60px')};

  display: inline-block;
  cursor: pointer;
  width: ${props => (props.width ? props.width : 'unset')};

  font-family: inherit;
  box-sizing: border-box;

  padding: 0.65rem 1.5rem;
  border-radius: var(--borderRadius);

  background-color: var(--backgroundColor);
  border: 2px solid var(--backgroundColor);
  color: var(--textColor);

  font-size: 1rem;
  font-weight: var(--fontWeight);

  ${props =>
    props.borderColor &&
    css`
      border: 2px solid var(--borderColor);
    `}

  ${props =>
    props.variant === 'outlined' &&
    css`
      border: 2px solid var(--textColor);
      background-color: unset;
    `};
  ${props =>
    props.borderRadiusFor == 'all' &&
    css`
      border-radius: var(--borderRadius);
    `}
  ${props =>
    props.borderRadiusFor == 'left' &&
    css`
      border-top-left-radius: var(--borderRadius);
      border-top-right-radius: 0px;
      border-bottom-right-radius: 0px;
      border-bottom-left-radius: var(--borderRadius);
      border-right: none;
    `}
  ${props =>
    props.borderRadiusFor == 'right' &&
    css`
      border-top-right-radius: var(--borderRadius);
      border-top-left-radius: 0px;
      border-bottom-left-radius: 0px;
      border-bottom-right-radius: var(--borderRadius);
      border-left: none;
    `}
  ${props =>
    props.size === 'xl' &&
    css`
      padding: 1.5rem 5.6rem;
      font-size: 1.5rem;
    `}
  ${props =>
    props.size === 'lg' &&
    css`
      padding: 1rem 3rem;
      font-size: 1.25rem;
    `}
  ${props =>
    props.size === 'md' &&
    css`
      padding: 0.65rem 1.5rem;
      font-size: 1rem;
    `}
  ${props =>
    props.size === 'sm' &&
    css`
      padding: 0.65rem 1rem;
      font-size: 0.65rem;
    `}
`;
const Button = (props: componentPropTypes) => {
  return (
    <StyledButton
      variant={props.variant}
      size={props.size}
      backgroundColor={props.backgroundColor}
      borderRadius={props.borderRadius}
      width={props.width}
      textColor={props.textColor}
      borderRadiusFor={props.borderRadiusFor}
      borderColor={props.borderColor}
      fontWeight={props.fontWeight}
    >
      {props.icon
        ? props.iconPosition === 'start'
          ? props.icon + ' ' + props.text
          : props.text + ' ' + props.icon
        : props.text}
    </StyledButton>
  );
};
export default Button;
