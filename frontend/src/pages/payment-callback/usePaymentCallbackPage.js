import {useEffect, useState} from 'react';
import {useConfig} from '../../providers/config-provider/ConfigProvider';

export default function usePaymentCallbackPage() {
    const {routeParams} = useConfig();

    const [paymentStatus, setPaymentStatus] = useState(false);
    const [paymentResultsData, setPaymentResultsData] = useState();
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (routeParams == null) return;

        const refID = routeParams['client_ref_id'];
        const status = routeParams['payment_status']
        if (!refID && !status)
            return

        const keysDict = {
            status: "Status",
            redID: "Reference ID"
        }
        const paymentResultTemp = {}

        if (status) {
            const statusValues = {
                succeeded: true,
                failed: false,
            }

            const statusDict = {
                true: "Success!",
                false: "Failure!"
            }

            const statusBool = statusValues[status] ?? false
            setPaymentStatus(statusBool)
            paymentResultTemp[keysDict.status] = statusDict[statusBool]
        }

        if (refID) {
            paymentResultTemp[keysDict.redID] = refID
        }

        setPaymentResultsData(paymentResultTemp);
        setIsLoading(false)
    }, [routeParams]);

    return {
        routeParams,
        paymentStatus,
        isLoading,
        paymentResultsData,
    };
}
