import { useForm } from "react-hook-form";
// import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ButtonFilled from "../elements/ButtonFilled";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTheme } from "../../context/ThemeContext";
import ThemeSwitcher from "../elements/ThemeSwitcher";

// import ThemeSwitcher from '../elements/ThemeSwitcher';

const loginSchema = yup
  .object({
    username: yup
      .string()
      .required("Username is required")
      .min(3, "Username must be at least 3 characters"),
    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
  })
  .required();

const LoginForm = () => {
//   const { login } = useAuth();
  const {themeColors} = useTheme();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    const success = await login(data.username, data.password);
    if (success) {
      navigate("/dashboard");
    }
  };

  return (
<div className="min-w-screen h-screen flex items-center justify-center ">
  <div className={`w-full max-w-md rounded-xl shadow-md px-4 py-8 sm:px-6 lg:px-8" ${themeColors.backgroundSecondary}`}>
    <ThemeSwitcher />
    <h4 className={`text-center text-2xl font-bold tracking-tight ${themeColors.text}`}>
      Sign In To Your Account
    </h4>
    <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4 rounded-md">
        <div>
          <label
            htmlFor="username"
            className={`block text-sm font-medium ${themeColors.text}`}
          >
            Username
          </label>
          <input
            {...register("username")}
            type="text"
            className={`mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none ${themeColors.border} ${themeColors.inputBg} ${themeColors.text} ${themeColors.inputFocus}`}
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-600">
              {errors.username.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="password"
            className={`block text-sm font-medium text-gray-700 ${themeColors.text}`}
          >
            Password
          </label>
          <p className={`${themeColors.text}`}>Haloo</p>
          <input
            {...register("password")}
            type="password"
            className={`mt-1 block w-full rounded-md border px-3 py-2 ${themeColors.border} rounded-md shadow-sm ${themeColors.inputBg} ${themeColors.text} ${themeColors.inputFocus} focus:outline-none sm:text-sm`}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>
      </div>

      <ButtonFilled 
        type="submit"
        variant="solid"
        radius="lg"
        className={`flex items-center justify-center gap-2 w-full ${themeColors.inputFocus.split(' ')[0]} ${themeColors.primary} ${themeColors.buttonHover}`}>
        Sign In
      </ButtonFilled>
    </form>
  </div>
</div>
  );
};

export default LoginForm;
