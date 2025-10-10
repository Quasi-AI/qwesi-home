'use client';
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Mic, Play, RotateCcw, Settings, User, Volume2, CheckCircle, Clock, Video, Download, Camera, CameraOff, AlertTriangle, X } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// ============================================================================
// CONSTANTS
// ============================================================================
const API_BASE_URL = 'https://dark-caldron-448714-u5.uc.r.appspot.com';
const SILENCE_TIMEOUT_MS = 3000;
const AVATAR_DEFAULT_URL = 'https://models.readyplayer.me/68e257931df78dfe0f4b5b72.glb';

const INTERVIEW_QUESTIONS = {
  1: "Hello! Welcome to your interview. Can you tell me about yourself?",
  2: "Can you describe a challenging situation you faced and how you handled it?",
  3: "What are your greatest strengths and how do they relate to this position?",
  4: "Where do you see yourself in five years?",
  5: "Why are you interested in this position and our company?",
  6: "Do you have any questions for me?"
};

// ============================================================================
// 3D AVATAR COMPONENTS
// ============================================================================
const AvatarModel = ({ url }) => {
  const { scene } = useGLTF(url);
  
  useEffect(() => {
    if (scene) {
      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      
      scene.position.x -= center.x;
      scene.position.y -= center.y;
      scene.position.z -= center.z;
      scene.position.y += size.y * 0.2;
    }
  }, [scene]);
  
  return <primitive object={scene} scale={1.5} />;
};

