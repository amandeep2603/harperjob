import {
  Center,
  Grid,
  GridItem,
  Heading,
  HStack,
  Input,
  Box,
  VStack,
  Table,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Tbody,
  Thead,
  Text,
  Menu,
  MenuButton,
  MenuList,
  Button,
  MenuItem,
  useToast,
  useDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { fetcher } from "../helper/fetcher";
import Image from "next/image";
import { PinnedCard } from "./PinnedCard";

export const PinnedList = ({ hr_id }) => {
  const [key, setKey] = useState({ name: "", hid: hr_id });
  const [modalProps, setModalProps] = useState({ dev_info: "", open: false });
  const { onOpen, isOpen, onClose } = useDisclosure();
  const client = useQueryClient();
  const toast = useToast();

  const fetchUserPinned = async () => {
    try {
      const res = await fetcher.get(`hr/searchpindev/?hid=${hr_id}`);
      return res.data;
    } catch (error) {
      return error;
    }
  };

  const { data, isLoading } = useQuery(["name"], fetchUserPinned);

  const searchUser = async (key) => {
    try {
      const response = await fetcher.post(
        `hr/searchpindev/`,
        JSON.stringify(key)
      );
      return response.data;
    } catch (error) {
      return error.response;
    }
  };
  const mutation = useMutation(["name"], (key) => searchUser(key), {
    onSuccess(data) {
      client.setQueryData(["name"], data);
    },
  });

  const handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    mutation.mutate(key);
    setKey({ ...key, [name]: value });
  };

  const unpindata = async (userdata) => {
    try {
      const response = await fetcher.post("/hr/pindev/", userdata);
      return response.data;
    } catch (error) {
      return error.response;
    }
  };

  const mut = useMutation(["unpin"], (userdata) => unpindata(userdata), {
    onSuccess() {
      client.invalidateQueries(["name"]);
      toast({
        title: "Successfully unpinned",
        status: "success",
        variant: "subtle",
        duration: 9000,
        isClosable: true,
        position: "top",
      });
    },
  });

  const unpinUser = (dev_id) => {
    const userdata = { dev_id: dev_id, hr_id: hr_id, is_pinned: false };
    mut.mutate(userdata);
  };

  const modal = (d) => {
    setModalProps({
      ...modalProps,
      ...d,
      open: isOpen,
    });
  };

  const { name } = key;

  if (isLoading) {
    return <Center h="100vh" w="100%"></Center>;
  }

  console.log(modalProps);

  console.log(modalProps);

  const { open } = modalProps;

  return (
    <>
      <Center>
        <Input
          name="name"
          value={name}
          placeholder="Search Pinned User"
          onChange={handleChange}
        />
      </Center>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent p="2" >
          <ModalBody >
          <ModalCloseButton m="2" />
            <PinnedCard {...modalProps} />
          </ModalBody>
        </ModalContent>
      </Modal>

      <TableContainer>
        <Table variant="striped" colorScheme="twitter">
          <TableCaption>Pinned user data</TableCaption>
          <Thead>
            <Tr>
              <Th>Avatar</Th>
              <Th>Name</Th>
              <Th>Tech</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.data.map((d, i) => {
              return (
                <Tr key={i}>
                  <Td position="relative">
                    <Image
                      src={`/uploads/${d.avatar}`}
                      layout="fill"
                      objectFit="contain"
                    />
                  </Td>
                  <Td>{d.name}</Td>
                  <Td>
                    {d.tech.map((t) => {
                      return (
                        <Text
                          as="span"
                          whiteSpace="break-spaces"
                          fontWeight="semibold"
                        >
                          {t}{" "}
                        </Text>
                      );
                    })}
                  </Td>
                  <Td>
                    <Menu>
                      <MenuButton as={Button} colorScheme="twitter">
                        Actions
                      </MenuButton>
                      <MenuList
                        onClick={() => {
                          onOpen(), modal(d);
                        }}
                      >
                        <MenuItem>View Profile</MenuItem>
                        <MenuItem onClick={() => unpinUser(d.dev_id)}>
                          Unpin
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};
