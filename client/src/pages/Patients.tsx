import { useEffect, useState } from "react";
import API from "../services/api";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Patient {
  _id?: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  address: string;
  disease: string;
  doctor: string;
}

function Patients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [newPatient, setNewPatient] = useState<Patient>({
    name: "",
    age: 0,
    gender: "",
    phone: "",
    address: "",
    disease: "",
    doctor: "",
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    getPatients();
  }, []);

  // ==========================
  // Get Patients
  // ==========================
  const getPatients = async () => {
  try {
    setLoading(true);

    const response = await API.get("/patients");

    setPatients(response.data);

  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

  // ==========================
  // Add / Update Patient
  // ==========================
  const savePatient = async () => {

  // Validation
  if (
    newPatient.name.trim() === "" ||
    newPatient.age <= 0 ||
    newPatient.gender.trim() === "" ||
    newPatient.phone.trim() === "" ||
    newPatient.address.trim() === "" ||
    newPatient.disease.trim() === "" ||
    newPatient.doctor.trim() === ""
  ) {
    alert("Please fill all fields correctly.");
    return;
  }

  if (!/^\d{10}$/.test(newPatient.phone)) {
    alert("Phone number must be exactly 10 digits.");
    return;
  }

  try {
    if (editingId) {
      await API.put(`/patients/${editingId}`, newPatient);
      alert("Patient Updated Successfully!");
    } else {
      await API.post("/patients", newPatient);
      alert("Patient Added Successfully!");
    }

    setNewPatient({
      name: "",
      age: 0,
      gender: "",
      phone: "",
      address: "",
      disease: "",
      doctor: "",
    });

    setEditingId(null);
    getPatients();

  } catch (error) {
    console.log(error);
  }
};

  // ==========================
  // Delete Patient
  // ==========================
  const deletePatient = async (id: string) => {

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this patient?"
  );

  if (!confirmDelete) return;

  try {

    await API.delete(`/patients/${id}`);

    alert("Patient Deleted Successfully!");

    getPatients();

  } catch (error) {
    console.log(error);
  }
};

  const exportToExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(
    patients.map((patient) => ({
      Name: patient.name,
      Age: patient.age,
      Gender: patient.gender,
      Phone: patient.phone,
      Address: patient.address,
      Disease: patient.disease,
      Doctor: patient.doctor,
    }))
  );

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Patients"
  );

  XLSX.writeFile(workbook, "Patients.xlsx");
};
  const exportToPDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Hospital Management System", 14, 15);

  doc.setFontSize(12);
  doc.text("Patients Report", 14, 25);

  autoTable(doc, {
    startY: 35,
    head: [[
      "Name",
      "Age",
      "Gender",
      "Phone",
      "Address",
      "Disease",
      "Doctor",
    ]],
    body: patients.map((patient) => [
      patient.name,
      patient.age,
      patient.gender,
      patient.phone,
      patient.address,
      patient.disease,
      patient.doctor,
    ]),
  });

  doc.save("Patients_Report.pdf");
};
<button
  className="btn btn-danger ms-2"
  onClick={exportToPDF}
>
  <i className="bi bi-file-earmark-pdf me-2"></i>
  Export PDF
</button>


  // ==========================
  // Edit Patient
  // ==========================
  const editPatient = (patient: Patient) => {
    setNewPatient({
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      phone: patient.phone,
      address: patient.address,
      disease: patient.disease,
      doctor: patient.doctor,
    });

    setEditingId(patient._id || null);
  };

  // ==========================
  // Search Patient
  // ==========================
  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h2 className="mb-4">
  <i className="bi bi-people-fill me-2"></i>
  Patients
</h2>

      {/* Search */}
      <input
        className="form-control mb-3"
        placeholder="🔍 Search Patient by Name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="mb-3">
  <div className="text-center mb-3">
  <button
    className="btn btn-success me-2"
    onClick={exportToExcel}
  >
    <i className="bi bi-file-earmark-excel me-2"></i>
    Export Patients
  </button>

  <button
    className="btn btn-danger"
    onClick={exportToPDF}
  >
    <i className="bi bi-file-earmark-pdf me-2"></i>
    Export PDF
  </button>
</div>
</div>

      {/* Patient Form */}
      <div className="card p-4 mb-4">

        <input
          className="form-control mb-3"
          placeholder="Name"
          value={newPatient.name}
          onChange={(e) =>
            setNewPatient({
              ...newPatient,
              name: e.target.value,
            })
          }
        />

        <input
          className="form-control mb-3"
          type="number"
          placeholder="Age"
          value={newPatient.age}
          onChange={(e) =>
            setNewPatient({
              ...newPatient,
              age: Number(e.target.value),
            })
          }
        />

        <input
          className="form-control mb-3"
          placeholder="Gender"
          value={newPatient.gender}
          onChange={(e) =>
            setNewPatient({
              ...newPatient,
              gender: e.target.value,
            })
          }
        />

        <input
          className="form-control mb-3"
          placeholder="Phone"
          value={newPatient.phone}
          onChange={(e) =>
            setNewPatient({
              ...newPatient,
              phone: e.target.value,
            })
          }
        />

        <input
          className="form-control mb-3"
          placeholder="Address"
          value={newPatient.address}
          onChange={(e) =>
            setNewPatient({
              ...newPatient,
              address: e.target.value,
            })
          }
        />

        <input
          className="form-control mb-3"
          placeholder="Disease"
          value={newPatient.disease}
          onChange={(e) =>
            setNewPatient({
              ...newPatient,
              disease: e.target.value,
            })
          }
        />

        <input
          className="form-control mb-3"
          placeholder="Doctor"
          value={newPatient.doctor}
          onChange={(e) =>
            setNewPatient({
              ...newPatient,
              doctor: e.target.value,
            })
          }
        />

        <button
  className="btn btn-success"
  onClick={savePatient}
>
  {editingId ? (
    <>
      <i className="bi bi-pencil-square me-2"></i>
      Update Patient
    </>
  ) : (
    <>
      <i className="bi bi-plus-circle me-2"></i>
      Add Patient
    </>
  )}
</button>
{editingId && (
  <button
    className="btn btn-secondary w-100 mt-2"
    onClick={() => {
      setEditingId(null);

      setNewPatient({
        name: "",
        age: 0,
        gender: "",
        phone: "",
        address: "",
        disease: "",
        doctor: "",
      });
    }}
  >
    <i className="bi bi-x-circle me-2"></i>
    Cancel
  </button>
)}

      </div>

      {/* Patient Table */}
      <table className="table table-bordered table-striped">

        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Disease</th>
            <th>Doctor</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
  <tr>
    <td colSpan={8} className="text-center">
      <div className="spinner-border text-primary me-2"></div>
      Loading Patients...
    </td>
  </tr>
) : filteredPatients.length > 0 ? (
            filteredPatients.map((patient) => (
              <tr key={patient._id}>
                <td>{patient.name}</td>
                <td>{patient.age}</td>
                <td>{patient.gender}</td>
                <td>{patient.phone}</td>
                <td>{patient.address}</td>
                <td>{patient.disease}</td>
                <td>{patient.doctor}</td>

                <td>
                  <button
  className="btn btn-warning btn-sm me-2"
  onClick={() => editPatient(patient)}
>
  <i className="bi bi-pencil-square me-1"></i>
  Edit
</button>

                  <button
  className="btn btn-danger btn-sm"
  onClick={() => deletePatient(patient._id!)}
>
  <i className="bi bi-trash me-1"></i>
  Delete
</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="text-center">
                No Patients Found
              </td>
            </tr>
          )}
        </tbody>

      </table>
    </div>
  );
}

export default Patients;