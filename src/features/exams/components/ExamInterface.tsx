'use client';

import { useState, useEffect } from 'react';

interface Question {
  id: string;
  content: string;
  type: string;
  options: any;
  marks: number;
}

export function ExamInterface({ exam, attemptId }: { exam: any, attemptId: string }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(exam.duration * 60);

  const currentQuestion = exam.questions[currentQuestionIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
    // Autosave can be triggered here or on an interval
  };

  const handleSubmit = async () => {
    await fetch(`/api/exams/attempts/${attemptId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
      headers: { 'Content-Type': 'application/json' },
    });
    alert('Exam submitted successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white min-h-screen shadow-lg">
      <div className="flex justify-between items-center mb-8 pb-4 border-b">
        <h1 className="text-2xl font-bold text-black">{exam.title}</h1>
        <div className="text-xl font-mono text-red-600">
          {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-500">Question {currentQuestionIndex + 1} of {exam.questions.length}</span>
          <span className="text-sm font-medium text-blue-600">{currentQuestion.marks} Marks</span>
        </div>
        <p className="text-lg text-black mb-6">{currentQuestion.content}</p>

        {currentQuestion.type === 'MCQ' && (
          <div className="space-y-3">
            {Object.entries(currentQuestion.options).map(([key, value]: [string, any]) => (
              <label key={key} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 text-black">
                <input
                  type="radio"
                  name={currentQuestion.id}
                  className="mr-3"
                  checked={answers[currentQuestion.id] === key}
                  onChange={() => handleAnswerChange(currentQuestion.id, key)}
                />
                {value}
              </label>
            ))}
          </div>
        )}

        {currentQuestion.type === 'ESSAY' && (
          <textarea
            className="w-full h-64 p-4 border rounded-lg focus:ring-blue-500 text-black"
            placeholder="Write your answer here..."
            value={answers[currentQuestion.id] || ''}
            onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
          />
        )}
      </div>

      <div className="flex justify-between mt-12 pt-6 border-t">
        <button
          onClick={() => setCurrentQuestionIndex(i => Math.max(0, i - 1))}
          disabled={currentQuestionIndex === 0}
          className="px-6 py-2 border rounded-lg text-black disabled:opacity-30"
        >
          Previous
        </button>
        {currentQuestionIndex === exam.questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Submit Exam
          </button>
        ) : (
          <button
            onClick={() => setCurrentQuestionIndex(i => Math.min(exam.questions.length - 1, i + 1))}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Next Question
          </button>
        )}
      </div>
    </div>
  );
}
