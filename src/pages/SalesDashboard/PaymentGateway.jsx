import React from "react";
import Chart from "react-apexcharts";
import ReactApexChart from "react-apexcharts";

export default function PaymentGateway() {
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
        labels: ["Cheque", "Cash", "RTGS/NEFT", "Online Transfer", "Others"],
        legend: {
            show: false,
        },
    };

    const chartSeries = [40, 20, 15, 15, 10]; // Adjust the values based on your data
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
