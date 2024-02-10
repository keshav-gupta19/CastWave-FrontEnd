/* eslint-disable react/prop-types */
import { CircularProgress } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import OtpInput from "react-otp-input";
import styled from "styled-components";
import { useTheme } from "styled-components";
import { useDispatch } from "react-redux";
import { openSnackbar } from "../redux/snackbarSlices";
import axios from "axios";
const Title = styled.div`
  font-size: 22px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_primary};
  margin: 16px 22px;
`;

const OutlinedBox = styled.div`
  height: 44px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.text_secondary};
  color: ${({ theme }) => theme.text_secondary};
  ${({ googleButton }) =>
    googleButton &&
    `
    user-select: none; 
  gap: 16px;`}
  ${({ button, theme }) =>
    button &&
    `
    user-select: none; 
  border: none;
    background: ${theme.button};
    color: '${theme.text_secondary}';`}
    ${({ activeButton, theme }) =>
    activeButton &&
    `
    user-select: none; 
  border: none;
    background: ${theme.primary};
    color: white;`}
  margin: 3px 20px;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  padding: 0px 14px;
`;

const LoginText = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_secondary};
  margin: 0px 26px 0px 26px;
`;
const Span = styled.span`
  color: ${({ theme }) => theme.primary};
  font-size: 12px;
  margin: 0px 26px 0px 26px;
`;

const Error = styled.div`
  color: red;
  font-size: 12px;
  margin: 2px 26px 8px 26px;
  display: block;
  ${({ error }) =>
    error === "" &&
    `    display: none;
    `}
`;

const Timer = styled.div`
  color: ${({ theme }) => theme.text_secondary};
  font-size: 12px;
  margin: 2px 26px 8px 26px;
  display: block;
`;

const Resend = styled.div`
  color: ${({ theme }) => theme.primary};
  font-size: 14px;
  margin: 2px 26px 8px 26px;
  display: block;
  cursor: pointer;
`;
const OTP = ({ email, name, otpVerified, setOtpVerified, reason }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const [otpSent, setOtpsent] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState("00:00");
  const [showTimer, setShowTimer] = useState(false);
  const Ref = useRef(null);

  const getTimeRemaining = (e) => {
    const total = Date.parse(e) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 60000) % 60);
    const hours = Math.floor((total / 60000 / 60) % 24);
    return {
      total,
      seconds,
      minutes,
      hours,
    };
  };
  const startTimer = (e) => {
    let { total, seconds, minutes } = getTimeRemaining(e);
    if (total >= 0) {
      setTimer(
        (minutes > 0 ? minutes : "0" + minutes) +
          ":" +
          (seconds > 9 ? seconds : "0" + seconds)
      );
    }
  };
  const getDeadTime = () => {
    let deadline = new Date();
    deadline.setSeconds(deadline.getSeconds() + 60);
    return deadline;
  };
  const clearTimer = (e) => {
    setTimer("01:00");
    if (Ref.current) clearInterval(Ref.current);
    const id = setInterval(() => {
      startTimer(e);
    }, 1000);
    Ref.current = id;
  };
  const sendOtp = async () => {
    const res = await axios.get(
      `http://localhost:3000/api/auth/generateotp?email=${email}&name=${name}&reason=${reason}`
    );
    // console.log(res);
    if (res.status === 200) {
      dispatch(
        openSnackbar({
          message: "OTP sent Successfully",
          severity: "success",
        })
      );
      setOtpsent(true);
      setDisabled(true);
      setOtp("");
      setOtpError("");
      setOtpLoading(false);
    } else {
      dispatch(
        openSnackbar({
          message: "OTP sent Error",
          severity: "error",
        })
      );
      setOtp("");
      setOtpError("");
      setOtpLoading(false);
    }
  };
  const validateOtp = async () => {
    setOtpLoading(true);
    setDisabled(true);
    try {
      const res = await axios.get(
        `http://localhost:3000/api/auth/verifyotp?code=${otp}`
      );
      // console.log(res.data);
      if (res.status === 200) {
        // console.log("maii aaya");
        setOtpVerified(true);
        setOtp("");
        setOtpError("");
        setDisabled(false);
        setOtpLoading(false);
      } else {
        setOtpError(res.data.message);
        setOtpLoading(false);
        setDisabled(false);
      }
    } catch (err) {
      dispatch(
        openSnackbar({
          message: err.message,
          severity: "error",
        })
      );
      setOtpError("");
      setOtpLoading(false);
      setDisabled(false);
    }
  };
  const resendOtp = () => {
    setShowTimer(true);
    clearTimer(getDeadTime());
    sendOtp();
  };
  useEffect(() => {
    if (timer == "00:00") {
      setShowTimer(false);
    } else {
      setShowTimer(true);
    }
  }, [timer]);
  useEffect(() => {
    sendOtp();
    clearTimer(getDeadTime());
  }, []);

  useEffect(() => {
    if (otp.length === 6) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [otp]);
  return (
    <>
      <Title>Verify OTP</Title>
      <LoginText>
        A verification <b>&nbsp;OTP &nbsp;</b> has been sent to:
      </LoginText>
      <Span>{email}</Span>
      {!otpSent ? (
        <div
          style={{
            padding: "12px 26px",
            marginBottom: "20px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "14px",
            justifyContent: "center",
          }}
        >
          Sending OTP
          <CircularProgress color="inherit" size={20} />
        </div>
      ) : (
        <div>
          <OtpInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            shouldAutoFocus={true}
            inputStyle={{
              fontSize: "22px",
              width: "38px",
              height: "38px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              textAlign: "center",
              margin: "6px 4px",
              backgroundColor: "transparent",
              color: theme.text_primary,
            }}
            containerStyle={{ padding: "8px 2px", justifyContent: "center" }}
            renderInput={(props) => <input {...props} />}
          />
          <Error error={otpError}>
            <b>{otpError}</b>
          </Error>
          <OutlinedBox
            button={true}
            activeButton={!disabled}
            style={{ marginTop: "12px", marginBottom: "12px" }}
            onClick={() => validateOtp()}
          >
            {otpLoading ? (
              <CircularProgress color="inherit" size={20} />
            ) : (
              "Submit"
            )}
          </OutlinedBox>
          {showTimer ? (
            <>
              <Timer>
                Resend in <b>{timer}</b>
              </Timer>
            </>
          ) : (
            <>
              <Resend
                onClick={() => {
                  resendOtp;
                }}
              >
                <b>Resend</b>
              </Resend>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default OTP;
