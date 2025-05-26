const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Course = require("../../authoring/models/course.model");
const { createScormPackage } = require("./utils/scormUtils");

const run = async () => {
  await connectDB();

  const course = await Course.findOne(); // get first course
  if (!course) return console.error("No course found!");

  const zipPath = await createScormPackage(course);
  console.log("SCORM Package generated:", zipPath);

  mongoose.disconnect();
};

run();
