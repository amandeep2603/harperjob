import { Input, Button, Box, useToast, Center, Heading } from "@chakra-ui/react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { fetcher } from "../../helper/fetcher";
import { useRouter } from "next/router";

const login = () => {
  const [user, setUser] = useState({ email: "", password: "" });
  const router = useRouter();
  const toast = useToast();

  const sendFormData = (formData) => {
    try {
      const response = fetcher.post("hr/login/", formData);
      return response;
    } catch (error) {
      return error.response;
    }
  };

  const mutation = useMutation(["user"], (formData) => sendFormData(formData), {
    onSuccess(res) {
      const { data } = res.data;
      if (data.length > 0) {
        localStorage.setItem("isAuth", true);
        localStorage.setItem("hr_info", JSON.stringify(data[0]));
        router.push("/hr/dashboard/");
        toast({
          title: "Login successful",
          status: "success",
          variant: "subtle",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      } else {
        toast({
          title: "Invalid credientials",
          status: "error",
          variant: "subtle",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        router.push("/hr/login");
      }
    },
    onError(error) {
      console.log(error);
    },
  });

  const handleFormElem = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setUser({ ...user, [name]: value });
  };

  const handleForm = (e) => {
    e.preventDefault();
    const formData = new FormData();
    const { email, password } = user;
    formData.append("email", email);
    formData.append("password", password);
    mutation.mutate(formData);
    setUser({ email: "", password: "" });
  };

  const { email, password } = user;
  return (
    <>
      <Center justifyContent="center" w="100%" h="100vh" >
        <Box display="flex" flexDir="column" w="96" p="4" gap="2" shadow="xl">
          <Heading size="lg">Login</Heading>
          <Input
            name="email"
            value={email}
            onChange={handleFormElem}
            type="email"
            placeholder="Email"
            required
          />
          <Input
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={handleFormElem}
            required
          />

          <Button colorScheme="twitter" onClick={handleForm}>Login</Button>
        </Box>
      </Center>
    </>
  );
};

export default login;
