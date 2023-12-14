const express = require("express");
const app = express();

require("dotenv").config();
require("./config/database").connect();

const { employee, admins } = require("./model/employee");

const auth = require("./middleware/adminauth");
const auth1 = require("./middleware/employeeauth");

const path = require("path");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const os = require('os');
const child_process = require('child_process');
const http = require("http");
const bcrypt = require('bcryptjs');
var cookieParser = require('cookie-parser')
app.use(cookieParser());

const server = http.createServer(app);
const io = require("socket.io")(server);

io.on("connection", (socket) => {
    socket.on("save", async (values) => {
        try {
            const olduser = await employee.findOne({ email: values.email });
            const oldempcode = await employee.findOne({ empcode: values.empcode });
            if (oldempcode) {
                socket.emit('savesuccess', 'Employee Id Already Taken');
            } else if (olduser) {
                socket.emit('savesuccess', 'Email Already Exist');
            } else {
                encryptedPassword = await bcrypt.hash(values.dob, 10);
                const employees = await employee.create({
                    empcode: values.empcode,
                    designation: values.designation,
                    doj: values.doj,
                    name: values.name,
                    dob: values.dob,
                    age: values.age,
                    experience: values.experience,
                    gender: values.gender,
                    proffid: values.proffid,
                    email: values.email,
                    contact: values.contact,
                    address: values.address,
                    month: values.month,
                    year: values.year,
                    bsal: values.bsal,
                    tdays: values.tdays,
                    absents: values.absents,
                    medical: values.medical,
                    pfund: values.pfund,
                    convence: values.convence,
                    netsalary: values.netsalary,
                    password: encryptedPassword
                })

                // console.log(values.template);
                const filepath = path.join(__dirname, "public", "Salary_Reciept", values.empcode);
                fs.writeFileSync(filepath, values.template);

                socket.emit('savesuccess', 'Records Saved Successfully');
            }
        } catch (error) {
            socket.emit('savesuccess', error.message);
        }
    })

    socket.on("search", async (empcode) => {
        const oldempcode = await employee.findOne({ empcode });
        if (oldempcode) {
            const searchedemployee = await employee.find({ empcode });
            const filepath = path.join(__dirname, "public", "Salary_Reciept", empcode);
            const template = fs.readFileSync(filepath, "utf8");
            if (searchedemployee.length > 0) {
                socket.emit("searchedemployee", searchedemployee, template);
            } else {
                socket.emit("emptysearch", "Employee Id does not Exist");
            }
        } else {
            socket.emit('savesuccess', 'Employee Id does not exist');
        }
    })

    socket.on("update", async (values) => {
        try {
            const olduser = await employee.findOne({ email: values.email });
            const oldempcode = await employee.findOne({ empcode: values.empcode });
            // console.log(!(!olduser))
            // console.log(!(!oldempcode))
            if (!oldempcode) {
                socket.emit('savesuccess', 'Employee Id does not exist');
            } else if (!olduser) {
                socket.emit('savesuccess', 'Email does not exist');
            } else {
                const employees = await employee.updateOne(
                    { empcode: values.empcode },
                    {
                        $set: {
                            designation: values.designation,
                            doj: values.doj,
                            name: values.name,
                            dob: values.dob,
                            age: values.age,
                            experience: values.experience,
                            gender: values.gender,
                            proffid: values.proffid,
                            email: values.email,
                            contact: values.contact,
                            address: values.address,
                            month: values.month,
                            year: values.year,
                            bsal: values.bsal,
                            tdays: values.tdays,
                            absents: values.absents,
                            medical: values.medical,
                            pfund: values.pfund,
                            convence: values.convence,
                            netsalary: values.netsalary
                        }
                    }
                )

                // console.log(values.template);
                const filepath = path.join(__dirname, "public", "Salary_Reciept", values.empcode);
                fs.writeFileSync(filepath, values.template);

                socket.emit('savesuccess', 'Records Updated Successfully');
            }
        } catch (error) {
            socket.emit('savesuccess', error.message);
        }
    })

    socket.on("delete", async (empcode) => {
        try {
            const oldempcode = await employee.findOne({ empcode });
            if (oldempcode) {
                const delete1 = await employee.deleteOne({ empcode });

                const filepath = path.join(__dirname, "public", "Salary_Reciept", empcode);
                fs.unlinkSync(filepath);

                if (delete1.deletedCount === 1) {
                    socket.emit("deletesuccess", "Employee deleted successfully");
                } else {
                    socket.emit("deletesuccess", "Employee could not be deleted");
                }
            } else {
                socket.emit("savesuccess", "Employee Id does not exist");
            }
        } catch (error) {
            socket.emit('savesuccess', error.message);
        }
    })
});

