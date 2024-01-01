const http = require("http");
const app = require("./app");

const server = http.createServer(app);
const express = require("express");
const path = require("path")

const auth = require("./middleware/auth");
const auth1 = require("./middleware/auth1");
const auth2 = require("./middleware/auth2");

const { admins, student, teacher } = require("./model/user");

const exphbs = require('express-handlebars');

//Getting Port Number ioom .env file
const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

app.use(express.urlencoded({ extended: false }));

//Code to Run Home Page
const publicDir = path.join(__dirname, './public')
app.use(express.static(publicDir))
app.set('view engine', 'hbs')

const publicDir1 = path.join(__dirname, './public/3d Login Page/style1.css')
app.use(express.static(publicDir1))
app.get('/', (req, res) => {
    try {
        res.render("index");
    } catch (err) {
        res.render('admin-error', {
            error: err
        })
    }
});

//Code to Run Login Page on Click In Home Page
const login = path.join(__dirname, '/views')
app.use(express.static(login))
app.set('view engine', 'hbs')
app.get('/index.hbs', (req, res) => {
    try {
        res.render("index");
    } catch (err) {
        res.render('admin-error', {
            error: err
        })
    }
});

//Code to Register Admin Page
const admin1 = path.join(__dirname, './views')
app.set(express.static(admin1))
app.get('/admin', auth, async (req, res) => {
    try {
        var id = req.cookies.tid;
        const user = await admins.findById(id);   //we are finding through id
        var aname = user.first_name;
        var lname = user.last_name;
        af = req.cookies.userimg;
        var cadmin = await admins.find({ "status": "ACTIVE" }).count();
        var cteacher = await teacher.find({ "status": "ACTIVE" }).count();
        var cstudent = await student.find({ "status": "ACTIVE" }).count();
        var totalats = cadmin + cteacher + cstudent;
        res.render("admin", {
            imge: af,
            welcome: aname,
            lname: lname,
            cadmin: cadmin,
            cteacher: cteacher,
            cstudent: cstudent,
            totalats: totalats,
        });
    } catch (err) {
        res.render('admin-error', {
            error: err
        })
    }
});

//Code to Register Staff Page
const staff1 = path.join(__dirname, './views')
app.set(express.static(staff1))
app.get('/staff', auth1, async (req, res) => {
    try {
        var id = req.cookies.tid;
        const user = await teacher.findById(id);
        var aname = user.first_name;
        var lname = user.last_name;
        af = req.cookies.userimg;
        var cadmin = await admins.find({ "status": "ACTIVE" }).count();
        var cteacher = await teacher.find({ "status": "ACTIVE" }).count();
        var cstudent = await student.find({ "status": "ACTIVE" }).count();
        var totalats = cadmin + cteacher + cstudent;

        res.render("staff", {
            imge: af,
            welcome: aname,
            lname: lname,
            cadmin: cadmin,
            cteacher: cteacher,
            cstudent: cstudent,
            totalats: totalats,
        });
    } catch (err) {
        res.render('admin-error', {
            error: err
        })
    }
});

//Code to Register Student Page
const student1 = path.join(__dirname, './views')
app.set(express.static(student1))
app.get('/student', auth2, async (req, res) => {
    try {
        var id = req.cookies.tid;
        const user = await student.findById(id);
        var aname = user.first_name;
        var lname = user.last_name;
        af = req.cookies.userimg;
        var cadmin = await admins.find({ "status": "ACTIVE" }).count();
        var cteacher = await teacher.find({ "status": "ACTIVE" }).count();
        var cstudent = await student.find({ "status": "ACTIVE" }).count();
        var totalats = cadmin + cteacher + cstudent;
        res.render("student", {
            imge: af,
            welcome: aname,
            lname: lname,
            cadmin: cadmin,
            cteacher: cteacher,
            cstudent: cstudent,
            totalats: totalats,
        });
    } catch (err) {
        res.render('admin-error', {
            error: err
        })
    }
});

//Code to Register AddStudent Page
const addstudent = path.join(__dirname, './views')
app.use(express.static(addstudent))
app.get('/admin-addstudent', auth, (req, res) => {
    try {
        var af = req.cookies.userimg;
        var c = "j:null"
        if (af == c) {
            af = '';
        }
        res.render("admin-addstudent", {
            imge2: af,
        });
    } catch (err) {
        res.render('admin-error', {
            error: err
        })
    }
});

