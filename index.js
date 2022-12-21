const express= require("express");
const path= require("path");
const fs= require("fs/promises");

const app = express();

app.use(express.json());

const jsonPath= path.resolve("./file/task.json");

app.get("/task", async (req, res)=>{
    const jsonFile=await fs.readFile(jsonPath, "utf-8");
    res.send(jsonFile);
});
app.post("/task", async (req, res)=>{
    const task= req.body;
    const TaskArray = JSON.parse( await fs.readFile(jsonPath, "utf-8"));
    const lastIndex = TaskArray.length -1 ;
    const newId = TaskArray[lastIndex].id +1;
    TaskArray.push({...task, id: newId});
    await fs.writeFile(jsonPath, JSON.stringify(TaskArray));
    console.log(TaskArray);
     res.end();
});
app.put("/task", async (req, res)=>{
    const TaskArray = JSON.parse( await fs.readFile(jsonPath, "utf-8"));
    const {title, description, status, id}= req.body;

    const TaskIndex =TaskArray.findIndex(task => task.id === id);
    if (TaskIndex >=0){
        TaskArray[TaskIndex].title = title;
        TaskArray[TaskIndex].description = description;
        TaskArray[TaskIndex].status = status;

        await fs.writeFile(jsonPath, JSON.stringify( TaskArray));
        console.log( TaskArray);
        res.send("tarea actualizada");
         res.end();
    }
});
app.delete("/task", async (req, res)=>{
    const TaskArray = JSON.parse( await fs.readFile(jsonPath, "utf-8"));
    const { id }= req.body;
    const TaskIndex =TaskArray.findIndex(task => task.id === id);
    TaskArray.splice(TaskIndex, 1);

  await fs.writeFile(jsonPath, JSON.stringify(TaskArray));

  res.send("tarea eliminada");

  res.end();
});

const PORT=8000;

app.listen(PORT, ()=>{
    console.log(`servidor escuchando en el puerto ${PORT}`);
});