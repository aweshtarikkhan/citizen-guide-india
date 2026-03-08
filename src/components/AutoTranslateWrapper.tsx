import useAutoTranslate from "@/hooks/useAutoTranslate";

const AutoTranslateWrapper = ({ children }: { children: React.ReactNode }) => {
  useAutoTranslate();
  return <>{children}</>;
};

export default AutoTranslateWrapper;