//Code to Register StudentList Page
const liststudent = path.join(__dirname, './views')
app.use(express.static(liststudent))
app.get('/admin-studentlist', auth, (req, res) => {
    try {
        var af = req.cookies.userimg;
        var c = "j:null"
        if (af == c) {
            af = '';
        }
        student.find((err, docs) => {
            if (!err) {
                res.render("admin-studentlist", {
                    list: docs,
                    imge6: af,
                });
            }
            else {
                //console.log('Error in retrieving students list :' + err);
                res.render('admin-error', {
                    error: err
                })
            }
        });
    } catch (err) {
        res.render('admin-error', {
            error: err
        })
    }
});

//Code to Register Add Admin Page
const addadmin = path.join(__dirname, './views')
app.use(express.static(addadmin))
app.get('/admin-addadmin', auth, (req, res) => {
    try {
        var af = req.cookies.userimg;
        var c = "j:null"
        if (af == c) {
            af = '';
        }
        res.render("admin-addadmin", {
            imge1: af,
        });
    } catch (err) {
        res.render('admin-error', {
            error: err
        })
    }
});

//Code to Register Bulk Adding
const BulkAdding = path.join(__dirname, './views')
app.use(express.static(BulkAdding))
app.get('/admin-bulkadding', auth, (req, res) => {
    try {
        var af = req.cookies.userimg;
        var c = "j:null"
        if (af == c) {
            af = '';
        }
        res.render("admin-bulkadding", {
            imge2: af,
        });
    } catch (err) {
        res.render('admin-error', {
            error: err
        })
    }
});

//Code to Register List Admin Page
const adminlist = path.join(__dirname, './views')
app.use(express.static(adminlist))
app.get('/admin-adminlist', auth, (req, res) => {
    try {
        var af = req.cookies.userimg;
        var c = "j:null"
        if (af == c) {
            af = '';
        }
        admins.find((err, docs) => {
            if (!err) {
                res.render("admin-adminlist", {
                    list: docs,
                    imge4: af,
                });
            }
            else {
                //console.log('Error in retrieving employee list :' + err);
                res.render('admin-error', {
                    error: err
                })
            }
        });
    } catch (err) {
        res.render('admin-error', {
            error: err
        })
    }
});

//Code to Register List Teacher Page
const teacherlist1 = path.join(__dirname, './views')
app.use(express.static(teacherlist1))
app.get('/admin-teacherlist', auth, (req, res) => {
    try {
        var af = req.cookies.userimg;
        var c = "j:null"
        if (af == c) {
            af = '';
        }
        teacher.find((err, docs) => {
            if (!err) {
                res.render("admin-teacherlist", {
                    list: docs,
                    imge7: af,
                });
            }
            else {
                //console.log('Error in retrieving teachers list :' + err);
                res.render('admin-error', {
                    error: err
                })
            }
        });
        //res.render("admin-teacherlist");
    } catch (err) {
        res.render('admin-error', {
            error: err
        })
    }
});

//Code to Register Add Teacher Page
const teacheradd = path.join(__dirname, './views')
app.use(express.static(teacheradd))
app.get('/admin-addteacher', auth, (req, res) => {
    try {
        var af = req.cookies.userimg;
        var c = "j:null"
        if (af == c) {
            af = '';
        }
        res.render("admin-addteacher", {
            imge3: af,
        });
    } catch (err) {
        res.render('admin-error', {
            error: err
        })
    }
});

//Code to MyProfile Admin Page
const adminprofile1 = path.join(__dirname, './views')
app.set(express.static(adminprofile1))
app.get('/admin-profile', auth, (req, res) => {
    try {
        var af = req.cookies.userimg;
        var c = "j:null"
        if (af == c) {
            af = '';
        }
        var a = req.cookies.tid;
        admins.findById(a, (err, docs) => {
            if (!err) {
                res.render("admin-profile", {
                    list: docs,
                    imge5: af,
                });
            }
            else {
                //console.log('Error  :' + err);
                res.render('admin-error', {
                    error: err
                })
            }
        });
    } catch (err) {
        res.render('admin-error', {
            error: err
        })
    }
});

