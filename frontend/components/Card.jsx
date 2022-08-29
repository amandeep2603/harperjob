import {
  Box,
  VStack,
  Center,
  Avatar,
  Text,
  Heading,
  HStack,
  Tag,
  TagLabel,
  Button,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import Image from "next/image";
import { IoMdClose } from "react-icons/io";
import { AiOutlinePushpin, AiFillPushpin } from "react-icons/ai";
import { GrGlobe } from "react-icons/gr";
import { FiMail } from "react-icons/fi";
import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetcher } from "../helper/fetcher";
import { useState } from "react";

export const Card = ({
  dev_id,
  name,
  avatar,
  bio,
  country,
  email,
  tech,
  hobbies,
  hr_id,
}) => {
  const [isPinned, setIsPinned] = useState(false);
  const client = useQueryClient()
  const toast = useToast()
  const sendPin = async (data) => {
    try {
      const response = await fetcher.post("hr/pindev/", data);
      return response.data;
    } catch (error) {
      return error.response;
    }
  };
  const mutation = useMutation(["pin"], (data) => sendPin(data), {
    onSuccess() {
      setIsPinned(!isPinned)
      toast({
        title:"Profile successfully pinned",
        status:"success",
        variant:"subtle",
        isClosable:true,
        position:"top"
      })
      client.invalidateQueries(['name'])
    },
  });

  const sendPinDev = (e) => {
    const data = { dev_id: dev_id, hr_id: hr_id, is_pinned: true };
    mutation.mutate(data);
  };

  const variants={
    init:{opacity:1, x:0},
    trans:{opacity:0 ,x:500}
  }




  return (
    <>
      <Box
        as={motion.div}
        key={dev_id}

        w="96"
        h="30rem"
        animate={!isPinned ? "init":"trans"}
        variants={variants}
        display="flex"
        flexDirection="column"
        alignItems="center"
        border="2px"
        borderColor="gray.600"
        rounded="md"
        gap="2"
        p="1"
        position="absolute"
        top="0"
        bg="white"
      >
        <Box bgColor="blue.300" w="100%" h="24"></Box>
        <Center position="relative" mt="-14">
          <Avatar position="relative" bgColor="white" w="20" h="20" shadow="lg">
            <Image src={`/uploads/${avatar}`} layout="fill" />
          </Avatar>
        </Center>

        <Center flexDirection="column">
          <Heading>{name}</Heading>
          <Text>{bio}</Text>
        </Center>
        <HStack
          borderBottom="1"
          borderColor="gray.900"
          w="100%"
          p="2"
          justifyContent="space-around"
        >
          <HStack>
            <Avatar icon={<GrGlobe size="16px" />} bgColor="gray.300" />
            <Text fontWeight="semibold" fontSize="sm">
              {country}
            </Text>
          </HStack>
          <HStack>
            <Avatar icon={<FiMail size="16px" />} bgColor="gray.300" />
            <Text fontWeight="semibold" fontSize="sm">
              {email}
            </Text>
          </HStack>
        </HStack>
        <Box
          as="div"
          w="100%"
          overflowY="scroll"
          p="2"
          h="32"
          border="1px"
          borderColor="gray.300"
        >
          <Box w="100%" p="2">
            <Heading size="md">Hobbies</Heading>
            <HStack>
              {hobbies.map((h) => {
                return (
                  <Tag size="md" rounded="full" p="2">
                    <TagLabel>{h}</TagLabel>
                  </Tag>
                );
              })}
            </HStack>
          </Box>
          <Box w="100%" mt="3" p="2">
            <Heading size="md">Tech</Heading>
            <HStack>
              {tech.map((t) => {
                return (
                  <Tag size="md" rounded="full" p="2">
                    <TagLabel>{t}</TagLabel>
                  </Tag>
                );
              })}
            </HStack>
          </Box>

          <HStack mt="3" w="100%" p="2">
            <Button
              w="100%"
              bgColor="black"
              colorScheme="blackAlpha"
              variant="solid"
            >
              Github
            </Button>
            <Button
              w="100%"
              bgColor="linkedin.800"
              colorScheme="Linkedin"
              variant="solid"
            >
              Linkedin
            </Button>
          </HStack>
        </Box>

        <HStack>
          <IconButton rounded="full" icon={<IoMdClose size="20px" />} onClick={()=>setIsPinned(!isPinned)} />
            <IconButton
            rounded="full"
            colorScheme="twitter"
            icon={<AiOutlinePushpin size="20px"/>}
            onClick={sendPinDev}
            
          />
     
        </HStack>
      </Box>
    </>
  );
};