app.use(express.urlencoded({ extended: false }));
app.post("/register", async (req, res) => {
    //As we are dealing with database it may return an exception so use try catch block
    try {
        var { name, email, password, user } = req.body;
        const oldUser = await admins.findOne({ email });

        if (oldUser) {  //if user already exist in database we will send below message
            res.render("register", {
                success: "User Already Exist. Please Login"
            })
        } else {
            encryptedPassword = await bcrypt.hash(password, 10);
            const admin = await admins.create({
                name,
                email: email.toLowerCase(),
                password: encryptedPassword,
                user,
            });
            res.render("register", {
                success: "Successfully Registered"
            })
        }
    } catch (err) {
        res.render('admin-error', {
            error: err
        })
    }
    // Our register logic ends here
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await admins.findOne({ email });   //we are finding through email
        const user1 = await employee.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password)) || user1 && (await bcrypt.compare(password, user1.password))) {
            if (user) {
                const allemployee = await employee.find();
                res.cookie('email', user.email);

                const token = await jwt.sign(
                    { user_id: user._id, email: user.email },   //First we will provide a token for user
                    process.env.TOKEN_KEY,                      //This token will be stored in client side
                    {
                        expiresIn: "2h",
                    }
                );

                res.cookie('x-access-token', token, {   //To Store the Token on Browser we are using 
                    secure: true,                       //cookies
                    httpOnly: true,                     //Note first parameter is name of token
                    sameSite: 'lax'                     //Second is generated token
                });

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
            } else {
                const token = await jwt.sign(
                    { user_id: user1._id, email: user1.email },   //First we will provide a token for user
                    process.env.TOKEN_KEY1,                      //This token will be stored in client side
                    {
                        expiresIn: "2h",
                    }
                );

                res.cookie('x-access-token', token, {   //To Store the Token on Browser we are using 
                    secure: true,                       //cookies
                    httpOnly: true,                     //Note first parameter is name of token
                    sameSite: 'lax'                     //Second is generated token
                });


                res.cookie('empcode', user1.empcode)     //I have also stored User Databse ID in Browser This will 
                res.cookie('email', user1.email);
                const filepath = path.join(__dirname, "public", "Salary_Reciept", user1.empcode)
                const template = fs.readFileSync(filepath, "utf-8")
                res.render("employee", {
                    user1,
                    template
                })
            }
        }
        else {  //if user is not present in our database he will get below message 
            res.render("login", {
                success: "Invalid Credentials"
            })
        }

    } catch (err) {
        res.render('admin-error', {
            error: err
        })
    }
})

app.post("/logout", (req, res) => {
    try {
        res.clearCookie('x-access-token');
        res.clearCookie('empcode');
        res.clearCookie('email');
        res.redirect("/login")
    } catch (error) {
        res.render('admin-error', {
            error: err
        })
    }
})

app.post('/changepassword', auth1, async (req, res) => {
    try {
        const email = req.cookies.email;
        const password = req.body.password;
        encryptedPassword = await bcrypt.hash(password, 10);

        employee.updateOne({ email }, {
            $set: {
                password: encryptedPassword,
            }
        }).then((x) => {
            res.render('changepassword', {
                success: "Successfully Changed the password",
            })
        }).catch((err) => {
            console.log(err)
        })
    } catch (err) {
        res.render('admin-error', {
            error: err
        })
    }
});

app.post('/updateprofile', auth1, async (req, res) => {
    try {
        const { empcode, designation, email, dob, name, age, experience, gender, proffid, contact, address } = req.body;

        const Update = await employee.updateOne(
            { email },
            {
                $set: {
                    empcode: empcode,
                    designation: designation,
                    email: email,
                    dob: dob,
                    name: name,
                    age: age,
                    experience: experience,
                    gender: gender,
                    proffid: proffid,
                    contact: contact,
                    address: address
                }
            }
        )
        const data = await employee.findOne({ email });
        if (Update.nModified === Update.n) {
            res.render("updateprofile", {
                success: "Successfully Updated",
                data
            });
        } else {
            res.render("updateprofile", {
                success: "Update failed. No matching record found.",
                data
            });
        }
    } catch (err) {
        res.render('admin-error', {
            error: err
        })
    }
});

module.exports = {
    app, server
}