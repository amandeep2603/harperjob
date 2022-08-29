
import { Button, Center ,Heading } from "@chakra-ui/react"
import { fetcher } from "../helper/Fetcher"
import { Meta } from "../helper/Meta"
import Link from "next/link"

export default function Home() {
  return (
    <>
      <Meta/>
      <Center p="4" bg="gray.50" justifyContent="space-between">
         <Heading>Harper Job</Heading>
         <Link href="/hr/login">
          <Button colorScheme="twitter">Login</Button>
         </Link>
      </Center>
      <Center flexDir="column" h="50vh">
        <Heading>One Place to hire talents</Heading>
        <Link href="/hr/signup">
            <Button bg="black" colorScheme="twitter" color="white"  mt="10" size="lg">Get started</Button>
        </Link>
      </Center>
    </>
  )
}

