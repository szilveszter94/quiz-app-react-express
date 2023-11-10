/* eslint-disable react/prop-types */
import { createContext, useState } from "react";

export const ActualQuizContext = createContext({
  actualQuiz: [],
  setActualQuiz: () => [],
});

export const ActualQuizProvider = ({ children }) => {
  const [actualQuiz, setActualQuiz] = useState(false);
  const value = { actualQuiz, setActualQuiz };
  

  return (
    <ActualQuizContext.Provider value={value}>
      {children}
    </ActualQuizContext.Provider>
  );
};