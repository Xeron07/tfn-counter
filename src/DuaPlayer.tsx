import { useState, useRef, useEffect } from "react";
import { AudioLines, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import duaAudio from "@/audio/DUA_OF_YUNUS.mp3";

export function DuaPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio(duaAudio);
    audioRef.current.onended = () => {
      setIsPlaying(false);
      setIsVisible(false);
    };
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const playDua = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setIsVisible(false);
    } else {
      setIsVisible(true);
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className='rounded-lg w-full mb-6'>
      {/* Header with button - no overflow-hidden here */}
      <div className='w-full flex justify-between items-center px-2 border-b-3 border-green-600 bg-black rounded-lg shadow-2xl'>
        <span className='text-sm font-semibold text-green-600'>Dua</span>
        <Button
          variant='ghost'
          onClick={playDua}
          className='bg-green-600 hover:bg-green-700 text-white rounded-full h-8 w-8 transition-all active:scale-95 z-10'
          style={{ background: "transparent" }}>
          {isPlaying ? (
            <AudioLines
              className={`text-green-600 h-5 w-9 ${
                isPlaying ? "animate-pulse" : ""
              }`}
            />
          ) : (
            <Play
              size={20}
              className={`text-green-500 ${isPlaying ? "animate-pulse" : ""}`}
            />
          )}
        </Button>
      </div>

      {/* Slide content with overflow-hidden only on this div */}
      <div className='overflow-hidden'>
        <div
          className={`px-2 py-4 mx-4 flex justify-center items-center bg-gray-200 rounded-b-2xl border-b-3 border-green-500 transition-all duration-500 ease-in-out transform ${
            isVisible
              ? "max-h-96 opacity-100 translate-y-0"
              : "max-h-0 opacity-0 -translate-y-full"
          }`}>
          <span className='text-base md:text-3xl font-bold text-green-600 font-arabic text-center'>
            لَّآ إِلَٰهَ إِلَّآ أَنتَ سُبْحَٰنَكَ إِنِّى كُنتُ مِنَ
            ٱلظَّٰلِمِينَ
          </span>
        </div>
      </div>
    </div>
  );
}
