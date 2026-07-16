import { useEffect, useState } from "react";
import API from "../services/api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Appointment {
  _id: string;
  patient: {
    name: string;
  };
  doctor: {
    name: string;
  };
  appointmentDate: string;
  appointmentTime: string;
  status: string;
}

function Dashboard() {
  const [doctorCount, setDoctorCount] = useState(0);
  const [patientCount, setPatientCount] = useState(0);
  const [appointmentCount, setAppointmentCount] = useState(0);

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const chartData = {
  labels: ["Patients", "Doctors", "Appointments"],
  datasets: [
    {
      label: "Hospital Data",
      data: [patientCount, doctorCount, appointmentCount],
      backgroundColor: [
        "#0d6efd",
        "#198754",
        "#ffc107",
      ],
    },
  ],
};

  const getDashboardData = async () => {
    try {
      const doctors = await API.get("/doctors");
      const patients = await API.get("/patients");
      const appointmentsRes = await API.get("/appointments");

      setDoctorCount(doctors.data.length);
      setPatientCount(patients.data.length);
      setAppointmentCount(appointmentsRes.data.length);

      setAppointments(appointmentsRes.data.slice(0, 5));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  return (
  <div className="container mt-4">

    <h1 className="text-center fw-bold text-primary">
      🏥 Hospital Management Dashboard
    </h1>

    <p className="text-center text-muted mb-5">
      Manage Patients, Doctors and Appointments Easily
    </p>

    <div className="row">

      <div className="col-md-4 mb-4">
        <div className="card bg-primary text-white shadow h-100">
          <div className="card-body text-center">
            <h1>🧑‍🤝‍🧑</h1>
            <h1 className="display-4 fw-bold">
  {patientCount}
</h1>
            <h5>Total Patients</h5>
            <i className="bi bi-people-fill display-4"></i>
<h2>{patientCount}</h2>
          </div>
        </div>
      </div>

      <div className="col-md-4 mb-4">
        <div className="card bg-success text-white shadow h-100">
          <div className="card-body text-center">
            <h1>👨‍⚕️</h1>
            <h1 className="display-4 fw-bold">
  {doctorCount}
</h1>
            <h5>Total Doctors</h5>
            <i className="bi bi-person-badge-fill display-4"></i>
<h2>{doctorCount}</h2>
          </div>
        </div>
      </div>

      <div className="col-md-4 mb-4">
        <div className="card bg-warning text-dark shadow h-100">
          <div className="card-body text-center">
            <h1>📅</h1>
            <h1 className="display-4 fw-bold">
  {appointmentCount}
</h1>
            <h5>Total Appointments</h5>
            <i className="bi bi-calendar-check-fill display-4"></i>
<h2>{appointmentCount}</h2>
          </div>
        </div>
      </div>

    </div>

    <div className="card shadow-lg border-0">

      <div className="card-header bg-dark text-white">
        <h4 className="mb-0">📋 Recent Appointments</h4>
      </div>
      <div className="col-md-4 mb-3">
  <div className="card bg-danger text-white shadow">
    <div className="card-body text-center">
      <h2>
        {appointments.filter(
          (a) => a.status === "Pending"
        ).length}
      </h2>

      <h5>Pending Appointments</h5>
    </div>
  </div>
</div>
<div className="col-md-4 mb-3">
  <div className="card bg-info text-white shadow">
    <div className="card-body text-center">
      <h2>
        {appointments.filter(
          (a) => a.status === "Completed"
        ).length}
      </h2>

      <h5>Completed Appointments</h5>
    </div>
  </div>
</div>

      <div className="card-body">

        <table className="table table-hover table-bordered">

          <thead className="table-secondary">
            <tr>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            {appointments.length > 0 ? (
              appointments.map((appointment) => (
                <tr key={appointment._id}>

                  <td>{appointment.patient.name}</td>

                  <td>{appointment.doctor.name}</td>

                  <td>
                    {new Date(
                      appointment.appointmentDate
                    ).toLocaleDateString()}
                  </td>

                  <td>{appointment.appointmentTime}</td>

                  <td>
                    <span
                      className={
                        appointment.status === "Completed"
                          ? "badge bg-success"
                          : appointment.status === "Pending"
                          ? "badge bg-warning text-dark"
                          : appointment.status === "Cancelled"
                          ? "badge bg-danger"
                          : "badge bg-primary"
                      }
                    >
                      {appointment.status}
                    </span>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center">
                  No Appointments Found
                </td>
              </tr>
            )}

          </tbody>

        </table>

      </div>

    </div>
    <div className="card mt-5 shadow">

  <div className="card-header bg-primary text-white">
    <h4>Hospital Statistics</h4>
  </div>

  <div className="card-body">

    <Bar data={chartData} />

  </div>

</div>

  </div>
);
}

export default Dashboard;