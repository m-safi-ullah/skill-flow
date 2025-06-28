import { useEffect, useState } from "react";
import { generateEnglishTest } from "../../utils/generateEnglishTest";
import axios from "../../../baseURL/axios";

let resizeTimeout;

const SkillTest = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [terminated, setTerminated] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);

  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300);
  const [testGenerating, setTestGenerating] = useState(false);

  // Fetch profile info first
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/dashboard/getProfile");

        if (res.data.success) {
          const profile = res.data.profile;

          if (profile.test?.voilation == true) {
            setTerminated(true);
            setLoading(false);
            setScore(profile.test.score);
            return;
          }

          if (profile.test?.score) {
            setScore(profile.test.score);
          }

          if (profile.test?.date) {
            const lastTestDate = new Date(profile.test.date);
            const now = new Date();
            const diffDays = Math.floor(
              (now - lastTestDate) / (1000 * 60 * 60 * 24)
            );

            if (diffDays < 7) {
              setBlocked(true);
              setLoading(false);
              return;
            }
          }
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Start test: generate questions
  const handleStart = async () => {
    setStarted(true);
    setTestGenerating(true);
    setScore(null);

    try {
      const res = await generateEnglishTest();
      if (res.success) {
        setQuestions(res.questions);
      } else {
        alert("Failed to generate test.");
      }
    } catch (err) {
      console.error("Error during test start:", err);
      alert("Failed to start the test.");
    } finally {
      setTestGenerating(false);
    }
  };

  // Timer countdown
  useEffect(() => {
    if (
      !started ||
      terminated ||
      blocked ||
      score !== null ||
      questions.length === 0
    )
      return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [started, questions, score, terminated, blocked]);

  // Violation monitoring
  useEffect(() => {
    if (!started) return;

    const handleVisibilityChange = () => {
      if (document.hidden)
        terminateTest("Test terminated: tab switch detected.");
    };

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (window.innerWidth < 768) {
          terminateTest("Test terminated: screen too small.");
        }
      }, 300);
    };

    const handleBeforeUnload = (e) => {
      if (!testCompleted && !terminated) {
        e.preventDefault();
        e.returnValue = "";
        terminateTest("Test terminated: page refresh or close.");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("resize", handleResize);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [started, testCompleted]);

  const handleSelect = (qIdx, optIdx) => {
    setAnswers({ ...answers, [qIdx]: optIdx });
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) setCurrentQ(currentQ + 1);
  };

  const handleBack = () => {
    if (currentQ > 0) setCurrentQ(currentQ - 1);
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      alert("Please answer all questions before submitting.");
      return;
    }

    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correct) correctCount++;
    });

    setScore(correctCount);
    setTestCompleted(true);

    try {
      await axios.post("/dashboard/test", {
        score: correctCount.toString(),
      });
    } catch (err) {
      console.error("Error submitting score:", err);
    }
  };

  const terminateTest = async (reason) => {
    if (terminated || blocked) return;

    setTerminated(true);
    setQuestions([]);
    setStarted(false);
    setTestGenerating(false);

    try {
      await axios.post("/dashboard/test", {
        reason,
      });
    } catch (err) {
      console.error("Failed to log cheating:", err);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="mx-auto p-6">
      <div className="flex justify-between">
        <h2 className="text-xl font-medium mb-4">English Skill Test</h2>
        {score && (
          <p className="text-green-800 text-medium text-lg">
            Your Score: {score}/10
          </p>
        )}
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : terminated ? (
        <div
          class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
          role="alert"
        >
          Test terminated due to violation. You can retake it after 7 Days.
        </div>
      ) : blocked ? (
        <div
          class="p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
          role="alert"
        >
          You can retake the test after 7 days.
        </div>
      ) : !started ? (
        <div className="bg-white border rounded shadow p-6">
          <p className="mb-4 text-gray-700 leading-relaxed">
            📋 This is a timed test of 5 minutes. Once started,{" "}
            <strong>you are not allowed to</strong>:
          </p>
          <ul className="list-disc list-inside mb-4 text-gray-600">
            <li>Switch tabs</li>
            <li>Resize or minimize the screen</li>
            <li>Refresh or close the page</li>
          </ul>
          <p className="mb-4 text-red-600 font-medium">
            ⚠️ Violation will terminate the test and block you for 7 days.
          </p>
          <div>
            <button
              onClick={handleStart}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              disabled={testCompleted}
            >
              Start Test
            </button>
          </div>
        </div>
      ) : testGenerating || questions.length === 0 ? (
        <p className="text-green-500">
          🧠 Generating your test... Please wait.
        </p>
      ) : score !== null ? (
        <div className="text-center mt-8 text-green-700 font-bold text-xl">
          ✅ Your Score: {score} / {questions.length}
        </div>
      ) : (
        <>
          <div className="text-center text-blue-600 font-semibold text-lg mb-4">
            ⏱ Time Left: {formatTime(timeLeft)}
          </div>

          <div className="p-4 border rounded-lg shadow-sm bg-white mb-4">
            <p className="font-semibold mb-2">
              {currentQ + 1}. {questions[currentQ].question}
            </p>
            {questions[currentQ].options.map((opt, oIdx) => (
              <label key={oIdx} className="block cursor-pointer mb-1">
                <input
                  type="radio"
                  name={`q${currentQ}`}
                  className="mr-2"
                  checked={answers[currentQ] === oIdx}
                  onChange={() => handleSelect(currentQ, oIdx)}
                />
                {opt}
              </label>
            ))}
          </div>

          <div className="flex justify-between mb-6">
            <button
              onClick={handleBack}
              disabled={currentQ === 0}
              className={`px-4 py-2 rounded ${
                currentQ === 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Back
            </button>

            {currentQ === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                Submit
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                Next
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SkillTest;
