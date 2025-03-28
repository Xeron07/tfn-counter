import { useState, useEffect, useRef, useCallback } from "react";
import {
  RotateCcw,
  Save,
  ChevronUp,
  ChevronDown,
  Volume2,
  VolumeOff,
  LoaderCircle,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import tasbihSound from "@/audio/one_drop.mp3";
import decreaseSound from "@/audio/on_drop_back.mp3";
import resetSound from "@/audio/drop_reset.wav";

import FlipNumbers from "react-flip-numbers";
import { DuaPlayer } from "./DuaPlayer";
import { Drawer, DrawerContent, DrawerTrigger } from "./components/ui/drawer";
import { Label } from "./components/ui/label";
import { Input } from "./components/ui/input";

export default function TasbihCounter({
  name,
  postLoading,
  handleSubmitData,
  handleChangeName,
  handleChangeCount,
}: {
  name: string;
  postLoading: boolean;
  handleChangeName: (val: string) => void;
  handleChangeCount: (val: string) => void;
  handleSubmitData: () => Promise<void>;
}) {
  const [count, setCount] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const incrementRef = useRef<HTMLButtonElement>(null);
  const decrementRef = useRef<HTMLButtonElement>(null);

  // Memoize audio objects
  const tasbihAudio = useRef(new Audio(tasbihSound));
  const tasbihDecreaseAudio = useRef(new Audio(decreaseSound));
  const tasbihResetAudio = useRef(new Audio(resetSound));

  const toggleMute = () => {
    tasbihAudio.current.muted = !isMuted;
    tasbihDecreaseAudio.current.muted = !isMuted;
    tasbihResetAudio.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const animateButton = useCallback(
    (buttonRef: React.RefObject<HTMLButtonElement | null>) => {
      if (buttonRef?.current) {
        buttonRef.current?.classList.add("scale-95");
        setTimeout(() => buttonRef.current?.classList.remove("scale-95"), 100);
      }
    },
    []
  );

  const playSound = useCallback(() => {
    tasbihAudio.current.currentTime = 0;
    tasbihAudio.current.play();
  }, []);

  const playDecreaseSound = useCallback(() => {
    tasbihDecreaseAudio.current.currentTime = 0;
    tasbihDecreaseAudio.current.play();
  }, []);

  const playResetSound = useCallback(() => {
    tasbihResetAudio.current.currentTime = 0;
    tasbihResetAudio.current.play();
  }, []);

  const incrementCounter = useCallback(() => {
    setCount((prev) => prev + 1);
    animateButton(incrementRef);
    playSound();
  }, [animateButton, playSound]);

  const decrementCounter = useCallback(() => {
    if (count > 0) {
      setCount((prev) => prev - 1);
      animateButton(decrementRef);
      playDecreaseSound();
    }
  }, [count, animateButton, playDecreaseSound]);

  const resetCounter = useCallback(() => {
    if (count > 0) {
      setCount(0);
      playResetSound();
    }
  }, [count, playResetSound]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.key === "+") incrementCounter();
      if (e.key === "-") decrementCounter();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [incrementCounter, decrementCounter]);

  const formattedCount = count.toString().padStart(6, "0");

  return (
    <div className='flex flex-col items-center justify-center min-h-screen w-full p-4'>
      <Card className=' rounded-3xl shadow-lg bg-black border-0 w-56'>
        <CardContent className='p-3'>
          {/* 6-digit Odometer with animation */}
          <div className='bg-white rounded-md px-2 py-1 mb-3 h-16 flex justify-end items-center overflow-hidden'>
            <FlipNumbers
              height={40}
              width={30}
              color='#01301C'
              background='#ffffff'
              play
              perspective={300}
              numbers={formattedCount}
              numberStyle={{
                fontFamily: "'Electrolize', sans-serif",
                fontWeight: "bold",
                fontSize: "2rem",
              }}
              duration={0.2} // Faster animation (200ms)
            />
          </div>

          {/* Buttons */}
          <div className='flex flex-col items-center mt-2'>
            <Button
              ref={incrementRef}
              onClick={incrementCounter}
              className=' bg-green-600 hover:bg-green-700  rounded-full shadow-lg transition-all active:scale-95 w-28 h-28 focus:outline-none focus:ring-0 focus:border-0 hover:outline-none'
              variant={"outline"}
              style={{
                backgroundColor: "#01301C",
                borderRadius: "calc(infinity * 1px)",
                color: "#00EA86",
              }}>
              <ChevronUp className='size-22' />
            </Button>
            <Button
              ref={decrementRef}
              onClick={decrementCounter}
              className=' bg-green-600 hover:bg-green-700  rounded-full shadow-lg transition-all active:scale-95 w-14 h-14 mt-[-15px] z-50'
              variant={"outline"}
              style={{
                backgroundColor: "#01301C",
                borderRadius: "calc(infinity * 1px)",
                border: "4px solid black",
                color: "#00EA86",
              }}>
              <ChevronDown className='size-8' />
            </Button>
          </div>
        </CardContent>

        <CardFooter className='p-3'>
          <div className='w-full grid grid-cols-3 gap-2'>
            <Drawer
              onOpenChange={(open: boolean) =>
                !!open && handleChangeCount(`${count}`)
              }>
              <DrawerTrigger asChild>
                <Button
                  variant='outline'
                  className='h-10 text-green-600 border-green-600 hover:bg-green-50'>
                  <Save size={18} />
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
                  <Button
                    className='w-full bg-green-500 text-white'
                    onClick={() => {
                      handleSubmitData();
                      resetCounter();
                    }}
                    disabled={postLoading}>
                    {postLoading ? (
                      <>
                        Submitting... <LoaderCircle className='animate-spin' />
                      </>
                    ) : (
                      "✅ Submit Entry"
                    )}
                  </Button>
                </div>
              </DrawerContent>
            </Drawer>
            <Button
              onClick={resetCounter}
              disabled={count === 0}
              variant='outline'
              className={`h-10 text-green-600 border-green-600 hover:bg-green-50 ${
                count === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}>
              <RotateCcw size={18} />
            </Button>
            <Button
              onClick={() => toggleMute()}
              variant='outline'
              className='h-10 text-green-600 border-green-600 hover:bg-green-50'>
              {isMuted ? (
                <VolumeOff size={18} className='text-red-500' /> // Muted state (red)
              ) : (
                <Volume2 size={18} /> // Unmuted state
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>

      <div className='mt-6 text-sm text-green-600'>
        <DuaPlayer />
      </div>
    </div>
  );
}
