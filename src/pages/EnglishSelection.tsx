
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const EnglishSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50 p-4">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-center text-purple-700">
          Choose English Activity
        </h1>
        
        <div className="grid gap-4">
          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow border-purple-200"
            onClick={() => navigate("/english/letters")}
          >
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Letters Before & After</h2>
                <p className="text-gray-600">Identify the letter before or after</p>
              </div>
              <span className="text-4xl">🔤</span>
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow border-purple-200"
            onClick={() => navigate("/english/vocabulary")}
          >
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Vocabulary</h2>
                <p className="text-gray-600">Name objects and animals from pictures</p>
              </div>
              <span className="text-4xl">🖼️</span>
            </CardContent>
          </Card>
        </div>
        
        <Button 
          variant="outline"
          onClick={() => navigate("/subjects")}
          className="w-full border-purple-300"
        >
          Back to Subject Selection
        </Button>
      </div>
    </div>
  );
};

export default EnglishSelection;
