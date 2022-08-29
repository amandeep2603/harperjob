import { useRouter } from "next/router";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetcher } from "../../helper/fetcher";
import {
  Center,
  Container,
  Box,
  HStack,
  VStack,
  Heading,
  Text,
  Skeleton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverCloseButton,
  Button,
  useDisclosure,
  IconButton,
  RadioGroup,
  Radio,
  Stack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useToast,
  Alert,
  Spinner,
} from "@chakra-ui/react";
import { BsFilter } from "react-icons/bs";
import { Card } from "../../components/Card";
import { PinnedList } from "../../components/PinnedList";
import { FiLogOut } from "react-icons/fi";
import { Meta } from "../../helper/Meta";

const dashboard = () => {
  const router = useRouter();
  const client = useQueryClient();

  const fetchDev = async () => {
    try {
      const response = await fetcher(`hr/filterdev/?hr_id=${hr.hr_id}`);
      return response.data;
    } catch (error) {
      return error.response;
    }
  };
  const { data: dev, isLoading } = useQuery(["devinfo"], fetchDev);
  const [hr, setHr] = useState({ hr_id: "", name: "", email: "", avatar: "" });
  const { onOpen, onClose, isOpen } = useDisclosure();
  const [country, setCountry] = useState("");
  const [lang1, setLang1] = useState("");
  const [lang2, setLang2] = useState("");
  const [logout, setLogout] = useState(false);
  const toast = useToast();

  const countryName = ["india", "australia", "canada", "new zealand"];
  const Lang1 = ["react js", "vue js", "angular js"];
  const Lang2 = ["python", "go", "rust", "c#"];

  const getFilteredData = async (data) => {
    try {
      const response = await fetcher.post("/hr/filterdev/", data);
      return response.data;
    } catch (error) {
      return error.response;
    }
  };

  const mutation = useMutation(["devinfo"], (data) => getFilteredData(data), {
    onSuccess(data) {
      client.setQueryData(["devinfo"], data);
      
    },
    onSettled(){
      toast({
        title: "Filtering data..",
        status: "info",
        variant: "subtle",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  });

  const handleFilter = (e) => {
    e.preventDefault();
    const data = JSON.stringify({
      country: country,
      lang1: lang1,
      lang2: lang2,
    });
    mutation.mutate(data);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuth = localStorage.getItem("isAuth");
      if (!isAuth || isAuth === "undefined") {
        router.push("/");
      }

      if (localStorage.getItem("hr_info")) {
        const { hr_id, name, email, avatar } = JSON.parse(
          localStorage.getItem("hr_info")
        );
        setHr({ ...hr, hr_id, name, email, avatar });
      }

      setCountry("");
      setLang1("");
      setLang2("");
    }
  }, []);

  if (logout) {
    toast({
      title: "Logout successfully ",
      status: "success",
      variant: "subtle",
      isClosable: true,
      position: "top",
    });
    setTimeout(() => {
      localStorage.removeItem("hr_info");
      localStorage.removeItem("isAuth");
      router.push("/");
    }, [500]);
  }

  if (isLoading) {
    return (
      <Center w="100%" h="100vh">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Center>
    );
  }

  const { data } = dev;

  return (
    <>
    <Meta title="dashboard"/>
      <VStack as="nav" minW="100%">
        <Skeleton isLoaded={!isLoading}>
          <HStack p="2" w="96" justifyContent="space-around">
            <HStack px="3">
              <Box position="relative" w="50px" h="50px">
                <Image src={`/uploads/${hr.avatar}`} layout="fill" />
              </Box>

              <Box>
                <Heading size="md" textTransform="capitalize">
                  {hr.name}
                </Heading>
                <Text fontSize="xs">{hr.hr_id}</Text>
              </Box>
            </HStack>
            <Popover
              isOpen={isOpen}
              onOpen={onOpen}
              onClose={onClose}
              placement="bottom-end"
              closeOnBlur={false}
            >
              <PopoverTrigger>
                <IconButton size="sm" icon={<BsFilter size="20px" />} />
              </PopoverTrigger>
              <PopoverContent p="5" style={{ width: "400px" }}>
                <Heading size="md" mt="2">
                  Country
                </Heading>
                <RadioGroup onChange={setCountry} value={country}>
                  <Stack direction="row">
                    {countryName.map((c, i) => {
                      return (
                        <Radio key={i} value={`${c}`}>
                          {c}
                        </Radio>
                      );
                    })}
                  </Stack>
                </RadioGroup>
                <Heading size="md" mt="2">
                  Frontend
                </Heading>
                <RadioGroup onChange={setLang1} value={lang1}>
                  <Stack direction="row">
                    {Lang1.map((l, i) => {
                      return (
                        <Radio key={i} value={`${l}`}>
                          {l}
                        </Radio>
                      );
                    })}
                  </Stack>
                </RadioGroup>
                <Heading size="md" mt="2">
                  Backend
                </Heading>
                <RadioGroup onChange={setLang2} value={lang2}>
                  <Stack direction="row">
                    {Lang2.map((j, i) => {
                      return (
                        <Radio key={i} value={`${j}`}>
                          {j}
                        </Radio>
                      );
                    })}
                  </Stack>
                </RadioGroup>
                <Button colorScheme="twitter" onClick={handleFilter} mt="4">
                  Filter
                </Button>
                <PopoverCloseButton />
              </PopoverContent>
            </Popover>
            <IconButton
              onClick={() => {
                setLogout(!logout);
              }}
            >
              <FiLogOut />
            </IconButton>
          </HStack>
        </Skeleton>
      </VStack>

      <Container as="main" minW="100%" minH="100%">
        <Tabs variant="solid-rounded" colorScheme="twitter">
          <Center>
            <TabList>
              <Tab>All Data</Tab>
              <Tab>Pinned User</Tab>
            </TabList>
          </Center>
          <TabPanels>
            <TabPanel>
              <Center position="relative" w="100%" overflow="hidden" h="36rem">
                {data.length === 0 ? (
                  <>
                    <Heading>No Result Found</Heading>
                  </>
                ) : (
                  <>
                    {data.map((d, index) => {
                      return <Card {...d} key={index} hr_id={hr.hr_id} />;
                    })}
                    <Heading
                      bgColor="twitter.600"
                      py="4"
                      px="10"
                      onClick={() => {client.invalidateQueries(["devinfo"])
                      toast({
                        title: "Reloading",
                        status: "info",
                        variant: "subtle",
                        duration: 9000,
                        isClosable: true,
                        position: "top",
                      });
                    }}
                      cursor="pointer"
                      fontSize="xl"
                      color="white"
                    >
                      Reload Now
                    </Heading>
                  </>
                )}
              </Center>
            </TabPanel>
            <TabPanel>
              <PinnedList {...hr} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </>
  );
};

export default dashboard;
