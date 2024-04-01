import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { IconContext } from "react-icons";
import {
  BsFillTrashFill,
  BsPlusCircle,
  BsFloppy,
  BsCalendar2Plus,
  BsFillPencilFill,
  BsCheckCircle,
  BsArrowCounterclockwise,
  BsFillTrash3Fill,
  BsGearWideConnected,
} from "react-icons/bs";
import { notify } from "../functions/toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

/*
notify({
  text: data.msg,
  error: true,
});
*/

function Dashboard({ setisLoggedIn }) {
  const [loading, setloading] = useState(false);

  const [userInfo, setuserInfo] = useState([]);
  const [categories, setcategories] = useState([]);
  const [selectedCategory, setselectedCategory] = useState(null);
  const [allTasks, setallTasks] = useState([]);

  const getUserInfo = () => {
    fetch(`${process.env.REACT_APP_BACK_END}/get-user-info`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: sessionStorage.getItem("token"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.status) {
          notify({
            text: data.msg,
            error: true,
          });
        } else if (!data.status && data.tokenError) {
          notify({
            text: data.msg,
            error: true,
          });
          sessionStorage.removeItem("token");
          window.location.reload();
        } else {
          if (data.userInfo[0].username === "test") {
            notify({
              testMode: true,
            });
          }
          setuserInfo(data.userInfo);
        }
      });
  };

  const getCategories = () => {
    fetch(`${process.env.REACT_APP_BACK_END}/get-categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: sessionStorage.getItem("token"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.status) {
          notify({
            text: data.msg,
            error: true,
          });
        } else if (!data.status && data.tokenError) {
          notify({
            text: data.msg,
            error: true,
          });
          sessionStorage.removeItem("token");
          window.location.reload();
        } else {
          setcategories(data.categories);
          if (data.categories.length > 0) {
            setselectedCategory(data.categories[0].id);
          }
        }
      });
  };

  const getTasks = () => {
    fetch(`${process.env.REACT_APP_BACK_END}/get-tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: sessionStorage.getItem("token"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.status) {
          notify({
            text: data.msg,
            error: true,
          });
        } else if (!data.status && data.tokenError) {
          notify({
            text: data.msg,
            error: true,
          });
          sessionStorage.removeItem("token");
          window.location.reload();
        } else {
          setallTasks(data.tasks);
        }
      });
  };

  useEffect(() => {
    setloading(true);
    getUserInfo();
    getCategories();
    getTasks();
    setloading(false);
  }, []);

  //
  if (!userInfo.length) return;
  if (loading) return <LoadingScreen />;
  return (
    <div>
      <Navbar setisLoggedIn={setisLoggedIn} userInfo={userInfo} />

      <div className="main">
        <Categories
          categories={categories}
          setcategories={setcategories}
          selectedCategory={selectedCategory}
          setselectedCategory={setselectedCategory}
          allTasks={allTasks}
        />

        <Tasks
          categories={categories}
          selectedCategory={selectedCategory}
          setallTasks={setallTasks}
          allTasks={allTasks}
        />
      </div>
    </div>
  );
}

export default Dashboard;

const LoadingScreen = () => {
  return (
    <div className="loading_screen_container">
      <ReactIcon
        size={"200px"}
        className={"spinning_icon"}
        icon={<BsGearWideConnected />}
        func={() => null}
      />
    </div>
  );
};

