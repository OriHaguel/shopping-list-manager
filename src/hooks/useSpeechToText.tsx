'use client';
import { getItem } from '@/utils/localStorage';
import { useState, useEffect, useRef } from 'react';

// Type definitions for the Web Speech API
interface SpeechRecognitionResult {
    isFinal: boolean;
    [index: number]: SpeechRecognitionAlternative;
    length: number;
}

interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
}

interface SpeechRecognitionEvent extends Event {
    resultIndex: number;
    results: SpeechRecognitionResult[];
}

interface SpeechRecognitionErrorEvent extends Event {
    error: string;
}

interface SpeechRecognition {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    onstart: () => void;
    onend: () => void;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: (event: SpeechRecognitionErrorEvent) => void;
}

declare global {
    interface Window {
        SpeechRecognition: new () => SpeechRecognition;
        webkitSpeechRecognition: new () => SpeechRecognition;
    }
}

export function useSpeechToText() {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
    const lan = getItem<string>('lan', '');
    const shouldBeListening = useRef(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const sr = new SpeechRecognition();
            sr.continuous = true;
            sr.interimResults = true;
            sr.lang = lan || 'en-US';
            // sr.lang = 'he-IL';

            sr.onstart = () => {
                setIsListening(true);
            };

            sr.onresult = (event) => {
                let transcriptSoFar = '';
                for (let i = 0; i < event.results.length; i++) {
                    transcriptSoFar += event.results[i][0].transcript;
                }
                setTranscript(transcriptSoFar);
            };

            sr.onerror = (event) => {
                console.error('Speech recognition error', event.error);
                shouldBeListening.current = false;
                setIsListening(false);
            };

            sr.onend = () => {
                if (shouldBeListening.current) {
                    sr.start();
                } else {
                    setIsListening(false);
                }
            };

            setRecognition(sr);

            return () => {
                shouldBeListening.current = false;
                sr.stop();
            };
        } else {
            console.warn('Speech Recognition API not supported in this browser.');
        }
    }, [lan]);

    const startListening = () => {
        if (recognition && !isListening) {
            shouldBeListening.current = true;
            setTranscript('')
            recognition.start();
        }
    };

    const stopListening = () => {
        if (recognition && isListening) {
            shouldBeListening.current = false;
            recognition.stop();
        }
    };
    // should use startListening and stopListening functions to control speech recognition
    // isListening indicates whether the recognition is active to disable/enable buttons accordingly
    // transcript holds the recognized text and updates as new results come in
    return { transcript, isListening, startListening, stopListening };
}