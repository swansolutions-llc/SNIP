import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { Chart } from "chart.js";

function EventCount() {
  const [eventData, setEventData] = useState([]);
  const [registerUserData, setRegisterUserData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventResponse = await axios.get("https://api.schoolnutritionindustryprofessionals.com/api/eventcount");
        setEventData(eventResponse.data);

        const registerUserResponse = await axios.get("https://api.schoolnutritionindustryprofessionals.com/api/registerusercount");
        setRegisterUserData(registerUserResponse.data);

        console.log('Event Data:', eventResponse.data);
        console.log('Register User Data:', registerUserResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const lineChartCtx = document.getElementById("myChart").getContext("2d");
    const uniqueDates = [...new Set(eventData.map(data => data.month))];
    const monthNamesWithYear = uniqueDates.map(date => format(new Date(date), "MMMM yyyy")); // Use yyyy instead of YYYY
    const aggregatedEventData = uniqueDates.map(date => {
      const eventsForDate = eventData.filter(data => data.month === date);
      const totalEventCount = eventsForDate.reduce((acc, cur) => acc + cur.eventCount, 0);
      return { month: date, totalEventCount };
    });
    const myChart = new Chart(lineChartCtx, {
      type: 'line',
      data: {
        labels: monthNamesWithYear,
        datasets: [
          {
            data: aggregatedEventData.map(data => data.totalEventCount),
            label: 'Event Count',
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 2,
            fill: false,
          },
          {
            data: registerUserData.userCount?.map(data => data.usersCount) || [], 
            label: 'Register User Count',
            borderColor: 'rgb(75, 192, 192)',
            borderWidth: 2,
            fill: false,
          },
        ],
      },
      options: {
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
              displayFormats: {
                month: 'YYYY-MMMM',
              },
            },
            title: {
              display: true,
              text: 'Date',
              color: '#fff', 
            },
            ticks: {
              color: '#fff', // Set the color for x-axis labels
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Count',
                color: '#fff', // Set the color for y-axis title
              },
              ticks: {
                color: '#fff', // Set the color for y-axis labels
              },
            },
          },
        },
      },
      });

  }, [eventData, registerUserData]);

  return (
    <>
      <div className="evnet-line-chart">
        <h1 className="w-[150px] mx-auto mt-10 text-2xl font-semibold capitalize">
          Register User and Event 
        </h1>
        <div className="w-[1100px] flex mx-auto my-auto">
          <div className='border border-gray-400 pt-0 rounded-xl w-full h-fit my-auto shadow-xl'>
            <canvas id='myChart'></canvas>
          </div>

        </div>
      </div>
    </>
  );
}

export default EventCount;
