import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import axios from "axios";

const EthereumChart = () => {
  const chartRef = useRef(null);
  const [priceData, setPriceData] = useState([]);
  const [dataToShow, setDataToShow] = useState(7);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=${dataToShow}&interval=daily`
        );
        const data = response.data.prices;

        setPriceData(data);
      } catch (error) {
        console.error("Error fetching Ethereum price data:", error);
      }
    };

    fetchData();
  }, [dataToShow]);

  useEffect(() => {
    if (priceData.length === 0 || !chartRef.current) {
      return;
    }

    const timestamps = priceData.map((entry) =>
      new Date(entry[0]).toLocaleDateString()
    );
    const prices = priceData.map((entry) => entry[1]);

    const ctx = chartRef.current.getContext("2d");

    new Chart(ctx, {
      type: "line",
      data: {
        labels: timestamps,
        datasets: [
          {
            label: "Ethereum Price (USD)",
            data: prices,
            borderColor: "rgba(203, 155, 81, 1)", // Adjust color for a 3D-like effect
            borderWidth: 1.5,
            fill: true,
            backgroundColor: "rgba(203, 155, 81, 0.1)", // Adjust color for a 3D-like effect
            pointRadius: 3,
            pointBackgroundColor: "rgba(203, 155, 81, 1)", // Adjust color for a 3D-like effect
            pointBorderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: "Date",
              color: "white",
              font: {
                size: 18,
              },
            },
            ticks: {
              color: "white",
              font: {
                size: 14,
              },
              maxRotation: 0,
              maxTicksLimit: 10, // Number of visible ticks
            },
          },
          y: {
            display: true,
            title: {
              display: true,
              text: "Price (USD)",
              color: "white",
              font: {
                size: 18,
              },
            },
            ticks: {
              color: "white",
              font: {
                size: 14,
              },
            },
          },
        },
        plugins: {
          legend: {
            display: true,
            labels: {
              color: "rgba(203, 155, 81, 1)", // Adjust color for a 3D-like effect
              font: {
                size: 18,
              },
            },
          },
          tooltip: {
            enabled: true,
          },
        },
      },
    });
  }, [priceData]);

  return (
    <div>
      <canvas ref={chartRef} className="ethereum-chart" />
    </div>
  );
};

export default EthereumChart;
