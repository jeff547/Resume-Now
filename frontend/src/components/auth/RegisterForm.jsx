import { useEffect, useRef, useState } from "react";
import Title from "../common/Title";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { api } from "../../api/axios";
import ErrorMessage from "./ErrorMessage";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = "/users/signup";

const Register = ({ success, setSuccess, setRegister }) => {
  const userRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");

  // Focus on first input box when first opening page
  useEffect(() => {
    userRef.current.focus();
  }, []);

  // Checks if email is in correct format
  useEffect(() => {
    const isValid = EMAIL_REGEX.test(email);
    console.log(`Email - ${email} is Valid: ${isValid}`);
    setValidEmail(isValid);
  }, [email]);

  useEffect(() => {
    // Checks if password is strong enough
    const isValid = PWD_REGEX.test(pwd);
    console.log(`Password - ${pwd} is Valid: ${isValid}`);
    setValidPwd(isValid);
    // Checks that both passwords match
    const matchingPwd = pwd === matchPwd && isValid;
    console.log(`Matching Password: ${matchingPwd}`);
    setValidMatch(matchingPwd);
  }, [pwd, matchPwd]);

  // Updates error message depending on user input
  useEffect(() => {
    setErrMsg("");
  }, [email, pwd, matchPwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Prevent External JS Hackers
    if (!EMAIL_REGEX.test(email) || !PWD_REGEX.test(pwd)) {
      setErrMsg("Unauthorized Entry");
      return;
    }

    console.log(`Email: ${email} Password: ${pwd}`); // logging

    try {
      const response = await api.post(
        REGISTER_URL,
        JSON.stringify({
          email: email,
          password: pwd,
        }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );

      console.log(`${REGISTER_URL} response: ${JSON.stringify(response)}`); // logging
      // Check HTTP success status code
      if (response.status == 200) {
        setSuccess(true);
      }
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No server response");
      } else if (err.response?.status == 409) {
        setErrMsg("A user with this email already exists.");
      } else if (err.response?.status == 500) {
        setErrMsg("Failed to create user due to a database error.");
      } else {
        setErrMsg("Registration Failed: Unknown Error");
      }
      errRef.current.focus();
    }
  };

  const handleToLogin = () => {
    setRegister(false);
    setSuccess(false);
  };

  return (
    <>
      {success ? (
        <div className="flex w-full max-w-sm flex-col items-center gap-8 px-4 py-9 text-center sm:max-w-md sm:px-6">
          <Title classNames="text-3xl text-center">
            Your account was successfully created!
          </Title>
          <button className="button px-12 py-3" onClick={handleToLogin}>
            Go to Sign In
          </button>
        </div>
      ) : (
        <section className="flex w-full flex-col items-center">
          <ErrorMessage errRef={errRef} errMsg={errMsg} />
          <form
            className="flex w-full max-w-sm flex-col items-center gap-5 px-4 pt-5 sm:max-w-md sm:px-6"
            onSubmit={handleSubmit}
          >
            <Title classNames="text-3xl font-semibold text-gray-200 mb-2">
              Create your account
            </Title>
            <div className="w-full">
              <label htmlFor="email" className="mb-3 block text-gray-200">
                E-mail
                {email &&
                  (!validEmail ? (
                    <span className="pl-1 text-red-500">
                      <FontAwesomeIcon icon={faTimes} />
                    </span>
                  ) : (
                    <span className="pl-1 text-green-500">
                      <FontAwesomeIcon icon={faCheck} />
                    </span>
                  ))}
              </label>
              <input
                type="text"
                id="email"
                ref={userRef}
                placeholder="JohnDoe@mail.com"
                required
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={validEmail ? "false" : "true"}
                aria-describedby="emailnote"
                value={email}
                onFocus={() => setEmailFocus(true)}
                onBlur={() => setEmailFocus(false)}
                autoComplete="email"
                className="w-full rounded-md border border-gray-800 bg-black p-2 text-white placeholder-gray-600 focus:outline-none focus:ring focus:ring-purple-700"
              />

              <p
                id="emailnote"
                className={
                  emailFocus && email && !validEmail
                    ? "mt-1.5 text-xs text-red-300"
                    : "sr-only"
                }
              >
                <FontAwesomeIcon icon={faInfoCircle} className="pr-1" />
                Must be a valid email <br />
                Letters, numbers, and special characters are allowed
              </p>
            </div>
            <div className="w-full">
              <label htmlFor="password" className="mb-3 block text-gray-200">
                Password
                {pwd &&
                  (!validPwd ? (
                    <span className="pl-1 text-red-500">
                      <FontAwesomeIcon icon={faTimes} />
                    </span>
                  ) : (
                    <span className="pl-1 text-green-500">
                      <FontAwesomeIcon icon={faCheck} />
                    </span>
                  ))}
              </label>
              <input
                type="password"
                id="password"
                placeholder="••••••••••"
                onChange={(e) => setPwd(e.target.value)}
                required
                autoComplete="new-password"
                value={pwd}
                aria-invalid={validPwd ? "false" : "true"}
                aria-describedby="pwdnote"
                onFocus={() => setPwdFocus(true)}
                onBlur={() => setPwdFocus(false)}
                className="w-full rounded-md border border-gray-800 bg-black p-2 text-white placeholder-gray-600 focus:outline-none focus:ring focus:ring-purple-700"
              />
              <p
                id="pwdnote"
                className={
                  pwdFocus && !validPwd
                    ? "mt-1.5 text-xs text-red-300"
                    : "sr-only"
                }
              >
                <FontAwesomeIcon icon={faInfoCircle} className="pr-1" />
                8–24 characters long
                <br /> At lowercase and uppercase letters, a number and a
                special character
                <br /> Allowed Special Characters:{" "}
                <span aria-label="exclamation mark">!</span>{" "}
                <span aria-label="at symbol">@</span>{" "}
                <span aria-label="hashtag">#</span>{" "}
                <span aria-label="dollar sign">$</span>{" "}
                <span aria-label="percent">%</span>
              </p>
            </div>
            <div className="w-full">
              <label htmlFor="confirm_pwd" className="mb-3 block text-gray-200">
                Confirm password{" "}
                {matchPwd &&
                  (!validMatch ? (
                    <span className="pl-1 text-red-500">
                      <FontAwesomeIcon icon={faTimes} />
                    </span>
                  ) : (
                    <span className="pl-1 text-green-500">
                      <FontAwesomeIcon icon={faCheck} />
                    </span>
                  ))}
              </label>
              <input
                type="password"
                id="confirm_pwd"
                placeholder="••••••••••"
                onChange={(e) => setMatchPwd(e.target.value)}
                required
                value={matchPwd}
                aria-invalid={validMatch ? "false" : "true"}
                aria-describedby="confirmNote"
                onFocus={() => setMatchFocus(true)}
                onBlur={() => setMatchFocus(false)}
                className="w-full rounded-md border border-gray-800 bg-black p-2 text-white placeholder-gray-600 focus:outline-none focus:ring focus:ring-purple-700"
              />
              <p
                id="confirmNote"
                className={
                  matchFocus && !validMatch
                    ? "mt-1.5 text-xs text-red-300"
                    : "sr-only"
                }
              >
                <FontAwesomeIcon icon={faInfoCircle} className="pr-1" />
                Must match password above.
              </p>
            </div>
            <button
              type="submit"
              disabled={!validEmail || !validMatch || !validPwd ? true : false}
              className="mt-4 w-full cursor-pointer rounded-xl border border-purple-400 bg-gradient-to-b from-[#551dd9] to-[#7d58cd] py-3 font-semibold transition duration-700 hover:border-purple-300 hover:from-[#6322f9] hover:to-[#9b6dfd] hover:text-gray-200"
            >
              Sign Up
            </button>
          </form>
        </section>
      )}
    </>
  );
};
export default Register;
