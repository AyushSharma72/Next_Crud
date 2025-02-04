"use server";
import ConnectDb from "./db";
import tasksmodal from "./modals/tasksschema";

export async function createTaskAction(formData) {
  try {
    const title = formData.get("title");
    const dueDate = formData.get("dueDate");
    const description = formData.get("description");
    const time = formData.get("time");

    if (!title || !dueDate || !description || !time) {
      return { success: false, message: "All fields are required." };
    }

    await ConnectDb();

    const newTask = new tasksmodal({ title, dueDate, description, time });
    const response = await newTask.save();

    return {
      success: true,
      message: "Task created successfully.",
      task: response.toObject(), 
    };
  } catch (error) {
    console.error("Error creating task:", error);
    return { success: false, message: "Error creating task." };
  }
}

export async function deleteTaskAction(id) {
  try {
    if (!id) {
      return { success: false, message: "ID parameter is missing" };
    }

    await ConnectDb();
    const response = await tasksmodal.findByIdAndDelete(id).lean(); 

    if (response) {
      return { success: true, message: "Task deleted successfully" };
    } else {
      return { success: false, message: "Task not found" };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error deleting task" };
  }
}

export async function getTasksAction(page = 1, limit = 4) {
  try {
    await ConnectDb();

    let skipCount = (page - 1) * limit;
    const tasks = await tasksmodal.find().limit(limit).skip(skipCount).lean(); 

    if (tasks.length > 0) {
      return { success: true, message: "Fetched tasks successfully", tasks };
    } else {
      return { success: false, message: "No tasks found" };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error fetching tasks" };
  }
}

export async function getTasksCountAction() {
  try {
    await ConnectDb();
    const tasksCount = await tasksmodal.countDocuments();

    if (tasksCount) {
      return {
        success: true,
        message: "Fetched tasks count successfully",
        tasksCount,
      };
    } else {
      return { success: false, message: "No tasks found" };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: "Cannot fetch task count" };
  }
}

export async function updateTaskAction(
  id,
  { newtitle, newdescription, newdueDate, newStatus, newTime }
) {
  try {
    if (!newtitle && !newdescription && !newdueDate && !newTime && !newStatus) {
      return { success: false, message: "At least one field is required." };
    }

    await ConnectDb();

    const task = await tasksmodal.findById(id).lean(); 
    if (task) {
      const updatedTask = await tasksmodal
        .findByIdAndUpdate(
          id,
          {
            title: newtitle || task.title,
            dueDate: newdueDate || task.dueDate,
            description: newdescription || task.description,
            status: newStatus || task.status,
            time: newTime || task.time,
          },
          { new: true }
        )
        .lean(); 

      return { success: true, message: "Updated successfully", updatedTask };
    } else {
      return { success: false, message: "Task not found" };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error in updating task" };
  }
}

export async function getSingleTaskDataAction(id) {
  try {
    if (!id) {
      return { success: false, message: "Task ID is missing" };
    }
    await ConnectDb();
    const task = await tasksmodal.findById(id).lean();

    if (task) {
      return { success: true, message: "Fetched task successfully", task };
    } else {
      return { success: false, message: "No task found" };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error fetching task" };
  }
}
