const { TaskModel } = require("../models/tasks");
async function createTask(req, res, next) {
  try {
    const { title, text, category, user = req.user._id, status = "pending" } = req.body;
    const result = TaskModel.create({
      title,
      text,
      category,
      user,
      status,
      expiresIn: Date.now() + 1000 * 60 * 60 * 24 * 30,
    });
    if (!result) throw { status: 500, message: "Task not created" };
    return res.status(201).json({
      status: 201,
      success: true,
      message: "Task Created successfully",
    });
  } catch (error) {
    next(error);
  }
}
async function getAllTasks(req, res, next) {
  try {
    const userID = req.user._id;
    const tasks = await TaskModel.find({ user: userID }).sort({ _id: -1 });
    return res.status(200).json({
      status: 200,
      success: true,
      tasks,
    });
  } catch (error) {
    next(error);
  }
}
async function getTaskById(req, res, next) {
  try {
    const userID = req.user._id;
    const taskID = req.params.id;
    const task = await TaskModel.findOne({ user: userID, _id: taskID });
    if (!task) throw { status: 404, message: "task not found" };
    return res.status(200).json({
      status: 200,
      success: true,
      task,
    });
  } catch (error) {
    next(error);
  }
}
async function updateTask(req, res, next) {
  try {
    const { id: _id } = req.params;
    const user = req.user._id;
    const task = await TaskModel.findOne({ _id, user });
    if (!task) throw { status: 500, message: "Task not found" };
    const data = { ...req.body };
    Object.entries(data).forEach(([key, value]) => {
      if (!value || ["", " ", ".", null, undefined].includes(value) || value.length < 3) {
        delete data[key];
      }
      if (!["title", "text", "category"].includes(key)) {
        delete data[key];
      }
    });
    const updateTaskResult = await TaskModel.updateOne(
      { _id },
      {
        $set: data,
      }
    );
    if (updateTaskResult.modifiedCount > 0) {
      return res.status(200).json({
        status: 200,
        success: true,
        message: "Task updated successfully",
      });
    }
    throw { status: 400, message: "Task update failed" };
  } catch (error) {
    next(error);
  }
}
async function removeTask(req, res, next) {
  try {
    const { id: _id } = req.params;
    const userID = req.user._id;
    const task = await TaskModel.findOne({ _id, userID });
    if (!userID) throw { status: 400, message: "Task Not Found" };
    const removeResult = await TaskModel.deleteOne({ _id });
    if (removeResult.deletedCount > 0) {
      return res.status(200).json({
        status: 200,
        success: true,
        message: "Task removed successfully",
      });
    }
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  removeTask,
};
