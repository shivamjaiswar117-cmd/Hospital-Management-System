import { useEffect, useState } from "react";
import API from "../services/api";

interface Patient {
  _id: string;
  name: string;
}

interface Doctor {
  _id: string;
  name: string;
}

interface Appointment {
  _id?: string;
  patient: Patient | string;
  doctor: Doctor | string;
  appointmentDate: string;
  appointmentTime: string;
  reason: string;
  status: string;
}

function Appointments() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

 const [appointments, setAppointments] = useState<Appointment[]>([]);
 const [search, setSearch] = useState("");

  const [newAppointment, setNewAppointment] = useState<Appointment>({
    patient: "",
    doctor: "",
    appointmentDate: "",
    appointmentTime: "",
    reason: "",
    status: "Pending",
  });

  const [editingId, setEditingId] = useState("");

 

  const getPatients = async () => {
  try {
    const res = await API.get("/patients");
    setPatients(res.data);
  } catch (error) {
    console.log(error);
  }
};

 const getDoctors= async () => {
  try {
    const res = await API.get("/doctors");
    setDoctors(res.data);
  } catch (error) {
    console.log(error);
  }
};

  const getAppointments = async () => {
  try {
    const res = await API.get("/appointments");
    setAppointments(res.data);
  } catch (error) {
    console.log(error);
  }
};
  
  useEffect(() => {
  const loadData = async () => {
    await Promise.all([
      getPatients(),
      getDoctors(),
      getAppointments(),
    ]);
  };

  void loadData();
}, []);

  const saveAppointment = async () => {
  try {
    if (editingId) {
      await API.put("/appointments/" + editingId, newAppointment);
      alert(editingId ? "Appointment Updated Successfully!" : "Appointment Added Successfully!");
      alert(editingId ? "Appointment Updated Successfully!" : "Appointment Added Successfully!");
      setEditingId("");
    } else {
      await API.post("/appointments", newAppointment);
    }

    setNewAppointment({
      patient: "",
      doctor: "",
      appointmentDate: "",
      appointmentTime: "",
      reason: "",
      status: "Pending",
    });

    getAppointments();

  } catch (error) {
    console.log(error);
  }
};

  const deleteAppointment = async (id: string) => {

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this appointment?"
  );

  if (!confirmDelete) return;

  try {

    await API.delete(`/appointments/${id}`);

    alert("Appointment Deleted Successfully!");

    getAppointments();

  } catch (error) {
    console.log(error);
  }
};
  
  const editAppointment = (appointment: Appointment) => {

  setEditingId(appointment._id || "");

  setNewAppointment({
  patient:
    typeof appointment.patient === "string"
      ? appointment.patient
      : appointment.patient._id,

  doctor:
    typeof appointment.doctor === "string"
      ? appointment.doctor
      : appointment.doctor._id,

  appointmentDate: appointment.appointmentDate.substring(0, 10),
  appointmentTime: appointment.appointmentTime,
  reason: appointment.reason,
  status: appointment.status,
});

};
const filteredAppointments = appointments.filter((appointment) => {
  const patientName =
    typeof appointment.patient === "string"
      ? appointment.patient
      : appointment.patient.name;

  return patientName
    .toLowerCase()
    .includes(search.toLowerCase());
});

  return (
    <div className="container mt-4">

      <h2 className="text-center mb-4">Appointments</h2>
      <input
  className="form-control mb-3"
  placeholder="🔍 Search Appointment by Patient Name"
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>

     <div className="card p-4 mb-4">

  <select
    className="form-control mb-3"
    value={
  typeof newAppointment.patient === "string"
    ? newAppointment.patient
    : newAppointment.patient._id
}
    onChange={(e) =>
      setNewAppointment({
        ...newAppointment,
        patient: e.target.value,
      })
    }
  >
    <option value="">Select Patient</option>

    {patients.map((patient) => (
      <option key={patient._id} value={patient._id}>
        {patient.name}
      </option>
    ))}

  </select>

  <select
    className="form-control mb-3"
    value={
  typeof newAppointment.doctor === "string"
    ? newAppointment.doctor
    : newAppointment.doctor._id
}
    onChange={(e) =>
      setNewAppointment({
        ...newAppointment,
        doctor: e.target.value,
      })
    }
  >
    <option value="">Select Doctor</option>

    {doctors.map((doctor) => (
      <option key={doctor._id} value={doctor._id}>
        {doctor.name}
      </option>
    ))}

  </select>

  <input
  type="date"
  className="form-control mb-3"
  value={newAppointment.appointmentDate}
  onChange={(e) =>
    setNewAppointment({
      ...newAppointment,
      appointmentDate: e.target.value,
    })
  }
/>

  <input
  type="time"
  className="form-control mb-3"
  value={newAppointment.appointmentTime}
  onChange={(e) =>
    setNewAppointment({
      ...newAppointment,
      appointmentTime: e.target.value,
    })
  }
/>

  <input
    className="form-control mb-3"
    placeholder="Reason"
    value={newAppointment.reason}
    onChange={(e) =>
      setNewAppointment({
        ...newAppointment,
        reason: e.target.value,
      })
    }
  />

  <select
    className="form-control mb-3"
    value={newAppointment.status}
    onChange={(e) =>
      setNewAppointment({
        ...newAppointment,
        status: e.target.value,
      })
    }
  >
    <option>Pending</option>
    <option>Confirmed</option>
    <option>Completed</option>
    <option>Cancelled</option>
  </select>

  <button
    className="btn btn-success"
    onClick={saveAppointment}
  >
    {editingId ? "Update Appointment" : "Add Appointment"}
  </button>

</div>

  <table className="table table-bordered table-striped">

  <thead className="table-dark">
    <tr>
      <th>Patient</th>
      <th>Doctor</th>
      <th>Date</th>
      <th>Time</th>
      <th>Reason</th>
      <th>Status</th>
      <th>Actions</th>
    </tr>
  </thead>

  <tbody>

    {filteredAppointments.length > 0 ? (
      filteredAppointments.map((appointment) => (
        <tr key={appointment._id}>

          <td>
  {typeof appointment.patient === "string"
    ? appointment.patient
    : appointment.patient.name}
</td>

<td>
  {typeof appointment.doctor === "string"
    ? appointment.doctor
    : appointment.doctor.name}
</td>
          <td>
            {new Date(appointment.appointmentDate).toLocaleDateString()}
          </td>

          <td>{appointment.appointmentTime}</td>

          <td>{appointment.reason}</td>

          <td>
  <span
    className={`badge ${
      appointment.status === "Completed"
        ? "bg-success"
        : appointment.status === "Pending"
        ? "bg-warning text-dark"
        : appointment.status === "Cancelled"
        ? "bg-danger"
        : "bg-primary"
    }`}
  >
    {appointment.status}
  </span>
</td>

          <td>

            <button
              className="btn btn-warning btn-sm me-2"
              onClick={() => editAppointment(appointment)}
            >
              Edit
            </button>

            <button
              className="btn btn-danger btn-sm"
              onClick={() => deleteAppointment(appointment._id!)}
            >
              Delete
            </button>

          </td>

        </tr>
      ))
    ) : (
      <tr>
        <td colSpan={7} className="text-center">
          No Appointments Found
        </td>
      </tr>
    )}

  </tbody>

</table>

    </div>
  );
}

export default Appointments;