import usePaymentCallbackPage from './usePaymentCallbackPage';
import SvgIcon from "@mui/material/SvgIcon";
import {Button} from "@mui/material";

export default function PaymentCallbackPage() {
    const {
        paymentStatus,
        paymentResultsData,
    } = usePaymentCallbackPage()

    const iconStyles = {
        width: "150px",
        height: "150px",
        marginBottom: "auto",
        marginTop: "auto",
    }

    return (
        <section style={{
            display: "flex",
            flexWrap: "nowrap",
            alignItems: "center",
            flexDirection: 'column',
            minHeight: "60vh",
        }}>
            {!paymentStatus &&
                <SvgIcon style={iconStyles}>
                    <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" fill="#fd5154" r="10"/>
                        <path clipRule="evenodd"
                              d="m8.44461 9.17169c-.19588-.19464-.19689-.51122-.00224-.7071.19464-.19588.51122-.19689.7071-.00225l2.85073 2.83266 2.8502-2.83217c.1959-.19464.5125-.19363.7071.00225.1947.19588.1937.51246-.0022.7071l-2.8457 2.82772 2.8457 2.8277c.1959.1947.1969.5112.0023.7071-.1947.1959-.5113.1969-.7071.0023l-2.8503-2.8323-2.85077 2.8328c-.19589.1946-.51247.1936-.70711-.0023s-.19363-.5125.00225-.7071l2.84623-2.8282z"
                              fill="#fff" fillRule="evenodd"/>
                    </svg>
                </SvgIcon>
            }
            {paymentStatus &&
                <SvgIcon style={iconStyles}>
                    <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" fill="#21c179" r="10"/>
                        <path clipRule="evenodd"
                              d="m16.6766 8.58327c.1936.19698.1908.51355-.0062.70708l-5.7054 5.60545c-.1914.1881-.4972.1915-.6927.0078l-2.67382-2.5115c-.20128-.189-.21118-.5055-.02212-.7067.18906-.2013.50548-.2112.70676-.0222l2.32368 2.1827 5.3628-5.26888c.1969-.19353.5135-.19073.707.00625z"
                              fill="#fff" fillRule="evenodd"/>
                    </svg>
                </SvgIcon>
            }
            <div style={{
                display: "flex",
                flexDirection: "column",
                width: "70vw",
                maxWidth: "700px",
                borderTop: "2px solid grey",
                borderLeft: "2px solid grey",
                backgroundColor: "rgba(126,126,126,0.2)",
                padding: "10px",
                borderRadius: "10px"
            }}>
                {paymentResultsData && Object.keys(paymentResultsData).map((key, index) => (
                    <div key={index} style={{
                        display: "flex",
                        flexWrap: "nowrap",
                        flexDirection: "row",
                        justifyContent: "space-between"
                    }}>
                        <h3>
                            {key}
                        </h3>
                        <p>
                            {paymentResultsData[key]}
                        </p>
                    </div>
                ))}
            </div>
            <div className="back-to-home-container" style={{
                marginTop: "30px",
                borderRadius: "5px"
            }}>
                <Button className={"back-to-home"}>
                    Back to Home Page!
                </Button>
            </div>
        </section>
    )
}