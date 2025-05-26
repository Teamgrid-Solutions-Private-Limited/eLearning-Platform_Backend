const express = require('express');
const packageRoutes = require('./package.routes');
const trackingRoutes = require('./tracking.routes');
const Course = require("./models/Course");
const { createScormPackage } = require("./utils/scormUtils");
const router = express.Router();


 
router.get("/courses/:id/export", async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: "Course not found" });
  
    const zipPath = await createScormPackage(course);
    res.download(zipPath);
  });

module.exports = router; 