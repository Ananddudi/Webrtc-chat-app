import { useState } from "react";
import validator from "validator";

export const useFormValidation = () => {
  const [error, setError] = useState({
    fullname: false,
    email: false,
    password: false,
  });

  const validation = (key, value) => {
    let result = false;
    switch (key) {
      case "fullname":
        const regex = /[\s-]/;
        result = regex.test(value);
        break;
      case "email":
        result = validator.isEmail(value) && value.length > 5;
        break;
      case "password":
        result = validator.isStrongPassword(value, {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 0,
        });
        break;
    }
    return !result;
  };

  const onChange = (key, value) => {
    setError((prev) => {
      if (key === "fullname")
        return { ...prev, fullname: validation("fullname", value) };
      if (key === "email")
        return { ...prev, email: validation("email", value) };
      if (key === "password") {
        return { ...prev, password: validation("password", value) };
      }
    });
  };

  function setErrors(key) {
    setError((prev) => ({ ...prev, [key]: true }));
  }

  return { error, onChange, setErrors };
};
