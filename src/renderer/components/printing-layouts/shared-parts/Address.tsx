import React, { useMemo } from 'react';
import { Shipment } from 'renderer/types/order';
import PrintTypography from 'renderer/base/print-typography/PrintTypography';

interface AddressProps {
  shipment: Shipment;
}

const Address: React.FC<AddressProps> = ({ shipment }) => {
  const text = useMemo(() => {
    const complement = shipment.complement ? `${shipment.complement},` : '';
    const referencePoint = shipment.reference_point ? `, ${shipment.reference_point}` : '';

    return `${shipment.address}, nº ${shipment.number}, ${complement} ${shipment.district}, ${shipment.city} - ${shipment.region}${referencePoint}`;
  }, [shipment]);

  return <PrintTypography>{text}</PrintTypography>;
};

export default Address;
