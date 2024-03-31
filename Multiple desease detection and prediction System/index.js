const express = require("express")
const app = express()
const { spawn } = require('child_process');
const { exec } = require('child_process');
const path = require('path');
var port = 4001

app.use(express.urlencoded({ extended: false }))

app.use(express.static('public'));

app.set("view engine", "hbs")
app.get("/", (req, res) => {
    res.render("model1")
})
app.post("/covidpredict", (req, res) => {
    const filePath = path.join(__dirname, 'Model1', 'temp.py');
    //0,0,0,0,0,1,0
    // const argument = [0,1,1,0,0,1,0];
    console.log(req.body.cough)
    const argument = [req.body.cough, req.body.fever, req.body.sorethroat, req.body.breath, req.body.head, req.body.age, req.body.gender];
    const childProcess = spawn('python', [filePath, ...argument]);

    childProcess.stdout.on('data', (data) => {
        // console.log(data.toString())
        res.render("model1", {
            result: data.toString()
        });
    });

    // childProcess.stderr.on('data', (data) => {
    //     console.log(data.toString())
    // });

    childProcess.on('close', (code) => {
        console.log(code)
    });
    // res.render("index")
})

app.get("/model2",(req,res) =>{
    res.render("model2")
})
app.post("/diabetispredict", (req, res) => {
    const filePath = path.join(__dirname, 'Model2', 'temp.py');

    // const argument = [0, 117, 80, 31, 53, 45.2, 0.089, 24];
    const argument = [req.body.Pregnancies, req.body.Glucose, req.body.BloodPressure, req.body.SkinThickness, req.body.Insulin, req.body.BMI, req.body.DiabetesPedigreeFunction,req.body.Age];
    // console.log(argument)
    const childProcess = spawn('python', [filePath, ...argument]);

    childProcess.stdout.on('data', (data) => {
        // console.log(data.toString())
        if(data.toString()==0){
            res.render("model2", {
                result: "Not Diabetic"
            })
        }else{
            res.render("model2", {
                result: "You are diabetic"
            })
        }
    });

    // childProcess.stderr.on('data', (data) => {
    //     console.log(data.toString())
    // });

    // childProcess.on('close', (code) => {
    //     console.log(code)
    // });
    // res.render("index")
})

app.get("/model3",(req,res) =>{
    res.render("model3")
})
app.post("/heartpredict", (req, res) => {
    const filePath = path.join(__dirname, 'Model3', 'temp.py');

    const argument = [req.body.Age,req.body.gender,req.body.cp,req.body.trestbps,req.body.chol,req.body.Fbs,req.body.RestECG,req.body.Thalac,req.body.Exang,req.body.OldPeak,req.body.Slope,req.body.CA,req.body.Thal];

    const childProcess = spawn('python', [filePath, ...argument]);

    childProcess.stdout.on('data', (data) => {
        // console.log(data.toString())
        if(data.toString()==0){
            res.render("model3", {
                result: "You are Healthy"
            })
        }else{
            res.render("model3", {
                result: "You have heart Desease"
            })
        }
    });

    // childProcess.stderr.on('data', (data) => {
    //     console.log(data.toString())
    // });

    // childProcess.on('close', (code) => {
    //     console.log(code)
    // });
    // res.render("index")
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})