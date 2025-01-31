import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import ReactApexChart from "react-apexcharts";
import useApiService from "../../hooks/useApiService";
import useProperty from "../../hooks/useProperty";
import Cookies from 'js-cookie';

export default function PaymentGateway() {
    const { getAPIAuthKey } = useApiService();
    const userid = Cookies.get('userId');
    const { schemeId } = useProperty();
    const [paymentStatues, setPaymentStatues] = useState([]);
    useEffect(() => {
        getPaymentStatues();
    }, []);
    const getPaymentStatues = async () => {
        try {
            const result = await getAPIAuthKey(`/get-payment-type-summary/${userid}/${schemeId}`);
            if (!result) {
                throw new Error('Something went wrong');
            }
            const responseRs = JSON.parse(result);
            setPaymentStatues(responseRs);
        }
        catch (error) {
            console.error(error);
        }
    }
    const chartOptions = {
        chart: {
            type: "donut",
            height: '100%',
        },
        plotOptions: {
            pie: {
                startAngle: -90,
                endAngle: 90,
                donut: {
                    size: "90%",
                },
            },
        },
        dataLabels: {
            enabled: false,
            formatter: function (val) {
                return val.toFixed(0) + "%";
            },
        },
        fill: {
            colors: ["#d36dfd", "#a4ff3a", "#377bff", "#64d9f9", "#adb8ff"],
        },
        labels: paymentStatues?.labels,
        legend: {
            show: false,
        },
    };

    const chartSeries = paymentStatues?.series?.length ? paymentStatues.series : [1]; // Prevents error in ApexCharts
    return (
        <div className="PageHeader text-center" style={{ height: "100%" }}>
            <label className="fontwhite  mb-3">Payment Gateway Status</label>
            <div style={{ position: "relative", height: "200px" }}>
                <ReactApexChart
                    options={chartOptions}
                    series={chartSeries}
                    type="donut"
                    height={300} // Keep height here full but it will be clipped
                />
            </div>
            <div className="row offset-2 fw-medium font-12 text-start">
                <div className="col-md-6 p-1">
                    <label className="me-2" style={{ background: "#CB3CFF", borderRadius: "50%", height: "10px", width: "10px" }}></label>
                    <label style={{ color: "#E4E6F6" }}>Cheque</label>
                </div>
                <div className="col-md-6 p-1">
                    <label className="me-2" style={{ background: "#97FF3C", borderRadius: "50%", height: "10px", width: "10px" }}></label>
                    <label style={{ color: "#E4E6F6" }}>Cash</label>
                </div>
                <div className="col-md-6 p-1">
                    <label className="me-2" style={{ background: "#0038FF", borderRadius: "50%", height: "10px", width: "10px" }}></label>
                    <label style={{ color: "#E4E6F6" }}>RTGS / NEFT</label>
                </div>
                <div className="col-md-6 p-1">
                    <label className="me-2" style={{ background: "#AAB8FF", borderRadius: "50%", height: "10px", width: "10px" }}></label>
                    <label style={{ color: "#E4E6F6" }}>Others</label>
                </div>
                <div className="col-md-6 p-1">
                    <label className="me-2" style={{ background: "#00C2FF", borderRadius: "50%", height: "10px", width: "10px" }}></label>
                    <label style={{ color: "#E4E6F6" }}>Online Transfer</label>
                </div>
            </div>
        </div>
    )
}