//Code to MyProfile Staff Page
app.get('/staff-profile', auth1, (req, res) => {
    try {
        var af = req.cookies.userimg;
        var c = "j:null"
        if (af == c) {
            af = '';
        }
        var a = req.cookies.tid;
        teacher.findById(a, (err, docs) => {
            if (!err) {
                res.render("staff-profile", {
                    list: docs,
                    imge: af,
                });
            }
            else {
                //console.log('Error  :' + err);
                res.render('admin-error', {
                    error: err
                })
            }
        });
    } catch (err) {
        res.render('admin-error', {
            error: err
        })
    }
});

//Code to MyProfile Staff Page
app.get('/student-profile', auth2, (req, res) => {
    try {
        var af = req.cookies.userimg;
        var c = "j:null"
        if (af == c) {
            af = '';
        }
        var a = req.cookies.tid;
        student.findById(a, (err, docs) => {
            if (!err) {
                res.render("student-profile", {
                    list: docs,
                    imge: af,
                });
            }
            else {
                //console.log('Error  :' + err);
                res.render('admin-error', {
                    error: err
                })
            }
        });
    } catch (err) {
        res.render('admin-error', {
            error: err
        })
    }
});

//Code to Run forgot password  Page on Click In Login Page
const fogpss = path.join(__dirname, '/views')
app.use(express.static(fogpss))
app.set('view engine', 'hbs')
app.get('/forgotpassword', (req, res) => {
    try {
        res.render("forgotpassword");
    } catch (err) {
        res.render('admin-error', {
            error: err
        })
    }
});

//Code to Run Admin chat Page 
const chat = path.join(__dirname, '/views')
app.use(express.static(chat))
app.set('view engine', 'hbs')
app.get('/admin-chatapp', async (req, res) => {
    try {
        var af = req.cookies.userimg;
        var c = "j:null"
        if (af == c) {
            af = '';
        }
        var cadmin = await admins.find({ "status": "ACTIVE" }).count();
        var cteacher = await teacher.find({ "status": "ACTIVE" }).count();
        var cstudent = await student.find({ "status": "ACTIVE" }).count();
        res.render("admin-chatapp", {
            countadmin: cadmin,
            countteacher: cteacher,
            countstudent: cstudent,
            imge: af,
        });
    } catch (err) {
        res.render('admin-error', {
            error: err
        })
    }
});


//Code to Run Student chat Page 
const schat = path.join(__dirname, '/views')
app.use(express.static(schat))
app.set('view engine', 'hbs')
app.get('/student-chatapp', async (req, res) => {
    try {
        var af = req.cookies.userimg;
        var c = "j:null"
        if (af == c) {
            af = '';
        }
        var cadmin = await admins.find({ "status": "ACTIVE" }).count();
        var cteacher = await teacher.find({ "status": "ACTIVE" }).count();
        var cstudent = await student.find({ "status": "ACTIVE" }).count();
        res.render("student-chatapp", {
            countadmin: cadmin,
            countteacher: cteacher,
            countstudent: cstudent,
            imge: af,
        });
    } catch (err) {
        res.render('admin-error', {
            error: err
        })
    }
});

//Code to Run Staff chat Page 
const stchat = path.join(__dirname, '/views')
app.use(express.static(stchat))
app.set('view engine', 'hbs')
app.get('/staff-chatapp', async (req, res) => {
    try {
        var af = req.cookies.userimg;
        var c = "j:null"
        if (af == c) {
            af = '';
        }
        var cadmin = await admins.find({ "status": "ACTIVE" }).count();
        var cteacher = await teacher.find({ "status": "ACTIVE" }).count();
        var cstudent = await student.find({ "status": "ACTIVE" }).count();
        res.render("staff-chatapp", {
            countadmin: cadmin,
            countteacher: cteacher,
            countstudent: cstudent,
            imge: af,
        });
    } catch (err) {
        res.render('admin-error', {
            error: err
        })
    }
});



//Staff ADD and View Notes Code start
//Code to Register Staff NotesPage
const staffnotes = path.join(__dirname, './views')
app.set(express.static(staffnotes))
app.get('/staff-addnotes', auth1, async (req, res) => {
    try {
        var id = req.cookies.tid;
        af = req.cookies.userimg;

        res.render("staff-addnotes", {
            imge: af,
        });
    } catch (err) {
        res.render('admin-error', {
            error: err
        })
    }
});

//Code to View Staff NotesPage
const fs = require('fs');
const viewstaffnotes = path.join(__dirname, './views');
app.set('views', viewstaffnotes);

