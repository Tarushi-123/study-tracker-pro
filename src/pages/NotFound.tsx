import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f0e6d8] flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-[#8b7355] to-[#a69580] flex items-center justify-center mx-auto mb-6 shadow-[6px_6px_12px_#d4c9ba,-6px_-6px_12px_#ffffff]">
          <span className="text-3xl font-bold text-white">?</span>
        </div>
        <h1 className="text-5xl font-bold text-[#3d3429] mb-2">404</h1>
        <p className="text-lg text-[#8b7355] mb-8">
          This page doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="bg-[#faf5ee] border-[#e0d5c5] text-[#5a4d3e] hover:bg-[#e8dfd2] shadow-[4px_4px_8px_#d4c9ba,-4px_-4px_8px_#ffffff]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
          <Button
            onClick={() => navigate("/")}
            className="bg-[#8b7355] hover:bg-[#6b5b47] text-white shadow-[4px_4px_8px_#d4c9ba,-4px_-4px_8px_#ffffff]"
          >
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
        </div>
      </div>
    </div>
  );
}
