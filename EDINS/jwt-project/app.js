//Note: if you are adding cookie as reponse to browser than see that the   
//first letter  of cookie must be greater than "t" i.e u
//if no it will completly change the logic of chat application which will 
//lead to untraceble errors

/*This is our Main file where we are creating API's */

//This Package Loads environment variables from .env file
require("dotenv").config();

//Here we are importing database connectivity file
require("./config/database").connect();

//fs module will help us to perform operations on file
const fs = require('fs');
var filePath = './public/backend/images';   //In this Path We will be Storing all images uploaded

//This package we are going to use to encrypt our password
const bcrypt = require('bcrypt');

//This Package is used to make our website dynamic
const express = require("express");

//We will be making use of this package to generate tokens
var jwt = require('jsonwebtoken');

//We Have imported our 3 Authentication File
const auth = require("./middleware/auth");  //Admin Authentication
const auth1 = require("./middleware/auth1"); //Teacher Authentication
const auth2 = require("./middleware/auth2"); //Student Authentication

//This Package will help us to add files or images to our database
let multer = require('multer');

//We are making use of cookies to store some of data in Browser
var cookieParser = require('cookie-parser')

//We have Imported our Schema Files using these objects 
//we will be accessing data from database
const { admins, student, teacher } = require("./model/user");

//This Package will help us to Know the path of our Directory
const path = require("path");

//const { Console } = require("console");

//We have imported mongoose package to handle database related query
const { model } = require("mongoose");

var methodOverride = require('method-override');

//this package is used to send the email for forgot password  
const nodemailer = require("nodemailer");


//We have to create an object for express module
//Now we will be making use of this obj through out the file 
const app = express();

//This helps to parse values from frontend to backend
//Note if we dont Write this there will be no data transfer from frontend to backend or viceversa
app.use(express.urlencoded({ extended: false }));

//As we imported cookie-parser we must write below statement to make use of it
app.use(cookieParser());
app.use(methodOverride('X-HTTP-Method-Override'));

//This is Storage Setting for Images of admins student or teachers
let storage = multer.diskStorage({              //Now whenever we add image,
    destination: 'public/backend/images/',      //It will get stored in public/backend/images/ path
    filename: (req, file, cb) => {              //This code will give the name for our image file
        cb(null, file.originalname)             //I have stored image in its original name 
    }                                           //i.e name defined by user
})

let upload = multer({       //Here we are uploading our image
    //A StorageEngine responsible for processing files uploaded via Multer
    storage: storage,       //We have passed Storage Setting previous created line no 53-58

    //Here we are validating our uploaded file
    fileFilter: (req, file, cb) => {
        if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/jpg' || file.mimetype == 'image/png' || file.mimetype == 'image/jfif' || file.mimetype == 'image/avif') {
            cb(null, true)      //if the file is of type jpeg jpg png etc the code will work fine
        }
        else {
            cb(null, false)     //if user enters any other file except mentioned above he will get error message 
            return cb(new Error('The type of file selected by you is not supported'))
        }
    }
})

//Here we are creating our register API 
//Now when user try to register it will pass the route here
//we are making use of post method
//Note that the given credentials should match with the form details method(post) and action(/register)
//Only Admins Can Register
app.post("/register", async (req, res) => {
    //As we are dealing with database it may return an exception so use try catch block
    try {
        if (req.body.licence_key) {
            // Get user input, note that the name given should match with the /register form also keep same sequence
            var { first_name, licence_key, email, password } = req.body;
            //if user has licence key he can register as admin
            if (licence_key == '1234') {            //checking licence key
                // check if user already exist
                // Validate if user exist in our database
                const oldUser = await admins.findOne({ email });

                if (oldUser) {  //if user already exist in database we will send below message
                    //return res.status(409).send("User Already Exist. Please Login");
                    res.render('index', {
                        success: "User Already Exist. Please Login"
                    })
                }
                //if the user is verified we will process further
                //Encrypt user password using bcrypt
                encryptedPassword = await bcrypt.hash(password, 10);

                // Create user in our database in admins Collection
                const admin = await admins.create({
                    first_name,                     //Here we will be creating new admin in our database
                    last_name: "null",              // using .create method
                    dob: "null",                    // admins here is name of database collection
                    email: email.toLowerCase(),     //And also our declared Schema which we have imported
                    password: encryptedPassword,    //above
                    phone: "null",
                    pagePhoto: "",
                    address: "null",
                    city: "null",
                    zipcode: "null",
                    collegename: "null"
                });

                // Generate a token when user register
                const token = await jwt.sign(
                    { admin_id: admins._id, email },
                    process.env.TOKEN_KEY,
                    {
                        expiresIn: "2h", //The token will expire in 2hours
                    }
                );
                // save user token in database
                admin.token = token;

                //After user Succesfully registers he will get below message
                //res.status(400).send("Successfully Registered");
                res.render('index', {
                    success: "Successfully Registered as admin"
                })
            }
            else {  //if user enters wrong licence key he will get below message
                //res.status(400).send("Wrong Licence Key,You are not allowed to register");
                res.render('index', {
                    success: "Wrong Licence Key,You are not allowed to register"
                })
            }
        } else {
            var { first_name, email, password } = req.body;
            const oldUser = await student.findOne({ email });

            if (oldUser) {  //if user already exist in database we will send below message
                //return res.status(409).send("User Already Exist. Please Login");
                res.render('index', {
                    success: "User Already Exist. Please Login"
                })
            }

            //if the user is verified we will process further
            //Encrypt user password using bcrypt
            encryptedPassword = await bcrypt.hash(password, 10);

            // Create user in our database in admins Collection
            const students = await student.create({
                studentid: "",                     //Here we will be creating new admin in our database
                first_name: first_name,              // using .create method
                last_name: "null",
                gender: "null",
                dob: "null",
                sem: "null",                   // admins here is name of database collection
                email: email.toLowerCase(),     //And also our declared Schema which we have imported
                password: encryptedPassword,    //above
                phone: "null",
                pagePhoto: "",
                address: "null",
                city: "null",
                zipcode: "null"
            });

            // Generate a token when user register
            const token = await jwt.sign(
                { student_id: student._id, email },
                process.env.TOKEN_KEY2,
                {
                    expiresIn: "2h", //The token will expire in 2hours
                }
            );
            // save user token in database
            students.token = token;

            //After user Succesfully registers he will get below message
            //res.status(400).send("Successfully Registered");
            res.render('index', {
                success: "Successfully Registered as student"
            })
        }
    } catch (err) {
        //console.log(err); //if any exception occurs it will print here    
        res.render('admin-error', {
            error: err
        }) 
    }
    // Our register logic ends here
});

