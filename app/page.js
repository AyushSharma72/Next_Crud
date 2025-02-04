"use client";
import { Tag, Pagination, Spin } from "antd";
import React from "react";
import { toast } from "react-hot-toast";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useState, useEffect } from "react";
import { GradientText } from "text-gradients";
import { LoadingOutlined } from "@ant-design/icons";
import moment from "moment";
import {
  getTasksAction,
  getTasksCountAction,
  deleteTaskAction,
  updateTaskAction,
  getSingleTaskDataAction,
} from "./actions";
import { Modal, Box, TextField, Button, Select, MenuItem } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

export default function Home() {
  const [page, setPage] = useState(1);
  const [tasks, setTasks] = useState([]);
  const [taskscount, setTasksCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = React.useState(false);
  const [deletemodal, SetDeleteModal] = useState(false);
  const [newtitle, setNewTitle] = useState("");
  const [newdescription, setNewDescription] = useState("");
  const [newDuedate, setNewDueDate] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const[newTime,setNewtime] = useState("")
  const [loadingbackdrop, Setloadingbackdrop] = useState(false);
  const [deleteid, SetDeleteId] = useState("");

  async function OpenModal(id) {
    Setloadingbackdrop(true);
    const response = await getSingleTaskDataAction(id);
    if (response.success) {
      setNewTitle(response.task.title);
      setNewDescription(response.task.description);
      setNewDueDate(moment(response.task.dueDate).format("YYYY-MM-DD"));
      setNewStatus(response.task.status);
      setNewtime(response.task.time);
      setOpen(true);
      Setloadingbackdrop(false);
    } else {
      Setloadingbackdrop(false);
      toast.error(response.message);
    }
  }

  function handleClose() {
    setOpen(false);
    setNewTitle("");
    setNewDescription("");
    setNewDueDate(null);
  }

  async function fetchData() {
    setLoading(true);
    const response = await getTasksAction(page);

    if (response.success) {
      setTasks(response.tasks);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }

  async function deleteTask(id,e){
  
    e.preventDefault();
    const response = await deleteTaskAction(id);

    if (response.success) {
      toast.success("Task deleted");
      SetDeleteModal(false);
      fetchData();
    } else {
      SetDeleteModal(false);
      toast.error(response.message);
    }
  
}

  async function getTasksCount() {
    const response = await getTasksCountAction();
    if (response.success) {
      setTasksCount(response.tasksCount);
    } else {
      // toast.error(response.message);
    }
  }

  async function UpdateTask(id) {
    setLoading(true);
    const response = await updateTaskAction(id, {
      newtitle,
      newdescription,
      newdueDate: newDuedate,
      newStatus,
      newTime,
    });

    if (response.success) {
      setLoading(false);
      toast.success(response.message);
      fetchData();
      handleClose();
    } else {
      setLoading(false);
      toast.error(response.message);
    }
  }



  useEffect(() => {
    fetchData();
    getTasksCount();
  }, [page]);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",

    boxShadow: 24,
    p: 4,
  };

  return (
    <main>
      {loading ? (
        <div className="flex gap-2 items-center justify-center mt-10">
          <GradientText
            color="bluepink"
            direction="top left"
            className="text-4xl font-extrabold "
          >
            Loading
          </GradientText>
          <Spin indicator={<LoadingOutlined spin />} />
        </div>
      ) : tasks?.length > 0 ? (
        <div className="flex justify-center flex-col items-center gap-y-6">
          <GradientText
            color="bluepink"
            direction="top left"
            className="text-4xl font-extrabold  mt-5"
          >
            Your Tasks
          </GradientText>
          <div className="h-[500px] w-[90%] sm:w-3/4 lg:w-1/2 flex flex-col items-center gap-y-6 overflow-auto">
            {tasks.map((t) => (
              <div
                key={t._id}
                className="bg-slate-900 p-4 flex gap-4 rounded-lg w-full justify-between"
              >
                <div className="flex flex-col gap-4">
                  <p className="text-lg font-semibold text-white flex gap-2">
                    <span>Task:</span>
                    {t.title}
                  </p>
                  <p className="text-lg text-gray-300 flex gap-2">
                    <span className="font-medium ">Description:</span>
                    {t.description}
                  </p>
                  <div className="flex gap-2 items-center">
                    <span className="text-sm text-gray-400">Due Date:</span>
                    <Tag color="geekblue">
                      {moment(t.dueDate).format("MMM DD, YYYY")}{" "}
                      {moment(t.time, "HH:mm").format("hh:mm A")}
                    </Tag>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="text-sm text-gray-400">Status:</span>
                    {t.status === "incomplete" ? (
                      <Tag color="yellow">{t.status}</Tag>
                    ) : (
                      <Tag color="green">{t.status}</Tag>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <FaEdit
                    className="cursor-pointer"
                    onClick={() => {
                      OpenModal(t._id);
                    }}
                  />
                  <MdDelete
                    className="text-red-600 cursor-pointer"
                    onClick={() => {
                      SetDeleteId(t._id);
                      SetDeleteModal(true);
                    }}
                  />
                </div>

                {/* update modal  */}
                <Modal
                  open={open}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box
                    sx={style}
                    className="flex flex-col cursor-pointer gap-1"
                  >
                    <h2 className="text-black text-center text-bold text-xl">
                      Update Task
                    </h2>
                    <TextField
                      label="Title"
                      fullWidth
                      value={newtitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      margin="normal"
                    />
                    <TextField
                      label="Description"
                      fullWidth
                      value={newdescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      margin="normal"
                      multiline
                      rows={4}
                    />
                    <TextField
                      label="Due Date"
                      type="date"
                      fullWidth
                      value={newDuedate}
                      onChange={(e) => setNewDueDate(e.target.value)}
                      margin="normal"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        min: new Date().toISOString().split("T")[0],
                      }}
                    />
                    <TextField
                      label="Time"
                      type="time"
                      fullWidth
                      value={newTime}
                      onChange={(e) => setNewtime(e.target.value)}
                      margin="normal"
                      
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                    <Select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      fullWidth
                    >
                      <MenuItem value="incomplete">Incomplete</MenuItem>
                      <MenuItem value="complete">Complete</MenuItem>
                    </Select>

                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        UpdateTask(t._id);
                      }}
                    >
                      Update
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        handleClose();
                      }}
                    >
                      Close
                    </Button>
                  </Box>
                </Modal>
              </div>
            ))}
          </div>

          {/* delete modal */}
          <Modal
            open={deletemodal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style} className="flex flex-col cursor-pointer gap-1">
              <h2 className="text-black text-center font-bold text-xl">
                Delete this task ?
              </h2>

              <Button
                variant="contained"
                color="error"
                onClick={(e) => {
                  deleteTask(deleteid, e);
                }}
              >
                Delete
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  SetDeleteModal(false);
                }}
              >
                Cancel
              </Button>
            </Box>
          </Modal>
          <Backdrop
            sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
            open={loadingbackdrop}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          <Pagination
            className="bg-white p-2"
            onChange={(value) => {
              setPage(value);
            }}
            defaultCurrent={page}
            total={taskscount}
            pageSize={4}
          />
        </div>
      ) : (
        <p className="text-center text-3xl text-red-600">No Tasks available</p>
      )}
    </main>
  );
}
