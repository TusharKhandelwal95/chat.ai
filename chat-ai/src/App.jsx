import { useState } from "react";
import "./App.css";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);

  async function generateAnswer(e) {
    setGeneratingAnswer(true);
    e.preventDefault();
    setAnswer("Loading your answer... It might take up to 10 seconds.");
    try {
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT
          }`,
        method: "post",
        data: {
          contents: [{ parts: [{ text: question }] }],
        },
      });

      setAnswer(
        response["data"]["candidates"][0]["content"]["parts"][0]["text"]
      );
    } catch (error) {
      console.log(error);
      setAnswer("Sorry - Something went wrong. Please try again!");
    }

    setGeneratingAnswer(false);
  }

  return (
    <>
      <div className="bg-gradient-to-r from-dark to-darker h-screen flex flex-col justify-center items-center p-4">
        <form
          onSubmit={generateAnswer}
          className="w-full md:w-2/3 lg:w-1/2 xl:w-1/3 text-center rounded-lg shadow-xl bg-dark py-6 px-4 transition-all duration-500 hover:scale-105"
        >
          <a
            target="_blank"
            rel="noopener noreferrer"
          >
            <h1 className="text-3xl font-bold text-white mb-6">
              <span className="text-blue-500">Chat</span>.ie
            </h1>
          </a>
          <textarea
            required
            className="border border-gray-600 rounded-lg w-full my-2 h-32 p-3 resize-none transition-all duration-300 focus:border-blue-400 focus:shadow-lg focus:outline-none"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask me anything..."
          ></textarea>
          <button
            type="submit"
            className={`w-full text-white p-3 rounded-md mt-4 transition-all duration-300 ${generatingAnswer ? "opacity-50 cursor-not-allowed" : ""
              }`}
            disabled={generatingAnswer}
          >
            {generatingAnswer ? "Generating..." : "Generate Answer"}
          </button>
        </form>
        <div className="w-full md:w-2/3 lg:w-1/2 xl:w-1/3 mt-6">
          <div className="text-left bg-dark p-6 rounded-lg shadow-lg">
            <ReactMarkdown className="text-white">{answer}</ReactMarkdown>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
