require("dotenv").config();
const mysql = require("mysql2"); // it contains func provided by the package
const { faker } = require("@faker-js/faker");
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride("_method"));

app.use(express.urlencoded({ extended: true }));

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

app.get("/notes", (req, res) => {
    let q = "SELECT* FROM notes"
    connection.query(q, (err, notes) => {
        if (err) {
            res.send(err)
        } else {
            res.render("home", { notes });
        }
    });
});

app.get("/notes/new", (req, res) => {
    res.render("new");
});

app.post("/notes", (req, res) => {
    let id = faker.string.uuid();
    let { title, content } = req.body;
    let q2 = "INSERT INTO notes (id,title,content) VALUES (?,?,?)";
    connection.query(q2, [id, title, content], (err, result) => {
        if (err) {
            res.status(500).send("Database Error");
        } else {
            console.log(result);
            res.redirect("/notes");
        }
    });

});

app.get("/notes/:id/edit", (req, res) => {
    let { id } = req.params;
    let query2 = `SELECT* FROM notes WHERE id =?`;
    connection.query(query2, [id], (err, result) => {
        if (err) {
            res.status(500).send("Database Error");
        } else {
            res.render("edit", { result });
        }
    });
});

app.patch("/notes/:id", (req, res) => {
    let { id } = req.params;
    let newTitle = req.body.title;
    let newContent = req.body.content;
    let query2 = `UPDATE notes SET title =?, content = ? WHERE id =?`;
    connection.query(query2, [newTitle, newContent, id], (err, result) => {
        if (err) {
            res.status(500).send("Database Error");
        } else {
            res.redirect("/notes");
        }
    });
});

app.delete("/notes/:id", (req, res) => {
    let { id } = req.params;
    let query = `DELETE FROM notes WHERE id =?`;
    connection.query(query, [id], (err, result) => {
        if (err) {
            res.status(500).send("Database Error");
        } else {
            console.log(result);
            res.redirect("/notes");
        }
    });
});