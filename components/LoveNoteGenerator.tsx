
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { COLORS, WEDDING_DETAILS } from '../constants';
import Reveal from './Reveal';

const LoveNoteGenerator: React.FC = () => {
  const [note, setNote] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const generateNote = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Write a short, beautiful, and poetic one-sentence wedding wish for Johnsean and Kristine who are getting married on ${WEDDING_DETAILS.date}. The wish should feel elegant and timeless. Max 20 words.`,
        config: {
          systemInstruction: "You are a poetic wedding celebrant who speaks in beautiful, short aphorisms about love.",
        }
      });
      setNote(response.text.trim());
    } catch (error) {
      console.error("Gemini Error:", error);
      setNote("May your love be as endless as the morning sun.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateNote();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto text-center px-4 flex flex-col items-center">
      <Reveal>
        <span className="text-[10px] uppercase tracking-[0.5em] opacity-40 mb-16 block font-cinzel" style={{ color: COLORS.accent }}>A Sacred Blessing</span>
      </Reveal>
      
      <div className="min-h-[250px] flex items-center justify-center mb-8 w-full">
        {loading ? (
          <div className="flex space-x-3">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: COLORS.accent, animationDelay: `${i * 0.2}s` }}></div>
            ))}
          </div>
        ) : (
          <Reveal animation="reveal-scale">
            <p className="text-4xl md:text-6xl font-script px-4 md:px-12 leading-[1.6] md:leading-[1.5]" style={{ color: COLORS.dark }}>
              {note || "Love is the thread that weaves the stars into the fabric of the morning."}
            </p>
          </Reveal>
        )}
      </div>

      <Reveal delay={800}>
        <button 
          onClick={generateNote}
          className="group flex flex-col items-center space-y-2 opacity-30 hover:opacity-100 transition-opacity duration-500"
          disabled={loading}
        >
          <div className="w-px h-8 bg-current"></div>
          <span className="text-[8px] uppercase tracking-[0.3em] font-bold">Refresh Blessing</span>
        </button>
      </Reveal>
    </div>
  );
};

export default LoveNoteGenerator;
