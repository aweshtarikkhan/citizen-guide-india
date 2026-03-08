import { useState } from "react";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Trophy, AlertTriangle, Target } from "lucide-react";
import { Link } from "react-router-dom";

interface Question {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const questions: Question[] = [
  {
    question: "What is the minimum age to vote in India?",
    options: ["16 years", "18 years", "21 years", "25 years"],
    correct: 1,
    explanation: "Under Article 326 of the Indian Constitution, every citizen who is 18 years or older on the qualifying date is eligible to vote.",
  },
  {
    question: "Which document is NOT accepted as voter ID at the polling booth?",
    options: ["Aadhaar Card", "Driving License", "Credit Card", "Passport"],
    correct: 2,
    explanation: "Credit cards are not valid voter identification. Aadhaar, Driving License, Passport, and several other government-issued IDs are accepted.",
  },
  {
    question: "What is NOTA in Indian elections?",
    options: ["A political party", "None Of The Above option", "A voting machine", "An election officer"],
    correct: 1,
    explanation: "NOTA (None Of The Above) allows voters to reject all candidates. It was introduced in 2013 after a Supreme Court ruling.",
  },
  {
    question: "Which form is used for new voter registration?",
    options: ["Form 6", "Form 7", "Form 8", "Form 10"],
    correct: 0,
    explanation: "Form 6 is used for new voter registration. Form 7 is for objections, and Form 8 is for corrections.",
  },
  {
    question: "Who appoints the Chief Election Commissioner of India?",
    options: ["Prime Minister", "Parliament", "President of India", "Supreme Court"],
    correct: 2,
    explanation: "The Chief Election Commissioner is appointed by the President of India under Article 324 of the Constitution.",
  },
  {
    question: "What does EVM stand for?",
    options: ["Electronic Voting Machine", "Election Verification Method", "Electoral Vote Management", "Electronic Vote Monitor"],
    correct: 0,
    explanation: "EVM stands for Electronic Voting Machine, used in Indian elections since 1982 (first in Kerala).",
  },
  {
    question: "Can NRIs (Non-Resident Indians) vote in Indian elections?",
    options: ["No, they cannot", "Yes, by postal ballot", "Yes, at the embassy", "Yes, if they visit India on election day"],
    correct: 3,
    explanation: "NRIs can vote, but they must be physically present at their registered constituency on polling day. Overseas postal voting is being considered.",
  },
  {
    question: "What is the Voter Helpline number in India?",
    options: ["100", "112", "1800", "1950"],
    correct: 3,
    explanation: "1950 is the toll-free Voter Helpline number by the Election Commission of India for voter-related queries.",
  },
];

const VoterQuiz = () => {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [finished, setFinished] = useState(false);

  const q = questions[currentQ];

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === q.correct) setScore((s) => s + 1);
  };

  const next = () => {
    if (currentQ + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  const restart = () => {
    setCurrentQ(0);
    setSelected(null);
    setScore(0);
    setAnswered(false);
    setFinished(false);
  };

  const pct = Math.round((score / questions.length) * 100);
  const ResultIcon = pct >= 75 ? Trophy : pct >= 50 ? Target : AlertTriangle;
  const resultMsg =
    pct >= 75
      ? "Excellent! You're a well-informed voter! 🎉"
      : pct >= 50
      ? "Good job! But there's more to learn. 📚"
      : "Time to brush up on your voter knowledge! 💪";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-20 md:py-28">
        <div className="container max-w-2xl">
          <div className="text-center mb-10">
            <span className="text-sm font-semibold text-foreground uppercase tracking-widest">Interactive Quiz</span>
            <h1 className="text-3xl md:text-4xl font-display font-bold mt-3 text-foreground">
              Voter Readiness Quiz
            </h1>
            <p className="mt-3 text-muted-foreground text-lg">
              Test your knowledge about Indian elections and voting
            </p>
          </div>

          {!finished ? (
            <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-card">
              {/* Progress */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-semibold text-muted-foreground">
                  Question {currentQ + 1} of {questions.length}
                </span>
                <span className="text-sm font-semibold text-foreground">
                  Score: {score}/{currentQ + (answered ? 1 : 0)}
                </span>
              </div>
              <div className="h-1.5 bg-muted rounded-full mb-8">
                <div
                  className="h-full bg-foreground rounded-full transition-all duration-500"
                  style={{ width: `${((currentQ + (answered ? 1 : 0)) / questions.length) * 100}%` }}
                />
              </div>

              {/* Question */}
              <h2 className="text-lg md:text-xl font-display font-semibold text-foreground mb-6">{q.question}</h2>

              <div className="space-y-3 mb-6">
                {q.options.map((opt, idx) => {
                  let cls = "border-border hover:border-foreground/30 hover:bg-muted/50";
                  if (answered) {
                    if (idx === q.correct) cls = "border-foreground bg-foreground/5";
                    else if (idx === selected) cls = "border-destructive bg-destructive/5";
                    else cls = "border-border opacity-50";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(idx)}
                      disabled={answered}
                      className={`w-full text-left px-4 py-3 rounded-xl border ${cls} transition-all flex items-center gap-3`}
                    >
                      <span className="h-7 w-7 rounded-full border border-current/20 flex items-center justify-center text-xs font-bold shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-sm font-medium text-foreground">{opt}</span>
                      {answered && idx === q.correct && <CheckCircle2 className="h-5 w-5 text-foreground ml-auto shrink-0" />}
                      {answered && idx === selected && idx !== q.correct && <XCircle className="h-5 w-5 text-destructive ml-auto shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              {answered && (
                <div className="p-4 rounded-xl bg-muted/50 border border-border mb-6 animate-in fade-in duration-300">
                  <p className="text-sm text-foreground leading-relaxed">
                    <strong>Explanation:</strong> {q.explanation}
                  </p>
                </div>
              )}

              {answered && (
                <button
                  onClick={next}
                  className="w-full py-3 bg-foreground text-background rounded-xl font-semibold text-sm hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2"
                >
                  {currentQ + 1 >= questions.length ? "See Results" : "Next Question"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          ) : (
            /* Results */
            <div className="rounded-2xl border border-border bg-card p-8 md:p-10 shadow-card text-center animate-in fade-in duration-500">
              <ResultIcon className="h-16 w-16 mx-auto mb-4 text-foreground" />
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
                {score}/{questions.length} Correct
              </h2>
              <p className="text-lg text-muted-foreground mb-6">{resultMsg}</p>

              <div className="h-3 bg-muted rounded-full max-w-xs mx-auto mb-8">
                <div
                  className="h-full rounded-full bg-foreground transition-all duration-1000"
                  style={{ width: `${pct}%` }}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={restart}
                  className="px-6 py-3 rounded-xl border border-border font-semibold text-sm hover:bg-muted transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" /> Try Again
                </button>
                <Link
                  to="/knowledge"
                  className="px-6 py-3 rounded-xl bg-foreground text-background font-semibold text-sm hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2"
                >
                  Learn More <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <FooterSection />
    </div>
  );
};

export default VoterQuiz;
