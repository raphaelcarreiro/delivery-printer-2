import styled, { css } from 'styled-components';

interface StyledPrintTypographyProps {
  bold?: boolean;
  fontSize?: number;
  align?: 'rigth' | 'center' | 'left';
  display?: string;
  gutterBottom: boolean;
  upperCase: boolean;
  italic: boolean;
  noWrap?: boolean;
}

export const StyledPrintTypography = styled.p<StyledPrintTypographyProps>`
  font-weight: 400;
  font-size: ${props => (props.fontSize ? `${props.fontSize}em` : '1em')};
  line-height: 1.2em;
  color: #000;
  font-family: sans-serif;
  word-break: break-word;
  margin: 0;

  ${props =>
    props.bold &&
    css`
      font-weight: 600;
    `}

  ${props =>
    props.align &&
    css`
      text-align: ${props.align};
    `}

  ${props =>
    props.display &&
    css`
      display: ${props.display};
    `}

  ${props =>
    props.gutterBottom &&
    css`
      margin-bottom: 8px;
    `}

  ${props =>
    props.upperCase &&
    css`
      text-transform: uppercase;
    `}

  ${props =>
    props.italic &&
    css`
      font-style: italic;
    `}

    ${props =>
    props.noWrap &&
    css`
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    `}
`;
