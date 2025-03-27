import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoaderCircle, LoaderPinwheel } from "lucide-react";
import { Badge } from "./components/ui/badge";

interface Entry {
  timestamp: string;
  name: string;
  count: number;
}

const TotalCountCard = ({
  total,
  fetchLoading,
  sheetData,
  name,
  count,
  postLoading,
  handleSubmitData,
  handleChangeName,
  handleChangeCount,
}: {
  total: number;
  fetchLoading: boolean;
  sheetData: Entry[];
  name: string;
  count: string;
  postLoading: boolean;
  handleChangeName: (val: string) => void;
  handleChangeCount: (val: string) => void;
  handleSubmitData: () => Promise<void>;
}) => {
  const [showTable, setShowTable] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleShowTable = () => {
    if (!showTable) setTimeout(() => setShowTable(false), 60000); // Auto-hide after 1 min
    setShowTable((prev) => !prev);
  };

  const handleSubmit = () => {
    handleSubmitData().then(() => setDrawerOpen(false));
    // Close drawer after submit
  };

  return (
    <div className='w-full max-w-md '>
      {/* 🖥 Desktop View */}
      <Card className='p-4 shadow-xl rounded-lg mt-6 bg-white'>
        <CardHeader className='text-center'>
          <CardTitle className='text-base md:text-2xl font-bold'>
            ✨ Total Count Till Now ✨
          </CardTitle>
        </CardHeader>

        <CardContent className='flex justify-center items-center text-xl md:text-4xl font-extrabold'>
          {fetchLoading ? (
            <LoaderPinwheel className='animate-spin size-10' />
          ) : (
            <Badge className='text-xl md:text-4xl font-bold bg-rose-500'>
              {total}
            </Badge>
          )}
        </CardContent>

        <CardFooter className='flex justify-center'>
          {!!sheetData?.length && (
            <>
              <Button onClick={handleShowTable} className='hidden md:block'>
                {showTable ? "Hide Details 📋" : "Show Details 📋"}
              </Button>

              {/* 📱 Mobile View - Add New Entry Button */}
              <div className='md:hidden flex justify-center mt-4'>
                <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                  <DrawerTrigger asChild>
                    <Button
                      className='w-full text-black '
                      variant={"outline"}
                      style={{
                        backgroundColor: "white",
                        border: "1px solid black",
                      }}>
                      ➕ Add New Entry{" "}
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent className='px-6 py-10 bg-white rounded-t-lg shadow-lg'>
                    <h2 className='text-lg font-bold text-center mb-4'>
                      📝 Add New Entry
                    </h2>
                    <div className='space-y-3'>
                      <div className='flex flex-col space-y-1.5'>
                        <Label>Name</Label>
                        <Input
                          value={name}
                          onChange={(e) => handleChangeName(e.target.value)}
                          placeholder='Enter name'
                        />
                      </div>
                      <div className='flex flex-col space-y-1.5'>
                        <Label>Count</Label>
                        <Input
                          type='number'
                          value={count}
                          onChange={(e) => handleChangeCount(e.target.value)}
                          placeholder='Enter count'
                        />
                      </div>
                      <Button
                        className='w-full bg-green-500 text-white'
                        onClick={handleSubmit}
                        disabled={fetchLoading || postLoading}>
                        {postLoading ? (
                          <>
                            Submitting...{" "}
                            <LoaderCircle className='animate-spin' />
                          </>
                        ) : (
                          "✅ Submit Entry"
                        )}
                      </Button>
                    </div>
                  </DrawerContent>
                </Drawer>
              </div>
            </>
          )}
        </CardFooter>

        {showTable && (
          <div className='hidden md:block mt-4 p-4  text-whiterounded-lg shadow-lg overflow-hidden bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white animate-gradient'>
            <h3 className='text-lg font-semibold mb-3'>📅 Recent Entries</h3>
            <div className='overflow-auto max-h-80 border border-gray-300 rounded-lg'>
              <table className='w-full text-left border-collapse'>
                {/* Sticky Table Header */}
                <thead className='bg-gray-100 sticky top-0'>
                  <tr className='border-b border-gray-300'>
                    <th className='p-3 font-semibold text-gray-700 border-r sticky top-0 bg-gray-100'>
                      📆 Timestamp
                    </th>
                    <th className='p-3 font-semibold text-gray-700 border-r sticky top-0 bg-gray-100'>
                      👤 Name
                    </th>
                    <th className='p-3 font-semibold text-gray-700 sticky top-0 bg-gray-100'>
                      🔢 Count
                    </th>
                  </tr>
                </thead>
                {/* Table Body */}
                <tbody className='max-h-[10vh] overflow-y-auto bg-white text-black'>
                  {sheetData.reverse().map((entry, index) => (
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
        {/* 📱 Mobile View - Table Always Visible */}
        {!!sheetData?.length && (
          <div className='md:hidden p-4 rounded-lg shadow-md text-white bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white animate-gradient'>
            <h3 className='text-lg font-semibold mb-3 text-center'>
              📅 Recent Entries
            </h3>
            <div className='overflow-auto max-h-[40vh] border border-gray-300 rounded-lg'>
              <table className='w-full text-left border-collapse'>
                <thead className='bg-gray-100 sticky top-0'>
                  <tr className='border-b border-gray-300'>
                    <th className='p-3 font-semibold text-gray-700 border-r sticky top-0 bg-gray-100'>
                      📆 Timestamp
                    </th>
                    <th className='p-3 font-semibold text-gray-700 border-r sticky top-0 bg-gray-100'>
                      👤 Name
                    </th>
                    <th className='p-3 font-semibold text-gray-700 sticky top-0 bg-gray-100'>
                      🔢 Count
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white text-black'>
                  {sheetData.reverse().map((entry, index) => (
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
      <Badge className='md:hidden block w-full text-center mt-2'>
        Horipur Squad Tasbih Recitation Count
      </Badge>
    </div>
  );
};

export default TotalCountCard;
