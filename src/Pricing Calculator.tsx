import React, { useState, useCallback, useMemo } from 'react';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

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
  return input.trim() === '' || /^\d+$/.test(input.trim());
};

const parseInput = (input) => {
  const cleanInput = input.trim();
  return cleanInput === '' ? 0 : parseInt(cleanInput, 10);
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
  const [logs, setLogs] = useState('');
  const [users, setUsers] = useState('');
  const [costs, setCosts] = useState({ logCost: 0, userCost: 0, totalCost: 0 });
  const [errors, setErrors] = useState({ logs: '', users: '' });

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
      setErrors(prev => ({ ...prev, [errorKey]: 'Please enter a valid non-negative integer' }));
    } else {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && isValid) {
      calculateCost();
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Pricing Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label htmlFor="logs" className="block text-sm font-medium text-gray-700">
              Number of Logs
            </label>
            <Input
              type="text"
              id="logs"
              value={logs}
              onChange={handleInputChange(setLogs, 'logs')}
              onKeyPress={handleKeyPress}
              placeholder="Enter number of logs (e.g., 1000000)"
              className="mt-1"
            />
            {errors.logs && <p className="text-xs text-red-500 mt-1">{errors.logs}</p>}
          </div>
          <div>
            <label htmlFor="users" className="block text-sm font-medium text-gray-700">
              Number of Users
            </label>
            <Input
              type="text"
              id="users"
              value={users}
              onChange={handleInputChange(setUsers, 'users')}
              onKeyPress={handleKeyPress}
              placeholder="Enter number of users (e.g., 5)"
              className="mt-1"
            />
            {errors.users && <p className="text-xs text-red-500 mt-1">{errors.users}</p>}
          </div>
          <Button onClick={calculateCost} className="w-full" disabled={!isValid}>
            Calculate Cost
          </Button>
          <div className="text-center space-y-2">
            <p className="text-md">Log Cost: ${costs.logCost.toFixed(2)}</p>
            <p className="text-md">User Cost: ${costs.userCost.toFixed(2)}</p>
            <p className="text-lg font-semibold">Total Cost: ${costs.totalCost.toFixed(2)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingCalculator;
