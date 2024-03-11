import { useState, useEffect, useRef } from 'react';
import { Chart } from 'chart.js';

const CountUsers = () => {
  const [userCount, setUserCount] = useState(0);
  const myDoughnutChartRef = useRef(null);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await fetch('https://api.schoolnutritionindustryprofessionals.com/api/usercount');
        const data = await response.json();
        setUserCount(data.userCount);

        if (myDoughnutChartRef.current) {
          myDoughnutChartRef.current.data.datasets[0].data[0] = data.userCount;
          myDoughnutChartRef.current.update();
        } else {
          createDoughnutChart(data.userCount);
        }
      } catch (error) {
        console.error('Error fetching user count:', error);
      }
    };

    const createDoughnutChart = (userCount) => {
      const doughnutCtx = document.getElementById('myChart').getContext('2d');

      myDoughnutChartRef.current = new Chart(doughnutCtx, {
        type: 'doughnut',
        data: {
          labels: ['Users'],
          datasets: [{
            data: [userCount],
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgb(75, 192, 192)',
            borderWidth: 2,
          }],
        },
        options: {
          scales: {
            x: {
              display: false,
            },
            y: {
              display: false,
            },
          },
        },
      });
    };

    fetchUserCount();
  }, []);

  return (
    <div>
      <h1>User Count: {userCount}</h1>
      <canvas id='myChart' width='200' height='200'></canvas>
    </div>
  );
};

export default CountUsers;