//Here we are creating our Login API 
//Now when user try to login it will pass the route here
//we are making use of post method
//Only Users present in database can login
//Our logic will auto detect the user(admin student staff) and will render to that page
app.post("/login", async (req, res) => {
    try {
        //Get the input from User using req.body
        //I have taking inputs in single line
        const { email, password } = req.body;

        //Now first we will find weather the entered user is present in anyone
        //Of our database Collection(admins,teacher,student) 
        const user = await admins.findOne({ email });   //we are finding through email
        const user1 = await teacher.findOne({ email });
        const user2 = await student.findOne({ email });
        //if user is found in anyone of collection the other two will be null
        //ex: if user found in admins(user) ,then other two teacher(user1) staff(user2) will get value null

        //In this we are checking user entered details are matching with values present in database
        //We are Comparing email and password (BY using AND operator) entered by user with our database 
        //Also to check weather user,user1,user2 we have used OR operator
        if (user && (await bcrypt.compare(password, user.password)) || user1 && (await bcrypt.compare(password, user1.password)) || user2 && (await bcrypt.compare(password, user2.password))) {
            //Checking wheather Admin Student or Staff
            if (user) {         //if user is admin this block will execute
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
                });                                     //Third is Properties of cookie

                res.cookie('tid', user._id)     //I have also stored User Databse ID in Browser This will 
                res.cookie('zemail', user.email);
                //This will Help us while creating user profile page ,through
                //this i will get to known which user is logined, according to that i can provide his details

                af = user.pagePhoto; //I am getting image name from database 
                res.cookie('userimg', af, {         //Storing this Image name in Browser
                    secure: true,                   //This will help us to display the users image in sidebar
                    httpOnly: true,     //Here i will understand which user had logined according to that i will 
                    sameSite: 'lax'     //display the image in sidebar
                })

                //In the below code we are counting total number of admins,student and staff using query
                var cadmin = await admins.find({ "status": "ACTIVE" }).count();
                var cteacher = await teacher.find({ "status": "ACTIVE" }).count();
                var cstudent = await student.find({ "status": "ACTIVE" }).count();
                var totalats = cadmin + cteacher + cstudent;  //Total number of users

                //Below code we are fetching firstname and lastname that we will be displaying 
                //in our main admin Dashboard
                var aname = user.first_name;
                var lname = user.last_name;

                res.render('admin', {   //After all above formalities we will pass user to admin page
                    imge: af,           //This is Sidebar Image,note that i have send value of image to interface 
                    welcome: aname,     //This is FirstName displayed in admin Dashboard after Welcome 
                    lname: lname,        //This is LastName displayed in admin Dashboard after FirstName
                    cadmin: cadmin,     //Displaying Total number of admins in database on admin Dashboard
                    cteacher: cteacher, //Displaying Total number of teachers in database on admin Dashboard
                    cstudent: cstudent, //Displaying Total number of students in database on admin Dashboard
                    totalats: totalats,  //This is Sum of all total users present in databse displayed on admin Dashboard
                })
                //Note Values are always passed to interface in second parameter of render() method
            }
            else if (user1) {   //if user is Teacher this block will execute
                const token = await jwt.sign(
                    { user_id: user1._id, email: user1.email },     //First we will provide a token for user
                    process.env.TOKEN_KEY1,                         //This token will be stored in client side
                    {
                        expiresIn: "2h",
                    }
                );                                      //Here Also we Have same formality as discussed as discussed for admin user
                // save user token in database          
                user1.token = token;

                res.cookie('x-access-token', token, {
                    secure: true,
                    httpOnly: true,
                    sameSite: 'lax'
                });

                res.cookie('tid', user1._id)
                res.cookie('zemail', user1.email);
                af = user1.pagePhoto;

                res.cookie('userimg', af, {
                    secure: true,
                    httpOnly: true,
                    sameSite: 'lax'
                })

                //In the below code we are counting total number of admins,student and staff using query
                var cadmin = await admins.find({ "status": "ACTIVE" }).count();
                var cteacher = await teacher.find({ "status": "ACTIVE" }).count();
                var cstudent = await student.find({ "status": "ACTIVE" }).count();
                var totalats = cadmin + cteacher + cstudent;  //Total number of users

                var aname = user1.first_name;
                var lname = user1.last_name;
                res.render('staff', {
                    imge: af,
                    welcome: aname,
                    lname: lname,
                    cadmin: cadmin,     //Displaying Total number of admins in database on admin Dashboard
                    cteacher: cteacher, //Displaying Total number of teachers in database on admin Dashboard
                    cstudent: cstudent, //Displaying Total number of students in database on admin Dashboard
                    totalats: totalats,  //This is Sum of all total users present in databse displayed on admin Dashboard
                })
            }
            else {      //if user is Student this block will execute
                const token = await jwt.sign(
                    { user_id: user2._id, email: user2.email },
                    process.env.TOKEN_KEY2,
                    {
                        expiresIn: "2h",            //Here Also we Have same formality as discussed for admin user
                    }
                );

                user2.token = token;

                res.cookie('x-access-token', token, {
                    secure: true,
                    httpOnly: true,
                    sameSite: 'lax'
                });

                res.cookie('tid', user2._id)
                res.cookie('zemail', user2.email);
                af = user2.pagePhoto;

                res.cookie('userimg', af, {
                    secure: true,
                    httpOnly: true,
                    sameSite: 'lax'
                })

                //In the below code we are counting total number of admins,student and staff using query
                var cadmin = await admins.find({ "status": "ACTIVE" }).count();
                var cteacher = await teacher.find({ "status": "ACTIVE" }).count();
                var cstudent = await student.find({ "status": "ACTIVE" }).count();
                var totalats = cadmin + cteacher + cstudent;  //Total number of users

                var aname = user2.first_name;
                var lname = user2.last_name;

                res.render('student', {
                    imge: af,
                    welcome: aname,
                    lname: lname,
                    cadmin: cadmin,     //Displaying Total number of admins in database on admin Dashboard
                    cteacher: cteacher, //Displaying Total number of teachers in database on admin Dashboard
                    cstudent: cstudent, //Displaying Total number of students in database on admin Dashboard
                    totalats: totalats,  //This is Sum of all total users present in databse displayed on admin Dashboard
                })
            }
        }
        else {  //if user is not present in our database he will get below message 
            //res.status(400).send("Invalid Credentials");
            res.render('index', {
                success: "Invalid Credentials"
            })
        }
    } catch (err) {     //If any Error occurs while login we will print here
        //console.log(err);
        res.render('admin-error', {
            error: err
        })
    }
});     //Note That Different tokens are generated for Different user, this is to secure our System 


