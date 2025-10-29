
import React, { useState, useCallback } from 'react';
import { Recommendation, PreferenceOption } from './types';
import { PREFERENCE_OPTIONS } from './constants';
import { getMenuRecommendation } from './services/geminiService';
import LoadingSpinner from './components/LoadingSpinner';
import RecommendationCard from './components/RecommendationCard';

const App: React.FC = () => {
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const togglePreference = (preferenceId: string) => {
    setSelectedPreferences(prev =>
      prev.includes(preferenceId)
        ? prev.filter(id => id !== preferenceId)
        : [...prev, preferenceId]
    );
  };

  const handleGetRecommendation = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setRecommendation(null);
    try {
      const result = await getMenuRecommendation(selectedPreferences);
      setRecommendation(result);
    } catch (e: any) {
      setError(e.message || '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedPreferences]);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col font-sans p-4">
      <header className="text-center py-6 md:py-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          오늘 뭐 먹지?
        </h1>
        <p className="text-slate-400 mt-2">AI가 추천하는 직장인 점심 메뉴</p>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center container mx-auto px-4 w-full">
        <div className="w-full max-w-2xl mb-8">
          <h2 className="text-lg font-semibold text-slate-300 mb-4 text-center">어떤 메뉴를 원하세요? (선택)</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {PREFERENCE_OPTIONS.map((option: PreferenceOption) => (
              <button
                key={option.id}
                onClick={() => togglePreference(option.id)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 ${
                  selectedPreferences.includes(option.id)
                    ? 'bg-cyan-500 text-white shadow-md'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full max-w-md h-96 flex items-center justify-center my-4">
          {isLoading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="text-center p-6 bg-red-900/50 border border-red-700 rounded-lg">
              <p className="text-red-300 font-semibold">오류 발생!</p>
              <p className="text-red-400 mt-1">{error}</p>
            </div>
          ) : recommendation ? (
            <RecommendationCard recommendation={recommendation} />
          ) : (
            <div className="text-center text-slate-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11" /></svg>
              <p className="mt-4">취향을 선택하고 아래 버튼을 눌러주세요!</p>
            </div>
          )}
        </div>
      </main>

      <footer className="sticky bottom-0 w-full bg-slate-900/80 backdrop-blur-sm py-4 mt-auto">
        <div className="container mx-auto px-4 flex justify-center">
            <button
              onClick={handleGetRecommendation}
              disabled={isLoading}
              className="w-full max-w-xs px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full shadow-lg hover:shadow-cyan-500/50 transform hover:scale-105 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none"
            >
              {isLoading 
                ? '고민 중...' 
                : recommendation 
                ? '다시 시도' 
                : '점심 메뉴 추천받기'}
            </button>
        </div>
      </footer>
    </div>
  );
};

export default App;

