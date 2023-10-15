import React, { useContext, useState } from "react";
import { AuthContext } from "./context";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AlternateEmailSharpIcon from "@mui/icons-material/AlternateEmailSharp";
import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";
import CloseIcon from "@mui/icons-material/Close";
import AlertTitle from "@mui/material/AlertTitle";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { variables } from "./variables";
import { Navigate } from "react-router-dom";

export default function Auth() {
  const { userCon, setUserCon } = useContext(AuthContext);

  const [values, setValues] = useState({
    email: "",
    password: "",
    showPassword: false
  });
  const [openErr, setOpenErr] = useState(false);

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleLogin = async () => {
    setOpenErr(false);
    await fetch(variables.API_URL_Login, {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify({
        email: values.email,
        password: values.password
      })
    })
      .then(function (response) {
        if (response.status !== 200) {
          response.json().then(function (data) {
            console.log(data);
          });
          console.log(
            "Looks like there was a problem. Status Code: " + response.status
          );
          setOpenErr(true);
          return;
        }
        response.json().then(function (data) {
          sessionStorage.setItem(variables.tokenKey, data.token);
          sessionStorage.setItem(variables.userId, data.id);
          setUserCon(data);

          setValues({
            email: "",
            password: "",
            showPassword: false
          });
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("catch error Code: " + errorCode);
        console.log("catch error Message: " + errorMessage);
        setOpenErr(true);
      });
  };

  if (userCon !== null) {
    return <Navigate to={`/start/${userCon.id}`} replace={true} />;
  } else if (sessionStorage.getItem(variables.userId) !== null) {
    return (
      <Navigate
        to={`/start/${sessionStorage.getItem(variables.userId)}`}
        replace={true}
      />
    );
  } else {
    return (
      <Dialog open={true}>
        <Collapse in={openErr}>
          <Alert
            severity="error"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setOpenErr(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 0, fontWeight: "bold" }}
          >
            <AlertTitle>Error</AlertTitle>
            Incorrect Email or Password!
          </Alert>
        </Collapse>
        <DialogTitle>Sign In</DialogTitle>
        <DialogContent>
          <DialogContentText style={{ fontWeight: "bold" }}>
            Enter email address and password
          </DialogContentText>
          <Box sx={{ display: "flex", flexWrap: "wrap" }}>
            <div>
              <TextField
                label="Email"
                id="outlined-start-adornment"
                sx={{ m: 1, width: "25ch" }}
                value={values.mail}
                onChange={handleChange("email")}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {" "}
                      <AlternateEmailSharpIcon />
                    </InputAdornment>
                  )
                }}
              />

              <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">
                  Password
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={values.showPassword ? "text" : "password"}
                  value={values.password}
                  onChange={handleChange("password")}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {values.showPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>
            </div>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogin}>Login</Button>
        </DialogActions>
      </Dialog>
    );
  }
}