//Here we are creating our add-admin API 
//When User submit from add-admin page it will pass values here
//Note that the action in form should be /add-admin or it will not give an error but it will be difficult to trace
//First Parameter is our Action Route
//Second we are uploading the image in public\backend\images
//(if you dont write this the image will not be stored)
//3rd Parameter is req and res to make transactions between Interface and API
app.post("/add-admin", upload.single('page_Photo'), async (req, res) => {
    try {
        //Below code is for sidebar image
        var af = req.cookies.userimg;   //getting value of cookie stored on web browser
        var c = "j:null"        //if there is no image it will return j:null
        if (af == c) {          //we are converting it into empty value so that default
            af = '';            //?(Question Mark) image will appear in sidebar
        }
        email = req.body.email; //we are getting the email
        const oldUser = await admins.findOne({ email });    //We are Checking if the user already
        if (oldUser) {                                  //exist in our databse
            res.render('admin-addadmin', {
                success: "User Already Exist",
                imge1: af       //if already present He will get this message
            })  //We have passed this(success) value to admin-addadmin page
        }
        else {  //if user dont exist we will create a user
            var admin = new admins();   //we created common object so that at a time we can pass values
            admin.first_name = req.body.first_name;        //First we get all value entered by user using req.body
            admin.last_name = req.body.last_name;
            admin.email = req.body.email;
            admin.password = await bcrypt.hash(req.body.password, 10);
            admin.dob = req.body.dob;
            admin.phone = req.body.phone;
            //admin.pagePhoto =req.file.filename;
            try {
                if (req.file.filename == undefined) {       //if the image is not submited by user it will return an exception
                    admin.pagePhoto = req.body.filename;    //so to handle this use try catch
                } else {                                    //if user sends an image we store that image
                    admin.pagePhoto = req.file.filename;    //else we will pass the empty value to database
                }                                           //req.body.filename will pass empty value
                //req.file.filename will pass the file name to database
            }
            catch {
                //console.log('Handled File Exception')   //We handled an exception
            }

            admin.address = req.body.address;
            admin.city = req.body.city;
            admin.zipcode = req.body.zipcode;
            await admin.save((err, doc) => {            //using .save() we can add new user to database
                if (!err)                               //in doc we are passing the above values
                    res.render('admin-addadmin', {      //it will auto get it because we have used common object admin
                        success: "Successfully Inserted",
                        imge1: af   // if there is no error we will pass this value to 
                    })                                      //admin-addadmin page
                else {
                    //console.log('Error during record insertion:' + err);
                    res.render('admin-error', {
                        error: err
                    })
                }   //If any error occurs while saving we will print here
            });
        }
    } catch (err) {
        //console.log(err);   //if any exception occurs in try Block we will println here
        res.render('admin-error', {
            error: err
        })
    }
});

//Here we are creating our add-student API 
//When User submit from add-student page it will pass values here
//Note that the action in form should be /add-student or it will not give an error but it will be difficult to trace
//First Parameter is our Action Route
//Second we are uploading the image in public\backend\images
//(if you dont write this the image will not be stored)
//3rd Parameter is req and res to make transactions between Interface and API
app.post("/add-student", upload.single('page_Photo'), async (req, res) => {
    try {
        //Below code is for sidebar image
        var af = req.cookies.userimg;   //getting value of cookie stored on web browser
        var c = "j:null"        //if there is no image it will return j:null
        if (af == c) {          //we are converting it into empty value so that default
            af = '';            //?(Question Mark) image will appear in sidebar
        }
        email = req.body.email; //we are getting the email from interface
        const oldUser = await student.findOne({ email }); //We are Checking if the user already
        if (oldUser) {                                    //exist in our databse
            res.render('admin-addstudent', {
                success: "User Already Exist",  //if already present He will get this message
                imge2: af
            })      //We have passed this(success) value to admin-addstudent page

        }
        else {      //if user dont exist we will create a user
            var stud = new student();   //we created common object so that, at a time we can pass values
            stud.studentid = req.body.studentid;    //First we get all value entered by user using req.body
            stud.first_name = req.body.first_name;
            stud.last_name = req.body.last_name;
            stud.gender = req.body.gender;
            stud.dob = req.body.dob;
            stud.sem = req.body.sem;
            stud.email = req.body.email;
            stud.password = await bcrypt.hash(req.body.password, 10);
            stud.phone = req.body.phone;
            try {
                if (req.file.filename == undefined) {   //if the image is not submited by user it will return an exception
                    stud.pagePhoto = req.body.filename; //so to handle this use try catch
                } else {                                //if user sends an image we store that image
                    stud.pagePhoto = req.file.filename; //else we will pass the empty value to database
                }                                        //req.body.filename will pass empty value
            }    //req.file.filename will pass the file name to database
            catch {
                //console.log('Handled File Exception')   //We handled an exception
            }
            stud.address = req.body.address;
            stud.city = req.body.city;
            stud.zipcode = req.body.zipcode;
            await stud.save((err, doc) => {             //using .save() we can add new user to database
                if (!err)                               //in doc we are passing the above values
                    res.render('admin-addstudent', {    //it will auto get it because we have used common object stud
                        success: "Successfully Inserted",    // if there is no error we will pass this value to 
                        imge2: af
                    })                                     //admin-addstudent page 
                else {
                    //console.log('Error during record insertion:' + err);
                    res.render('admin-error', {
                        error: err
                    })
                }   //If any error occurs while saving we will print here
            });
        }
    } catch (err) {
        //console.log(err);    //if any exception occurs in try Block we will println here
        res.render('admin-error', {
            error: err
        })
    }
});

