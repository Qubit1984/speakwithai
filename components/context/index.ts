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
  selectedid: string;
  selectedname: string;
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
  setSelectedid: (id: string) => void;
  setSelectedName: (id: string) => void;
};

const useStore = create<State & Actions>((set) => ({
  aiparas: [],
  selectedid: "",
  selectedname: "",
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
  setSelectedid: (id) => {
    set((state) => ({ selectedid: id }));
  },
  setSelectedName: (name) => {
    set((state) => ({ selectedname: name }));
  },
}));
export default useStore;
