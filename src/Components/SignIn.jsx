/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import validator from "validator";
import {
  CloseRounded,
  EmailRounded,
  PasswordRounded,
  TroubleshootRounded,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { IconButton, Modal } from "@mui/material";
import { closeSignin } from "../redux/setSignInSlice";
import CircularProgress from "@mui/material/CircularProgress";
import styled from "styled-components";
import OTP from "./OTP";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { loginFailure, loginSuccess } from "../redux/userSlice";
import { openSnackbar } from "../redux/snackbarSlices";
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
  color: ${({ theme }) => theme.text_primary};
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
      color:'${theme.bg}';`}
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
  margin: 20px 20px 30px 20px;
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

const ForgetPassword = styled.div`
  color: ${({ theme }) => theme.text_secondary};
  font-size: 13px;
  margin: 8px 26px;
  display: block;
  cursor: pointer;
  text-align: right;
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;
const Signin = ({ setSignUpOpen, setSignInOpen }) => {
  const [emailError, setEmailError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [Loading, setLoading] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [values, setValues] = useState({
    password: "",
    showPassword: false,
  });

  // opt ko verify karo
  const [showOtp, setShowOtp] = useState(false);
  const [optVerified, setOtpVerified] = useState(false);

  // resetPassword
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [samePassword, setSamePassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [passwordCorrect, setPasswordCorrect] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [resetDisabled, setResetDisabled] = useState(true);
  const [credentialsError, setCredentialsError] = useState("");
  const [resettingPassword, setResettingPassword] = useState(false);
  const dispatch = useDispatch();
  const validateEmail = () => {
    if (validator.isEmail(email)) {
      setEmailError("");
    } else {
      setEmailError("Enter a valid email address");
    }
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!disabled) {
      setLoading(true);
      setDisabled(false);
      // console.log("hehehe");
      try {
        const res = await axios.post("http://localhost:3000/api/auth/signin", {
          email: email,
          password: password,
        });
        if (res.status === 200) {
          dispatch(loginSuccess(res.data));
          setLoading(false);
          setDisabled(false);
          dispatch(closeSignin());
          dispatch(
            openSnackbar({
              message: "Logged In Successfully",
              severity: "success",
            })
          );
        } else if (res.status === 202) {
          // console.log("hxhxhxhhxhhhxhxh");
          dispatch(loginFailure());
          setLoading(false);
          setDisabled(false);
          setCredentialsError(res.data.message);
          dispatch(
            openSnackbar({
              message: "User not verified",
              severity: "error",
            })
          );
        } else {
          // console.log("hxhxhxhhxhhhxhxh");
          dispatch(loginFailure());
          setLoading(false);
          setDisabled(false);
          setCredentialsError(`Invalid Credentials:`, res.data.message);
        }
      } catch (error) {
        dispatch(loginFailure());
        // console.log("hxhxhxhhxhhhxhxh");
        setLoading(false);
        setDisabled(false);
        dispatch(
          openSnackbar({
            message: 'Password Error',
            severity: 'error',
          })
        );
      }
    }
    if (email == "" || password == "") {
      dispatch(
        openSnackbar({
          message: "Please enter all the details carefully",
          severity: "error",
        })
      );
    }
  };
  const validatePassword = () => {
    if (newPassword.length < 8) {
      setSamePassword("Password must be at least 8 characters long");
      setPasswordCorrect(false);
    } else if (newPassword.length > 16) {
      setSamePassword("Password must be less than 16 characters long");
    } else if (
      !newPassword.match(/[a-z]/g) ||
      !newPassword.match(/[A-Z]/g) ||
      !newPassword.match(/[0-9]/g) ||
      !newPassword.match(/[^a-zA-Z\d]/g)
    ) {
      setPasswordCorrect(false);
      setSamePassword(
        "Password must contain atleast one lowercase, uppercase, number and special character!"
      );
    } else {
      setSamePassword("");
      setPasswordCorrect(true);
    }
  };
  useEffect(() => {
    if (email !== "") {
      validateEmail();
    }
    if (validator.isEmail(email) && password.length > 5) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [email, password]);
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // console.log(tokenResponse);
        setLoading(true);
        const user = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );
        // console.log(user);
        const res = await axios.post("http://localhost:3000/api/auth/google", {
          name: user.data.name,
          email: user.data.email,
          img: user.data.picture,
        });
        if (res.status === 200) {
          dispatch(loginSuccess(res.data));
          dispatch(closeSignin());
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
              message: "Something went wrong",
              severity: "error",
            })
          );
          setLoading(false);
        }
      } catch (error) {
        dispatch(loginFailure());
        dispatch(
          openSnackbar({
            message: err.message,
            severity: "error",
          })
        );
      }
    },
    onError: () => {
      dispatch(loginFailure());
      setLoading(false);
      dispatch(
        openSnackbar({
          message: "Something went wrong",
          severity: "error",
        })
      );
    },
  });
  const closeForgetPassword = () => {
    setShowForgotPassword(false);
    setShowOtp(false);
  };
  useEffect(() => {
    if (newPassword !== "") validatePassword();
    if (passwordCorrect && newPassword === confirmedPassword) {
      setSamePassword("");
      setResetDisabled(false);
    } else if (confirmedPassword !== "" && passwordCorrect) {
      setSamePassword("Passwords do not match");
      setResetDisabled(true);
    }
  }, [newPassword, confirmedPassword]);

  useEffect(() => {
    performResetPassword();
  }, [optVerified]);

  const performResetPassword = async () => {
    if (optVerified) {
      setShowOtp(true);
      setResettingPassword(true);
      try {
        const res = await axios.put(
          "http://localhost:3000/api/auth/forgetPassword",
          {
            email,
            password: confirmedPassword,
          }
        );
        if (res.status === 200) {
          dispatch(
            openSnackbar({
              message: "Password Changed successfully",
              severity: "success",
            })
          );
          setShowForgotPassword(false);
          setEmail("");
          setPassword("");
          setNewPassword("");
          setConfirmedPassword("");
          setOtpVerified(false);
          setResettingPassword(false);
        }
      } catch (error) {
        dispatch(
          openSnackbar({
            message: error.message,
            severity: "error",
          })
        );
        setShowOtp(false);
        setOtpVerified(false);
        setResettingPassword(false);
      }
    }
  };
  const sendOtp = async () => {
    // console.log(confirmedPassword);
    if (!resetDisabled) {
      setResetDisabled(true);
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:3000/api/auth/findByEmail?email=${email}`
        );
        if (res.status === 200) {
          // console.log("yaha tak sab sahi hai");
          setShowOtp(true);
          setResetDisabled(false);
          setLoading(false);
        } else if (res.status === 202) {
          setEmailError("User not found!");
          setResetDisabled(false);
          setLoading(false);
        }
      } catch (error) {
        setResetDisabled(false);
        setLoading(false);
        dispatch(
          openSnackbar({
            message: error.message,
            severity: "error",
          })
        );
      }
    }
  };

  return (
    <>
      <Modal
        open={true}
        onClose={() => {
          dispatch(closeSignin());
        }}
      >
        <Container>
          {!showForgotPassword ? (
            <Wrapper>
              <CloseRounded
                style={{
                  position: "absolute",
                  top: "24px",
                  right: "30px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  dispatch(closeSignin());
                }}
              />
              <>
                <Title>Sign In</Title>
                <OutlinedBox
                  googleButton={TroubleshootRounded}
                  style={{ margin: "24px" }}
                  onClick={() => googleLogin()}
                >
                  {Loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : (
                    <>
                      <GoogleIcon
                        src={
                          "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1000px-Google_%22G%22_Logo.svg.png?20210618182606"
                        }
                      />
                      Sign In with google
                    </>
                  )}
                </OutlinedBox>
                <Divider>
                  <Line />
                  or
                  <Line />
                </Divider>
                <OutlinedBox style={{ marginTop: "24px" }}>
                  <EmailRounded
                    sx={{ fontSize: "20px" }}
                    style={{ paddingRight: "12px" }}
                  />
                  <TextInput
                    placeholder="Email Id"
                    type="email"
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                </OutlinedBox>
                <Error error={emailError}>{emailError}</Error>
                <OutlinedBox>
                  <PasswordRounded
                    sx={{ fontSize: "20px" }}
                    style={{ paddingRight: "12px" }}
                  />
                  <TextInput
                    placeholder="Enter the Password"
                    type={values.showPassword ? "text" : "password"}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
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
                <ForgetPassword
                  onClick={() => {
                    setShowForgotPassword(true);
                  }}
                >
                  <b>Forgot Password?</b>
                </ForgetPassword>
                <OutlinedBox
                  button={true}
                  activeButton={!disabled}
                  style={{ marginTop: "6px" }}
                  onClick={handleLogin}
                >
                  {Loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : (
                    "Sign In"
                  )}
                </OutlinedBox>
              </>
              <LoginText>
                Don&apos;t have an account ?
                <Span
                  onClick={() => {
                    setSignUpOpen(true);
                    dispatch(closeSignin());
                  }}
                  style={{
                    fontWeight: "500",
                    marginLeft: "6px",
                    cursor: "pointer",
                  }}
                >
                  Create Account
                </Span>
              </LoginText>
            </Wrapper>
          ) : (
            <Wrapper>
              <CloseRounded
                style={{
                  position: "absolute",
                  top: "24px",
                  right: "30px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  closeForgetPassword();
                }}
              />
              {!showOtp ? (
                <>
                  <Title>Reset your Password</Title>
                  {resettingPassword ? (
                    <>
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
                        Updating password
                        <CircularProgress color="inherit" size={20} />
                      </div>
                      ;
                    </>
                  ) : (
                    <>
                      <OutlinedBox style={{ marginTop: "24px" }}>
                        <EmailRounded
                          sx={{ fontSize: "20px" }}
                          style={{ paddingRight: "12px" }}
                        />
                        <TextInput
                          placeholder="Email Id"
                          type="email"
                          onChange={(e) => {
                            setEmail(e.target.value);
                          }}
                        />
                      </OutlinedBox>
                      <Error error={emailError} />
                      <OutlinedBox style={{ marginTop: "24px" }}>
                        <PasswordRounded
                          sx={{ fontSize: "20px" }}
                          style={{ paddingRight: "12px" }}
                        />
                        <TextInput
                          placeholder="Enter New Password"
                          type="text"
                          onChange={(e) => {
                            setNewPassword(e.target.value);
                          }}
                        />
                      </OutlinedBox>
                      <OutlinedBox style={{ marginTop: "24px" }}>
                        <PasswordRounded
                          sx={{ fontSize: "20px" }}
                          style={{ paddingRight: "12px" }}
                        />
                        <TextInput
                          placeholder="Confirm New Password"
                          type={values.showPassword ? "text" : "password"}
                          onChange={(e) => {
                            setConfirmedPassword(e.target.value);
                          }}
                        />
                        <IconButton
                          color="inherit"
                          onClick={() =>
                            setValues({
                              ...values,
                              showPassword: !values.showPassword,
                            })
                          }
                        >
                          {values.showPassword ? (
                            <Visibility sx={{ fontSize: "20px" }} />
                          ) : (
                            <VisibilityOff sx={{ fontSize: "20px" }} />
                          )}
                        </IconButton>
                      </OutlinedBox>
                      <Error error={samePassword}>{samePassword}</Error>
                      <OutlinedBox
                        button={true}
                        activeButton={!resetDisabled}
                        style={{ marginTop: "6px", marginBottom: "24px" }}
                        onClick={() => {
                          sendOtp();
                        }}
                      >
                        {Loading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : (
                          "Submit"
                        )}
                      </OutlinedBox>
                      <LoginText>
                        Don&apos;t have an account ?
                        <Span
                          onClick={() => {
                            setSignUpOpen(true);
                            dispatch(closeSignin());
                          }}
                          style={{
                            fontWeight: "500",
                            marginLeft: "6px",
                            cursor: "pointer",
                          }}
                        >
                          Create Account
                        </Span>
                      </LoginText>
                    </>
                  )}
                </>
              ) : (
                <>
                  <OTP
                    email={email}
                    name="User"
                    optVerified={optVerified}
                    setOtpVerified={setOtpVerified}
                    reason="FORGOTPASSWORD"
                  />
                </>
              )}
            </Wrapper>
          )}
        </Container>
      </Modal>
    </>
  );
};

export default Signin;