//Here we are creating our add-teacher API 
//When User submit from add-teacher page it will pass values here
//Note that the action in form should be /add-teacher or it will not give an error but it will be difficult to trace
//First Parameter is our Action Route
//Second we are uploading the image in public\backend\images
//(if you dont write this the image will not be stored)
//3rd Parameter is req and res to make transactions between Interface and API
app.post("/add-teacher", upload.single('page_Photo'), async (req, res) => {
    try {
        //Below code is for sidebar image
        var af = req.cookies.userimg; //getting value of cookie stored on web browser
        var c = "j:null";       //if there is no image it will return j:null 
        if (af == c) {          //we are converting it into empty value so that default
            af = '';            //?(Question Mark) image will appear in sidebar
        }
        email = req.body.email; //we are getting the email from interface
        const oldUser = await teacher.findOne({ email });   //We are Checking if the user already
        if (oldUser) {                                      //exist in our databse
            res.render('admin-addteacher', {
                success: "User Already Exist",      //if already present He will get this message
                imge3: af
            })      //We have passed this(success) value to admin-addteacher page
        }
        else {      //if user dont exist we will create a user
            var tech = new teacher();   //we created common object so that, at a time we can pass values
            tech.first_name = req.body.first_name;  //First we get all value entered by user using req.body
            tech.last_name = req.body.last_name;
            tech.gender = req.body.gender;
            tech.dob = req.body.dob;
            tech.email = req.body.email;
            tech.password = await bcrypt.hash(req.body.password, 10);
            tech.phone = req.body.phone;
            try {
                if (req.file.filename == undefined) {   //if the image is not submited by user it will return an exception
                    tech.pagePhoto = req.body.filename; //so to handle this use try catch
                } else {                                 //if user sends an image we store that image
                    tech.pagePhoto = req.file.filename; //else we will pass the empty value to database
                }                                       //req.body.filename will pass empty value
            }   //req.file.filename will pass the file name to database
            catch {
                //console.log('Handled File Exception')   //We handled an exception
            }
            tech.address = req.body.address;
            tech.city = req.body.city;
            tech.zipcode = req.body.zipcode;
            await tech.save((err, doc) => {             //using .save() we can add new user to database
                if (!err)                               //in doc we are passing the above values
                {
                    const staffnotes = path.join(__dirname, `./public/Notes/${email}`)
                    fs.mkdir(staffnotes, { recursive: true }, (err) => {
                        if (err) {
                            //console.error('Failed to create folder:', err);
                            res.render('admin-error', {
                                error: err
                            })
                            return;
                        } else {
                            //console.log('Folder created successfully');
                            const parentFolderPath = path.join(__dirname, 'public', 'Notes', `${email}`);
                            const folderNames = ['Sem1', 'Sem2', 'Sem3', 'Sem4', 'Sem5', 'Sem6'];

                            folderNames.forEach((folderName) => {
                                const folderPath = path.join(parentFolderPath, folderName);

                                fs.mkdir(folderPath, { recursive: true }, (err) => {
                                    if (err) {
                                        //console.error(`Failed to create folder "${folderName}":`, err);
                                        res.render('admin-error', {
                                            error: err
                                        })
                                    } else {
                                        //console.log(`Folder "${folderName}" created successfully`);
                                    }
                                });
                            });
                        }
                    });
                    res.render('admin-addteacher', {    //it will auto get it because we have used common object tech
                        success: "Successfully Inserted",  // if there is no error we will pass this value to
                        imge3: af
                    })                                   //admin-addteacher page 
                } else {
                    //console.log('Error during record insertion:' + err);
                    res.render('admin-error', {
                        error: err
                    })
                }   //If any error occurs while saving we will print here
            });
        }
    } catch (err) {
        //console.log(err);   //if any exception occurs in try Block we will println here
        res.render('admin-error', {
            error: err
        })
    }
});

//Here we are creating our Delete API 
//when admin clicks on delete button from adminlist, student list or teacherlist
//it will pass the values here
const Messages = require("./model/messageModel");
const ChatGroup = require("./model/groupmessageModel");
app.post("/delete", auth, async (req, res) => {
    try {
        //Below code is for sidebar image
        var af4 = req.cookies.userimg;  //getting value of cookie stored on web browser
        var c = "j:null"        //if there is no image it will return j:null 
        if (af4 == c) {         //we are converting it into empty value so that default
            af4 = '';           //?(Question Mark) image will appear in sidebar
        }
        const dead = req.body.adminid;
        const email = req.body.email;
        const user = await admins.findOne({ email });       //Using email we are finding in which collection does the
        const user1 = await teacher.findOne({ email });     //email exist
        const user2 = await student.findOne({ email });
        //if user is found in anyone of collection the other two will be null
        //ex: if user found in admins(user) ,then other two teacher(user1) staff(user2) will get value null
        function deletemessages(dead) {
            Messages.deleteMany({
                $or: [
                    { users: dead },
                    { users: dead }
                ]
            }, function (err, result) {
                if (err) {
                    //console.log(err);
                    res.render('admin-error', {
                        error: err
                    })
                    // handle the error
                } else {
                    //console.log(result);
                    // handle the result
                }
            });
        }
        function deletegroupusers(email) {
            //console.log("Working");

            ChatGroup.updateMany(
                { users: { $in: [email] } },
                { $pull: { users: email } },
                function (err, result) {
                    if (err) {
                        //console.log('An error occurred:', err);
                        res.render('admin-error', {
                            error: err
                        })
                        // Handle the error
                    } else {
                        //console.log('Update result:', result);
                        // Handle the result
                    }
                }
            );
        }
        const fs = require('fs-extra');
        function deleteFolderRecursive(path) {
            if (fs.existsSync(path)) {
                fs.readdirSync(path).forEach((file) => {
                    const curPath = path + '/' + file;
                    if (fs.lstatSync(curPath).isDirectory()) {
                        // Recursive call if the current item is a directory
                        deleteFolderRecursive(curPath);
                    } else {
                        // Delete the file
                        fs.unlinkSync(curPath);
                    }
                });

                // Delete the directory and its contents
                fs.removeSync(path);
                //console.log(`Folder ${path} has been deleted.`);
            } else {
                //console.log(`Folder ${path} does not exist.`);
                res.render('admin-error', {
                    error: `Folder ${path} does not exist.`
                })
            }
        }
        if (user) {     //if the email entered is an admin it will enter this block

            var af = user.pagePhoto;        //here we are storing admin image name retrived from admin collection
            if (af != '') {     //Checking weather user have an image in databse or no
                fs.unlinkSync(`${filePath}/${af}`);     //if user have image in database we will delete it from  
            }                                           //backend folder so that after deleting user his image stored also get deleted

            const dead = req.body.adminid;

            deletemessages(dead);
            deletegroupusers(email);

            admins.findByIdAndRemove(dead, async (err, doc) => {    //This Query will find user id in
                if (!err) {                                         //admin collection and delete his all data
                    res.render("admin-adminlist", {
                        success: "Successfully Deleted",       //if no error occured while deleting the user 
                        imge4: af4                             //we will display Successfully Deleted msg
                    })
                } else {
                    res.render('admin-adminlist', {          //if some error occured while deleting 
                        success: "Error Occured",           //we will display Error Occured and then user can 
                        imge4: af4                          //retry 
                    });                             //Rarely Some errors will Occur
                    //console.log(err)
                }

            })
        } else if (user1) {      //if the email entered is an Teacher it will enter this block

            var af = user1.pagePhoto;    //here we are storing teacher image name retrived from teacher collection
            if (af != '') {         //Checking weather user1 have an image in database or no
                fs.unlinkSync(`${filePath}/${af}`);     //if user have image in database we will delete it from  
            }                                           //backend folder so that after deleting user his image stored also get deleted
            deletemessages(dead);
            deletegroupusers(email);

            const filePathnotes = path.join(__dirname, 'public', 'Notes', email);
            deleteFolderRecursive(filePathnotes);
            teacher.findByIdAndRemove(dead, async (err, doc) => {   //This Query will find user id in
                if (!err) {                                     //teacher collection and delete his all data
                    res.render("admin-teacherlist", {
                        success: "Successfully Deleted",        //if no error occured while deleting the user 
                        imge7: af4                              //we will display Successfully Deleted msg
                    })
                } else {
                    res.render('admin-teacherlist', {        //if some error occured while deleting 
                        success: "Error Occured",           //we will display Error Occured and then user can 
                        imge7: af4                          //retry
                    })                          //Rarely Some errors will Occur
                }
            })
        } else {        //if the email entered is an Student it will enter this block
            var af = user2.pagePhoto;   //here we are storing Student image name retrived from Student collection
            if (af != '') {         //Checking weather user2 have an image in database or no
                fs.unlinkSync(`${filePath}/${af}`);     //if user have image in database we will delete it from  
            }                                           //backend folder so that after deleting user his image stored also get deleted
            deletemessages(dead);
            deletegroupusers(email);
            student.findByIdAndRemove(dead, async (err, doc) => {   //This Query will find user id in
                if (!err) {                                     //Student collection and delete his all data
                    res.render("admin-studentlist", {
                        success: "Successfully Deleted",    //if no error occured while deleting the user 
                        imge6: af4                          //we will display Successfully Deleted msg
                    })
                } else {
                    res.render('admin-studentlist', {      //if some error occured while deleting 
                        success: "Error Occured",       //we will display Error Occured and then user can 
                        imge6: af4                      //retry
                    })                          //Rarely Some errors will Occur
                }
            })
        }
    } catch (err) {
        res.render('admin-error', {
            error: err
        })
    }
});

