import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import PricingCalculator from "./App";

const rootElement = document.getElementById("root");

// Add null check or use non-null assertion
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement as HTMLElement);
  root.render(
    <ChakraProvider>
      <PricingCalculator />
    </ChakraProvider>
  );
}
