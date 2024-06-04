import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CommitsChart = ({ commits }) => {
  const commitDates = Object.keys(commits);
  const commitCounts = Object.values(commits);

  const data = {
    labels: commitDates,
    datasets: [
      {
        label: 'Commits',
        data: commitCounts,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Commits per Day',
      },
    },
  };

  return (
    <div>
      <h2>Commits</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default CommitsChart;