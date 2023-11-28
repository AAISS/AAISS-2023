import { useEffect, useState } from 'react';
import { useAPI } from '../../providers/APIProvider/APIProvider';
import { useConfig } from '../../providers/config-provider/ConfigProvider';

export default function usePaymentCallbackPage() {
  const { routeParams } = useConfig();

  const { verifyPaymentData, postVerifyPayment } = useAPI();

  const [paymentStatus, setPaymentStatus] = useState(false);
  const [paymentResultsData, setPaymentResultsData] = useState();

  useEffect(() => {
    if (routeParams == null) return;

    const clientrefid = routeParams['clientrefid'];
    postVerifyPayment({
      clientrefid,
    });
  }, [routeParams]);

  useEffect(() => {
    if (verifyPaymentData == null) return;

    if (verifyPaymentData.status !== 200 || verifyPaymentData.data.status !== 200) {
      setPaymentStatus(false);
    } else {
      setPaymentStatus(true);
    }
    setPaymentStatus(false);

    const paymentResultTemp = {};
    const keyDict = {
      message: 'Message',
      refid: 'Reference ID',
      card_number: 'Credit Card Number',
    };
    Object.keys(verifyPaymentData.data).forEach((key) => {
      if (key in keyDict) paymentResultTemp[keyDict[key]] = verifyPaymentData.data[key];
      else paymentResultTemp[key] = verifyPaymentData.data[key];
    });
    setPaymentResultsData(paymentResultTemp);
    console.log(paymentResultTemp);
  }, [verifyPaymentData]);

  return {
    routeParams,
    paymentStatus,
    paymentResultsData,
  };
}
