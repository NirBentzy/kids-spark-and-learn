
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import LeaderboardButton from "@/components/LeaderboardButton";

const SubjectSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50 p-4">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-center text-purple-700">
          Choose Your Subject
        </h1>
        
        <div className="grid gap-4">
          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow border-purple-200"
            onClick={() => navigate("/math")}
          >
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Math</h2>
                <p className="text-gray-600">Practice multiplication from 0×0 to 12×12</p>
              </div>
              <div className="flex items-center gap-2">
                <LeaderboardButton game="math" />
                <span className="text-4xl">🔢</span>
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow border-purple-200"
            onClick={() => navigate("/english")}
          >
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">English</h2>
                <p className="text-gray-600">Practice letters and vocabulary</p>
              </div>
              <span className="text-4xl">📝</span>
            </CardContent>
          </Card>
        </div>
        
        <Button 
          variant="outline"
          onClick={() => navigate("/")}
          className="w-full border-purple-300"
        >
          Back to Welcome Screen
        </Button>
      </div>
    </div>
  );
};

export default SubjectSelection;
