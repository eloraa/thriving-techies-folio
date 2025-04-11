'use client';

import { Button } from '@/components/ui/button';
import { Pause, Play, Plus, Minus, Volume2 } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { stripMarkdown } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TextToSpeechProps {
  text: string;
}

export const TextToSpeech = ({ text }: TextToSpeechProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [rate, setRate] = useState(1);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [showControls, setShowControls] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const voicesLoadedRef = useRef(false);

  const cleanText = stripMarkdown(text);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);

        if (!voicesLoadedRef.current) {
          // Try to find Google US English voice with more flexible matching
          const googleUSVoice = availableVoices.find(voice => voice.name.toLowerCase().includes('google') && voice.lang.toLowerCase().includes('en-us'));

          // If no Google voice found, try to find any US English voice
          const anyUSVoice = availableVoices.find(voice => voice.lang.toLowerCase().includes('en-us'));

          // If still no voice found, use the first available voice
          const defaultVoice = availableVoices[0];

          setSelectedVoice(googleUSVoice || anyUSVoice || defaultVoice);
          voicesLoadedRef.current = true;
        }
      }
    };

    // Load voices immediately if they're already available
    loadVoices();

    // Set up the voiceschanged event listener
    window.speechSynthesis.onvoiceschanged = loadVoices;

    // Cleanup
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const createUtterance = () => {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Wait a small amount of time to ensure the cancel operation is complete
    return new Promise<SpeechSynthesisUtterance>(resolve => {
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = rate;

        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }

        utterance.onend = () => {
          setIsPlaying(false);
        };

        utteranceRef.current = utterance;
        resolve(utterance);
      }, 100);
    });
  };

  const togglePlayPause = async () => {
    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    } else {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      } else {
        try {
          const utterance = await createUtterance();
          window.speechSynthesis.speak(utterance);
        } catch (error) {
          console.error('Failed to start speech synthesis:', error);
          setIsPlaying(false);
        }
      }
      setIsPlaying(true);
    }
  };

  const increaseSpeed = async () => {
    const newRate = Math.min(rate + 0.25, 2);
    setRate(newRate);

    if (isPlaying) {
      try {
        const utterance = await createUtterance();
        window.speechSynthesis.speak(utterance);
      } catch (error) {
        console.error('Failed to update speech rate:', error);
      }
    }
  };

  const decreaseSpeed = async () => {
    const newRate = Math.max(rate - 0.25, 0.5);
    setRate(newRate);

    if (isPlaying) {
      try {
        const utterance = await createUtterance();
        window.speechSynthesis.speak(utterance);
      } catch (error) {
        console.error('Failed to update speech rate:', error);
      }
    }
  };

  const handleVoiceChange = async (voiceName: string) => {
    const voice = voices.find(v => v.name === voiceName);
    if (voice) {
      // First pause any ongoing speech
      if (isPlaying) {
        window.speechSynthesis.pause();
        setIsPlaying(false);
      }

      // Cancel any pending utterances
      window.speechSynthesis.cancel();

      // Wait for the speech synthesis to fully stop
      await new Promise(resolve => setTimeout(resolve, 100));

      // Update the selected voice
      setSelectedVoice(voice);

      // If we were playing before, restart with the new voice
      if (isPlaying) {
        try {
          const utterance = await createUtterance();
          window.speechSynthesis.speak(utterance);
        } catch (error) {
          console.error('Failed to restart speech with new voice:', error);
        }
      }
    }
  };

  const handleStartListening = () => {
    setShowControls(true);
    togglePlayPause();
  };

  if (!showControls) {
    return (
      <Button variant="ghost" size="sm" className="px-0 h-auto rounded-none" onClick={handleStartListening}>
        <Play className="h-4 w-4" />
        Listen to article
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-4 flex-wrap min-w-0 truncate">
      <Button variant="ghost" size="sm" className="px-0 h-auto rounded-none" onClick={togglePlayPause}>
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        {isPlaying ? 'Pause' : 'Play'}
      </Button>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-6 w-6 p-0" onClick={decreaseSpeed} disabled={rate <= 0.5}>
          <Minus className="h-3 w-3" />
        </Button>
        <span className="text-sm font-mono">{rate.toFixed(2)}x</span>
        <Button variant="ghost" size="icon" className="h-6 w-6 p-0" onClick={increaseSpeed} disabled={rate >= 2}>
          <Plus className="h-3 w-3" />
        </Button>
      </div>

      <Select value={selectedVoice?.name} onValueChange={handleVoiceChange}>
        <SelectTrigger className="w-[180px] flex items-center gap-2 min-w-0 truncate">
          <Volume2 className="h-5 w-5 min-w-5" />
          <SelectValue placeholder="Select voice" />
        </SelectTrigger>
        <SelectContent data-lenis-prevent="true">
          {voices.map(voice => (
            <SelectItem key={voice.name} value={voice.name}>
              {voice.name} ({voice.lang})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
