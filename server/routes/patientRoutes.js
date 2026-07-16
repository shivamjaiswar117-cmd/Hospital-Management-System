const express = require("express");
const router = express.Router();
const Patient = require("../models/Patient");

console.log("patientRoutes.js loaded");

// ==========================
// Add New Patient (POST)
// ==========================
router.post("/", async (req, res) => {
  console.log("POST /api/patients route hit");
  console.log(req.body);

  try {
    const patient = new Patient(req.body);

    const savedPatient = await patient.save();

    res.status(201).json(savedPatient);
  } catch (error) {
    console.log("========== FULL ERROR ==========");
    console.dir(error, { depth: null });

    res.status(500).json({
      message: error.message,
    });
  }
});

// ==========================
// Get All Patients (GET)
// ==========================
router.get("/", async (req, res) => {
  try {
    const patients = await Patient.find();

    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ==========================
// Update Patient (PUT)
// ==========================
router.put("/:id", async (req, res) => {
  try {
    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedPatient) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    res.status(200).json(updatedPatient);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ==========================
// Delete Patient (DELETE)
// ==========================
router.delete("/:id", async (req, res) => {
  try {
    const deletedPatient = await Patient.findByIdAndDelete(req.params.id);

    if (!deletedPatient) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    res.status(200).json({
      message: "Patient deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;