/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import validator from "validator";
import { useDispatch } from "react-redux";
import { loginFailure, loginStart, loginSuccess } from "../redux/userSlice";
import { googleSignIn, signUp, signup } from "../api";
import { openSnackbar } from "../redux/snackbarSlices";
import { closeSignin, openSignin } from "../redux/setSignInSlice";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
// import { useTheme } from "styled-components";
import { IconButton, Modal } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import {
  CloseRounded,
  TroubleshootRounded,
  Person,
  EmailRounded,
  PasswordRounded,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

import styled from "styled-components";
import OTP from "./OTP";

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #000000a7;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 380px;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text_secondary};
  padding: 10px;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Title = styled.div`
  font-size: 22px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_primary};
  margin: 16px 28px;
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
const GoogleIcon = styled.img`
  width: 22px;
`;
const Divider = styled.div`
  display: flex;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.text_secondary};
  font-size: 14px;
  font-weight: 600;
`;
const Line = styled.div`
  width: 80px;
  height: 1px;
  border-radius: 10px;
  margin: 0px 10px;
  background-color: ${({ theme }) => theme.text_secondary};
`;

const TextInput = styled.input`
  width: 100%;
  border: none;
  font-size: 14px;
  border-radius: 3px;
  background-color: transparent;
  outline: none;
  color: ${({ theme }) => theme.text_secondary};
`;

const LoginText = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_secondary};
  margin: 20px 20px 38px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Span = styled.span`
  color: ${({ theme }) => theme.primary};
`;

const Error = styled.div`
  color: red;
  font-size: 10px;
  margin: 2px 26px 8px 26px;
  display: block;
  ${({ error }) =>
    error === "" &&
    `    display: none;
      `}