const AvatarDisplay = ({ avatarUrl, isSpeaking }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setHasError(false);
    setIsLoading(true);
  }, [avatarUrl]);

  if (hasError) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-xl">
        <User size={64} className="text-gray-400" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center rounded-xl z-10">
          <div className="animate-spin rounded-full h-10 w-10 border-3 border-gray-300 border-t-[#5c3aec]"></div>
        </div>
      )}
      {isSpeaking && (
        <div className="absolute inset-0 rounded-xl ring-4 ring-[#5c3aec] ring-offset-4 animate-pulse"></div>
      )}
      <Canvas
        camera={{ position: [0, 0.2, 2.5], fov: 45 }}
        style={{ background: 'transparent' }}
        onCreated={() => setIsLoading(false)}
        onError={() => setHasError(true)}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-5, 3, -5]} intensity={0.5} />
        <Suspense fallback={null}>
          <AvatarModel url={avatarUrl} />
        </Suspense>
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={1.5}
          maxDistance={4}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2}
          target={[0, 0.2, 0]}
        />
      </Canvas>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const InterviewPage = () => {
  // STATE - Session
  const [sessionId, setSessionId] = useState(null);
  const [sessionStats, setSessionStats] = useState(null);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [checkingPermissions, setCheckingPermissions] = useState(false);
  const [error, setError] = useState(null);

  // STATE - Interview Progress
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [transcript, setTranscript] = useState('');
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [showNextButton, setShowNextButton] = useState(false);

  // STATE - Audio/Speech
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSpeakingQuestion, setIsSpeakingQuestion] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  // STATE - Recording
  const [isRecording, setIsRecording] = useState(false);
  const [recordingUrl, setRecordingUrl] = useState(null);
  const [cameraEnabled, setCameraEnabled] = useState(false);

  // STATE - Proctoring
  const [cheatingWarnings, setCheatingWarnings] = useState([]);
  const [isLookingAway, setIsLookingAway] = useState(false);
  const [networkErrorCount, setNetworkErrorCount] = useState(0);

  // STATE - UI
  const [showSettings, setShowSettings] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(AVATAR_DEFAULT_URL);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // REFS
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const detectionIntervalRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const lastTranscriptRef = useRef('');
  const isProgressingRef = useRef(false);
  const isSpeakingQuestionRef = useRef(false);
  const isSpeakingRef = useRef(false);

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================
  const getAuthToken = () => {
    try {
      const auth = localStorage.getItem('auth');
      if (auth) {
        const { token } = JSON.parse(auth);
        return token || '';
      }
    } catch (e) {}
    return '';
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // ============================================================================
  // API FUNCTIONS
  // ============================================================================
  const startSession = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/interview-simulator/sessions/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({
          avatarUrl,
          userAgent: navigator.userAgent
        })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setSessionId(data.data.sessionId);
        return data.data.sessionId;
      } else {
        throw new Error(data.message || 'Failed to start session');
      }
    } catch (err) {
      console.warn('API unavailable, running in local mode:', err.message);
      const localSessionId = `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      setSessionId(localSessionId);
      return localSessionId;
    }
  };

  const saveAnswer = async (questionNum, questionText, answerText, startedAt, submittedAt) => {
    if (!sessionId) return;
    try {
      const responseTime = new Date(submittedAt).getTime() - new Date(startedAt).getTime();

      await fetch(`${API_BASE_URL}/interview-simulator/sessions/${sessionId}/answers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({
          questionNumber: questionNum,
          questionText: questionText,
          answerText: answerText,
          startedAt: startedAt,
          submittedAt: submittedAt,
          responseTime: responseTime
        })
      });
    } catch (err) {
      console.error('Error saving answer:', err);
    }
  };

  const saveWarning = async (warningType, detectedAt) => {
    if (!sessionId) return;
    try {
      await fetch(`${API_BASE_URL}/interview-simulator/sessions/${sessionId}/warnings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({
          warningType: warningType,
          detectedAt: detectedAt,
          questionNumber: currentQuestion + 1
        })
      });
    } catch (err) {
      console.error('Error saving warning:', err);
    }
  };

  const completeSession = async () => {
    if (!sessionId) return;
    try {
      if (isRecording) {
        stopScreenRecording();
      }

      const response = await fetch(`${API_BASE_URL}/interview-simulator/sessions/${sessionId}/complete`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({})
      });
      const data = await response.json();
      if (response.ok && data.success) {
        await fetchSessionStats();
      }
    } catch (err) {
      console.error('Error completing session:', err);
    }
  };

  const fetchSessionStats = async () => {
    if (!sessionId) return;
    try {
      const response = await fetch(`${API_BASE_URL}/interview-simulator/sessions/${sessionId}/stats`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setSessionStats(data.data);
      }
    } catch (err) {
      console.error('Error fetching session stats:', err);
    }
  };

  // ============================================================================
  // SPEECH FUNCTIONS
  // ============================================================================
  const speakQuestion = async (text) => {
    // mark speaking both in state and ref so recognition handler can ignore TTS
    isSpeakingRef.current = true;
    setIsSpeaking(true);
    console.log('Speaking:', text);

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`TTS API failed: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      return new Promise((resolve) => {
        audio.onended = () => {
          console.log('Ended speaking question');
          isSpeakingRef.current = false;
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
          resolve();
        };

        audio.onerror = (event) => {
          console.error('Audio playback error');
          isSpeakingRef.current = false;
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
          resolve();
        };

        audio.play().catch((error) => {
          console.error('Audio play error:', error);
          isSpeakingRef.current = false;
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
          resolve();
        });
      });
    } catch (error) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        console.error('TTS API request timed out');
      } else {
        console.error('Google TTS API failed, falling back to browser speech synthesis:', error);
      }

      // Fallback to browser speech synthesis
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        utterance.pitch = 1;

        return new Promise((resolve) => {
          utterance.onend = () => {
            console.log('Ended speaking question (fallback)');
            isSpeakingRef.current = false;
            setIsSpeaking(false);
            resolve();
          };

          utterance.onerror = (event) => {
            console.error('Browser speech synthesis error:', event);
            isSpeakingRef.current = false;
            setIsSpeaking(false);
            resolve();
          };

          window.speechSynthesis.speak(utterance);
        });
      } else {
        console.error('Browser speech synthesis not supported');
        isSpeakingRef.current = false;
        setIsSpeaking(false);
      }
    }
  };

  const logState = () => {
    console.log('=== CURRENT STATE ===');
    console.log('isListening:', isListening);
    console.log('interviewStarted:', interviewStarted);
    console.log('interviewComplete:', interviewComplete);
    console.log('currentQuestion:', currentQuestion);
    console.log('transcript:', transcript);
    console.log('lastTranscript:', lastTranscriptRef.current);
    console.log('=====================');
  };

  const startListening = () => {
    console.log('=== startListening called ===');
    console.log('speechSupported:', speechSupported);
    console.log('recognitionRef.current:', recognitionRef.current);
    console.log('isListening:', isListening);
    
    if (!recognitionRef.current) {
      console.error('Speech recognition not initialized!');
      setError('Speech recognition not initialized. Please refresh the page.');
      return;
    }
    
    if (isListening) {
      console.log('Already listening, skipping...');
      return;
    }
    
    lastTranscriptRef.current = '';
    setTranscript('');
    
    try {
      recognitionRef.current.start();
      setIsListening(true);
      console.log('Speech recognition start command sent');
    } catch (e) {
      console.error('Error starting recognition:', e);
      if (e.message && e.message.includes('already started')) {
        console.log('Recognition already started, setting state');
        setIsListening(true);
      } else {
        setError('Failed to start speech recognition: ' + e.message);
      }
    }
  };

  const nextQuestion = async () => {
    console.log('=== nextQuestion called ===');

    // Clear any existing silence timer
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    // Prevent multiple simultaneous progressions
    if (isProgressingRef.current) {
      console.log('Already progressing, skipping duplicate call');
      return;
    }
    isProgressingRef.current = true;

    // Stop recognition
    setIsListening(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.log('Stop recognition error:', e);
      }
    }

    const finalTranscript = lastTranscriptRef.current.trim();
    console.log('Final transcript to save:', finalTranscript);

    if (finalTranscript) {
      // Save the answer with current question
      const answerData = {
        question: INTERVIEW_QUESTIONS[currentQuestion + 1],
        answer: finalTranscript,
        timestamp: new Date().toLocaleTimeString()
      };

      console.log('Saving answer:', answerData);
      setAnswers(prev => [...prev, answerData]);

      const submittedAt = new Date().toISOString();
      await saveAnswer(
        currentQuestion + 1,
        INTERVIEW_QUESTIONS[currentQuestion + 1],
        finalTranscript,
        questionStartTime,
        submittedAt
      );
    }

    // Move to next question or complete
    if (currentQuestion < Object.keys(INTERVIEW_QUESTIONS).length - 1) {
      const newQuestion = currentQuestion + 1;
      console.log('Moving to question', newQuestion + 1);

      // Check if already speaking to prevent duplicate calls
      if (isSpeakingQuestionRef.current) {
        console.log('Already speaking a question, skipping duplicate call');
        return;
      }

      setCurrentQuestion(newQuestion);
      setTranscript('');
      lastTranscriptRef.current = '';
      setQuestionStartTime(new Date().toISOString());

      // Set flag to prevent duplicate speech
      setIsSpeakingQuestion(true);
      isSpeakingQuestionRef.current = true;

      // Determine the question to speak
      const questionToSpeak = INTERVIEW_QUESTIONS[newQuestion + 1];

      // Wait before speaking next question
      setTimeout(async () => {
        console.log('Speaking next question...');

        await speakQuestion(questionToSpeak);
        setIsSpeakingQuestion(false);
        isSpeakingQuestionRef.current = false;
        isProgressingRef.current = false; // Allow next progression

        // Start listening for next answer
        setTimeout(() => {
          console.log('Starting listening for next answer...');
          startListening();
        }, 1000);
      }, 1000);
    } else {
      console.log('Interview complete!');
      setInterviewComplete(true);
      isProgressingRef.current = false; // Reset progression flag
      completeSession();
    }
  };

  // ============================================================================
  // RECORDING FUNCTIONS
  // ============================================================================
  const startScreenRecording = async () => {
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: 'screen' },
        audio: true
      });

      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
      });

      const combinedStream = new MediaStream([
        ...displayStream.getVideoTracks(),
        ...audioStream.getAudioTracks()
      ]);

      streamRef.current = combinedStream;

      const options = { mimeType: 'video/webm;codecs=vp9' };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = 'video/webm';
      }

      const mediaRecorder = new MediaRecorder(combinedStream, options);
      mediaRecorderRef.current = mediaRecorder;

      const chunks = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordingUrl(url);
        combinedStream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

      displayStream.getVideoTracks()[0].onended = () => {
        alert('Screen sharing stopped! The interview will end.');
        setInterviewComplete(true);
        stopScreenRecording();
        completeSession();
      };

      return true;
    } catch (error) {
      throw new Error('Screen recording permission denied: ' + error.message);
    }
  };

  const stopScreenRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  };

  const downloadRecording = () => {
    if (recordingUrl) {
      const a = document.createElement('a');
      a.href = recordingUrl;
      a.download = `interview-recording-${sessionId || Date.now()}.webm`;
      a.click();
    }
  };

  // ============================================================================
  // CAMERA & PROCTORING FUNCTIONS
  // ============================================================================
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraEnabled(true);
        setTimeout(() => {
          startCheatingDetection();
        }, 500);
      } else {
        throw new Error('Video element not ready');
      }
      return true;
    } catch (error) {
      throw new Error('Camera permission denied: ' + error.message);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCameraEnabled(false);
      stopCheatingDetection();
    }
  };

  const startCheatingDetection = () => {
    detectionIntervalRef.current = setInterval(() => {
      if (videoRef.current && canvasRef.current && interviewStarted && !interviewComplete) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const regionSize = 100;
        
        try {
          const imageData = ctx.getImageData(
            centerX - regionSize/2,
            centerY - regionSize/2,
            regionSize,
            regionSize
          );
          
          let brightness = 0;
          for (let i = 0; i < imageData.data.length; i += 4) {
            brightness += (imageData.data[i] + imageData.data[i+1] + imageData.data[i+2]) / 3;
          }
          brightness = brightness / (regionSize * regionSize);
          
          const isAway = brightness < 30 || brightness > 240;
          
          if (isAway && !isLookingAway) {
            setIsLookingAway(true);
            const warning = {
              time: new Date().toLocaleTimeString(),
              type: 'Looking away from screen',
              question: currentQuestion + 1
            };
            setCheatingWarnings(prev => [...prev, warning]);
            saveWarning('looking_away', new Date().toISOString());
          } else if (!isAway && isLookingAway) {
            setIsLookingAway(false);
          }
        } catch (e) {}
      }
    }, 2000);
  };

  const stopCheatingDetection = () => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }
  };

  // ============================================================================
  // INTERVIEW CONTROL FUNCTIONS
  // ============================================================================
  const startInterview = async () => {
    setCheckingPermissions(true);
    setError(null);

    const token = getAuthToken();
    if (!token) {
      setError('Please log in to start the interview.');
      setCheckingPermissions(false);
      return;
    }

    try {
      const newSessionId = await startSession();
      if (!newSessionId) throw new Error('Failed to create session');

      setInterviewStarted(true);
      
      // Start camera first
      console.log('Starting camera...');
      await startCamera();
      
      // Then screen recording
      console.log('Starting screen recording...');
      await startScreenRecording();

      setPermissionsGranted(true);
      setStartTime(Date.now());
      setCurrentQuestion(0);
      setAnswers([]);
      setTranscript('');
      lastTranscriptRef.current = '';
      setCheckingPermissions(false);
      setQuestionStartTime(new Date().toISOString());

      // Speak first question
      console.log('Speaking first question...');
      await speakQuestion(INTERVIEW_QUESTIONS[currentQuestion + 1]);
      
      // Wait a bit then start listening
      console.log('Starting speech recognition...');
      setTimeout(() => {
        startListening();
      }, 1000);
    } catch (error) {
      console.error('Interview start error:', error);
      setCheckingPermissions(false);
      setInterviewStarted(false);
      setError('Failed to start interview: ' + error.message);
    }
  };

  const resetInterview = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setTranscript('');
    lastTranscriptRef.current = '';
    setIsListening(false);
    setIsSpeaking(false);
    setIsSpeakingQuestion(false);
    isSpeakingQuestionRef.current = false;
    isProgressingRef.current = false;
    setInterviewStarted(false);
    setInterviewComplete(false);
    setElapsedTime(0);
    setCheatingWarnings([]);
    setIsLookingAway(false);
    setPermissionsGranted(false);
    setCheckingPermissions(false);
    setSessionId(null);
    setSessionStats(null);
    setError(null);

    // Cancel any ongoing speech synthesis
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    if (isRecording) stopScreenRecording();
    if (cameraEnabled) stopCamera();
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
  };

  // ============================================================================
  // EFFECTS
  // ============================================================================
  
  // Check browser compatibility
  useEffect(() => {
    console.log('=== Browser compatibility check ===');

    if (!window.MediaRecorder) {
      setError('Your browser does not support screen recording. Please use Chrome or Edge.');
      return;
    }

    // Check speech recognition support
    const hasSpeechRecognition = typeof window !== 'undefined' &&
      ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);

    console.log('Speech recognition supported:', hasSpeechRecognition);

    if (!hasSpeechRecognition) {
      setError('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      setSpeechSupported(false);
    }
  }, []);

  // Timer Effect
  useEffect(() => {
    if (interviewStarted && !interviewComplete) {
      timerRef.current = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [interviewStarted, interviewComplete, startTime]);

  // Speech Recognition Setup Effect
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      setSpeechSupported(true);

      console.log('Speech recognition initialized');

      recognitionRef.current.onstart = () => {
        console.log('Speech recognition started');
      };

      recognitionRef.current.onresult = (event) => {
        console.log('Speech result received');

        // If we're speaking the question, ignore any recognition results (prevents capturing the question audio)
        if (isSpeakingRef.current) {
          console.log('Ignoring speech result because TTS is playing');
          return;
        }
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
            console.log('Final transcript:', transcript);
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript.trim().length > 0) {
          // Clear any existing silence timer
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
          }

          // Append final transcript parts to lastTranscriptRef and state
          const updated = (lastTranscriptRef.current || '') + finalTranscript;
          lastTranscriptRef.current = updated;
          setTranscript(updated);
          console.log('Updated full transcript:', updated);

          // Start silence timer for auto-progression
          silenceTimerRef.current = setTimeout(() => {
            if (!isProgressingRef.current) {
              console.log('Silence timeout reached, auto-progressing...');
              nextQuestion();
            }
          }, SILENCE_TIMEOUT_MS);
        } else if (interimTranscript) {
          // Clear silence timer when user is still speaking
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
          }

          // Update transcript with interim result without modifying lastTranscriptRef
          const interimUpdated = (lastTranscriptRef.current || '') + interimTranscript;
          setTranscript(interimUpdated);
        }
      };

      recognitionRef.current.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        if (event.error === 'no-speech') {
          console.log('No speech detected, continuing...');
          return;
        }
        if (event.error === 'aborted') {
          console.log('Recognition aborted (intentional)');
          return;
        }
        if (event.error === 'not-allowed') {
          setError('Microphone permission denied. Please allow microphone access.');
          setIsListening(false);
          return;
        }
        if (event.error === 'network') {
          console.error('Speech recognition network error');
          setNetworkErrorCount(prev => {
            const newCount = prev + 1;
            const warning = {
              time: new Date().toLocaleTimeString(),
              type: 'Network connectivity issue',
              question: currentQuestion + 1
            };
            setCheatingWarnings(prevWarnings => [...prevWarnings, warning]);
            saveWarning('network_error', new Date().toISOString());

            if (newCount >= 3) {
              console.error('Too many network errors, ending interview');
              setError('Network connectivity issues detected. Interview will be ended.');
              setInterviewComplete(true);
              completeSession();
            }
            return newCount;
          });
          setIsListening(false);
          return;
        }
        console.error('Speech recognition error:', event.error);
      };
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.log('Cleanup stop error:', e);
        }
      }
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      window.recognitionRestarting = false;
    };
  }, []);

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Interview Simulator</h1>
              <p className="text-sm text-gray-600 mt-0.5">Practice with AI-powered interviews</p>
            </div>
            <div className="flex items-center gap-3">
              {interviewStarted && !interviewComplete && (
                <>
                  <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
                    <Clock size={18} className="text-gray-600" />
                    <span className="font-mono text-sm font-medium text-gray-900">{formatTime(elapsedTime)}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-red-50 px-4 py-2 rounded-lg border border-red-200">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-red-700">Recording</span>
                  </div>
                </>
              )}
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Settings size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ERROR ALERT */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="max-w-7xl mx-auto flex items-start gap-3">
            <AlertTriangle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* SETTINGS PANEL */}
      {showSettings && (
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
              <button onClick={() => setShowSettings(false)} className="p-1 hover:bg-gray-100 rounded">
                <X size={20} className="text-gray-600" />
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Avatar URL</label>
              <input
                type="text"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://models.readyplayer.me/your-avatar-id.glb"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5c3aec] focus:border-transparent outline-none transition"
              />
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* WELCOME SCREEN */}
        {!interviewStarted && (
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Ready to Begin Your Interview?</h2>
              <p className="text-gray-600">
                Complete {Object.keys(INTERVIEW_QUESTIONS).length} questions with our AI interviewer
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8">
              <div className="flex gap-3">
                <AlertTriangle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1.5 text-sm">Auto-Progress Feature</h4>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• AI will automatically speak each question</li>
                    <li>• Recording starts automatically after each question</li>
                    <li>• 3 seconds of silence will trigger auto-progress to next question</li>
                    <li>• Hands-free interview experience!</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={startInterview}
                disabled={checkingPermissions}
                className="inline-flex items-center gap-2 bg-[#5c3aec] hover:bg-[#4a2ec4] text-white px-10 py-4 rounded-lg font-semibold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {checkingPermissions ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Initializing...
                  </>
                ) : (
                  <>Begin Interview</>
                )}
              </button>
            </div>
          </div>
        )}

        {/* COMPLETE SCREEN */}
        {interviewComplete && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Interview Complete</h2>
              <p className="text-lg text-gray-600">Duration: {formatTime(elapsedTime)}</p>
            </div>

            {sessionStats && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Performance Summary</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Completion Rate</p>
                    <p className="text-3xl font-bold text-gray-900">{sessionStats.session?.completionPercentage || 0}%</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Questions Answered</p>
                    <p className="text-3xl font-bold text-gray-900">{sessionStats.answers?.totalAnswers || 0}</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Avg Response Time</p>
                    <p className="text-3xl font-bold text-gray-900">{sessionStats.answers?.averageResponseTime || 0}s</p>
                  </div>
                </div>
              </div>
            )}

            {cheatingWarnings.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
                <div className="flex items-start gap-3 mb-4">
                  <AlertTriangle size={20} className="text-amber-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Behavioral Alerts</h3>
                    <p className="text-sm text-gray-600">{cheatingWarnings.length} irregularity detected during session</p>
                  </div>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {cheatingWarnings.map((warning, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-white rounded-lg text-sm border border-amber-200">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{warning.type}</p>
                        <p className="text-gray-600">Question {warning.question} at {warning.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {recordingUrl && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6 text-center">
                <Video size={32} className="text-[#5c3aec] mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Session Recording Available</h3>
                <button
                  onClick={downloadRecording}
                  className="inline-flex items-center gap-2 bg-[#5c3aec] hover:bg-[#4a2ec4] text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
                >
                  <Download size={18} />
                  Download Recording
                </button>
              </div>
            )}

            <div className="text-center">
              <button
                onClick={resetInterview}
                className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-900 px-6 py-2.5 rounded-lg font-medium border border-gray-300 transition-colors"
              >
                <RotateCcw size={18} />
                New Interview
              </button>
            </div>
          </div>
        )}

        {/* ACTIVE INTERVIEW */}
        {interviewStarted && !interviewComplete && (
          <div className="space-y-4">
            
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Question {currentQuestion + 1} of {Object.keys(INTERVIEW_QUESTIONS).length}
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {Math.round(((currentQuestion + 1) / Object.keys(INTERVIEW_QUESTIONS).length) * 100)}%
                </span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#5c3aec] transition-all duration-500 ease-out"
                  style={{ width: `${((currentQuestion + 1) / Object.keys(INTERVIEW_QUESTIONS).length) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-4">
              
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 text-sm">AI Interviewer</h3>
                  <div className="flex items-center gap-1.5">
                    <Volume2 size={14} className={isSpeaking ? 'text-[#5c3aec]' : 'text-gray-400'} />
                    <span className="text-xs font-medium text-gray-600">
                      {isSpeaking ? 'Speaking' : 'Idle'}
                    </span>
                  </div>
                </div>
                
                <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden mb-3">
                  <AvatarDisplay avatarUrl={avatarUrl} isSpeaking={isSpeaking} />
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 text-xs">Question</h4>
                    <button
                    onClick={() => speakQuestion(INTERVIEW_QUESTIONS[currentQuestion + 1])}
                      disabled={isSpeaking}
                      className="flex items-center gap-1 text-xs font-medium text-[#5c3aec] hover:text-[#4a2ec4] disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      <Play size={12} />
                      Replay
                    </button>
                  </div>
                  <p className="text-xs text-gray-800 leading-relaxed">
                    {INTERVIEW_QUESTIONS[currentQuestion + 1]}
                  </p>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-4">
                
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-sm">You</h3>
                    {isLookingAway && (
                      <span className="flex items-center gap-1 text-amber-600 text-xs font-medium">
                        <AlertTriangle size={14} />
                        Attention Alert
                      </span>
                    )}
                  </div>
                  <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden">
                    {!cameraEnabled && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                        <CameraOff size={28} className="mb-2 opacity-50" />
                        <p className="text-xs opacity-70">Initializing...</p>
                      </div>
                    )}
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                      style={{ transform: 'scaleX(-1)' }}
                    />
                    <canvas ref={canvasRef} className="hidden" />
                    {isLookingAway && (
                      <div className="absolute inset-0 border-4 border-amber-500 rounded-xl"></div>
                    )}
                    {cameraEnabled && (
                      <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-black bg-opacity-70 text-white px-2 py-1 rounded-lg text-xs font-medium">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                        Monitored
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-sm">Your Response</h3>
                    {isListening && (
                      <span className="flex items-center gap-1.5 text-red-600 text-xs font-medium">
                        <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></div>
                        Recording
                      </span>
                    )}
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 min-h-24 max-h-32 overflow-y-auto">
                    <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                      {transcript || <span className="text-gray-400">Listening... speak your answer</span>}
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl border-2 border-blue-200 shadow-sm p-4">
                  <div className="flex items-start gap-3">
                    <Mic size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900 text-sm mb-1">Auto-Recording Active</h4>
                      <p className="text-xs text-blue-800">
                        Recording automatically started. Speak your answer naturally. The system will auto-progress 
                        to the next question after 3 seconds of silence.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {answers.length > 0 && (
              <details className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <summary className="p-4 cursor-pointer hover:bg-gray-50 rounded-xl transition-colors">
                  <span className="font-semibold text-gray-900 text-sm">
                    Previous Responses ({answers.length})
                  </span>
                </summary>
                <div className="px-4 pb-4 space-y-3 max-h-64 overflow-y-auto">
                  {answers.map((item, index) => (
                    <div key={index} className="border-l-4 border-[#5c3aec] pl-3 py-1">
                      <div className="flex items-start justify-between mb-1">
                        <p className="font-medium text-gray-900 text-xs">Q{index + 1}: {item.question}</p>
                        <span className="text-xs text-gray-500">{item.timestamp}</span>
                      </div>
                      <p className="text-gray-700 text-xs leading-relaxed">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </details>
            )}
          </div>
        )}
      </main>

      {!interviewStarted && (
        <footer className="bg-white border-t border-gray-200 mt-16">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <h3 className="font-semibold text-gray-900 mb-4">How It Works</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Auto-Interview Flow</h4>
                <ol className="space-y-2 text-sm text-gray-600">
                  <li className="flex gap-2">
                    <span className="font-semibold text-gray-900">1.</span> 
                    Click "Begin Interview" to start
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-gray-900">2.</span> 
                    Grant camera and screen recording permissions
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-gray-900">3.</span> 
                    AI speaks question, then recording starts automatically
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-gray-900">4.</span> 
                    Speak your answer naturally
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-gray-900">5.</span> 
                    System detects 3 seconds of silence and auto-progresses
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-gray-900">6.</span> 
                    Process repeats for all questions automatically
                  </li>
                </ol>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-3">System Requirements</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-[#5c3aec] mt-1">•</span>
                    <span>Chrome or Edge browser recommended</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#5c3aec] mt-1">•</span>
                    <span>Microphone access for voice recognition</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#5c3aec] mt-1">•</span>
                    <span>Camera access for proctoring system</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#5c3aec] mt-1">•</span>
                    <span>Screen recording for session documentation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#5c3aec] mt-1">•</span>
                    <span>Stable internet connection required</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default InterviewPage;