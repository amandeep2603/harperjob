import { Meta } from "../../helper/Meta";
import { useState } from "react";
import { fetcher } from "../../helper/fetcher";
import { useMutation } from "@tanstack/react-query";
import { Input, Button, Box, Center, Heading, useToast } from "@chakra-ui/react";
import Router, { useRouter } from "next/router";

const signup = () => {
  const [user, setUser] = useState({
    email: "",
    name: "",
    password: "",
    company: "",
  });
  const [avatar, setAvatar] = useState();
  const toast = useToast()
  const router = useRouter()

  const sendFormData = async (formData) => {
    try {
      const response = fetcher.post("hr/signup/", formData);
      return response;
    } catch (error) {
      return error.response;
    }
  };

  const mutation = useMutation(["user"], (formData) => sendFormData(formData), {
    onSuccess(res) {
      console.log(res);
      toast({
        title: "Signup successful",
        status: "success",
        variant: "subtle",
        isClosable: true,
        position: "top",
      });
    },
    onError(error) {
      console.log(error);
    },
  });

  const handleFile = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleFormElem = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setUser({ ...user, [name]: value });
  };

  const handleForm = (e) => {
    e.preventDefault();

    const formData = new FormData();
    const { email, name, password, company } = user;

    formData.append("email", email);
    formData.append("name", name);
    formData.append("password", password);
    formData.append("avatar", avatar);
    formData.append("company", company);
    
    mutation.mutate(formData);
    
    setUser({ email: "", name: "", password: "", company: "" });
    router.push('/')
  };

  const { email, name, password, company } = user;
  return (
    <>
      <Meta title="Harper Job | hr" />

      <Center w="100%" h="100vh">
        <Box w="96" display="flex" flexDir="column" gap="2" shadow="xl" p="4">
          <Heading size="lg">Let's get started</Heading>
          <Input p="2" variant="filled" type="file" name="file" accept="image/*" onChange={handleFile} required />
          <Input p="2" variant="filled"
            name="email"
            value={email}
            onChange={handleFormElem}
            type="email"
            placeholder="Email"
            required
          />
          <Input p="2" variant="filled"
            name="name"
            type="text"
            value={name}
            onChange={handleFormElem}
            placeholder="Name"
            required
          />
          <Input p="2" variant="filled"
            name="company"
            type="text"
            placeholder="Company"
            value={company}
            onChange={handleFormElem}
            required
          />
          <Input p="2" variant="filled"
            name="password"
            type="password"
            value={password}
            placeholder="Password"
            onChange={handleFormElem}
            required
          />
          <Button colorScheme="twitter" onClick={handleForm}>SignUp</Button>
        </Box>
      </Center>
    </>
  );
};

export default signup;
