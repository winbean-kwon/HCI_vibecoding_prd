
import React from 'react';
import { Recommendation } from '../types';

interface RecommendationCardProps {
  recommendation: Recommendation;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => {
  return (
    <div className="w-full max-w-md bg-slate-800 rounded-2xl shadow-lg overflow-hidden transform transition-all duration-500 ease-in-out animate-fade-in">
      <div className="aspect-w-16 aspect-h-9">
        <img 
          src={recommendation.imageUrl} 
          alt={recommendation.name} 
          className="w-full h-64 object-cover" 
        />
      </div>
      <div className="p-6">
        <h2 className="text-3xl font-bold text-cyan-300 mb-2">{recommendation.name}</h2>
        <p className="text-slate-300">{recommendation.description}</p>
      </div>
    </div>
  );
};

export default RecommendationCard;
