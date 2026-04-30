"use client";

import { useState, useEffect } from "react";
import { MessageSquare, PlusCircle, User, Clock, ChevronDown, ChevronUp, Send } from "lucide-react";

interface Answer {
  id: string;
  content: string;
  author: string;
  createdAt: string;
}

interface Question {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  answers: Answer[];
}

export default function QAPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedQId, setExpandedQId] = useState<string | null>(null);

  // Form states
  const [showAskForm, setShowAskForm] = useState(false);
  const [newQTitle, setNewQTitle] = useState("");
  const [newQContent, setNewQContent] = useState("");
  const [newQAuthor, setNewQAuthor] = useState("");
  
  const [newAnswerContent, setNewAnswerContent] = useState("");
  const [newAnswerAuthor, setNewAnswerAuthor] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await fetch("/api/questions");
      const data = await res.json();
      setQuestions(data);
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQTitle || !newQContent || !newQAuthor) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newQTitle, content: newQContent, author: newQAuthor })
      });
      const newQuestion = await res.json();
      setQuestions([newQuestion, ...questions]);
      setShowAskForm(false);
      setNewQTitle("");
      setNewQContent("");
      setNewQAuthor("");
    } catch (error) {
      console.error("Failed to post question:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePostAnswer = async (e: React.FormEvent, questionId: string) => {
    e.preventDefault();
    if (!newAnswerContent || !newAnswerAuthor) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newAnswerContent, author: newAnswerAuthor, questionId })
      });
      const newAnswer = await res.json();
      
      // Update local state
      setQuestions(questions.map(q => {
        if (q.id === questionId) {
          return { ...q, answers: [...q.answers, newAnswer] };
        }
        return q;
      }));
      setNewAnswerContent("");
      setNewAnswerAuthor("");
    } catch (error) {
      console.error("Failed to post answer:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedQId(expandedQId === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <MessageSquare className="h-8 w-8 text-blue-600" /> Community Q&A
          </h1>
          <p className="text-gray-500 mt-2">Ask questions and get answers from the community.</p>
        </div>
        <button 
          onClick={() => setShowAskForm(!showAskForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center gap-2"
        >
          <PlusCircle className="h-5 w-5" /> Ask a Question
        </button>
      </div>

      {showAskForm && (
        <form onSubmit={handleAskQuestion} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-8 animate-in slide-in-from-top-2">
          <h2 className="text-xl font-bold mb-4">Post a new question</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
              <input 
                type="text" required value={newQAuthor} onChange={e => setNewQAuthor(e.target.value)}
                className="w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Question Title</label>
              <input 
                type="text" required value={newQTitle} onChange={e => setNewQTitle(e.target.value)}
                className="w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g., Which is better for CS: NIT Trichy or Surathkal?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
              <textarea 
                required value={newQContent} onChange={e => setNewQContent(e.target.value)} rows={3}
                className="w-full border border-gray-300 text-gray-900 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowAskForm(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                {isSubmitting ? "Posting..." : "Post Question"}
              </button>
            </div>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Loading questions...</div>
      ) : questions.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900">No questions yet</h3>
          <p className="text-gray-500">Be the first to ask a question!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map(q => {
            const isExpanded = expandedQId === q.id;
            return (
              <div key={q.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm transition-all hover:shadow-md">
                <div 
                  className="p-6 cursor-pointer flex justify-between items-start"
                  onClick={() => toggleExpand(q.id)}
                >
                  <div className="flex-1 pr-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{q.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><User className="h-4 w-4" /> {q.author}</span>
                      <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {new Date(q.createdAt).toLocaleDateString()}</span>
                      <span className="font-medium text-blue-600">{q.answers.length} answers</span>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-blue-50">
                    {isExpanded ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
                  </button>
                </div>

                {isExpanded && (
                  <div className="border-t border-gray-100 bg-gray-50 p-6 animate-in slide-in-from-top-1">
                    <p className="text-gray-700 whitespace-pre-wrap mb-8 text-lg">{q.content}</p>
                    
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      Answers ({q.answers.length})
                    </h4>
                    
                    {q.answers.length > 0 ? (
                      <div className="space-y-4 mb-8">
                        {q.answers.map(ans => (
                          <div key={ans.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                            <p className="text-gray-800 mb-3">{ans.content}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="font-medium text-gray-700">{ans.author}</span>
                              <span>{new Date(ans.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 mb-8 italic">No answers yet. Can you help?</p>
                    )}

                    <form onSubmit={(e) => handlePostAnswer(e, q.id)} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                      <h5 className="text-sm font-bold text-gray-700 mb-3">Your Answer</h5>
                      <input 
                        type="text" required value={newAnswerAuthor} onChange={e => setNewAnswerAuthor(e.target.value)}
                        className="w-full border border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-sm mb-3 focus:ring-1 focus:ring-blue-500 outline-none"
                        placeholder="Your Name"
                      />
                      <textarea 
                        required value={newAnswerContent} onChange={e => setNewAnswerContent(e.target.value)} rows={3}
                        className="w-full border border-gray-300 text-gray-900 rounded-lg px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none mb-3"
                        placeholder="Write your answer here..."
                      />
                      <div className="flex justify-end">
                        <button type="submit" disabled={isSubmitting} className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-5 rounded-lg transition-colors flex items-center gap-2 text-sm disabled:opacity-50">
                          <Send className="h-4 w-4" /> Post Answer
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
