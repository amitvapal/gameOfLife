import { useCallback, useEffect, useRef, useState } from 'react';
import { storage } from '../lib/storage.js';

const STORAGE_KEY = 'notes-state';
const emptyState = () => ({ text: '', images: [] });

export default function useNotes() {
  const [state, setState] = useState(
    () => storage.get(STORAGE_KEY) || emptyState()
  );
  const writeTimer = useRef(null);

  useEffect(() => {
    if (writeTimer.current) clearTimeout(writeTimer.current);
    writeTimer.current = setTimeout(() => {
      storage.set(STORAGE_KEY, state);
    }, 400);
    return () => {
      if (writeTimer.current) clearTimeout(writeTimer.current);
    };
  }, [state]);

  const setText = useCallback((text) => {
    setState((prev) => ({ ...prev, text }));
  }, []);

  const addImage = useCallback((dataUrl) => {
    setState((prev) => ({
      ...prev,
      images: [
        ...prev.images,
        {
          id: `img_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          dataUrl,
          size: 'md',
        },
      ],
    }));
  }, []);

  const removeImage = useCallback((id) => {
    setState((prev) => ({
      ...prev,
      images: prev.images.filter((i) => i.id !== id),
    }));
  }, []);

  const setImageSize = useCallback((id, size) => {
    setState((prev) => ({
      ...prev,
      images: prev.images.map((i) => (i.id === id ? { ...i, size } : i)),
    }));
  }, []);

  return {
    text: state.text,
    images: state.images,
    setText,
    addImage,
    removeImage,
    setImageSize,
  };
}
