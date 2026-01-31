import { useEffect, useRef, useCallback } from 'react';
import { Audio } from 'expo-av';

export function useSound() {
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    const loadSound = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../../assets/sounds/bell.mp3')
        );
        soundRef.current = sound;
      } catch (error) {
        console.warn('Failed to load sound:', error);
      }
    };

    loadSound();

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const playSound = useCallback(async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.setPositionAsync(0);
        await soundRef.current.playAsync();
      }
    } catch (error) {
      console.warn('Failed to play sound:', error);
    }
  }, []);

  return { playSound };
}