app.get('/staff-viewnotes', auth1, async (req, res) => {
    try {
        af = req.cookies.userimg;

        const email = req.cookies.zemail; // Get the email dynamically

        const semesters = ['Sem1', 'Sem2', 'Sem3', 'Sem4', 'Sem5', 'Sem6'];

        const semesterData = [];
        for (const semester of semesters) {
            const folderPath = path.join(__dirname, 'public', 'Notes', email, semester);
            const files = fs.existsSync(folderPath) ? fs.readdirSync(folderPath) : [];
            semesterData.push({ semester: semester, files: files });
        }

        res.render('staff-viewnotes', {
            imge: af,
            email: email,
            semesterData: semesterData,
        });
    } catch (err) {
        res.render('admin-error', {
            error: err
        })
    }
});
app.get('/download/:email/:semester/:filename', (req, res) => {
    try {
        const { email, semester, filename } = req.params;
        const filePath = path.join(__dirname, 'public', 'Notes', email, semester, filename);

        // Check if the file exists
        if (fs.existsSync(filePath)) {
            // Set the appropriate headers for the file download
            res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
            res.setHeader('Content-Type', 'application/octet-stream');

            // Stream the file to the response
            const fileStream = fs.createReadStream(filePath);
            fileStream.pipe(res);
        } else {
            // File not found
            res.status(404).send('File not found');
        }
    } catch (err) {
        res.render('admin-error', {
            error: err
        })
    }
});
const mime = require('mime-types');

app.get('/View/:email/:semester/:filename', (req, res) => {
    try {
        const { email, semester, filename } = req.params;
        const filePath = path.join(__dirname, 'public', 'Notes', email, semester, filename);

        if (fs.existsSync(filePath)) {
            const fileStream = fs.createReadStream(filePath);
            const contentType = mime.lookup(filePath) || 'application/octet-stream';

            res.setHeader('Content-Disposition', 'inline; filename=' + encodeURIComponent(filename));
            res.setHeader('Content-Type', contentType);

            fileStream.pipe(res);
        } else {
            res.status(404).send('File not found');
        }
    } catch (err) {
        res.render('admin-error', {
            error: err
        })
    }
});

app.get('/delete/:email/:semester/:filename', async (req, res) => {
    try {
        const { email, semester, filename } = req.params;
        const filePath = path.join(__dirname, 'public', 'Notes', email, semester, filename);

        if (fs.existsSync(filePath)) {
            try {
                fs.unlinkSync(filePath);
                res.redirect('/staff-viewnotes');
            } catch (err) {
                //console.log(err);
                //res.status(500).send('Internal Server Error');
                res.render('admin-error', {
                    error: err
                })
            }
        } else {
            res.redirect('/staff-viewnotes');
        }
    } catch (err) {
        res.render('admin-error', {
            error: err
        })
    }
});

const hbs = require('hbs');
hbs.registerHelper('inc', function (value) {
    return parseInt(value) + 1;
});
//Code to View Staff NotesPage  Ends here

//Code to View Student NotesPage  Starts here
const studentnotes = path.join(__dirname, './views')
app.set(express.static(studentnotes))
app.get('/student-viewnotes', auth2, async (req, res) => {
    try {
        var id = req.cookies.tid;
        af = req.cookies.userimg;
        var teachers = await teacher.find();
        const emails = teachers.map((teacher) => teacher.email);
        //console.log(emails);
        res.render("student-viewnotes", {
            imge: af,
            emails: emails,
        });
    } catch (err) {
        res.render('admin-error', {
            error: err
        })
    }
});

//Code to MyProfile Admin Page
const adminchangepassword = path.join(__dirname, './views')
app.set(express.static(adminchangepassword))
app.get('/admin-changepassword', auth, (req, res) => {
    try {
        var af = req.cookies.userimg;
        var c = "j:null"
        if (af == c) {
            af = '';
        }
        res.render("admin-changepassword", {
            imge5: af,
        });
    } catch (err) {
        res.render('admin-error', {
            error: err
        })
    }
});

const staffchangepassword = path.join(__dirname, './views')
app.set(express.static(staffchangepassword))
app.get('/staff-changepassword', auth1, (req, res) => {
    try {
        var af = req.cookies.userimg;
        var c = "j:null"
        if (af == c) {
            af = '';
        }
        res.render("staff-changepassword", {
            imge: af,
        });
    } catch (err) {
        res.render('admin-error', {
            error: err
        })
    }
});

