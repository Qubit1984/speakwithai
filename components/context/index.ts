import { create } from "zustand";

type AiPara = {
  id: string;
  user_id: string;
  name: string;
  prompt: string;
  temperature: number;
  max_token: number;
  listen_language: string;
  speak_language: string;
  should_speak: boolean;
};

type State = {
  aiparas: AiPara[];
  selectedai: AiPara;
  /*   selectedid: string;
  selectedname: string;
  selectedlisten: string; */
};
type Actions = {
  addAistate: (AiPara: AiPara) => void;
  deleteAistate: (id: string) => void;
  updateAistate: (id: string, newAipara: object) => void;
  getAistate: (
    id: string,
    property: keyof AiPara,
  ) => AiPara[keyof AiPara] | undefined;
  setInitialAistate: (initialAiParas: AiPara[]) => void;
  setSelectedai: (AiPara: Partial<AiPara>) => void;
  setSelectedid: (id: string) => void;
  setSelectedName: (id: string) => void;
  setSelectedListen: (id: string) => void;
};

const useStore = create<State & Actions>((set) => ({
  aiparas: [],
  selectedai: {
    id: "a",
    user_id: "default",
    name: "日本語IT面试教师",
    prompt:
      "日本語の教師として、モキュメントのITミーティングにおいて、フロントエンドの基礎的な質問をすることがあります。話すときはできるだけ簡潔にしてください。",
    temperature: 0.3,
    max_token: 25,
    listen_language: "ja",
    speak_language: "Takumi",
    should_speak: true,
  },
  addAistate: (AiPara) => {
    set((state) => ({ aiparas: [...state.aiparas, AiPara] }));
  },

  deleteAistate: (id) => {
    set((state) => ({
      aiparas: state.aiparas.filter((item) => item.id !== id),
    }));
  },
  updateAistate: (id, newAipara) => {
    set((state) => ({
      aiparas: state.aiparas.map((item) =>
        item.id === id ? { ...item, ...newAipara } : item,
      ),
    }));
  },
  getAistate: (id, property) => {
    const store: State = useStore.getState();
    const AiPara = store.aiparas.find((AiPara) => AiPara.id === id);
    return AiPara ? AiPara[property] : undefined;
  },
  setInitialAistate: (initialAiParas) => {
    set((state) => ({ aiparas: initialAiParas }));
  },
  setSelectedai: (aiPartial) => {
    set((state) => ({ selectedai: { ...state.selectedai, ...aiPartial } }));
  },
  setSelectedid: (id) => {
    set((state) => ({
      selectedai: { ...state.selectedai, id },
    }));
  },
  setSelectedName: (name) => {
    set((state) => ({ selectedai: { ...state.selectedai, name } }));
  },
  setSelectedListen: (listen_language) => {
    set((state) => ({ selectedai: { ...state.selectedai, listen_language } }));
  },
}));
export default useStore;
