import express, { Request, Response, NextFunction } from "express";
import path from "path";
import morgan from "morgan";
import bodyParser from "body-parser";
import serverless from "serverless-http";

const app = express();

// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

// Routes
app.get("/", (req: Request, res: Response) => {
  res.render("index", { title: "Portfolio" });
});

app.post("/", (req: Request, res: Response) => {
  res.send("Got a POST request");
});

app.put("/user", (req: Request, res: Response) => {
  res.send("Got a PUT request at /user");
});

app.delete("/user", (req: Request, res: Response) => {
  res.send("Got a DELETE request at /user");
});

app.get("/contact", (req: Request, res: Response) => {
  res.render("contact", { title: "Kontakt" });
});

app.post("/submit-form", (req, res) => {
  console.log(req.body);
  res.send("Formularz został wysłany!");
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Error handling
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).render("404", { title: "Nie znaleziono" });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).render("error", { title: "Błąd serwera" });
});

module.exports = app;
module.exports.handler = serverless(app);
