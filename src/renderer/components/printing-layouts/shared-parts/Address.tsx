import React, { useMemo } from 'react';
import { Shipment } from 'renderer/types/order';
import PrintTypography from 'renderer/base/print-typography/PrintTypography';

interface AddressProps {
  shipment: Shipment;
}

const Address: React.FC<AddressProps> = ({ shipment }) => {
  const text = useMemo(() => {
    if (shipment.complement) {
      return `${shipment.address}, nº ${shipment.number}, ${shipment.complement},
    ${shipment.district}, ${shipment.city} - ${shipment.region}`;
    }

    return `${shipment.address}, nº ${shipment.number}, ${shipment.district}, ${shipment.city} - ${shipment.region}`;
  }, [shipment]);

  return <PrintTypography>{text}</PrintTypography>;
};

export default Address;
