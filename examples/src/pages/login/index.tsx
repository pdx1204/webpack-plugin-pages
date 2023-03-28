import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/", { replace: true });
  };

  return <button onClick={handleLogin}>登录</button>;
}

export default Login;
