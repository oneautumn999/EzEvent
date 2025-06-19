import { SignUp } from "@clerk/clerk-react";

const RegisterPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full p-6 rounded-lg shadow-lg">
        <SignUp
          path="/register"
          routing="path"
          fallbackRedirectUrl={"/admin/dashboard"}
        />
      </div>
    </div>
  );
};

export default RegisterPage;
