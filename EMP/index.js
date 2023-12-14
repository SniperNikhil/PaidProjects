const express = require("express");
const { app, server } = require("./app.js");

const path = require("path");

const { employee, admins } = require("./model/employee");
const fs = require("fs");
const port = 4001;

var cookieParser = require('cookie-parser')
app.use(cookieParser());

const auth = require("./middleware/adminauth");
const auth1 = require("./middleware/employeeauth");

const home = path.join(__dirname, "/views")
app.use(express.static(home))
app.set('view engine', 'hbs')

const public = path.join(__dirname, './public')
app.use(express.static(public))

app.get("/", (req, res) => {
    try {
        res.render("register")
    } catch (error) {
        res.render('admin-error', {
            error: error
        })
    }
})
app.get("/login", (req, res) => {
    try {
        res.render("login")
    } catch (error) {
        res.render('admin-error', {
            error: error
        })
    }
})
app.get("/employee", auth1, async (req, res) => {
    try {
        email = req.cookies.email;
        const user1 = await employee.findOne({ email });
        const filepath = path.join(__dirname, "public", "Salary_Reciept", user1.empcode)
        const template = fs.readFileSync(filepath, "utf-8")
        res.render("employee", {
            user1,
            template
        })
    } catch (error) {
        res.render('admin-error', {
            error: error
        })
    }
})

app.get('/index', auth, async (req, res) => {
    try {
        const allemployee = await employee.find();
        res.render("index", {
            textarea: `
        Company Name, XYZ
        Address: XYZ, Floor4       
-----------------------------------
Employee ID     :   
Salary Of       :   Mon-YYYY
Generated On    :   DD-MM-YYYY
Generated Time  :   ------
-----------------------------------
Todays Days     :   DD
Total Present   :   DD
Total Absents   :   DD
Convence        :   Rs.----
Medical         :   Rs.----
PF              :   Rs.----
Gross Payment   :   Rs.-------
Net Salary      :   Rs.-------
-----------------------------------
This is a computer-generated slip, 
not required any signature       
        `,
            allemployee
        });
    } catch (error) {
        res.render('admin-error', {
            error: error
        })
    }
})

app.get("/changepassword", auth1, (req, res) => {
    try {
        res.render("changepassword")
    } catch (error) {
        res.render('admin-error', {
            error: error
        })
    }
})

app.get("/updateprofile", auth1, async (req, res) => {
    try {
        const email = req.cookies.email;
        const data = await employee.findOne({ email });
        res.render("updateprofile", {
            data
        })
    } catch (error) {
        res.render('admin-error', {
            error: error
        })
    }
})

app.get('/admin-error', (req, res) => {
    try {
        res.render("admin-error");
    } catch (err) {
        res.render('admin-error', {
            error: err
        })
    }
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
