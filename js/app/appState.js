export const defaultInput = {
  name: "测试用户",
  birthDate: "1949-10-01",
  birthTime: "00:00",
  birthProvince: "北京市",
  birthplace: "北京",
  gender: "male",
  targetYear: 2026,
  selectedMonth: 1,
  trueSolarTime: false,
  preInterpretAi: false,
};

export function createEmptyAiState() {
  return {
    loading: false,
    text: "",
    error: "",
  };
}

export function createEmptyChatState() {
  return {
    question: "",
    loading: false,
    error: "",
    messages: [],
  };
}

export function createAppState(initialInput = defaultInput) {
  return {
    currentInput: { ...defaultInput, ...initialInput },
    state: null,
    natalAiState: createEmptyAiState(),
    luckAiState: createEmptyAiState(),
    yearAiState: createEmptyAiState(),
    monthAiState: createEmptyAiState(),
    chatState: createEmptyChatState(),
    aiChatOpen: false,
    yearAiGenerationId: 0,
    locationCatalog: { cities: [] },
    masterSummaryDatabase: null,
  };
}

export function resetGeneratedStates(store) {
  store.natalAiState = createEmptyAiState();
  store.luckAiState = createEmptyAiState();
  store.yearAiState = createEmptyAiState();
  store.monthAiState = createEmptyAiState();
  store.chatState = createEmptyChatState();
}
