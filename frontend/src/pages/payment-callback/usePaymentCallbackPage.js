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
    if (!clientrefid)
      return
    postVerifyPayment({
      clientrefid,
    });
  }, [postVerifyPayment, routeParams]);

  useEffect(() => {
    if (verifyPaymentData == null) return;

    const paymentResultTemp = {};
    if (verifyPaymentData.status !== 200 || verifyPaymentData.data.status !== 200) {
      setPaymentStatus(false);
      paymentResultTemp['Message'] = "Payment Failed!"
    } else {
      paymentResultTemp['Message'] = "Success!"
      setPaymentStatus(true);
    }

    const keyDict = {
      message: 'Message',
      refid: 'Reference ID',
      card_number: 'Credit Card Number',
      data: "Reference ID"
    };
    const removedKeys = ['status', 'message']
    Object.keys(verifyPaymentData.data).forEach((key) => {
      if (removedKeys.indexOf(key) > -1)
        return
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
