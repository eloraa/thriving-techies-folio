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

  const cleanText = stripMarkdown(text);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);

      const googleUSVoice = availableVoices.find(
        voice => voice.name === 'Google US English' || voice.name === 'Google US English (en-US)' || (voice.name.includes('Google') && voice.lang === 'en-US')
      );

      const anyUSVoice = availableVoices.find(voice => voice.lang === 'en-US');

      if (!selectedVoice) {
        setSelectedVoice(googleUSVoice || anyUSVoice || (availableVoices.length > 0 ? availableVoices[0] : null));
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [selectedVoice]);

  useEffect(() => {
    return () => {
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const createUtterance = () => {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = rate;
    utterance.voice = selectedVoice;

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utteranceRef.current = utterance;
    return utterance;
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      window.speechSynthesis.pause();
    } else {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      } else {
        const utterance = createUtterance();
        window.speechSynthesis.speak(utterance);
      }
    }
    setIsPlaying(!isPlaying);
  };

  const increaseSpeed = () => {
    const newRate = Math.min(rate + 0.25, 2);
    setRate(newRate);

    if (isPlaying) {
      const utterance = createUtterance();
      window.speechSynthesis.speak(utterance);
    }
  };

  const decreaseSpeed = () => {
    const newRate = Math.max(rate - 0.25, 0.5);
    setRate(newRate);

    if (isPlaying) {
      const utterance = createUtterance();
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleVoiceChange = (voiceName: string) => {
    const voice = voices.find(v => v.name === voiceName);
    if (voice) {
      setSelectedVoice(voice);

      if (isPlaying) {
        const utterance = createUtterance();
        window.speechSynthesis.speak(utterance);
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
