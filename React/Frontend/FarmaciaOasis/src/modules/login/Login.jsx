import { useState } from "react";
import { TextInput, Button, Paper, Title, Center } from "@mantine/core";
import axios from "axios";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await axios.post("http://localhost:4000/api/auth/login", {
        username,
        password
      });

      localStorage.setItem("usuario", JSON.stringify(res.data.user));
      onLogin();
    // eslint-disable-next-line no-unused-vars
    } catch (e) {
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <Center style={{ height: "100vh" }}>
      <Paper shadow="lg" p="xl" radius="md" style={{ width: "350px" }}>
        <Title order={2} mb="lg">Iniciar Sesión</Title>

        <TextInput
          label="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          mb="md"
        />

        <TextInput
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          mb="lg"
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <Button fullWidth onClick={handleSubmit}>
          Entrar
        </Button>
      </Paper>
    </Center>
  );
}
