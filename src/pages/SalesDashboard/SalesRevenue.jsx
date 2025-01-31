import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import Cookies from 'js-cookie';
import useProperty from "../../hooks/useProperty";
import useApiService from "../../hooks/useApiService";

export default function SalesRevenue() {
    const userid = Cookies.get('userId');
    const { schemeId } = useProperty();
    const { getAPIAuthKey } = useApiService();
    const [activeTab, setActiveTab] = useState(1);
    const [chartOptions, setChartOptions] = useState({
        chart: {
            type: "line",
            toolbar: {
                show: false,
            },
        },
        stroke: {
            curve: "smooth",
            width: 2,
        },
        xaxis: {
            categories: [],
            labels: {
                style: {
                    colors: "#ADB8FF",
                    fontSize: "12px",
                },
            },
        },
        yaxis: {
            labels: {
                style: {
                    colors: "#ADB8FF",
                    fontSize: "12px",
                },
                formatter: (value) => `${value}`,
            },
        },
        grid: {
            borderColor: "#444",
        },
        tooltip: {
            theme: "dark",
            x: {
                format: "MMM yyyy",
            },
        },
        fill: {
            type: "gradient",
            gradient: {
                shade: "dark",
                gradientToColors: ["#64d9f9"],
                shadeIntensity: 1,
                type: "horizontal",
                opacityFrom: 0.8,
                opacityTo: 0.2,
                stops: [0, 100],
            },
        },
        colors: ["#377bff"],
        dataLabels: {
            enabled: false,
        },
    });

    const [chartSeries, setChartSeries] = useState([{ name: "Sales Revenue", data: [] }]);
    useEffect(() => {
        getSalesRevenue();
    }, [activeTab]);
    const getSalesRevenue = async () => {
        try {
            const result = await getAPIAuthKey(`/get-sales-analytics/${userid}/${schemeId}/${activeTab}`);
            if (!result) {
                throw new Error('Something went wrong');
            }
            const responseRs = JSON.parse(result);
            setChartSeries([{ name: "Sales Revenue", data: responseRs?.series }]);
            setChartOptions((prevOptions) => ({
                ...prevOptions,
                xaxis: {
                    ...prevOptions.xaxis,
                    categories: responseRs?.categories,
                },
            }));
        }
        catch (error) {
            console.error(error);
        }
    }
    return (
        <div className="PageHeader">
            <div className="row">
                <div className="col-md-10">
                    <label className="fontwhite">Total Sales Revenue</label><br />
                </div>
                <div style={{ border: "none" }} className='col-md-2 tab_bg d-flex align-items-center px-0'>
                    <div className={`${activeTab == 1 && "popular_badge"} cursor-pointer py-2 font-12`}
                        onClick={(e) => { setActiveTab(1) }}>Month</div>
                    <div className={`${activeTab == 2 && "popular_badge"} cursor-pointer py-2 font-12`}
                        onClick={(e) => { setActiveTab(2); }}>Year</div>
                </div>
            </div>
            <Chart options={chartOptions} series={chartSeries} type="line" height={300} />
        </div>
    )
}