const studentchangepassword = path.join(__dirname, './views')
app.set(express.static(studentchangepassword))
app.get('/student-changepassword', auth2, (req, res) => {
    try {
        var af = req.cookies.userimg;
        var c = "j:null"
        if (af == c) {
            af = '';
        }
        res.render("student-changepassword", {
            imge: af,
        });
    } catch (err) {
        res.render('admin-error', {
            error: err
        })
    }
});

//Feedback Logic Starts here
const Feedback = require("./model/feedbackSchema"); // Import the Feedback model

app.get('/student-feedback', async (req, res) => {
    try {
        var af = req.cookies.userimg;
        var c = "j:null"
        if (af == c) {
            af = '';
        }
        var teachers = await teacher.find();
        const emails = teachers.map((teacher) => teacher.email);
        res.render('student-feedback', {
            teachers: emails,
            imge: af,
        });
    } catch (err) {
        //console.error(error);
        //res.status(500).send('Error fetching teachers data.');
        res.render('admin-error', {
            error: err
        })
    }
});

app.post('/submit-feedback', async (req, res) => {
    try {
        const email = req.body.email;
        const userswhosubmittedfeedback = req.cookies.zemail;

        try {
            const existingFeedback1 = await Feedback.findOne({
                teacher: email,
                userswhosubmittedfeedback: { $elemMatch: { $eq: userswhosubmittedfeedback } },
            });
            if (existingFeedback1) {
                res.status(200).send('You have already submitted feedback for respective teacher');
            } else {
                // An array of arrays to store the options for each question
                const questionOptions = [
                    [req.body.Q1A, req.body.Q1B, req.body.Q1C, req.body.Q1D],
                    [req.body.Q2A, req.body.Q2B, req.body.Q2C, req.body.Q2D],
                    [req.body.Q3A, req.body.Q3B, req.body.Q3C, req.body.Q3D],
                    [req.body.Q4A, req.body.Q4B, req.body.Q4C, req.body.Q4D],
                    [req.body.Q5A, req.body.Q5B, req.body.Q5C, req.body.Q5D],
                ];
                //console.log(questionOptions);
                const existingFeedback = await Feedback.findOne({ teacher: email });
                if (!existingFeedback) {
                    await Feedback.create({
                        teacher: email,
                    });
                }
                Feedback.updateOne(
                    { teacher: email }, // Filter to find the specific document
                    { $push: { userswhosubmittedfeedback: userswhosubmittedfeedback } } // Update to add the email to the array
                )
                    .then(result => {
                        //console.log('Email added to userswhosubmittedfeedback array successfully');
                    })
                    .catch(error => {
                        //console.error('Error while adding email to userswhosubmittedfeedback array:', error);
                        res.render('admin-error', {
                            error: error
                        })
                    });
                for (let i = 0; i < questionOptions.length; i++) {
                    const options = questionOptions[i];
                    const answerIndex = options.findIndex(option => option === "A" || option === "B" || option === "C" || option === "D");
                    //console.log(answerIndex);
                    if (answerIndex !== -1) {
                        const answer = String.fromCharCode(65 + answerIndex); // Convert the index to A, B, C, or D
                        //console.log(answer);
                        await Feedback.findOneAndUpdate(
                            { teacher: email },
                            { $inc: { [`question${i + 1}.${answer}`]: 1 } },
                            { new: true }
                        );
                    }
                }

                res.status(200).send('Feedback submitted successfully.');
            }
        } catch (err) {
            //console.error('Error while checking user existence:', error);
            res.render('admin-error', {
                error: err
            })
        }
    } catch (err) {
        //console.error(error); // Log the error for debugging
        //res.status(500).send('Error while submitting feedback.');
        res.render('admin-error', {
            error: err
        })
    }
});
//Feedback logic ends Here

// Socket.io Setup
const io = require("socket.io")(server);
const connectedUsers = {};
const Messages = require("./model/messageModel");
const ChatGroup = require("./model/groupmessageModel");
const GpMessage = require("./model/chatmessages");

