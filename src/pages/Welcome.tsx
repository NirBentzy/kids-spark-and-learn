
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

const Welcome = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [timerEnabled, setTimerEnabled] = useState(true);
  const [error, setError] = useState("");

  const handleStart = () => {
    if (!name.trim()) {
      setError("Please enter your name to continue");
      return;
    }
    
    // Store user preferences in localStorage
    localStorage.setItem("playerName", name);
    localStorage.setItem("timerEnabled", String(timerEnabled));
    
    // Navigate to subject selection
    navigate("/subjects");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50 p-4">
      <Card className="w-full max-w-md shadow-lg border-purple-200">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-purple-700">
            Kids Spark and Learn
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-lg">Your Name</Label>
            <Input 
              id="name"
              value={name} 
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              placeholder="Enter your name"
              className="text-lg p-6 border-purple-200 focus:border-purple-400"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="timer-mode" className="text-lg">Timer Mode</Label>
            <Switch 
              id="timer-mode"
              checked={timerEnabled} 
              onCheckedChange={setTimerEnabled}
            />
          </div>
          
          {timerEnabled && (
            <p className="text-sm text-gray-600 italic">
              You'll have 20 seconds to answer each question!
            </p>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleStart} 
            className="w-full bg-purple-600 hover:bg-purple-700 text-xl py-6"
          >
            Let's Start Learning!
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Welcome;
