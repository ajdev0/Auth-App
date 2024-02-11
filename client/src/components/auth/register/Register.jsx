import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContex";
//validation
const getCharacterValidationError = (str) => {
  return `Your password must have at least 1 ${str} character`;
};
//schema
const schema = yup
  .object({
    name: yup.string().required("Please enter a Name"),
    email: yup.string().email().required("Email must be a valid email"),
    password: yup
      .string()
      .required("Please enter a password")
      .min(8, "Password must have at least 8 characters")
      .matches(/[0-9]/, getCharacterValidationError("digit"))
      .matches(/[a-z]/, getCharacterValidationError("lowercase"))
      .matches(/[A-Z]/, getCharacterValidationError("uppercase"))
      .matches(
        /[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/,
        getCharacterValidationError("Special Char")
      ),
  })
  .required();

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();
  //form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema, { validateAllFieldCriteria: true }),
    mode: "all",
  });

  //password
  const togglePasswordVisiblity = () => {
    setShowPassword(showPassword ? false : true);
  };
  //
  const onSubmit = async (data) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/auth/signup`, data);

      navigate("/login");
      //console.log(data);
    } catch (error) {
      const { data } = error.response;
      setError(data?.message);
    }
    console.log(data);
  };

  useEffect(() => {
    if (auth.token !== "") navigate("/welcome");
  });

  return (
    <div>
      <h2 className="text-2xl font-semibold text-center mb-4">
        Create a new account
      </h2>
      <p className="text-gray-600 text-center mb-6">
        Enter your details to register.
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-gray-700 text-sm font-semibold mb-2"
          >
            Name *
          </label>
          <input
            {...register("name")}
            type="text"
            id="name"
            className="form-input w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-blue-500"
            required
            placeholder="Abrar Ibrahim"
          />
          <p className="text-red-400 text-xs mt-1">{errors.name?.message}</p>
        </div>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 text-sm font-semibold mb-2"
          >
            Email Address *
          </label>
          <input
            {...register("email")}
            type="email"
            id="email"
            className="form-input w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-blue-500"
            required
            placeholder="hello@example.com"
          />
          <p className="text-red-400 text-xs mt-1">{errors.email?.message}</p>
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-gray-700 text-sm font-semibold mb-2"
          >
            Password *
          </label>
          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            id="password"
            className="form-input w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-blue-500"
            required
            placeholder="••••••••"
          />
          <div className="relative">
            <div className=" flex items-center absolute inset-y-0 right-0 top-[-22px] bottom-24   mr-3  text-sm leading-5">
              <i onClick={togglePasswordVisiblity}>
                {showPassword ? <HiOutlineEye /> : <HiOutlineEyeOff />}
              </i>
            </div>
          </div>
          <p className="text-red-400 text-xs mt-1"></p>
          <p className="text-red-400 text-xs mt-1">
            {errors.password?.message.split(",").map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </p>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Register
        </button>
        {error && (
          <div className="bg-red-200 rounded mt-4 p-2 text-red-900 font-light text-center ">
            {error}
          </div>
        )}
        <p className="text-gray-600 text-xs text-center mt-4">
          Have an account ?
          <Link to="/login" className="text-blue-500 hover:underline ml-1">
            Signin
          </Link>
          .
        </p>
      </form>
    </div>
  );
};

export default Register;
