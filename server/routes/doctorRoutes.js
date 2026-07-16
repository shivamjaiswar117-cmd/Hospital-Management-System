const express = require("express");
const router = express.Router();
const Doctor = require("../models/Doctor");

// ==========================
// Add Doctor (POST)
// ==========================
router.post("/", async (req, res) => {
  try {
    const doctor = new Doctor(req.body);

    const savedDoctor = await doctor.save();

    res.status(201).json(savedDoctor);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ==========================
// Get All Doctors (GET)
// ==========================
router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find();

    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ==========================
// Update Doctor (PUT)
// ==========================
router.put("/:id", async (req, res) => {
  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedDoctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    res.status(200).json(updatedDoctor);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ==========================
// Delete Doctor (DELETE)
// ==========================
router.delete("/:id", async (req, res) => {
  try {
    const deletedDoctor = await Doctor.findByIdAndDelete(req.params.id);

    if (!deletedDoctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      message: "Doctor deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


module.exports = router;