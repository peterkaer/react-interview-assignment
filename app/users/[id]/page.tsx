"use client";

import {
  Avatar,
  Box,
  Center,
  Flex,
  Heading,
  Spinner,
  Text,
} from "@chakra-ui/react";

import { useQuery } from "@tanstack/react-query";

import axios from "axios";

import { User } from "@/app/models/user";

const fetchUser = async (id: string) => {
  const { data } = await axios.get(`https://reqres.in/api/users/${id}`);

  return data;
};

export default function Details({ params }: { params: { id: string } }) {
  const { id } = params;

  const { data, isLoading, error } = useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchUser(id),
  });

  const user: User = data?.data || {};

  return (
    <Center
      flexDirection="column"
      minHeight="100vh"
      justifyContent="flex-start"
      mt="20vh"
    >
      <Box width={["90%", "80%", "50%"]}>
        {isLoading ? (
          <Center mt="10vh">
            <Spinner size="xl" />
          </Center>
        ) : error ? (
          <Center mt="5vh">
            <Text fontSize="lg" color="red.500">
              Failed to load users - please try again later.
            </Text>
          </Center>
        ) : (
          <Flex alignItems="center">
            <Avatar
              name={`${user.first_name} ${user.last_name}`}
              src={user.avatar}
              size="l"
            />
            <Box padding={8}>
              <p>
                <strong>First Name:</strong>&nbsp;
                {user.first_name}
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
        )}
      </Box>
    </Center>
  );
}
