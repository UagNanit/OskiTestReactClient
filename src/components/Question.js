import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "./context";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import MobileStepper from "@mui/material/MobileStepper";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import Tooltip from "@mui/material/Tooltip";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useDidMount from "./didMount";
import { variables } from "./variables";
import { Navigate, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

export default function Question(props) {
  const [open, setOpen] = useState(false);
  const { userCon, setUserCon } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [pending, setPending] = useState(true);
  let { testId } = useParams();
  let { testName } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [rightAnsers, setRightAnsers] = useState([]);
  const maxSteps = data?.length;
  const [valueAnser, setValueAnser] = useState(null);

  const sendAnswers = async () => {
    await fetch(variables.API_URL_UserAnswers, {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${sessionStorage.getItem(variables.tokenKey)}`
      },
      body: JSON.stringify({
        userId: sessionStorage.getItem(variables.userId),
        testId: testId,
        answers: rightAnsers
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

          return;
        }
        response.json().then(function (data) {
          console.log(data);
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("catch error Code: " + errorCode);
        console.log("catch error Message: " + errorMessage);
      })
      .finally(() => {
        navigate("/");
      });
  };

  const handleBackToStart = () => {
    /*console.log({
      userId: sessionStorage.getItem(variables.userId),
      testId: testId,
      answers: rightAnsers
    });*/
    sendAnswers();
  };

  const handleClickLogout = () => {
    sessionStorage.removeItem(variables.tokenKey);
    sessionStorage.removeItem(variables.userId);
    setUserCon(null);
    navigate("/");
  };

  useDidMount(() => {
    fetch(variables.API_URL_Test + `/${testId}`, {
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
          navigate("/");
        }
        response.json().then(function (dataDb) {
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

  const handleNext = (event) => {
    if (valueAnser == null) {
      return;
    }

    setRightAnsers((oldArray) => [
      ...oldArray,
      {
        questionId: data[activeStep]?.id,
        answerId: valueAnser
      }
    ]);

    if (activeStep < maxSteps - 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      setOpen(true);
    }
    setValueAnser(null);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleRadioChange = (event) => {
    setValueAnser(event.target.value);
  };

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

  if (userCon === null && sessionStorage.getItem(variables.userId) === null) {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <div>
      <h1>Questions {testName}</h1>
      <Tooltip title={"Logout"}>
        <Button
          sx={{ margin: 1 }}
          onClick={handleClickLogout}
          variant="outlined"
          color="error"
        >
          Logout
        </Button>
      </Tooltip>
      <Box sx={{ justifyContent: "center", flexDirection: "column" }}>
        <Paper
          square
          elevation={0}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 160,
            pl: 2,
            bgcolor: "info.main"
          }}
        >
          <Typography sx={{ fontSize: "28px", color: "white" }}>
            {data[activeStep]?.textQuestion}
          </Typography>
        </Paper>
        <Box
          sx={{
            p: 2
          }}
        >
          <RadioGroup
            aria-label="quiz"
            name="quiz"
            onChange={handleRadioChange}
            sx={{
              width: "100%",
              p: 2,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            {data[activeStep]?.answers.map((val, i) => {
              return (
                <FormControlLabel
                  sx={{ color: "black" }}
                  key={val.id}
                  value={val.id}
                  control={<Radio />}
                  label={val.textAnswer}
                />
              );
            })}
          </RadioGroup>
        </Box>
        <MobileStepper
          variant="text"
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
          nextButton={
            <Button
              size="small"
              onClick={handleNext}
              disabled={activeStep === maxSteps}
            >
              {activeStep < maxSteps - 1 ? "Next" : "Finish"}
              {theme.direction === "rtl" ? (
                <KeyboardArrowLeft />
              ) : (
                <KeyboardArrowRight />
              )}
            </Button>
          }
          backButton={
            <Button
              sx={{
                display: "none"
              }}
              size="small"
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              {theme.direction === "rtl" ? (
                <KeyboardArrowRight />
              ) : (
                <KeyboardArrowLeft />
              )}
              Back
            </Button>
          }
        />
      </Box>

      <Dialog open={open}>
        <DialogTitle id="alert-dialog-title">
          Congratulations, you have completed the test.
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <>You will see the test results on the main page. Click "back".</>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleBackToStart}>Back</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