io.on("connection", (socket) => {
    socket.on("new-user-joined", (username) => {
        connectedUsers[username] = socket.id;
        var tid = username;
        //console.log(tid);
        admins.find((err, docs) => {
            if (!err) {
                socket.emit('user-list', docs);
            }
            else {
                console.log('Error  :' + err);               
            }
        });
        teacher.find((err, docs) => {
            //console.log(docs.first_name);
            if (!err) {
                socket.emit('user-list1', docs);
            }
            else {
                console.log('Error  :' + err);              
            }
        });
        student.find((err, docs) => {
            if (!err) {
                socket.emit('user-list2', docs);
            }
            else {
                //console.log('Error  :' + err);
                res.render('admin-error', {
                    error: err
                })
            }
        });
        ChatGroup.find((err, docs) => {
            if (!err) {
                socket.emit('group-list', docs);
            }
            else {
                console.log('Error  :' + err);              
            }
        });
    });

    socket.on('disconnect', () => {
        for (const [key, value] of Object.entries(connectedUsers)) {
            if (value === socket.id) {
                delete connectedUsers[key];
                break;
            }
        }
    });

    socket.on("clickedusername", async (buttonText11) => {
        var email = buttonText11.buttonText;
        const user = await admins.findOne({ email });   //we are finding through email
        const user1 = await teacher.findOne({ email });
        const user2 = await student.findOne({ email });
        var client = buttonText11.clientcookie;
        if (user) {
            var a = await admins.findOne({ email });
            var uname = a.first_name + " " + a.last_name;
            var uid = a._id;

            var un = {
                uname,
                uid,
                client,
                clickedimge: a.pagePhoto,
            }
            io.emit("uname", un);
        } else if (user1) {
            var a = await teacher.findOne({ email });
            var uname = a.first_name + " " + a.last_name;
            var uid = a._id;
            var un = {
                uname,
                uid,
                client,
                clickedimge: a.pagePhoto,
            }
            io.emit("uname", un);
        } else {
            var a = await student.findOne({ email });
            if (a) {
                var uname = a.first_name + " " + a.last_name;
                var uid = a._id;
                var un = {
                    uname,
                    uid,
                    client,
                    clickedimge: a.pagePhoto,
                }
                io.emit("uname", un);
            } else {
                // Handle the case when 'a' is null
                // For example, you can log an error or send an appropriate response.
            }

        }
    })

    socket.on('message', async (data) => {
        try {
            const receiverSocketId = connectedUsers[data.receiverid];

            var from = data.senderid;
            var to = data.receiverid;
            var message = data.msg;
            var senderemail = data.senderemail;

            const group = await ChatGroup.findOne({ groupname: to });
            if (group) {
                const groupName = group.groupname;

                const data2 = await GpMessage.create({
                    groupname: groupName,
                    message: { text: message },
                    sender: from,
                    senderemail: senderemail,
                })

                //console.log("Message sent by group");
                io.emit('gpmessage', { msg: data.msg, receiverid: data.receiverid, senderid: data.senderid, groupName, senderemail });
            }
            else {
                const data1 = await Messages.create({
                    message: { text: message },
                    users: [from, to],
                    sender: from,
                });
                //console.log(receiverSocketId);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit('message', { msg: data.msg, receiverid: data.receiverid, senderid: data.senderid });
                }
            }
        } catch (err) {
            console.log("Error " + err);
        }
    });

    socket.on('previousmessages', async (data) => {
        var from = data.senderid;
        var to = data.receiverid;

        const messages = await Messages.find({
            users: {
                $all: [from, to],
            },
        }).sort({ updatedAt: 1 });

        var projectedMessages = messages.map((msg) => {
            return {
                fromSelf: msg.sender.toString() === from,
                message: msg.message.text,
                ccookie: data.ccookie,
            };
        });

        io.emit("previousdata", projectedMessages);
        //console.log(projectedMessages);
    });

    socket.on('users', async (data) => {
        admins.find(async (err, adminDocs) => {
            if (!err) {
                var ausers = adminDocs.map(admin => admin.email);
                teacher.find(async (err, teacherDocs) => {
                    if (!err) {
                        var tusers = teacherDocs.map(teacher => teacher.email);
                        student.find(async (err, studentDocs) => {
                            if (!err) {
                                var susers = studentDocs.map(student => student.email);

                                // Combine the three arrays into a single variable
                                var allusers = [...susers, ...ausers, ...tusers];

                                if (data) {
                                    if (data.inputField) {
                                        try {
                                            var myCookie = data.ccookie;
                                            const result = await ChatGroup.findOne({ groupname: data.inputField });
                                            const usersArray = result.users;
                                            const data2 = {
                                                usersArray,
                                                data: data.inputField,
                                                allusers,
                                                myCookie
                                            }
                                            io.emit("allgroupusers", data2);

                                        } catch (error) {
                                            console.error(error);
                                            // Handle any errors that occur during the query
                                        }
                                    }
                                } else {
                                    io.emit("allusers", allusers);
                                }
                                //console.log(combinedUsers);
                            } else {
                                console.log('Error: ' + err);
                            }
                        });
                    } else {
                        console.log('Error: ' + err);
                    }
                });
            } else {
                console.log('Error: ' + err);
            }
        });
    });

    socket.on('createGroup', async (data) => {
        // console.log(data.users);
        // console.log(data.groupName);
        try {
            const existingGroup = await ChatGroup.findOne({ groupname: data.groupName });
            if (existingGroup) {
                var a = "Group Alreadt Exist Please try different name";
                var client = data.clientcookie;
                data2 = { a, client }
                io.emit("SuccessGroup", data2);
            } else {
                const data1 = await ChatGroup.create({
                    groupname: data.groupName,
                    users: data.users,
                });
                //console.log(data1);
                if (data1) {
                    var a = "Group Created successfully";
                    var client = data.clientcookie;

                    data2 = { a, client }
                    io.emit("SuccessGroup", data2);
                }
            }
        } catch (err) {
            var a = "Group Alreadt Exist Please try different name";
            var client = data.clientcookie;
            data2 = { a, client }
            io.emit("SuccessGroup", data2);
        }
    });

    socket.on('clickedgroupname', (groupbuttonText1) => {
        var client = groupbuttonText1.clientcookie;
        var groupbuttonText = groupbuttonText1.groupbuttonText;

        var data = { client, groupbuttonText };

        io.emit("clickedgrouptext", data);
    })

    socket.on('previousgroupmessages', async (data) => {
        var from = data.senderid;
        const messages = await GpMessage.find({
            groupname: data.groupbuttonText
        }).sort({ updatedAt: 1 });

        //console.log(messages);

        var projectedMessages = messages.map((msg) => {
            return {
                fromSelf: msg.sender && msg.sender.toString() === from ? msg.sender.toString() === from : false,
                message: msg.message.text,
                ccookie: data.ccookie,
                senderemail: msg.senderemail
            };
        });

        //console.log(projectedMessages)

        io.emit("previousgroupdata", projectedMessages);
        //console.log(projectedMessages);
    });

    socket.on('viewgroupmembers', async (data) => {
        // console.log(data);
        try {
            const result = await ChatGroup.findOne({ groupname: data });
            const usersArray = result.users;
            const data2 = {
                usersArray,
                data
            }
            socket.emit("viewgroupmembers", data2);

        } catch (error) {
            console.error(error);
            // Handle any errors that occur during the query
        }

    });

    socket.on('addmembers', async (data) => {
        var groupname = data.inputField;
        var selectedUsers = data.selectedUsers;
        // console.log(groupname);
        // console.log(selectedUsers);
        try {
            await ChatGroup.updateOne(
                { groupname: groupname },
                {
                    $push: {
                        users: { $each: selectedUsers }
                    }
                }
            );
            socket.emit('addmembersuccess');
        } catch (err) {
            console.log(err);
            socket.emit('addmembersuccess', (err));
        }
    });

    socket.on('groupmembers', async (data) => {
        //console.log(data);
        const group = await ChatGroup.findOne({ groupname: data });
        const users = group.users; // Get the users array from the found group

        socket.emit('groupmembers', (users));
    })

    socket.on('removemembers', async (data) => {
        var groupname = data.inputField;
        var selectedUsers = data.selectedUsers;
        // console.log(groupname);
        // console.log(selectedUsers);
        try {
            await ChatGroup.updateOne(
                { groupname: groupname },
                {
                    $pull: {
                        users: { $in: selectedUsers }
                    }
                }
            );

            socket.emit('removemembersuccess');
        } catch (err) {
            console.log(err);
            socket.emit('removemembersuccess', (err));
        }
    });

    socket.on('deletegroup', async (data) => {
        const result = await ChatGroup.deleteOne({ groupname: data })
            .then(async result => {
                //console.log(result); // Check the result here
                if (result.deletedCount > 0) {
                    //console.log("Deletion successful");
                    await GpMessage.deleteMany({ groupname: data })
                    socket.emit('deletegroupsuccess');
                }
            })
            .catch(error => {
                console.error(error);
            });
    })

    socket.on('exitgroup', async (data) => {
        try {
            // Remove the user from the "users" array
            await ChatGroup.updateOne(
                { groupname: data.inputField },
                { $pull: { users: data.myCookie } }
            );
            //console.log("exit Success")
            socket.emit('exitgroupsuccess');
        } catch (err) {
            console.log(err);
        }
    })

    //Below code is for Student Notes 
    socket.on('viewnotesstudents', (data) => {
        const email = data.email; // Get the email dynamically
        const sem = data.sem;

        const folderPath = path.join(__dirname, 'public', 'Notes', email, sem);
        const files = fs.existsSync(folderPath) ? fs.readdirSync(folderPath) : [];

        var data = { email, sem, files }
        socket.emit('viewnotesstudent', data);
    });

    socket.on('deleteFiles', async (email) => {
        const baseDir = path.join(__dirname, 'public', 'Notes', email);

        const semFolders = ['Sem1', 'Sem2', 'Sem3', 'Sem4', 'Sem5', 'Sem6'];

        try {
            for (const semFolder of semFolders) {
                const semPath = path.join(baseDir, semFolder);

                if (fs.existsSync(semPath)) {
                    const files = fs.readdirSync(semPath);

                    for (const file of files) {
                        const filePath = path.join(semPath, file);
                        await fs.promises.unlink(filePath);
                    }
                }
            }

            // Respond with success message to the individual client
            socket.emit('deletionSuccess', { message: 'Files have been deleted successfully.' });
        } catch (error) {
            // Handle any errors that occurred during the file deletion process
            console.error('Error deleting files:', error);
            socket.emit('deletionError', { message: 'An error occurred while deleting files.' });
        }
    });

    socket.on('getFeedbackResults', async (teacher) => {
        try {
            const feedback = await Feedback.findOne({ teacher });
            if (feedback) {
                // Calculate the percentages for each response
                const questions = ['Q1', 'Q2', 'Q3', 'Q4', 'Q5'];
                const questionResults = questions.map((question) => {
                    const totalResponses = feedback[`question${question.charAt(1)}`].A +
                        feedback[`question${question.charAt(1)}`].B +
                        feedback[`question${question.charAt(1)}`].C +
                        feedback[`question${question.charAt(1)}`].D;

                    return {
                        question,
                        A: (feedback[`question${question.charAt(1)}`].A / totalResponses) * 100,
                        B: (feedback[`question${question.charAt(1)}`].B / totalResponses) * 100,
                        C: (feedback[`question${question.charAt(1)}`].C / totalResponses) * 100,
                        D: (feedback[`question${question.charAt(1)}`].D / totalResponses) * 100,
                    };
                });

                // Send the feedback results to the client
                socket.emit('feedbackResults', questionResults, feedback.suggestion);
            } else {
                socket.emit('feedbackResults', null, null); // No feedback available
            }
        } catch (error) {
            console.error('Error while fetching feedback results:', error);
            socket.emit('feedbackResults', null, null); // Error occurred
        }
    });
});

// ... Remaining code ...
app.get('/admin-feedbackresult', async (req, res) => {
    try {
        var af = req.cookies.userimg;
        var c = "j:null"
        if (af == c) {
            af = '';
        }
        var teachers = await teacher.find();
        const emails = teachers.map((teacher) => teacher.email);
        res.render('admin-feedbackresult', {
            teachers: emails,
            imge: af,
        });
    } catch (error) {
        //console.error(error);
        //res.status(500).send('Error fetching teachers data.');
        res.render('admin-error', {
            error: err
        })
    }
});

//Code to Register Bulk Adding
const Error = path.join(__dirname, './views')
app.use(express.static(Error))
app.get('/admin-error', auth, (req, res) => {
    try {
        var af = req.cookies.userimg;
        var c = "j:null"
        if (af == c) {
            af = '';
        }
        res.render("admin-error", {
            imge2: af,
        });
    } catch (err) {
        res.render('admin-error', {
            error: err
        })
    }
});

// server listening
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
