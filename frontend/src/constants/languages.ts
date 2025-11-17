export interface LanguageOption {
  label: string;
  value: string;
  monacoLanguage: string;
  extension: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { label: 'JavaScript', value: 'javascript', monacoLanguage: 'javascript', extension: 'js' },
  { label: 'TypeScript', value: 'typescript', monacoLanguage: 'typescript', extension: 'ts' },
  { label: 'Python', value: 'python', monacoLanguage: 'python', extension: 'py' },
  { label: 'Java', value: 'java', monacoLanguage: 'java', extension: 'java' },
  { label: 'Go', value: 'go', monacoLanguage: 'go', extension: 'go' },
  { label: 'Rust', value: 'rust', monacoLanguage: 'rust', extension: 'rs' },
  { label: 'C++', value: 'cpp', monacoLanguage: 'cpp', extension: 'cpp' },
  { label: 'C#', value: 'csharp', monacoLanguage: 'csharp', extension: 'cs' },
  { label: 'C', value: 'c', monacoLanguage: 'c', extension: 'c' },
  { label: 'SQL', value: 'sql', monacoLanguage: 'sql', extension: 'sql' },
];

export const DEFAULT_LANGUAGE = LANGUAGE_OPTIONS[0];

export const getLanguageOption = (value: string): LanguageOption => {
  return LANGUAGE_OPTIONS.find((option) => option.value === value) ?? DEFAULT_LANGUAGE;
};