`;
const Signup = ({ setSignUpOpen, setSignInOpen }) => {
  const [name, setName] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpsent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [credentialsError, setCredentialsError] = useState("");
  const [passwordCorrect, setPasswordCorrect] = useState(false);
  const [nameValidated, setNameValidated] = useState(false);
  const [correctName, setCorrectName] = useState(false);
  const [values, setValues] = useState({
    password: "",
    showPassword: false,
  });
  useEffect(() => {
    if (email !== "") {
      validateEmail();
    }
    if (password !== "") {
      validatePassword();
    }
    if (name !== "") {
      validateName();
    }
    if (
      name !== "" &&
      validator.isEmail(email) &&
      passwordCorrect &&
      correctName
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [name, email, password, passwordCorrect, correctName]);
  const validateEmail = () => {
    if (validator.isEmail(email)) {
      setEmailError("");
    } else {
      setEmailError("Enter a valid email Id!");
    }
  };
  const dispatch = useDispatch();

  const createAccount = async () => {
    if (otpVerified) {
      dispatch(loginStart());
      setDisabled(true);
      setLoading(true);
      try {
        const res = await axios.post("http://localhost:3000/api/auth/signup", {
          name,
          email,
          password,
        });
        if (res.status === 200) {
          // console.log(res);
          dispatch(loginSuccess(res.data));
          dispatch(
            openSnackbar({
              message: `OTP verfied and account created successfully`,
              severity: "success",
            })
          );
          setLoading(false);
          setDisabled(false);
          setSignUpOpen(false);
          dispatch(closeSignin());
        } else {
          dispatch(loginFailure());
          setCredentialsError(`${res.data.message}`);
          setLoading(false);
          setDisabled(false);
        }
      } catch (error) {
        dispatch(loginFailure());
        setLoading(false);
        setDisabled(false);
        dispatch(
          openSnackbar({
            message: error.message,
            severity: "error",
          })
        );
      }
    }
  };
  useEffect(() => {
    createAccount();
  }, [otpVerified]);
  const validateName = () => {
    if (name.length < 4) {
      setNameValidated(false);
      setCorrectName(false);
      setCredentialsError("Name must be at least 4 characters long!");
    } else {
      setCorrectName(true);
      if (!nameValidated) {
        setCredentialsError("");
        setNameValidated(true);
      }
    }
  };
  const validatePassword = () => {
    if (password.length < 8) {
      setCredentialsError("Password must be at least 8 characters long!");
      setPasswordCorrect(false);
    } else if (password.length > 16) {
      setCredentialsError("Password must be less than 16 characters long!");
      setPasswordCorrect(false);
    } else if (
      !password.match(/[a-z]/g) ||
      !password.match(/[A-Z]/g) ||
      !password.match(/[0-9]/g) ||
      !password.match(/[^a-zA-Z\d]/g)
    ) {
      setCredentialsError(
        "Password must contain atleast one lowercase, uppercase, number and special character!"
      );
      setPasswordCorrect(false);
    } else {
      setCredentialsError("");
      setPasswordCorrect(true);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!disabled) {
      setOtpsent(true);
    }
    if (name === "" || email === "" || password === "") {
      dispatch(
        openSnackbar({
          message: "Please fill all the details",
          severity: "error",
        })
      );
    }
  };

  // google sign in
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      const user = await axios
        .get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        })
        .catch((err) => {
          dispatch(loginFailure());
          dispatch(
            openSnackbar({
              message: err.message,
              severity: "error",
            })
          );
        });
      const res = await axios.post("http://localhost:3000/api/auth/google", {
        name: user.dat.name,
        email: user.data.email,
        img: user.data.picture,
      });
      if (res.status === 200) {
        // console.log(res);
        dispatch(loginSuccess(res.data));
        dispatch(closeSignin());
        setSignInOpen(false);
        dispatch(
          openSnackbar({
            message: "Logged in Successfully",
            severity: "success",
          })
        );
        setLoading(false);
      } else {
        dispatch(loginFailure(res.data));
        dispatch(
          openSnackbar({
            message: res.data.message,
            severity: "error",
          })
        );
        setLoading(false);
      }
    },
    onError: (errorResponse) => {
      dispatch(loginFailure());
      dispatch(
        openSnackbar({
          message: errorResponse.error,
          severity: "error",
        })
      );
      setLoading(false);
    },
  });
  // const theme = useTheme();
  return (
    <>
      <Modal open={true} onClose={() => dispatch(closeSignin())}>
        <Container>
          <Wrapper>
            <CloseRounded
              style={{
                position: "absolute",
                top: "24px",
                right: "30px",
                cursor: "pointer",
                color: "inherit",
              }}
              onClick={() => setSignUpOpen(false)}
            />
            {!otpSent ? (
              <>
                <Title>Sign Up</Title>
                <OutlinedBox
                  googleButton={TroubleshootRounded}
                  style={{ margin: "24px" }}
                  onClick={() => {
                    googleLogin;
                  }}
                >
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : (
                    <>
                      <GoogleIcon src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1000px-Google_%22G%22_Logo.svg.png?20210618182606" />
                      Sign In with Google
                    </>
                  )}
                </OutlinedBox>
                <Divider>
                  <Line />
                  or
                  <Line />
                </Divider>
                <OutlinedBox style={{ marginTop: "24px" }}>
                  <Person
                    sx={{ fontSize: "20px" }}
                    style={{ paddingRight: "12px" }}
                  />
                  <TextInput
                    placeholder="Enter your Full Name"
                    type="text"
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                </OutlinedBox>
                <OutlinedBox>
                  <EmailRounded
                    sx={{ fontSize: "20px" }}
                    style={{ paddingRight: "12px" }}
                  />
                  <TextInput
                    placeholder="Enter Your Email"
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </OutlinedBox>
                <Error error={emailError}>{emailError}</Error>
                <OutlinedBox>
                  <PasswordRounded
                    sx={{ fontSize: "20px" }}
                    style={{ paddingRight: "12px" }}
                  />
                  <TextInput
                    placeholder="Enter Password"
                    type={values.showPassword ? "text" : "password"}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <IconButton
                    color="inherit"
                    onClick={() => {
                      setValues({
                        ...values,
                        showPassword: !values.showPassword,
                      });
                    }}
                  >
                    {values.showPassword ? (
                      <Visibility sx={{ fontSize: "20px" }} />
                    ) : (
                      <VisibilityOff sx={{ fontSize: "20px" }} />
                    )}
                  </IconButton>
                </OutlinedBox>
                <Error error={credentialsError}>{credentialsError}</Error>
                <OutlinedBox
                  button={true}
                  activeButton={!disabled}
                  style={{ marginTop: "6px" }}
                  onClick={handleSignUp}
                >
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : (
                    "Create Account"
                  )}
                </OutlinedBox>
              </>
            ) : (
              <OTP
                email={email}
                name={name}
                otpVerified={otpVerified}
                setOtpVerified={setOtpVerified}
                reason={"Verify"}
              />
            )}
            <LoginText>
              Already have an account
              <Span
                onClick={() => {
                  setSignUpOpen(false);
                  dispatch(openSignin);
                }}
                style={{
                  fontWeight: "500",
                  marginLeft: "6px",
                  cursor: "pointer",
                }}
              >
                Sign In
              </Span>
            </LoginText>
          </Wrapper>
        </Container>
      </Modal>
    </>
  );
};

export default Signup;
