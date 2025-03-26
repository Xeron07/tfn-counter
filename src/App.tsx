import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet } from "lucide-react";

const SHEET_API_URL = import.meta.env.VITE_SHEET_API_URL || "";

function App() {
  const [name, setName] = useState("");
  const [count, setCount] = useState("");
  const [total, setTotal] = useState(0);

  const fetchCounterData = () => {
    fetch(SHEET_API_URL)
      .then((res) => res.json())
      .then((data) => {
        const sum = data.reduce(
          (
            acc: number,
            row: {
              timestamp: string;
              name: string;
              count: number;
            }
          ) => acc + Number(row.count),
          0
        );
        setTotal(sum);
      });
  };

  useEffect(() => {
    fetchCounterData();
    //eslinst-disable-next-line
  }, []);

  const handleSubmit = async () => {
    if (!name || !count) return;

    const requestData = {
      timestamp: new Date().toISOString(),
      name,
      count,
    };

    const sendDataToSheet = async (data: typeof requestData) => {
      try {
        // Use fetch instead of axios for better CORS control
        const response = await fetch(SHEET_API_URL, {
          method: "POST",
          mode: "no-cors", // Important for Google Apps Script
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        // Google Apps Script returns plain text that needs parsing
        const text = await response.text();
        const result = JSON.parse(text);
        return result.success;
      } catch (error) {
        console.error("Error sending data to sheet:", error);
        return false;
      }
    };

    const isSuccess = await sendDataToSheet(requestData);

    fetchCounterData();

    if (isSuccess) {
      console.log("Data sent successfully!");
      setName("");
      setCount("");
      setTotal((prev) => prev + Number(count));
    }
  };

  return (
    <div
      className='min-h-screen flex flex-col items-center justify-center text-gray-900 rtl w-[100vw] px-4 md:px-0'
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/emerging-it/image/upload/v1742947752/cdn/qp9gycwdk8qhvhxyxqu0.jpg')",
        backgroundSize: "cover",
      }}>
      <Card className='w-full max-w-md p-6 bg-white shadow-xl rounded-lg'>
        <CardHeader>
          <CardTitle className='text-xl font-semibold mb-4 flex items-center justify-center gap-2'>
            <Sheet className='text-green-400 text-3xl' /> Entry For Tasbih Count
          </CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col gap-4'>
          <Input
            type='text'
            placeholder='Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type='number'
            placeholder='Count'
            value={count}
            onChange={(e) => setCount(e.target.value)}
          />
          <Button className='bg-green-500 text-white' onClick={handleSubmit}>
            Submit
          </Button>
        </CardContent>
      </Card>
      <Card className='w-full max-w-md p-4 shadow-xl rounded-lg mt-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500  text-white animate-gradient'>
        <CardHeader className='text-center'>
          <CardTitle className='text-base md:text-2xl font-bold'>
            ✨ Total Count Till Now ✨
          </CardTitle>
        </CardHeader>
        <CardContent className='flex justify-center items-center text-xl md:text-4xl font-extrabold'>
          {total}
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
