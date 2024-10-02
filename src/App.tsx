import React, { useState, useCallback, useMemo } from "react";
import {
  Input,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Text,
  Box,
} from "@chakra-ui/react";

const PRICING_TIERS = [
  { lower: 0, upper: 10000, rate: 0 },
  { lower: 10000, upper: 2000000, rate: 0.0003224 },
  { lower: 2000000, upper: 15000000, rate: 0.0001352 },
  { lower: 15000000, upper: 50000000, rate: 0.0000852 },
  { lower: 50000000, upper: 100000000, rate: 0.0000473 },
  { lower: 100000000, upper: Infinity, rate: 0.0000243 },
];

const USER_PRICE = 20;

const isValidInput = (input) => {
  return input.trim() === "" || /^\d+$/.test(input.trim());
};

const parseInput = (input) => {
  const cleanInput = input.trim();
  return cleanInput === "" ? 0 : parseInt(cleanInput, 10);
};

const calculateLogCost = (logCount) => {
  let remainingLogs = logCount;
  let cost = 0;

  for (const tier of PRICING_TIERS) {
    if (remainingLogs <= 0) break;
    const logsInTier = Math.min(remainingLogs, tier.upper - tier.lower);
    cost += logsInTier * tier.rate;
    remainingLogs -= logsInTier;
  }

  return cost;
};

const PricingCalculator = () => {
  const [logs, setLogs] = useState("");
  const [users, setUsers] = useState("");
  const [costs, setCosts] = useState({ logCost: 0, userCost: 0, totalCost: 0 });
  const [errors, setErrors] = useState({ logs: "", users: "" });

  const isValid = useMemo(() => {
    return isValidInput(logs) && isValidInput(users);
  }, [logs, users]);

  const calculateCost = useCallback(() => {
    if (!isValid) return;

    const logCount = parseInput(logs);
    const userCount = parseInput(users);

    const logCost = calculateLogCost(logCount);
    const userCost = userCount * USER_PRICE;
    const totalCost = logCost + userCost;

    setCosts({ logCost, userCost, totalCost });
  }, [logs, users, isValid]);

  const handleInputChange = (setter, errorKey) => (event) => {
    const value = event.target.value;
    setter(value);

    if (!isValidInput(value)) {
      setErrors((prev) => ({
        ...prev,
        [errorKey]: "Please enter a valid non-negative integer",
      }));
    } else {
      setErrors((prev) => ({ ...prev, [errorKey]: "" }));
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && isValid) {
      calculateCost();
    }
  };

  return (
    <Card
      maxW="md"
      mx="auto"
      p={8}
      borderRadius="lg"
      boxShadow="lg"
      backgroundColor="white"
    >
      <CardHeader mb={6}>
        <Text fontSize="2xl" fontWeight="bold" color="gray.700">
          Pricing Calculator
        </Text>
      </CardHeader>
      <CardBody>
        <Box mb={4}>
          <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.600">
            Number of Logs
          </Text>
          <Input
            type="text"
            value={logs}
            onChange={handleInputChange(setLogs, "logs")}
            onKeyPress={handleKeyPress}
            placeholder="Enter number of logs"
            size="lg"
            borderColor={errors.logs ? "red.500" : "gray.300"}
            backgroundColor={errors.logs ? "red.50" : "white"}
            _hover={{ borderColor: "gray.400" }}
          />
          {errors.logs && (
            <Text color="red.500" fontSize="xs" mt={2}>
              {errors.logs}
            </Text>
          )}
        </Box>
        <Box mb={4}>
          <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.600">
            Number of Users
          </Text>
          <Input
            type="text"
            value={users}
            onChange={handleInputChange(setUsers, "users")}
            onKeyPress={handleKeyPress}
            placeholder="Enter number of users"
            size="lg"
            borderColor={errors.users ? "red.500" : "gray.300"}
            backgroundColor={errors.users ? "red.50" : "white"}
            _hover={{ borderColor: "gray.400" }}
          />
          {errors.users && (
            <Text color="red.500" fontSize="xs" mt={2}>
              {errors.users}
            </Text>
          )}
        </Box>
        <Button
          onClick={calculateCost}
          w="full"
          mt={4}
          size="lg"
          colorScheme="teal"
          disabled={!isValid}
          _hover={{ bg: "teal.500" }}
        >
          Calculate Cost
        </Button>
      </CardBody>
      <CardFooter mt={6}>
        <Box textAlign="center">
          <Text fontSize="lg" fontWeight="semibold" color="gray.700">
            Log Cost: ${costs.logCost.toFixed(2)}
          </Text>
          <Text fontSize="lg" fontWeight="semibold" color="gray.700">
            User Cost: ${costs.userCost.toFixed(2)}
          </Text>
          <Text fontSize="xl" fontWeight="bold" mt={2} color="teal.600">
            Total Cost: ${costs.totalCost.toFixed(2)}
          </Text>
        </Box>
      </CardFooter>
    </Card>
  );
};

export default PricingCalculator;
