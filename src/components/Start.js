import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "./context";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import ModalStartTest from "./ModalStartTest";
import Modal from "@mui/material/Modal";
import { variables } from "./variables";
import Typography from "@mui/material/Typography";
import useDidMount from "./didMount";
import FormHelperText from "@mui/material/FormHelperText";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { Navigate, useParams, useNavigate } from "react-router-dom";

export default function Start(props) {
  const { userCon, setUserCon } = useContext(AuthContext);
  let { userId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [pending, setPending] = useState(true);
  const [testList, setTestList] = useState([]);
  const [testResaltsList, setTestResaltsList] = useState([]);

  const handleClickLogout = () => {
    sessionStorage.removeItem(variables.tokenKey);
    sessionStorage.removeItem(variables.userId);
    setUserCon(null);
    navigate("/");
  };

  const [value, setValue] = useState({
    name: "",
    description: "",
    key: "",
    open: false
  });

  const [valueText, setValueText] = useState("");
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState("");

  useDidMount(() => {
    fetch(variables.API_URL_User + `/${userId}`, {
      method: "Get",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${sessionStorage.getItem(variables.tokenKey)}`
      }
    })
      .then(function (response) {
        if (response.status !== 200) {
          response.json().then(function (dataDb) {
            console.log(dataDb);
          });
          console.log(
            "Looks like there was a problem. Status Code: " + response.status
          );
          handleClickLogout();
          setPending(false);
          return <Redirect to={`/`} />;
        }
        response.json().then(function (dataDb) {
          setTestList(
            dataDb.tests.map((val) => {
              if (parseInt(val.testScore) <= 0) {
                return (
                  <FormControlLabel
                    key={val.id}
                    value={val.id}
                    control={<Radio />}
                    label={val.testName}
                  />
                );
              }
            })
          );

          setTestResaltsList(
            dataDb.tests.map((val) => {
              if (parseInt(val.testScore) > 0) {
                return (
                  <ListItem>
                    <ListItemText
                      primary={val.testName}
                      secondary={"score = " + `${parseInt(val.testScore)}`}
                    />
                  </ListItem>
                );
              }
            })
          );

          setData(dataDb);
          setPending(false);
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("catch error Code: " + errorCode);
        console.log("catch error Message: " + errorMessage);
        handleClickLogout();
        setPending(false);
        navigate("/");
      });
  }, []);

  const handleRadioChange = (event) => {
    setValueText(event.target.value);
    setHelperText("Good choice!");
    setError(false);

    const result = data.tests.filter((el) => el.id === event.target.value);
    setValue({
      name: result[0].testName,
      description: result[0].description,
      key: result[0].id,
      open: false
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (valueText == "") {
      setHelperText("Please select an option.");
      setError(true);
      return;
    } else {
      setHelperText("Please select an option.");
      setError(false);
    }

    setValue({
      name: value.name,
      description: value.description,
      key: value.key,
      open: true
    });
  };

  const handClose = () => {
    setValue({
      name: value.testName,
      description: value.description,
      key: value.id,
      open: false
    });
  };

  if (userCon === null && sessionStorage.getItem(variables.userId) === null) {
    return <Navigate to="/" replace={false} />;
  }

  if (pending) {
    return (
      <div>
        <h1>Loading ...</h1>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    );
  }

  return (
    <div>
      <Typography
        sx={{
          color: "primary.main",
          fontWeight: "bold",
          mx: 0.5,
          fontSize: 34
        }}
        align="center"
        gutterBottom
      >
        Hallo {userCon?.name ?? data?.name} this is list of your tests
      </Typography>
      <Tooltip title={"Logout"}>
        <Button onClick={handleClickLogout} variant="outlined" color="error">
          Logout
        </Button>
      </Tooltip>
      <form onSubmit={handleSubmit}>
        <FormControl component="fieldset" variant="standard" error={error}>
          <FormLabel style={{ fontSize: 22 }} component="legend">
            Select test
          </FormLabel>

          <RadioGroup
            aria-label="quiz"
            name="quiz"
            //value={value}
            onChange={handleRadioChange}
          >
            {testList}
          </RadioGroup>
          <FormHelperText>{helperText}</FormHelperText>
          <Tooltip title={"Start selected test"}>
            <Button sx={{ mt: 1, mr: 1 }} type="submit" variant="outlined">
              Start
            </Button>
          </Tooltip>
        </FormControl>
        <List
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        >
          {testResaltsList}
        </List>
      </form>
      <Modal
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        open={value.open}
        children={
          <ModalStartTest
            name={value.name}
            description={value.description}
            testkey={value.key}
            close={handClose}
          />
        }
      />
    </div>
  );
}
