import React, { HTMLAttributes } from 'react';
import { StyledPrintTypography } from './styles';

interface PrintTypographyProps extends HTMLAttributes<HTMLParagraphElement> {
  bold?: boolean;
  fontSize?: number;
  align?: 'rigth' | 'center' | 'left';
  display?: string;
  gutterBottom?: boolean;
  upperCase?: boolean;
  italic?: boolean;
  noWrap?: boolean;
}

const PrintTypography: React.FC<PrintTypographyProps> = ({
  children,
  gutterBottom = false,
  upperCase = false,
  italic = false,
  ...rest
}) => {
  return (
    <StyledPrintTypography gutterBottom={gutterBottom} upperCase={upperCase} italic={italic} {...rest}>
      {children}
    </StyledPrintTypography>
  );
};

export default PrintTypography;
