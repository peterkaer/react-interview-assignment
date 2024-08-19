"use client";

import {
  Accordion,
  AccordionIcon,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Avatar,
  Box,
  Center,
  Flex,
  Heading,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";

import { z } from "zod";
import axios from "axios";

import { User } from "./models/user";

const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  first_name: z.string(),
  last_name: z.string(),
  avatar: z.string().url(),
});

const fetchUsers = async () => {
  const { data } = await axios.get("https://reqres.in/api/users?delay=2");

  const validatedData = data.data.map((user: any) => {
    const result = userSchema.safeParse(user);

    if (!result.success) {
      console.error(
        "Validation Failed for User:",
        user.id,
        result.error.errors,
      );

      throw new Error("Invalid Data Format Received from the API");
    }

    return result.data as User;
  });

  return validatedData;
};

export default function Users() {
  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  return (
    <Center
      flexDirection="column"
      minHeight="100vh"
      justifyContent="flex-start"
      mt="20vh"
    >
      <Heading as="h2" size="lg" mb={4}>
        USERS
      </Heading>
      <Box width={["90%", "80%", "50%"]}>
        {isLoading ? (
          <Center mt="10vh">
            <Spinner size="xl" />
          </Center>
        ) : error ? (
          <Center mt="5vh">
            <Text fontSize="lg" color="red.500">
              Failed to Load Users - Please try Again Later.
            </Text>
          </Center>
        ) : (
          <Accordion allowToggle>
            {users.map((user: User) => (
              <AccordionItem key={user.id}>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    {user.first_name} {user.last_name}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>

                <AccordionPanel pb={4}>
                  <Flex alignItems="center">
                    <Avatar
                      name={`${user.first_name} ${user.last_name}`}
                      src={user.avatar}
                      size="l"
                    />
                    <Box padding={8}>
                      <p>
                        <strong>First Name:</strong>&nbsp;
                        <a
                          href={`/users/${user.id}`}
                          style={{ textDecoration: "underline" }}
                        >
                          {user.first_name}
                        </a>
                        <br />
                        <strong>Last Name:</strong>&nbsp; {user.last_name}
                        <br />
                        <strong>Email:</strong>&nbsp;
                        <a
                          href="mailto:{user.email}"
                          style={{ textDecoration: "underline" }}
                        >
                          {user.email}
                        </a>
                      </p>
                    </Box>
                  </Flex>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </Box>
    </Center>
  );
}
