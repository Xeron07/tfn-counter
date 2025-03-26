import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoaderPinwheel } from "lucide-react";

interface Entry {
  timestamp: string;
  name: string;
  count: number;
}

const TotalCountCard = ({
  total,
  fetchLoading,
  sheetData,
}: {
  total: number;
  fetchLoading: boolean;
  sheetData: Entry[];
}) => {
  const [showTable, setShowTable] = useState(false);

  const handleShowTable = () => {
    setShowTable(true);
    setTimeout(() => setShowTable(false), 60000); // Auto-hide after 1 minute (60,000ms)
  };

  return (
    <Card className='w-full max-w-md p-4 shadow-xl rounded-lg mt-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white animate-gradient'>
      <CardHeader className='text-center'>
        <CardTitle className='text-base md:text-2xl font-bold'>
          ✨ Total Count Till Now ✨
        </CardTitle>
      </CardHeader>

      <CardContent className='flex justify-center items-center text-xl md:text-4xl font-extrabold'>
        {fetchLoading ? (
          <LoaderPinwheel className='animate-spin size-10' />
        ) : (
          total
        )}
      </CardContent>

      <CardFooter className='flex justify-center'>
        <Button onClick={handleShowTable}>Show Details 📋</Button>
      </CardFooter>

      {showTable && (
        <div className='mt-4 p-4 bg-white text-black rounded-lg shadow-lg overflow-x-auto max-h-80'>
          <h3 className='text-lg font-semibold mb-3'>📅 Recent Entries</h3>
          <div className='overflow-auto max-h-60 border border-gray-300 rounded-lg'>
            <table className='w-full text-left border-collapse'>
              {/* Table Header */}
              <thead className='bg-gray-100 sticky top-0'>
                <tr className='border-b border-gray-300'>
                  <th className='p-3 font-semibold text-gray-700 border-r'>
                    📆 Timestamp
                  </th>
                  <th className='p-3 font-semibold text-gray-700 border-r'>
                    👤 Name
                  </th>
                  <th className='p-3 font-semibold text-gray-700'>🔢 Count</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {sheetData.map((entry, index) => (
                  <tr
                    key={index}
                    className='border-b border-gray-300 hover:bg-gray-50'>
                    <td className='p-3 border-r'>
                      {new Date(entry.timestamp).toLocaleString("en-US", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className='p-3 border-r'>{entry.name}</td>
                    <td className='p-3'>{entry.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Card>
  );
};

export default TotalCountCard;
