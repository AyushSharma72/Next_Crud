const mongoose = require("mongoose");

const tasksschema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["completed", "incomplete"],
      default: "incomplete",
    },
  },

  {
    timestamps: true,
  }
);

const tasksmodal =
  mongoose.models.tasks || mongoose.model("tasks", tasksschema);
export default tasksmodal;
