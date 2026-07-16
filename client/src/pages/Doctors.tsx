import { useEffect, useState } from "react";
import API from "../services/api";

interface Doctor {
  _id?: string;
  name: string;
  specialization: string;
  phone: string;
  email: string;
  experience: number;
  qualification: string;
  consultationFee: number;
  availableTime: string;
}

function Doctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [search, setSearch] = useState("");

  const [newDoctor, setNewDoctor] = useState<Doctor>({
    name: "",
    specialization: "",
    phone: "",
    email: "",
    experience: 0,
    qualification: "",
    consultationFee: 0,
    availableTime: "",
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    getDoctors();
  }, []);

  // ==========================
  // Get All Doctors
  // ==========================
  const getDoctors = async () => {
    try {
      const response = await API.get("/doctors");
      setDoctors(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // ==========================
  // Add / Update Doctor
  // ==========================
  const saveDoctor = async () => {
    try {
      if (editingId) {
        await API.put(`/doctors/${editingId}`, newDoctor);
        alert(editingId ? "Doctor Updated Successfully!" : "Doctor Added Successfully!");
        alert("Doctor Deleted Successfully!");
      } else {
        await API.post("/doctors", newDoctor);
      }

      setNewDoctor({
        name: "",
        specialization: "",
        phone: "",
        email: "",
        experience: 0,
        qualification: "",
        consultationFee: 0,
        availableTime: "",
      });

      setEditingId(null);

      getDoctors();
    } catch (error) {
      console.log(error);
    }
  };

  // ==========================
  // Delete Doctor
  // ==========================
  const deleteDoctor = async (id: string) => {

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this doctor?"
  );

  if (!confirmDelete) return;

  try {

    await API.delete(`/doctors/${id}`);

    alert("Doctor Deleted Successfully!");

    getDoctors();

  } catch (error) {
    console.log(error);
  }
};

  // ==========================
  // Edit Doctor
  // ==========================
  const editDoctor = (doctor: Doctor) => {
    setNewDoctor(doctor);
    setEditingId(doctor._id || null);
  };

  const filteredDoctors = doctors.filter((doctor) =>
  doctor.name.toLowerCase().includes(search.toLowerCase())
);
  return (
    <div className="container mt-4">
      <h2>Doctors</h2>
      <input
  className="form-control mb-3"
  placeholder="🔍 Search Doctor by Name"
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>
      
 
    <div className="card p-4 mb-4">

  <input
    className="form-control mb-3"
    placeholder="Doctor Name"
    value={newDoctor.name}
    onChange={(e) =>
      setNewDoctor({ ...newDoctor, name: e.target.value })
    }
  />

  <input
    className="form-control mb-3"
    placeholder="Specialization"
    value={newDoctor.specialization}
    onChange={(e) =>
      setNewDoctor({
        ...newDoctor,
        specialization: e.target.value,
      })
    }
  />

  <input
    className="form-control mb-3"
    placeholder="Phone"
    value={newDoctor.phone}
    onChange={(e) =>
      setNewDoctor({
        ...newDoctor,
        phone: e.target.value,
      })
    }
  />

  <input
    className="form-control mb-3"
    placeholder="Email"
    value={newDoctor.email}
    onChange={(e) =>
      setNewDoctor({
        ...newDoctor,
        email: e.target.value,
      })
    }
  />

  <input
    className="form-control mb-3"
    type="number"
    placeholder="Experience (Years)"
    value={newDoctor.experience}
    onChange={(e) =>
      setNewDoctor({
        ...newDoctor,
        experience: Number(e.target.value),
      })
    }
  />

  <input
    className="form-control mb-3"
    placeholder="Qualification"
    value={newDoctor.qualification}
    onChange={(e) =>
      setNewDoctor({
        ...newDoctor,
        qualification: e.target.value,
      })
    }
  />

  <input
    className="form-control mb-3"
    type="number"
    placeholder="Consultation Fee"
    value={newDoctor.consultationFee}
    onChange={(e) =>
      setNewDoctor({
        ...newDoctor,
        consultationFee: Number(e.target.value),
      })
    }
  />

  <input
    className="form-control mb-3"
    placeholder="Available Time"
    value={newDoctor.availableTime}
    onChange={(e) =>
      setNewDoctor({
        ...newDoctor,
        availableTime: e.target.value,
      })
    }
  />

  <button
    className="btn btn-success"
    onClick={saveDoctor}
  >
    {editingId ? "Update Doctor" : "Add Doctor"}
  </button>

</div>

<table className="table table-bordered table-striped">

  <thead className="table-dark">
    <tr>
      <th>Name</th>
      <th>Specialization</th>
      <th>Phone</th>
      <th>Email</th>
      <th>Experience</th>
      <th>Qualification</th>
      <th>Fee</th>
      <th>Available Time</th>
      <th>Actions</th>
    </tr>
  </thead>

  <tbody>

    {filteredDoctors.length > 0 ? (
      filteredDoctors.map((doctor) => (
        <tr key={doctor._id}>
          <td>{doctor.name}</td>
          <td>{doctor.specialization}</td>
          <td>{doctor.phone}</td>
          <td>{doctor.email}</td>
          <td>{doctor.experience} Years</td>
          <td>{doctor.qualification}</td>
          <td>₹{doctor.consultationFee}</td>
          <td>{doctor.availableTime}</td>

          <td>

            <button
              className="btn btn-warning btn-sm me-2"
              onClick={() => editDoctor(doctor)}
            >
              Edit
            </button>

            <button
              className="btn btn-danger btn-sm"
              onClick={() => deleteDoctor(doctor._id!)}
            >
              Delete
            </button>

          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan={9} className="text-center">
          No Doctors Found
        </td>
      </tr>
    )}

  </tbody>

</table>  
    </div>
  );
}

export default Doctors;