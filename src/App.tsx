import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoaderCircle, Sheet } from "lucide-react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import "animate.css";
import TotalCountCard from "./TotalCountCard";

const SHEET_API_URL = import.meta.env.VITE_SHEET_API_URL || "";

function App() {
  const [name, setName] = useState("");
  const [count, setCount] = useState("");
  const [total, setTotal] = useState(0);

  const [sheetData, setSheetData] = useState<
    {
      timestamp: string;
      name: string;
      count: number;
    }[]
  >([]);

  const [fetchLoading, setFetchLoading] = useState(false);
  const [postLoading, setPostLoading] = useState(false);

  const fetchCounterData = () => {
    setFetchLoading(true);
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
        setSheetData(data);
        setFetchLoading(false);
      });
  };

  useEffect(() => {
    fetchCounterData();
    //eslinst-disable-next-line
  }, []);

  const showSuccessAlert = async () => {
    await Swal.fire({
      title: '<span style="color: #4ecdc4">🎉 Success! 🎉</span>',
      html: `
            <div style="font-size: 1.1rem">
              <p>Thank you for participating! 💖</p>
              <p>Your count of <strong>${count}</strong> has been recorded.</p>
              <p style="font-size: 0.9rem; margin-top: 10px">You're amazing! ✨</p>
            </div>
          `,
      icon: "success",
      background: "#f8f9fa",
      showConfirmButton: true,
      confirmButtonText: "Got it! 😊",
      confirmButtonColor: "#4ecdc4",
      showClass: {
        popup: "animate__animated animate__fadeInDown",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp",
      },
      timer: 10000,
      timerProgressBar: true,
      footer: "<small>Horipur Squad Counter</small>",
    });
  };

  // Validation utilities
  const validateName = (name: string): { valid: boolean; message?: string } => {
    if (!name || name.trim() === "") {
      return { valid: false, message: "Name is required" };
    }
    if (name.length > 20) {
      return { valid: false, message: "Name must be 20 characters or less" };
    }
    if (/[<>{}]/.test(name)) {
      return { valid: false, message: "Name contains invalid characters" };
    }
    return { valid: true };
  };

  const validateCount = (
    count: string
  ): { valid: boolean; message?: string } => {
    if (!count || count.trim() === "") {
      return { valid: false, message: "Count is required" };
    }
    if (!/^\d+$/.test(count)) {
      return { valid: false, message: "Count must be a number" };
    }
    const num = parseInt(count, 10);
    if (num > 9999) {
      return { valid: false, message: "Count must be less than 9999" };
    }
    if (num <= 0) {
      return { valid: false, message: "Count must be positive" };
    }
    return { valid: true };
  };

  const handleSubmit = async () => {
    // Validate inputs
    const nameValidation = validateName(name);
    const countValidation = validateCount(count);

    if (!nameValidation.valid || !countValidation.valid) {
      await Swal.fire({
        title: "🚨 Oops! Something’s Missing! 🚨",
        html: `
    <div style="
      text-align: center;
      padding: 15px;
      border: 2px dashed #ff6b6b;
      border-radius: 10px;
      background-color: #fff3f3;
      color: #d63031;
      font-size: 16px;
      font-weight: bold;
      display: inline-block;
    ">
      ${nameValidation.message ? `<p>⚠️ ${nameValidation.message}</p>` : ""}
      ${countValidation.message ? `<p>⚠️ ${countValidation.message}</p>` : ""}
    </div>
    <p style="margin-top: 15px;">Let's fix this and try again! 💪😃</p>
  `,
        icon: "error",
        confirmButtonColor: "#ff6b6b",
        confirmButtonText: "Got it! 🔄",
        showClass: {
          popup: "animate__animated animate__headShake",
        },
      });
      return;
    }

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
        await response.text();
        return true;
      } catch (error) {
        console.error("Error sending data to sheet:", error);
        return false;
      }
    };

    setPostLoading(true);
    const response = await sendDataToSheet(requestData);
    if (response) {
      fetchCounterData();
      showSuccessAlert();

      setName("");
      setCount("");
      setTotal((prev) => prev + Number(count));
    } else {
      await Swal.fire({
        title: "Oops!",
        text: "Something went wrong. Please try again.",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    }

    setPostLoading(false);
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
          <Button
            className='bg-green-500 text-white flex justify-center items-center gap-2'
            onClick={handleSubmit}
            disabled={postLoading || fetchLoading}>
            {postLoading ? (
              <>
                Submitting... <LoaderCircle className='animate-spin' />
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </CardContent>
      </Card>
      <TotalCountCard
        fetchLoading={fetchLoading}
        total={total}
        sheetData={sheetData}
      />
    </div>
  );
}

export default App;
