import {
  PhoneAuthProvider,
  RecaptchaVerifier,
  signInWithCredential,
  signInWithPhoneNumber,
  getAdditionalUserInfo,
  updateProfile,
  getAuth,
  getIdToken,
  updateEmail,
} from "firebase/auth";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ThreeDots } from "react-loader-spinner";
import "react-phone-input-2/lib/material.css";
import { useDispatch } from "react-redux";
import { IconsAI } from "../../assets/Icons";
import OtpInput from "../../component/AIotp/OtpInput";
import { setRootLoading } from "../../API/RootLoadingManager";
import { setIdToken, setUser } from "../../Redux/Reducers/AuthReducer";
import { isValidEmail } from "../../Utils/Validators";
import useAuth from "../../context/AuthContext";
import { APIClient, session } from "../../API/ApiClient";

function Login() {
  const [ShowOtp, setShowOtp] = useState(false);
  const [ShowForm, setShowForm] = useState(false);
  const [ph, setph] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [IsLoading, setIsLoading] = useState(false);
  const [UserInfo, setUserInfo] = useState({
    name: "",
    email: "",
  });
  const [Country, setCountry] = useState({
    name: "India",
    flag: "🇮🇳",
    code: "IN",
    dial_code: "+91",
  });
  const [Error, setError] = useState({});
  const [IsDisabledVerify, setIsDisabledVerify] = useState(true);
  const [IsDisabledCont, setIsDisabledCont] = useState(true);
  const { Auth } = useAuth();
  const dispatch = useDispatch();
  const onCaptchaVerify = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        Auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            console.warn("captcha response", response);
          },
          "expired-callback": () => {
            window.recaptchaVerifier.reset();
            return;
          },
        }
      );
    }
  };

  const handleNumberInputValueChange = (value = "") => {
    setph(value);
    let err;

    if (value === "") {
      err = "Please Enter Mobile Number";
    } else if (value !== "") {
      err = "";
    }
    setError({ ...Error, ph: err });
  };

  useEffect(() => {
    if (otp.join("").length !== 6) {
      setIsDisabledVerify(true);
    } else {
      setIsDisabledVerify(false);
    }
  }, [otp]);

  const onLogin = () => {
    let validate = true;
    let err;
    if (ph.substring(2) === "") {
      validate = false;
      err = "Please Enter Mobile Number";
    }
    if (validate) {
      setIsLoading(true);
      onCaptchaVerify();
      const appVerifier = window.recaptchaVerifier;
      const formatedPh = Country.dial_code + ph;
      signInWithPhoneNumber(Auth, formatedPh, appVerifier)
        .then((confirmationResult) => {
          window.confirmationResult = confirmationResult;
          setShowOtp(true);
          setIsLoading(false);
          toast.success("OTP sent successfully");
          if (window.recaptchaVerifier) {
            window.recaptchaVerifier.clear();
            window.recaptchaVerifier = null;
          }
        })
        .catch((error) => {
          console.warn("auth error", error);
          toast.error("OTP not sent");
          setIsLoading(false);
        });
    }
    setError({ ...Error, ph: err });
  };

  const confirmOTP = () => {
    setIsLoading(true);
    const credential = PhoneAuthProvider.credential(
      window.confirmationResult.verificationId,
      otp.join("")
    );
    signInWithCredential(Auth, credential)
      .then((result) => {
        setIsLoading(false);
        const { isNewUser } = getAdditionalUserInfo(result);
        if (isNewUser) {
          setShowForm(true);
        } else {
          result.user
            .getIdToken()
            .then((UserIdToken) => {
              setRootLoading(true);
              session.start(UserIdToken).then((started) => {
                if (started) {
                  dispatch(setIdToken(UserIdToken));
                  dispatch(setUser(result.user));
                }
              });
            })
            .catch((error) => {
              console.log("user id token error", error);
            });
        }
      })
      .catch((err) => {
        if (`${err}`.includes("auth/invalid-verification-code")) {
          toast.error("Incorrect Verification code");
          // Toast.showWithGravity('Invalid Otp', Toast.TOP, Toast.SHORT);
          setIsLoading(false);
        }
        console.warn("signInWithCredential error", err);
      });
  };

  const handleInputChange = (value, fieldName) => {
    if (fieldName === "name") {
      const filteredText = value.replace(/[0-9]/g, "");
      setUserInfo((prevState) => ({ ...prevState, [fieldName]: filteredText }));
    } else {
      setUserInfo((prevState) => ({ ...prevState, [fieldName]: value }));
    }

    let error = "";
    if (fieldName === "name") {
      error = validateFullName(value);
    } else if (fieldName === "email") {
      error = validateEmail(value);
    }
    if (UserInfo.name !== "" && UserInfo.email !== "" && error === "") {
      setIsDisabledCont(false);
    } else {
      setIsDisabledCont(true);
    }
    setError((prevState) => ({ ...prevState, [fieldName]: error }));
  };

  const validateFullName = (FullName) => {
    if (FullName === "") {
      return "Please Enter Your Name";
    }
    return "";
  };

  const validateEmail = (email) => {
    if (email === "") {
      return "Please Enter Your Email Address";
    }
    if (email !== "" && !isValidEmail(email)) {
      return "Please Enter Valid Email Address";
    }
    return "";
  };

  const handleContinuePress = async () => {
    setIsLoading(true);
    updateProfile(Auth.currentUser, {
      displayName: UserInfo.name,
    })
      .then(() => {
        updateEmail(Auth.currentUser, UserInfo.email)
          .then(() => {
            Auth.currentUser
              .getIdToken()
              .then((UserIdToken) => {
                session.register(UserIdToken).then((registerd) => {
                  if (registerd) {
                    dispatch(setIdToken(UserIdToken));
                    dispatch(setUser(Auth.currentUser));
                    setIsLoading(false);
                  } else {
                    toast.error("something went wrong. please try again later");
                    setIsLoading(false);
                  }
                });
              })
              .catch((error) => {
                console.log("new user id token error", error);
              });
          })
          .catch((err) => {
            console.warn("update email error", err);
          });
      })
      .catch((err) => {
        console.warn("update profile error", err);
      });
  };

  return (
    <section
      className="bg-container"
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <div className="py-5 text-center w-full flex justify-center  border-r items-center ">
        <img
          height={25}
          className=""
          width={25}
          src={IconsAI.Logo}
          alt="ieltsLogo"
        />
        <div className="text-lg ml-3 font-USSemiBold">Adaptive IELTS</div>
      </div>
      <div
        className="bg-white  rounded-xl shadow-md  flex flex-col items-center justify-center"
        style={{
          width: "25%",
          height: "50%",
        }}
      >
        {ShowOtp ? (
          ShowForm ? (
            <div className="flex flex-col w-full px-7">
              <div className="font-medium text-center text-lg text-TextPrimary">
                Enter Your Info
              </div>
              <input
                value={UserInfo.name}
                onChange={(e) => {
                  handleInputChange(e.target.value, "name");
                }}
                placeholder="Name"
                className={`outline-none ${
                  Error.name ? "border border-[red]" : "border"
                } rounded-md w-full mt-2 text-TextPrimary text-sm py-2 pl-2 font-USRegular`}
              />
              <div className="text-xs text-red-600 font-USMedium h-5 pl-3">
                {Error.name}
              </div>
              <input
                value={UserInfo.email}
                onChange={(e) => {
                  handleInputChange(e.target.value, "email");
                }}
                placeholder="Email Address"
                className={`outline-none ${
                  Error.email ? "border border-[red]" : "border"
                } rounded-md w-full mt-2 text-TextPrimary text-sm py-2 pl-2 font-USRegular`}
              />
              <div className="text-xs text-red-600 font-USMedium h-5 pl-3">
                {Error.email}
              </div>
              <div className="w-full flex items-center justify-center py-2">
                <button
                  onClick={() => {
                    handleContinuePress();
                  }}
                  disabled={IsDisabledCont}
                  style={{
                    width: "40%",
                  }}
                  className={`bg-Primary ${
                    IsDisabledCont && "opacity-70 cursor-not-allowed"
                  } text-white text-sm flex items-center justify-center font-USBold h-8 rounded-md`}
                >
                  {IsLoading ? (
                    <ThreeDots
                      visible={true}
                      height="30"
                      width="30"
                      color="white"
                      radius="9"
                      ariaLabel="three-dots-loading"
                      wrapperStyle={{}}
                      wrapperClass=""
                    />
                  ) : (
                    "Continue"
                  )}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="font-medium text-lg text-TextPrimary">
                Enter OTP To Verify
              </div>
              <div
                style={{
                  marginBlock: 30,
                }}
                className="w-full"
              >
                <OtpInput otp={otp} onChange={setOtp} />
              </div>

              <div className="w-full flex items-center justify-center py-2">
                <button
                  onClick={() => {
                    confirmOTP();
                  }}
                  disabled={IsDisabledVerify}
                  style={{
                    width: "40%",
                  }}
                  className={`bg-Primary ${
                    IsDisabledVerify && "opacity-70 cursor-not-allowed"
                  } text-white flex items-center justify-center text-sm font-USBold h-8 rounded-md`}
                >
                  {IsLoading ? (
                    <ThreeDots
                      visible={true}
                      height="30"
                      width="30"
                      color="white"
                      radius="9"
                      ariaLabel="three-dots-loading"
                      wrapperStyle={{}}
                      wrapperClass=""
                    />
                  ) : (
                    "Verify"
                  )}
                </button>
              </div>
            </>
          )
        ) : (
          <>
            <div className="font-medium text-lg pb-3 text-TextPrimary">
              Wellcome!
            </div>
            <div className="w-full flex flex-col py-2 px-7 ">
              <div
                className={`flex flex-row w-full items-center ${
                  Error.ph ? "border-[red] border" : "border"
                } rounded-md px-3`}
              >
                <div className="font-USRegular text-sm text-TextPrimary cursor-pointer pr-2 border-r">
                  {Country.flag + " " + Country.dial_code}
                </div>
                <input
                  value={ph}
                  onChange={(e) => {
                    handleNumberInputValueChange(e.target.value);
                  }}
                  placeholder="Mobile Number"
                  type="number"
                  className="outline-none text-TextPrimary text-sm py-2 pl-2 font-USRegular"
                />
              </div>
              <div className="text-xs text-red-600 font-USMedium h-5 pl-3">
                {Error.ph}
              </div>
            </div>

            <div className="w-full flex items-center justify-center py-2">
              <button
                onClick={() => {
                  onLogin();
                }}
                style={{
                  width: "40%",
                }}
                className="bg-Primary flex items-center justify-center text-white text-sm font-USBold h-8 rounded-md"
              >
                {IsLoading ? (
                  <ThreeDots
                    visible={true}
                    height="30"
                    width="30"
                    color="white"
                    radius="9"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                  />
                ) : (
                  "Send OTP"
                )}
              </button>
            </div>
          </>
        )}
      </div>
      <div id="recaptcha-container" />
    </section>
  );
}

export default Login;
