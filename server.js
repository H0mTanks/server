const fs = require("fs");

const express = require("express");
const app = express();

const port = 5001;
const path = "./data/data.json";
const loginPath = path + "./login";
const registerPath = path + "./register";

app.use(express.json());

//*endpoint: http://localhost:5001/
// app.get("/", (req, res) => {
//   console.log("GET REQUEST");

//   fs.readFile(path, (err, dt) => {
//     if (err) {
//       console.log("error");
//       res.send("Could not find data");
//     } else {
//       const obj = JSON.parse(dt);
//       res.send(obj);
//     }
//   });
// });

//*requires email, sends back data array of user
app.post("/", (req, res) => {
  // console.log("post");
  // const newData = req.body;
  // console.log(newData);
  // fs.writeFileSync(path, JSON.stringify(newData));
  // res.send(null);
  console.log("get data for user");

  fs.readFile(path, (err, dt) => {
    if (err) {
      console.log("error");
      res.send("Could not find data");
    } else {
      const { email } = req.body;

      let data = JSON.parse(dt);
      data = data.users;
      console.log(data);
      const user = data.find((item) => item.email === email);

      res.send(user.data);
    }
  });
});

//*requires email and password, returns true if login succeeded, else false
app.post("/login", (req, res) => {
  console.log("login");

  // fs.writeFileSync(path, JSON.stringify(newData));
  fs.readFile(path, (err, dt) => {
    if (err) {
      console.log("error");
      res.send("Could not find data");
    } else {
      const { email, password } = req.body;

      let data = JSON.parse(dt);
      data = data.users;
      console.log(data);
      const user = data.find((item) => item.email === email);

      if (user && user.password === password) {
        res.send(true);
      } else {
        res.send(false);
      }
    }
  });
});

//*requires email and password, return true if user added and false when user already exists
app.post("/register", (req, res) => {
  console.log("register");

  // fs.writeFileSync(path, JSON.stringify(newData));
  fs.readFile(path, (err, dt) => {
    if (err) {
      console.log("error");
      res.send("Could not find data");
    } else {
      const { email, password } = req.body;

      const data = JSON.parse(dt);
      const users = data.users;
      // console.log(users);
      const user = users.find((item) => item.email === email);

      if (user) {
        res.send({ msg: "user already exists", status: false });
      } else {
        const newUser = { email: email, password: password, data: [] };
        const newUsers = [...users, newUser];
        const newData = { users: newUsers };
        fs.writeFileSync(path, JSON.stringify(newData));

        res.send({ msg: "user created", status: true });
      }
    }
  });
});

//*requires email and userData array
app.post("/todo", (req, res) => {
  console.log("update todo data");

  // fs.writeFileSync(path, JSON.stringify(newData));
  fs.readFile(path, (err, dt) => {
    if (err) {
      console.log("error");
      res.send("Could not find data");
    } else {
      const { email, userData } = req.body;

      let data = JSON.parse(dt);
      const users = data.users;
      // console.log(users);
      const user_idx = users.findIndex((item) => item.email === email);
      const user = users[user_idx];

      if (user) {
        data.users[user_idx].data = userData;
        const newData = data;
        fs.writeFileSync(path, JSON.stringify(newData));
        res.send({ msg: "data updated", status: true });
      } else {
        res.send({ msg: "user does not exist", status: false });
      }
    }
  });
});

app.listen(port, () => {
  console.log("Listening on port " + port);
});
