import React, { useEffect, useState } from 'react';
import useApiService from '../../hooks/useApiService';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../styles/inventoryusage.css';
import ReactApexChart from 'react-apexcharts';

export default function InventoryUsageHistory({ inventoryId, handleHide }) {
  const { getAPIAuthKey } = useApiService();
  const [inventoryInfo, setInventoryInfo] = useState({});
  const [logEntries, setLogEntries] = useState(null);
  const [startDate, setStartDate] = useState(new Date()); // Default to today's date

  const fetchInventoryUsage = async (selectedDate) => {
    try {
      const formattedDate = selectedDate
        ? `${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}-${selectedDate.getFullYear()}`
        : 'null';
      const response = await getAPIAuthKey(`/get-inventory-usage/${inventoryId}&${formattedDate}`);
      const responseRs = JSON.parse(response);

      if (responseRs.status === 'success') {
        const { inventoryDetails, usageLog } = responseRs;
        setInventoryInfo({
          name: inventoryDetails.name,
          available_quantity: inventoryDetails.current_quantity,
          price_per_unit: inventoryDetails.price_per_quantity,
        });
        setLogEntries(usageLog);
      } else {
        setInventoryInfo({});
        setLogEntries([]);
      }
    } catch (error) {
      console.error(error);
      setInventoryInfo({});
      setLogEntries([]);
    }
  };

  const chartOptions = {
    series: [
      {
        name: 'Quantity Used',
        data: logEntries ? logEntries.map(entry => entry.utilized_quantity) : [],
      },
    ],
    chart: {
      height: 350,
      type: 'line',
      zoom: { enabled: false },
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth' },
    title: { text: 'Inventory Usage Trends', align: 'left' },
    grid: {
      row: {
        colors: ['#f3f3f3', 'transparent'],
        opacity: 0.5,
      },
    },
    xaxis: {
      categories: logEntries ? logEntries.map(entry => entry.date) : [],
    },
  };

  useEffect(() => {
    if (inventoryId) {
      fetchInventoryUsage(startDate);
    }
  }, [inventoryId, startDate]);

  return (
    <div className="inventory-usage-history">
      <h2 className="title">Utilization Overview</h2>
      <div className="header-details">
        {inventoryInfo && (
          <div className="inventory-info">
            <p><strong>Name:</strong> {inventoryInfo.name || '-'}</p>
            <p><strong>Total Stock available:</strong> {inventoryInfo.available_quantity || '-'}</p>
            <p><strong>Price per Unit:</strong> {inventoryInfo.price_per_unit || '-'}</p>
          </div>
        )}
        <div className="date-picker">
          <label htmlFor="start-date"><strong>Date:</strong></label>
          <DatePicker
            id="start-date"
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="dd-MM-yyyy"
            placeholderText="Select a date"
          />
        </div>
      </div>

      {logEntries && logEntries.length > 0 ? (
        <table className="usage-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Quantity Used</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {logEntries.map((entry) => (
              <tr key={entry.id}>
                <td>{entry.date}</td>
                <td>{entry.utilized_quantity}</td>
                <td>{entry.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No usage found.</p>
      )}

      {/* Render the ApexCharts here */}
      {logEntries && logEntries.length > 0 && (
        <div className="chart-container">
          <ReactApexChart
            options={chartOptions}
            series={chartOptions.series}
            type="line"
            height={350}
          />
        </div>
      )}
    </div>
  );
}