//Here we are creating our adminupdate API 
//When User clicks on pencil button from admin-adminlist page it will pass values here
//Note that the action in form should be /adminupdate or it will not give an error but it will be difficult to trace
//First Parameter is our Action Route
//Second we are checking weather the user updating data is an authorized person or not
//3rd Parameter is req and res to make transactions between Interface and API
app.post('/adminupdate', auth, async (req, res) => {
    try {
        const dead = req.body.adminid;  //Getting the id of admin that is need to be updated

        //Below code is for sidebar image
        var af = req.cookies.userimg;   //getting value of cookie stored on web browser
        var c = "j:null"                //if there is no image it will return j:null 
        if (af == c) {                  //we are converting it into empty value so that default
            af = '';                    //?(Question Mark) image will appear in sidebar
        }

        admins.findById(dead, (err, docs) => {  //This query will retrive the details of user from database
            if (!err) {                     //And save it in docs
                res.render("admin-updateadmin", {   //if no error occured in fetching data from database
                    list: docs,                 //we will display all details of the user in the form on 
                    add: "Admin",               //admin-updateadmin page 
                    imge8: af,
                });
            }
            else {
                //console.log('Error  :' + err);  //If Some error occured it will display here
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

//Here we are creating our teacherupdate API 
//When User clicks on pencil button from admin-teacherlist page it will pass values here
//Note that the action in form should be /teacherupdate or it will not give an error but it will be difficult to trace
//First Parameter is our Action Route
//Second we are checking weather the user updating data is an authorized person or not
//3rd Parameter is req and res to make transactions between Interface and API
app.post('/teacherupdate', auth, async (req, res) => {
    try {
        const dead = req.body.adminid;  //Getting the id of teacher that is need to be updated

        //Below code is for sidebar image
        var af = req.cookies.userimg;   //getting value of cookie stored on web browser
        var c = "j:null"                //if there is no image it will return j:null 
        if (af == c) {                  //we are converting it into empty value so that default
            af = '';                    //?(Question Mark) image will appear in sidebar
        }

        teacher.findById(dead, (err, docs) => { //This query will retrive the details of user from database
            if (!err) {                         //And save it in docs
                res.render("admin-updateteacher", {   //if no error occured in fetching data from database
                    list: docs,                      //we will display all details of the user in the form on 
                    imge10: af,                     //admin-updateteacher page 
                });
            }
            else {
                //console.log('Error  :' + err);  //If Some error occured it will display here
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

//Here we are creating our studentupdate API 
//When User clicks on pencil button from admin-studentlist page it will pass values here
//Note that the action in form should be /studentupdate or it will not give an error but it will be difficult to trace
//First Parameter is our Action Route
//Second we are checking weather the user updating data is an authorized person or not
//3rd Parameter is req and res to make transactions between Interface and API
app.post('/studentupdate', auth, async (req, res) => {
    try {
        const dead = req.body.adminid;  //Getting the id of teacher that is need to be updated

        //Below code is for sidebar image
        var af = req.cookies.userimg;   //getting value of cookie stored on web browser
        var c = "j:null"                //if there is no image it will return j:null 
        if (af == c) {                  //we are converting it into empty value so that default
            af = '';                    //?(Question Mark) image will appear in sidebar
        }

        student.findById(dead, (err, docs) => {  //This query will retrive the details of user from database
            if (!err) {                         //And save it in docs
                res.render("admin-updatestudent", { //if no error occured in fetching data from database
                    list: docs,                     //we will display all details of the user in the form on 
                    imge9: af,                      //admin-updatestudent page 
                });
            }
            else {
                //console.log('Error  :' + err);  //If Some error occured it will display here
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

app.post('/aupdate', upload.single('page_Photo'), async (req, res) => {
    try {
        if (req.file) {
            const email = req.body.email;
            const user = await admins.findOne({ email });
            var af = user.pagePhoto;
            //console.log(af)
            if (af != '') {
                fs.unlinkSync(`${filePath}/${af}`);
            }
            admins.updateOne({ _id: req.body._id }, {
                $set: {
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email: req.body.email,
                    dob: req.body.dob,
                    phone: req.body.phone,
                    pagePhoto: req.file.filename,
                    address: req.body.address,
                    city: req.body.city,
                    zipcode: req.body.zipcode,
                    collegename: req.body.collegename,
                }
            }).then((x) => {
                res.render('admin-updateadmin', {
                    success: "Successfully Updated[Please ReLogin To See Perfect Changes]",
                    imge8: af,
                })
            }).catch((err) => {
                //console.log(e);
                res.render('admin-error', {
                    error: err
                })
            })
        }
        else {
            const email = req.body.email;
            const user = await admins.findOne({ email });
            var af = user.pagePhoto;
            admins.updateOne({ _id: req.body._id }, {
                $set: {
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email: req.body.email,
                    dob: req.body.dob,
                    phone: req.body.phone,
                    //pagePhoto :req.body.filename,
                    address: req.body.address,
                    city: req.body.city,
                    zipcode: req.body.zipcode,
                    collegename: req.body.collegename,
                }
            }).then((x) => {
                res.render('admin-updateadmin', {
                    success: "Successfully Updated",
                    imge8: af,
                })
            }).catch((err) => {
                //console.log(e);
                res.render('admin-error', {
                    error: err
                })
            })
        }
    } catch (err) {
        res.render('admin-error', {
            error: err
        })
    }
});

app.post('/tupdate', upload.single('page_Photo'), async (req, res) => {
    try {
        if (req.file) {
            //Below code is for Sidebar Image
            var af = req.cookies.userimg;
            var c = "j:null"
            if (af == c) {
                af = '';
            }
            //Below code is to override the teacher image
            const email = req.body.email;
            const user1 = await teacher.findOne({ email });
            var af1 = user1.pagePhoto;
            if (af1 != '') {
                fs.unlinkSync(`${filePath}/${af1}`);
            }
            //Update Code
            teacher.updateOne({ _id: req.body._id }, {
                $set: {
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    gender: req.body.gender,
                    dob: req.body.dob,
                    email: req.body.email,
                    phone: req.body.phone,
                    pagePhoto: req.file.filename,
                    address: req.body.address,
                    city: req.body.city,
                    zipcode: req.body.zipcode,
                }
            })
                .then((x) => {
                    res.render('admin-updateteacher', {
                        success: "Successfully Inserted",
                        imge10: af,
                    })
                }).catch((err) => {
                    //console.log(e);
                    res.render('admin-error', {
                        error: err
                    })
                })
        }
        else {
            //Below code is for Sidebar Image
            var af = req.cookies.userimg;
            var c = "j:null"
            if (af == c) {
                af = '';
            }
            teacher.updateOne({ _id: req.body._id }, {
                $set: {
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    gender: req.body.gender,
                    dob: req.body.dob,
                    email: req.body.email,
                    phone: req.body.phone,
                    //pagePhoto :req.file.filename,
                    address: req.body.address,
                    city: req.body.city,
                    zipcode: req.body.zipcode,
                }
            })
                .then((x) => {
                    res.render('admin-updateteacher', {
                        success: "Successfully Inserted",
                        imge10: af,
                    })
                }).catch((err) => {
                    //console.log(e);
                    res.render('admin-error', {
                        error: err
                    })
                })
        }
    } catch (err) {
        res.render('admin-error', {
            error: err
        })
    }
});

app.post('/supdate', upload.single('page_Photo'), async (req, res) => {
    try {
        if (req.file) {
            //The Below Code is for SideBar Image
            var af = req.cookies.userimg;
            var c = "j:null"
            if (af == c) {
                af = '';
            }
            //Below code is to override the Student image
            const email = req.body.email;
            const user2 = await student.findOne({ email });
            var af1 = user2.pagePhoto;
            if (af1 != '') {
                fs.unlinkSync(`${filePath}/${af1}`);
            }
            //Update Code
            student.updateOne({ _id: req.body._id }, {
                $set: {
                    studentid: req.body.studentid,
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    gender: req.body.gender,
                    dob: req.body.dob,
                    sem: req.body.sem,
                    email: req.body.email,
                    phone: req.body.phone,
                    pagePhoto: req.file.filename,
                    address: req.body.address,
                    city: req.body.city,
                    zipcode: req.body.zipcode
                }
            }).then((x) => {
                res.render('admin-updatestudent', {
                    success: "Successfully Updated",
                    imge9: af,
                })
            }).catch((err) => {
                //console.log(e);
                res.render('admin-error', {
                    error: err
                })
            })
        }
        else {
            //The Below Code is for SideBar Image
            var af = req.cookies.userimg;
            var c = "j:null"
            if (af == c) {
                af = '';
            }
            student.updateOne({ _id: req.body._id }, {
                $set: {
                    studentid: req.body.studentid,
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    gender: req.body.gender,
                    dob: req.body.dob,
                    sem: req.body.sem,
                    email: req.body.email,
                    phone: req.body.phone,
                    //pagePhoto :req.file.filename,
                    address: req.body.address,
                    city: req.body.city,
                    zipcode: req.body.zipcode
                }
            }).then((x) => {
                res.render('admin-updatestudent', {
                    success: "Successfully Updated",
                    imge9: af,
                })
            }).catch((err) => {
                //console.log(e);
                res.render('admin-error', {
                    error: err
                })
            })
        }
    } catch (err) {
        res.render('admin-error', {
            error: err
        })
    }
});

//Here we are creating logout api
//When user clicks on logout button below api will get executed
app.post('/logout', async (req, res) => {
    try {
        res.clearCookie('x-access-token');  //We are deleting all cookies created 
        res.clearCookie('userimg');         //i.e token,userimg,and tid
        res.clearCookie('tid');
        return res.redirect('/');     //Here we are redirecting back to 
    } catch (err) {
        res.render('admin-error', {
            error: err
        })
    }
});                             //login page after clicking logout button

app.post('/studentupdate1', auth2, async (req, res) => {
    try {
        const dead = req.body.adminid;
        var af = req.cookies.userimg;
        var c = "j:null"
        if (af == c) {
            af = '';
        }
        student.findById(dead, (err, docs) => {
            if (!err) {
                res.render("student-updatestudent", {
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

app.post('/supdate1', upload.single('page_Photo'), async (req, res) => {
    try {
        if (req.file) {
            //The Below Code is for SideBar Image
            var af = req.cookies.userimg;
            var c = "j:null"
            if (af == c) {
                af = '';
            }
            //Below code is to override the Student image
            const email = req.body.email;
            const user2 = await student.findOne({ email });
            var af1 = user2.pagePhoto;
            if (af1 != '') {
                fs.unlinkSync(`${filePath}/${af1}`);
            }
            //Update Code

            student.updateOne({ _id: req.body._id }, {
                $set: {
                    studentid: req.body.studentid,
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    gender: req.body.gender,
                    dob: req.body.dob,
                    sem: req.body.sem,
                    email: req.body.email,
                    phone: req.body.phone,
                    pagePhoto: req.file.filename,
                    address: req.body.address,
                    city: req.body.city,
                    zipcode: req.body.zipcode,
                    collegename: req.body.collegename,
                }
            }).then((x) => {
                res.render('student-updatestudent', {
                    success: "Successfully Updated",
                    imge: af,
                })
            }).catch((err) => {
                //console.log(e);
                res.render('admin-error', {
                    error: err
                })
            })
        }
        else {
            //The Below Code is for SideBar Image
            var af = req.cookies.userimg;
            var c = "j:null"
            if (af == c) {
                af = '';
            }
            student.updateOne({ _id: req.body._id }, {
                $set: {
                    studentid: req.body.studentid,
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    gender: req.body.gender,
                    dob: req.body.dob,
                    sem: req.body.sem,
                    email: req.body.email,
                    phone: req.body.phone,
                    //pagePhoto :req.file.filename,
                    address: req.body.address,
                    city: req.body.city,
                    zipcode: req.body.zipcode,
                    collegename: req.body.collegename,
                }
            }).then((x) => {
                res.render('student-updatestudent', {
                    success: "Successfully Updated",
                    imge: af,
                })
            }).catch((err) => {
                //console.log(e);
                res.render('admin-error', {
                    error: err
                })
            })
        }
    } catch (err) {
        res.render('admin-error', {
            error: err
        })
    }
});

app.post('/teacherupdate1', auth1, async (req, res) => {
    try {
        const dead = req.body.adminid;
        var af = req.cookies.userimg;
        var c = "j:null"
        if (af == c) {
            af = '';
        }
        teacher.findById(dead, (err, docs) => {
            if (!err) {
                res.render("staff-updatestaff", {
                    list: docs,
                    imge10: af,
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

app.post('/tupdate1', upload.single('page_Photo'), async (req, res) => {
    try {
        if (req.file) {
            //Below code is for Sidebar Image
            var af = req.cookies.userimg;
            var c = "j:null"
            if (af == c) {
                af = '';
            }
            //Below code is to override the teacher image
            const email = req.body.email;
            const user1 = await teacher.findOne({ email });
            var af1 = user1.pagePhoto;
            if (af1 != '') {
                fs.unlinkSync(`${filePath}/${af1}`);
            }
            //Update Code
            teacher.updateOne({ _id: req.body._id }, {
                $set: {
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    gender: req.body.gender,
                    dob: req.body.dob,
                    email: req.body.email,
                    phone: req.body.phone,
                    pagePhoto: req.file.filename,
                    address: req.body.address,
                    city: req.body.city,
                    zipcode: req.body.zipcode,
                    collegename: req.body.collegename,
                }
            })
                .then((x) => {
                    res.render('staff-updatestaff', {
                        success: "Successfully Updated",
                        imge10: af,
                    })
                }).catch((err) => {
                    //console.log(e);
                    res.render('admin-error', {
                        error: err
                    })
                })
        }
        else {
            //Below code is for Sidebar Image
            var af = req.cookies.userimg;
            var c = "j:null"
            if (af == c) {
                af = '';
            }
            teacher.updateOne({ _id: req.body._id }, {
                $set: {
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    gender: req.body.gender,
                    dob: req.body.dob,
                    email: req.body.email,
                    phone: req.body.phone,
                    //pagePhoto :req.file.filename,
                    address: req.body.address,
                    city: req.body.city,
                    zipcode: req.body.zipcode,
                    collegename: req.body.collegename,
                }
            })
                .then((x) => {
                    res.render('staff-updatestaff', {
                        success: "Successfully Updated",
                        imge10: af,
                    })
                }).catch((err) => {
                   // console.log(e);
                    res.render('admin-error', {
                        error: err
                    })
                })
        }
    } catch (err) {
        res.render('admin-error', {
            error: err
        })
    }
});

app.post('/otp', async (req, res) => {
    try {
        if (req.body.getotp) {
            var email = req.body.email;
            //console.log(email);
            const user = await admins.findOne({ email });   //we are finding through email
            const user1 = await teacher.findOne({ email });
            const user2 = await student.findOne({ email });

            if (user || user1 || user2) {
                try {
                    const otpGenerator = require('otp-generator')

                    var c = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
                    //console.log(c);


                    // Generate test SMTP service account from ethereal.email
                    // Only needed if you don't have a real mail account for testing
                    let testAccount = await nodemailer.createTestAccount();

                    // create reusable transporter object using the default SMTP transport
                    let transporter = nodemailer.createTransport({
                        service: "gmail",
                        auth: {
                            // user: 'nikhilmahendrakar02@gmail.com',
                            // pass: 'xtssszppzisgjtwc'
                            user: process.env.forgotuser,
                            pass: process.env.forgotpass
                        },
                    });

                    // send mail with defined transport object
                    let info = await transporter.sendMail({
                        from: '"Edins 👻" <edins@gmail.com>', // sender address
                        to: `"${email}"`, // list of receivers
                        subject: "OTP ✔", // Subject line
                        text: "your OTP ", // plain text body
                        html: `"<h2>${c}</h2>"`, // html body
                    });

                    var encryptotp = ((((c + 10) / 55) * ((c + 18) / 557)) / ((c + 190) ^ 876594 / 545)) / ((((c + 12) / 55) * ((c + 18) / 587)) / ((c + 190) ^ 876794 / 585));

                    res.cookie('zotp', encryptotp);

                    res.render("forgotpassword", {
                        em: email,
                        success: "OTP sent Successfully"
                    });
                }
                catch (err) {
                    res.render("forgotpassword", {
                        em: email,
                        success: "Please connect to a network"
                    });
                }
            }
            else {  //if user is not present in our database he will get below message 
                res.render("forgotpassword", {
                    em: email,
                    success: "Invalid Credentials"
                });
            }
        }
        else {
            var email = req.body.email;
            var otpp = req.body.otpp;
            var pass = req.body.pass;

            var bf = req.cookies.zotp;
            var encryptotp = ((((otpp + 10) / 55) * ((otpp + 18) / 557)) / ((otpp + 190) ^ 876594 / 545)) / ((((otpp + 12) / 55) * ((otpp + 18) / 587)) / ((otpp + 190) ^ 876794 / 585));

            //console.log(bf);
            //console.log(encryptotp);

            if (bf == encryptotp) {
                if (req.body.pass) {
                    encryptedPassword = await bcrypt.hash(pass, 10);
                    const user = await admins.findOne({ email });   //we are finding through email
                    const user1 = await teacher.findOne({ email });
                    const user2 = await student.findOne({ email });

                    if (user) {
                        admins.updateOne({ email: req.body.email }, {
                            $set: {
                                password: encryptedPassword,
                            }
                        }).then((x) => {
                            res.render("forgotpassword", {
                                em: email,
                                success: "Password changed Successfully,Please Login"
                            });
                        }).catch((err) => {
                            //console.log(e);
                            res.render('admin-error', {
                                error: err
                            })
                        })
                    } else if (user1) {
                        teacher.updateOne({ email: req.body.email }, {
                            $set: {
                                password: encryptedPassword,
                            }
                        }).then((x) => {
                            res.render("forgotpassword", {
                                em: email,
                                success: "Password changed Successfully,Please Login"
                            });
                        }).catch((err) => {
                            //console.log(e);
                            res.render('admin-error', {
                                error: err
                            })
                        })
                    } else {
                        student.updateOne({ email: req.body.email }, {
                            $set: {
                                password: encryptedPassword,
                            }
                        }).then((x) => {
                            res.render("forgotpassword", {
                                em: email,
                                success: "Password changed Successfully,Please Login"
                            });
                        }).catch((err) => {
                            //console.log(e);
                            res.render('admin-error', {
                                error: err
                            })
                        })
                    }
                }
                else {
                    res.render("forgotpassword", {
                        em: email,
                        success: "Password cannot be empty",
                    });
                }
            }
            else {
                res.render("forgotpassword", {
                    em: email,
                    success: "Wrong OTP"
                });
            }
        }
    } catch (err) {
        res.render('admin-error', {
            error: err
        })
    }
});

const fileUpload = require('express-fileupload');
app.use(fileUpload());

// Middleware to parse the request body
app.use(express.urlencoded({ extended: true }));
// Route to handle form submission
app.post('/addnotes', (req, res) => {
    try {
        af = req.cookies.userimg;
        const email = req.cookies.zemail;
        const sem = req.body.sem;
        const file = req.files.notesfile;

        const folderPath = path.join('public', 'Notes', email, sem);
        const filePath = path.join(folderPath, file.name);

        // Create the destination folder if it doesn't exist
        fs.mkdirSync(folderPath, { recursive: true });

        // Move the uploaded file to the destination folder
        file.mv(filePath, (err) => {
            if (err) {
                //console.error(err);
                //return res.status(500).send('Error uploading file');
                res.render('admin-error', {
                    error: err
                })
            }
            res.render("staff-addnotes", {
                imge: af,
                success: 'File uploaded successfully.',
            });
        });
    } catch (err) {
        res.render('admin-error', {
            error: err
        })
    }
});

const xlsx = require('xlsx');

function formatDate(serialNumber) {
    const date = new Date(Math.round((serialNumber - 25569) * 86400 * 1000));
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}-${month}-${year}`;
}

app.post('/upload', async (req, res) => {
    try {
        if (!req.files || !req.files.file) {
            return res.status(400).send('No file uploaded.');
        }

        const uploadedFile = req.files.file;
        // console.log(uploadedFile);
        const filePath = `public/BulkAdding/${uploadedFile.name}`;

        // Move the uploaded file to the server's 'uploads' directory
        uploadedFile.mv(filePath, async (err) => {
            if (err) {
                // console.log(err)
                return res.status(500).send('Error uploading the file.');
            }

            // Read the Excel file and extract data
            const workbook = xlsx.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { raw: true });

            const dataToInsert = await Promise.all(sheetData.map(async (item) => {
                const hashedPassword = await bcrypt.hash(formatDate(item.dob), 10);

                // Check if a document with the same email already exists in the database
                const existingUser = await student.findOne({ email: item.email });
                if (existingUser) {
                    // If the user already exists, skip inserting it into the database
                    return null;
                }

                return {
                    email: item.email,
                    password: hashedPassword,
                };
            }));

            // Remove any null entries (users that already exist)
            const filteredDataToInsert = dataToInsert.filter(user => user !== null);

            // Insert the data into the database
            student.insertMany(filteredDataToInsert)
                .then(() => {
                    var af = req.cookies.userimg;
                    var c = "j:null"
                    if (af == c) {
                        af = '';
                    }
                    res.render("admin-bulkadding", {
                        imge1: af,
                        success: "Successfully Added The Students From Excel Sheet To Database"
                    });
                })
                .catch((err) => {
                    //console.error(err);
                    //res.status(500).send('Error inserting data into MongoDB.');
                    res.render('admin-error', {
                        error: err
                    })
                });
        });
    } catch (err) {
        res.render('admin-error', {
            error: err
        })
    }
});

app.post('/changepassword', async (req, res) => {
    try {
        var af = req.cookies.userimg;
        var c = "j:null"
        if (af == c) {
            af = '';
        }
        const email = req.cookies.zemail;
        const password = req.body.password;
        encryptedPassword = await bcrypt.hash(password, 10);
        const user = await admins.findOne({ email });
        const user1 = await teacher.findOne({ email });
        const user2 = await student.findOne({ email });
        if (user) {
            admins.updateOne({ email }, {
                $set: {
                    password: encryptedPassword,
                }
            }).then((x) => {
                res.render('admin-changepassword', {
                    success: "Successfully Changed the password",
                    imge5: af,
                })
            }).catch((err) => {
                //console.log(e);
                res.render('admin-error', {
                    error: err
                })
            })
        } else if (user1) {
            teacher.updateOne({ email }, {
                $set: {
                    password: encryptedPassword,
                }
            }).then((x) => {
                res.render('admin-changepassword', {
                    success: "Successfully Changed the password",
                    imge5: af,
                })
            }).catch((err) => {
                //console.log(e);
                res.render('admin-error', {
                    error: err
                })
            })
        } else {
            student.updateOne({ email }, {
                $set: {
                    password: encryptedPassword,
                }
            }).then((x) => {
                res.render('admin-changepassword', {
                    success: "Successfully Changed the password",
                    imge5: af,
                })
            }).catch((err) => {
                //console.log(e);
                res.render('admin-error', {
                    error: err
                })
            })
        }
    } catch (err) {
        res.render('admin-error', {
            error: err
        })
    }
});

module.exports = app;

