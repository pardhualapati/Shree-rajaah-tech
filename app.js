const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static('public'));

// View engine
app.set("view engine", "ejs");

// Routes
app.get("/", (req, res) => {
    res.render("index");
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.get("/services", (req, res) => {
    res.render("services");
});

app.get("/contact", (req, res) => {
    res.render("contact", { message: null });
});

// Contact Form Submission
app.post("/contact", async (req, res) => {
    const { name, email, message } = req.body;

    try {
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        await transporter.sendMail({
            from: email,
            to: process.env.EMAIL_USER,
            subject: `New Contact Message from ${name}`,
            text: message
        });

        res.render("contact", { message: "Message sent successfully! We will contact you in 24 hours" });

    } catch (error) {
        console.log(error);
        res.render("contact", { message: "Error sending message." });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
