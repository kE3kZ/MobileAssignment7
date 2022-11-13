const express = require("express");
const app = express();
const PORT = 1200;
app.use(express.json());

const nodemon = require("nodemon");

const mongoose = require("mongoose");

const connectionString = "mongodb+srv://admin:Amonamarth1@cluster0.8ybvtzk.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", () => console.error.bind(console, "db connection error"));
db.once("open", () => console.log("connected to database successfully"));


//put code to get db schema here
require("./Models/students.js");
const Student = mongoose.model("Student");

require("./Models/courses.js");
const Course = mongoose.model("Course");

app.listen(PORT, () => console.log(`server started on http://localhost:${PORT}`));

app.get(`/getAllCourses`, async (req, res) => {
    try{
        let courses = await Course.find({}).lean()
        return res.status(200).json(courses);
    }
    catch{
        return res.status(500);
    }
});

app.get(`/getAllStudents`, async (req, res) => {
    try{
        let students = await Student.find({}).lean()
        return res.status(200).json(students);
    }
    catch{
        return res.status(500);
    }
});

app.get(`/findStudent`, async (req, res) => {
    try{
        let student = await Student.findOne({studentID: req.body.studentID})

        if (student) {
            return res.status(200).json(student);
            
        } 
        else {
            return res.status(200).json("{Message: Student not Found...}");          
        }
    }
    catch{
        return res.status(500).json("{Message: Connection ERROR...}");
    }
});

app.get(`/findCourse`, async (req, res) => {
    try{
        let course = await Course.find({courseInstructor: req.body.courseInstructor})

        if (course) {
            return res.status(200).json(course);
            
        } 
        else {
            return res.status(200).json("{Message: Course not Found...}");         
        }
    }
    catch{
        return res.status(500).json("{Message: Connection ERROR...}");
    }
});

app.post(`/addCourse`, (req, res) => {
    try{
        let course = {
            courseInstructor: req.body.courseInstructor,
            courseCredits: req.body.courseCredits,
            courseID: req.body.courseID,
            courseName: req.body.courseName
        }

        Course(course).save().then(() => {
            return res.status(200).json("{Message: Course Added...}");
        })
    }
    catch{
        return res.status(500);
    }
});

app.post(`/addStudent`, (req, res) => {
    try{
        let student = {
            fname: req.body.fname,
            lname: req.body.lname,
            studentID: req.body.studentID
        }

        Student(student).save().then(() => {
            return res.status(200).json("{Message: Student Added...}");
        })
    }
    catch{
        return res.status(500);
    }
});

app.post(`/editStudentById`, async (req, res) => {
    try{
        let student = await Student.updateOne({_id: req.body.id}
            ,{
            fname: req.body.fname
            }, {upsert: true});
        if (student) {
            res.status(200).json("Message: Student Updated");
        } 
        else {
            return res.status(200).json("{Message: Student not Found...}");          
        }
    }
    catch{
        return res.status(500).json("{Message: Connection ERROR...}");
    }
});

app.post(`/editStudentByFname`, async (req, res) => {
    try{
        let student = await Student.updateOne({fname: req.body.queryFname}
            ,{
            fname: req.body.fname,
            lname: req.body.lname
            }, {upsert: true});
        if (student) {
            res.status(200).json("Message: Student Updated");
        } 
        else {
            return res.status(200).json("{Message: Student not Found...}")  ;          
        }
    }
    catch{
        return res.status(500).json("{Message: Connection ERROR...}");
    }
});
app.post(`/editCourseByCourseName`, async (req, res) => {
    try{
        let course = await Course.updateOne({courseName: req.body.courseName}
            ,{
            courseInstructor: req.body.courseInstructor
            }, {upsert: true});
        if (course) {
            res.status(200).json("Message: Course Updated");
        } 
        else {
            return res.status(200).json("{Message: Student not Found...}")  ;          
        }
    }
    catch{
        return res.status(500).json("{Message: Connection ERROR...}");
    }
});

app.post(`/deleteCourseById`, async (req, res) => {
    try{
        let course = await Course.findOne({_id: req.body.id});

        if(course){
            await Course.deleteOne({_id: req.body.id})
            return res.status(200).json("{Message: Course Deleted}");
        }
        else{
            return res.status(200).json("{Message: No course was deleted - query null}");
        }
       
    }
    catch{
        return res.status(500).json("{Message: Connection ERROR...}");
    }
});

app.post(`/removeStudentFromClasses`, async (req, res) => {
    try{
        let student = await Student.findOne({studentID: req.body.studentID});

        if(student){
            await Student.deleteOne({fname: req.body.fname})
            return res.status(200).json("{Message: Student Deleted}");
        }
        else{
            return res.status(200).json("{Message: No student was deleted - query null}");
        }
       
    }
    catch{
        return res.status(500).json("{Message: Connection ERROR...}");
    }
});
