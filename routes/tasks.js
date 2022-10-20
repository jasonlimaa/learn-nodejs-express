const { getAllTasks, getTaskById, createTask, removeTask, updateTask } = require("../controllers/task.controller");

const router = require("express").Router();
router.get("/", getAllTasks);
router.get("/:id", getTaskById);
router.post("/create", createTask);
router.put("/update/:id", updateTask);
router.delete("/remove/:id", removeTask);
module.exports = router;