const Navbar = ({ setisLoggedIn, userInfo }) => {
  const [loading, setloading] = useState(false);

  const logOut = () => {
    setloading(true);

    fetch(`${process.env.REACT_APP_BACK_END}/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: sessionStorage.getItem("token"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.status) {
          notify({
            text: data.msg,
            error: true,
          });
          setisLoggedIn(true);
        } else {
          sessionStorage.removeItem("token");
          setisLoggedIn(false);
        }
      });
    setloading(false);
  };

  if (!userInfo.length) return;
  return (
    <div className="navbar">
      <h1>{userInfo[0].first_name + " " + userInfo[0].last_name}</h1>
      {loading ? (
        <button>Log Out</button>
      ) : (
        <button onClick={logOut}>Log Out</button>
      )}
    </div>
  );
};

const Categories = ({
  categories,
  setcategories,
  selectedCategory,
  setselectedCategory,
  allTasks,
}) => {
  const [addCategoryToggle, setaddCategoryToggle] = useState(false);
  const [categoryToAdd, setcategoryToAdd] = useState("");

  const addCategoryFunc = () => {
    if (!categoryToAdd) return;
    fetch(`${process.env.REACT_APP_BACK_END}/add-category`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: sessionStorage.getItem("token"),
        category: categoryToAdd,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.status) {
          notify({
            text: data.msg,
            error: true,
          });
        } else if (!data.status && data.tokenError) {
          notify({
            text: data.msg,
            error: true,
          });
          sessionStorage.removeItem("token");
          window.location.reload();
        } else {
          setcategories(data.categories);
          setcategoryToAdd("");
          setaddCategoryToggle(false);
          setselectedCategory(data.categories[data.categories.length - 1].id);
        }
      });
  };

  const deleteCategoryFunc = (id) => {
    fetch(`${process.env.REACT_APP_BACK_END}/delete-category`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: sessionStorage.getItem("token"),
        id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.status) {
          notify({
            text: data.msg,
            error: true,
          });
        } else if (!data.status && data.tokenError) {
          notify({
            text: data.msg,
            error: true,
          });
          sessionStorage.removeItem("token");
          window.location.reload();
        } else {
          setcategories(data.categories);
        }
      });
  };

  const doesCategoryIdExist = (categoryId) => {
    if (!categoryId) return false;
    for (let i = 0; i < allTasks.length; i++) {
      if (allTasks[i].category_id === categoryId) {
        return true;
      }
    }
    return false;
  };

  return (
    <div className="categories_container">
      {categories.length === 0 ? (
        <p className="add_color">Add Categories to begin</p>
      ) : null}
      {categories.map((category) => {
        return (
          <div
            key={category.id}
            className={`category ${
              category.id === selectedCategory ? "selected" : ""
            }`}
          >
            <p
              className="category_name"
              onClick={() => setselectedCategory(category.id)}
            >
              {category.category}
            </p>
            {doesCategoryIdExist(category.id) ? null : (
              <ReactIcon
                size={"20px"}
                className={"react_icon"}
                icon={<BsFillTrashFill />}
                func={() => deleteCategoryFunc(category.id)}
              />
            )}
          </div>
        );
      })}
      {addCategoryToggle ? (
        <div className="add_category_input">
          <input
            type="text"
            placeholder="Enter category name"
            value={categoryToAdd}
            onChange={(e) => setcategoryToAdd(e.target.value)}
          />
          <ReactIcon
            size={"20px"}
            className={"add_category_save_icon"}
            icon={<BsFloppy />}
            func={addCategoryFunc}
          />
        </div>
      ) : null}
      <ReactIcon
        size={"25px"}
        className={"add_category_toggle_icon"}
        icon={<BsPlusCircle />}
        func={() => setaddCategoryToggle(!addCategoryToggle)}
      />
    </div>
  );
};

const Tasks = ({ categories, selectedCategory, setallTasks, allTasks }) => {
  const [taskToAdd, settaskToAdd] = useState("");
  const [dueDate, setdueDate] = useState(new Date());

  const addTask = () => {
    if (!selectedCategory || !taskToAdd) return;

    fetch(`${process.env.REACT_APP_BACK_END}/add-task`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: sessionStorage.getItem("token"),
        category_id: selectedCategory,
        task: taskToAdd,
        due: dueDate,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.status) {
          notify({
            text: data.msg,
            error: true,
          });
        } else if (!data.status && data.tokenError) {
          notify({
            text: data.msg,
            error: true,
          });
          sessionStorage.removeItem("token");
          window.location.reload();
        } else {
          setallTasks(data.tasks);
          settaskToAdd("");
          setdueDate("");
        }
      });
  };

  const filterTasks = (tasks) => {
    return tasks.filter(
      (task) =>
        task.category_id === selectedCategory && task.status !== "finished"
    );
  };

  const filterTasksFinished = (tasks) => {
    return tasks.filter(
      (task) =>
        task.category_id === selectedCategory && task.status === "finished"
    );
  };

  const completeTask = (id) => {
    if (!id) return;
    fetch(`${process.env.REACT_APP_BACK_END}/complete-task`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: sessionStorage.getItem("token"),
        id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.status) {
          notify({
            text: data.msg,
            error: true,
          });
        } else if (!data.status && data.tokenError) {
          notify({
            text: data.msg,
            error: true,
          });
          sessionStorage.removeItem("token");
          window.location.reload();
        } else {
          setallTasks(data.tasks);
        }
      });
  };

  const deleteTask = (id) => {
    if (!id) return;
    fetch(`${process.env.REACT_APP_BACK_END}/delete-task`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: sessionStorage.getItem("token"),
        id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.status) {
          notify({
            text: data.msg,
            error: true,
          });
        } else if (!data.status && data.tokenError) {
          notify({
            text: data.msg,
            error: true,
          });
          sessionStorage.removeItem("token");
          window.location.reload();
        } else {
          setallTasks(data.tasks);
        }
      });
  };

  const undoTask = (id) => {
    if (!id) return;
    fetch(`${process.env.REACT_APP_BACK_END}/undo-task`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: sessionStorage.getItem("token"),
        id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.status) {
          notify({
            text: data.msg,
            error: true,
          });
        } else if (!data.status && data.tokenError) {
          notify({
            text: data.msg,
            error: true,
          });
          sessionStorage.removeItem("token");
          window.location.reload();
        } else {
          setallTasks(data.tasks);
        }
      });
  };

  const [showFinished, setshowFinished] = useState(false);

  return (
    <div>
      {categories.length === 0 ? null : (
        <div className="add_task">
          <input
            type="text"
            placeholder="Task"
            value={taskToAdd}
            onChange={(e) => settaskToAdd(e.target.value)}
          />
          <DatePicker
            selected={dueDate}
            onChange={(date) => setdueDate(date)}
          />
          {/* <input
            type="date"
            value={dueDate}
            onChange={(e) => setdueDate(e.target.value)}
          /> */}
          <ReactIcon
            size={"25px"}
            className={"react_icon"}
            icon={<BsCalendar2Plus />}
            func={addTask}
          />
          {/* <button onClick={addTask}>Add Task</button> */}
        </div>
      )}

      <div className="task_container">
        {filterTasks(allTasks).map((task) => {
          return (
            <TaskPending
              key={task.id}
              task={task}
              completeTask={completeTask}
              setallTasks={setallTasks}
            />
          );
        })}
      </div>

      {filterTasksFinished(allTasks).length !== 0 ? (
        <div className="show_finished_toggle">
          <h2 onClick={() => setshowFinished(!showFinished)}>
            Show Finished{" "}
            <span
              className={`show_finished_toggle_span ${
                showFinished && "show_finished_toggle_span_rotated"
              }`}
            >
              {"^"}
            </span>
          </h2>
        </div>
      ) : null}
      <div className="task_container">
        {showFinished ? (
          <>
            {filterTasksFinished(allTasks).map((task) => {
              return (
                <TaskFinished
                  key={task.id}
                  task={task}
                  deleteTask={deleteTask}
                  undoTask={undoTask}
                />
              );
            })}
          </>
        ) : null}
      </div>
    </div>
  );
};

const TaskPending = ({ task, completeTask, setallTasks }) => {
  const [editToggle, seteditToggle] = useState(false);
  const [taskToChange, settaskToChange] = useState(task.task);
  const [dueDate, setdueDate] = useState(
    task.due == null ? "" : new Date(task.due)
  );

  const editTask = () => {
    if (!taskToChange) return;

    fetch(`${process.env.REACT_APP_BACK_END}/edit-task`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: sessionStorage.getItem("token"),
        id: task.id,
        task: taskToChange,
        due: dueDate,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.status) {
          notify({
            text: data.msg,
            error: true,
          });
        } else if (!data.status && data.tokenError) {
          notify({
            text: data.msg,
            error: true,
          });
          sessionStorage.removeItem("token");
          window.location.reload();
        } else {
          setallTasks(data.tasks);
          seteditToggle(false);
        }
      });
  };

  if (editToggle) {
    return (
      <div className="task">
        <div className="task_left">
          <input
            type="text"
            placeholder="Task"
            value={taskToChange}
            onChange={(e) => settaskToChange(e.target.value)}
          />
          <DatePicker
            selected={
              dueDate ? new Date(dueDate).toISOString().split("T")[0] : ""
            }
            onChange={(date) => setdueDate(date)}
          />
          {/* <input
            type="date"
            value={dueDate ? new Date(dueDate).toISOString().split("T")[0] : ""}
            onChange={(e) => setdueDate(e.target.value)}
          /> */}
        </div>
        <div className="task_right">
          <ReactIcon
            size={"20px"}
            className={"task_control_icon"}
            icon={<BsFloppy />}
            func={editTask}
          />
        </div>
      </div>
    );
  } else {
    return (
      <div className="task">
        <div className="task_left">
          <h3>{task.task}</h3>
          {task.due ? <h3>{new Date(task.due).toLocaleDateString()}</h3> : null}
        </div>
        <div className="task_right">
          <ReactIcon
            size={"25px"}
            className={"task_control_icon"}
            icon={<BsFillPencilFill />}
            func={() => seteditToggle(true)}
          />
          <ReactIcon
            size={"25px"}
            className={"task_control_icon"}
            icon={<BsCheckCircle />}
            func={() => completeTask(task.id)}
          />
        </div>
      </div>
    );
  }
};

const TaskFinished = ({ task, deleteTask, undoTask }) => {
  return (
    <div key={task.id} className="task">
      <div className="task_left task_finished">
        <h3>{task.task}</h3>
        {task.due ? <h3>{new Date(task.due).toLocaleDateString()}</h3> : null}
      </div>
      <div className="task_right">
        <ReactIcon
          size={"25px"}
          className={"task_control_icon"}
          icon={<BsArrowCounterclockwise />}
          func={() => undoTask(task.id)}
        />
        <ReactIcon
          size={"25px"}
          className={"task_control_icon"}
          icon={<BsFillTrash3Fill />}
          func={() => deleteTask(task.id)}
        />
      </div>
    </div>
  );
};

const ReactIcon = ({ size, className, icon, func }) => {
  return (
    <IconContext.Provider value={{ size }}>
      <div onClick={func} className={className}>
        {icon}
      </div>
    </IconContext.Provider>
  );
};
