import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie, Bar, Line } from "react-chartjs-2";
import axios from "axios";
import "./styles/AdminDashboard.css";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState({
    totalDonations: 0,
    totalReceivers: 0,
    totalVolunteers: 0,
    inventoryStatus: { items: 0, categories: 0 },
  });
  const [pendingRequests, setPendingRequests] = useState([]);
  const [completedRequests, setCompletedRequests] = useState([]);
  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const donationsRes = await axios.get(
          "http://localhost:3001/admin/donations",
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        const requestsRes = await axios.get(
          "http://localhost:3001/admin/requests",
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        const usersRes = await axios.get("http://localhost:3001/admin/users", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });

        setDonations(donationsRes.data);
        setRequests(requestsRes.data);

        setMetrics({
          totalDonations: donationsRes.data.length,
          totalReceivers: requestsRes.data.length,
          totalUsers: usersRes.data.length,
          inventoryStatus: { items: donationsRes.data.length, categories: 10 }, // Adjust as necessary
        });

        setPendingRequests(
          requestsRes.data.filter((request) => request.status === "pending")
        );
        setCompletedRequests(
          requestsRes.data.filter((request) => request.status === "complete")
        );
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  const pieData = {
    labels: ["Completed", "Taken", "Pending"],
    datasets: [
      {
        data: [
          completedRequests.length,
          requests.length - completedRequests.length - pendingRequests.length,
          pendingRequests.length,
        ],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  const barData = {
    labels: ["Donations", "Receivers", "Volunteers"],
    datasets: [
      {
        label: "Count",
        data: [
          metrics.totalDonations,
          metrics.totalReceivers,
          metrics.totalVolunteers,
        ],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  const lineData = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Donations",
        fill: false,
        lineTension: 0.1,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: [65, 59, 80, 81, 56, 55, 40],
      },
    ],
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
      </div>
      <div className="dashboard-metrics">
        <div className="metric-card">
          <h2>Total Donations</h2>
          <p>{metrics.totalDonations}</p>
        </div>
        <div className="metric-card">
          <h2>Total Requests</h2>
          <p>{metrics.totalReceivers}</p>
        </div>
        <div className="metric-card">
          <h2>Total Users</h2>
          <p>{metrics.totalUsers}</p>
        </div>
      </div>
      <div className="chart-section">
        <h2>Statistics</h2>
        <div className="chart-wrapper">
          <h3>Requests Status</h3>
          <Pie data={pieData} />
        </div>
        <div className="chart-wrapper">
          <h3>Summary</h3>
          <Bar data={barData} />
        </div>
        <div className="chart-wrapper">
          <h3>Donations Over Time</h3>
          <Line data={lineData} />
        </div>
      </div>
      <div className="users-section">
        <h2>Donations</h2>
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Quantity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation, index) => (
              <tr key={index}>
                <td>{donation.donarName}</td>
                <td>{donation.quantity}</td>
                <td>{donation.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="users-section">
        <h2>Requests</h2>
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Quantity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request, index) => (
              <tr key={index}>
                <td>{request.receiverName}</td>
                <td>{request.quantity}</td>
                <td>{request.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;