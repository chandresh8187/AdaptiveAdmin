import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { APIClient } from "../../API/ApiClient";
const initialState = {
  missing_collocations: [],
  Loading: false,
  api_payload: [],
  openForm: false,
  openConfirmModal: false,
  MC_pageNumber: 1,
  Content: [],
  Generator: "chatgpt",
  GeneratorModal: false,
  IsProcessing: false,
  CurrentWordIndex: 0,
  collection_names: [],
  selected_collection: "",
  word_sets: [],
  LoadingCollections: false,
  LoadingWordSets: false,
  selected_wordset: "",
  selected_list_type: "existing",
  vocabularyList: {
    missing: [],
    existing: [],
  },
  opened_collection: "",
};
export const setSelectedCollection = (collection) => ({
  type: "SET_SELECTED_COLLECTION",
  payload: collection,
});

export const setOpenedCollection = (collection) => ({
  type: "SET_OPENED_COLLECTION",
  payload: collection,
});

export const setSelectedListType = (type) => {
  return async (dispatch) => {
    dispatch({
      type: "SET_SELECTED_LIST_TYPE",
      payload: type,
    });
  };
};

export const setSelectedWordset = (wordset) => ({
  type: "SET_SELECTED_WORDSET",
  payload: wordset,
});

export const getWordSetsByCollection = (collection, flag = 0) => {
  return async (dispatch) => {
    const response = await APIClient.post("word_sets", {
      collection_name: collection,
    });
    if (response.ok && response.status === 200) {
      dispatch({
        type: "SET_WORDS_SETS",
        payload: [],
      });
      dispatch(setLoadingWordSets(false));

      dispatch({
        type: "SET_WORDS_SETS",
        payload: response.data,
      });
      if (flag === 1) {
        dispatch(setSelectedWordset(response.data[0].word_set_name));
        dispatch(
          getVocabulary("existing", collection, response.data[0].word_set_name)
        );
      }
    }
  };
};

export const getVocabulary = (ListType, collection_name, word_set_name) => {
  return async (dispatch) => {
    dispatch(setLoadingWordList(true));
    dispatch({
      type: "SET_VOCABULARY_LIST",
      payload: { ListType: ListType, data: [] },
    });
    if (ListType === "existing") {
      const response = await APIClient.post("vocabulary", {
        collection_name: collection_name,
        word_set_name: word_set_name,
      });
      if (response.ok && response.status === 200) {
        const data = CreateWordListJsonForVocabulary(response.data);
        dispatch({
          type: "SET_VOCABULARY_LIST",
          payload: { ListType: ListType, data: data },
        });
        dispatch(setIsProcessing(true));
        dispatch({
          type: "SET_GENERATED_CONTENT",
          payload: response.data,
        });
      }
      dispatch(setLoadingWordList(false));
      dispatch(setIsProcessing(false));
    }
  };
};

export const getCollectionList = () => {
  return async (dispatch) => {
    dispatch(setLoadingCollections(true));
    const response = await APIClient.post("vocabulary_collection_names");
    if (response.ok && response.status === 200) {
      dispatch({
        type: "SET_COLLECTION_NAMES",
        payload: response.data.vocabulary_collection_names,
      });
      dispatch(setLoadingCollections(false));
    } else {
      dispatch(setLoadingCollections(false));
      toast.error(response.message);
    }
  };
};

const CreateWordListJson = (list) => {
  let generatedList = list.map((word) => ({
    word,
    id: uuidv4(),
    isRemoved: false,
    isGenerated: false,
    isSelected: false,
  }));
  return generatedList;
};

const CreateWordListJsonForVocabulary = (list) => {
  let generatedList = list.map((word) => ({
    word: word.word,
    id: uuidv4(),
    isRemoved: false,
    isGenerated: false,
    isSelected: false,
  }));
  return generatedList;
};

// content changing methods
export const updateContentWord = (value, index) => ({
  type: "UPDATE_CONTENT_WORD",
  payload: { value, index },
});
export const updateContentPOP = (value, index) => ({
  type: "UPDATE_CONTENT_PART_OF_SPEECH",
  payload: { value, index },
});

export const updateContentMeaning = (value, index) => ({
  type: "UPDATE_CONTENT_MEANING",
  payload: { value, index },
});

export const updateContentCC = (value, index, subIndex) => ({
  type: "UPDATE_CONTENT_CC",
  payload: { value, index, subIndex },
});

export const updateContentExamples = (value, index, subIndex) => ({
  type: "UPDATE_CONTENT_EXAMPLES",
  payload: { value, index, subIndex },
});

export const updateContentSynonyms = (value, index, subIndex) => ({
  type: "UPDATE_CONTENT_SYNONYMS",
  payload: { value, index, subIndex },
});

export const updateContentSynonymsEx = (value, index, subIndex, key) => ({
  type: "UPDATE_CONTENT_SYNONYMS_EX",
  payload: { value, index, subIndex, key },
});

export const updateContentIWT = (value, index, subIndex, key) => ({
  type: "UPDATE_CONTENT_IWT",
  payload: { value, index, subIndex, key },
});

export const updateContentSpEx = (value, index, subIndex, key) => ({
  type: "UPDATE_CONTENT_SPEAKING_EXAMPLE",
  payload: { value, index, subIndex, key },
});

export const updateContentCommanErrors = (value, index, subIndex, key) => ({
  type: "UPDATE_CONTENT_COMMAN_ERRORS",
  payload: { value, index, subIndex, key },
});

export const updateContentUsageTips = (value, index, subIndex) => ({
  type: "UPDATE_CONTENT_USAGE_TIPS",
  payload: { value, index, subIndex },
});

export const openForm = (value) => ({
  type: "OPEN_FORM",
  payload: value,
});

export const openGeneraterModal = (value) => ({
  type: "OPEN_GENERATE_MODAL",
  payload: value,
});

export const ConfirmModal = (value) => ({
  type: "OPEN_COMFIRM_MODAL",
  payload: value,
});

const setLoadingWordList = (loading) => ({
  type: "SET_LOADING_WORD_LIST",
  payload: loading,
});

export const setGenerater = (generator) => ({
  type: "SET_AI_GENERATER",
  payload: generator,
});

const setIsProcessing = (value) => ({
  type: "SET_PROCESSING",
  payload: value,
});

export const setLoadingWordSets = (value) => ({
  type: "SET_LOADING_WORDS_SETS",
  payload: value,
});

export const setLoadingCollections = (value) => ({
  type: "SET_LOADING_COLLECTIONS",
  payload: value,
});
export const setCurrentWordIndex = (index) => ({
  type: "SET_CURRENT_WORD_INDEX",
  payload: index,
});

// for add new words
export const addWordsInMissingList = (NewWordsList) => {
  return async (dispatch) => {
    let ApiPayload = NewWordsList;
    let body = {
      collocation_list: ApiPayload,
    };
    if (ApiPayload.length < 0 || ApiPayload[0] === "") {
      toast.error("Please Enter Some Words");
    } else {
      dispatch(refreshMCWordList());
      const response = await APIClient.post("add_collocations", body);
      if (response.ok) {
        toast.success("saved Words successfully");
        // dispatch(getMissingWordsList());
      } else {
        toast.error(response.message);
      }
    }
  };
};

export const AddWordContent = (collection_name, word, content = []) => {
  return async (dispatch) => {
    const response = await APIClient.post("add_words", {
      collection_name: collection_name,
      word_list: [word],
    });
    console.log("response sub", response);
    if (response.ok && response.status === 200) {
      const updatedContent = content.filter((item) => item.word !== word.word);
      console.log("updatedContent", updatedContent);
      dispatch({
        type: "SET_GENERATED_CONTENT",
        payload: updatedContent,
      });
      toast.success("Data Saved Successfully");
    } else {
      toast.error(response.message);
    }
  };
};

export const RemoveExistingWords = (
  collection_name,
  words,
  selected_wordset
) => {
  return async (dispatch) => {
    const response = await APIClient.post("remove_words", {
      collection_name: collection_name,
      word_list: [words],
    });
    if (response.ok && response.status === 200) {
      dispatch(getVocabulary("existing", collection_name, selected_wordset));
      dispatch(ConfirmModal(false));
    } else {
      toast.error(response.message);
    }
  };
};

//for soft remove single or multiple word
export const removeWordFromMissingList = (ApiPayload) => {
  return async (dispatch) => {
    let body = {
      collocation_list: ApiPayload,
    };
    const response = await APIClient.post("remove_collocations", body);
    if (response.ok && response.status === 200) {
      dispatch(refreshMCWordList());
      // dispatch(getMissingWordsList());
      dispatch(ConfirmModal(false));
      dispatch({
        type: "SET_API_PAYLOAD",
        payload: [],
      });
    }
  };
};

// for selection of words
export const setSelectedMissingWords = (NewWord, list = [], type) => {
  return async (dispatch) => {
    let updatedList = [];
    updatedList = list.map((word, index) => {
      if (word.word === NewWord.word) {
        return { ...word, isSelected: !word.isSelected };
      }
      return word;
    });

    const ApiPayload = updatedList
      .filter((item) => item.isSelected === true)
      .map((itm) => itm.word);

    dispatch({
      type: "SET_API_PAYLOAD",
      payload: ApiPayload,
    });
    dispatch({
      type: "SET_VOCABULARY_LIST",
      payload: { ListType: type, data: updatedList },
    });
  };
};

//for refreshing word list
export const refreshMCWordList = () => ({
  type: "SET_MISSING_WORDS",
  payload: [],
});

// for getting all word list
export const getMissingWordsList = (
  collection_name,
  pageNumber = 1,
  prevList = []
) => {
  return async (dispatch) => {
    dispatch(setLoadingWordList(true));

    let pageSize = 50;
    const response = await APIClient.post(
      `missing_words?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      {
        collection_name,
      }
    );

    if (response.ok) {
      let allList = [
        ...prevList,
        ...CreateWordListJson(response.data.missing_words),
      ];

      if (response.data.missing_words.length > 0) {
        if (pageNumber === 1) {
          dispatch({
            type: "SET_VOCABULARY_LIST",
            payload: {
              ListType: "missing",
              data: CreateWordListJson(response.data.missing_words),
            },
          });
        } else {
          dispatch({
            type: "SET_VOCABULARY_LIST",
            payload: { ListType: "missing", data: allList },
          });
        }
        dispatch({
          type: "MC_PAGE_NUMBER",
          payload: pageNumber,
        });
      }

      dispatch(setLoadingWordList(false));
    } else {
      let allList = [...prevList, ...[]];
      toast.error(response.message);
      dispatch(setLoadingWordList(false));
      dispatch({
        type: "SET_VOCABULARY_LIST",
        payload: { ListType: "missing", data: pageNumber === 1 ? [] : allList },
      });
    }
  };
};

//for generate content of vocabulary
export const GenerateConntentFromWords = (
  selected_collection,
  payload,
  generator
) => {
  return async (dispatch) => {
    console.log("selected_collection gen", selected_collection);
    dispatch(openGeneraterModal(false));
    dispatch(setIsProcessing(true));
    dispatch({
      type: "SET_GENERATED_CONTENT",
      payload: [],
    });
    const response = await APIClient.post("generate_collocation_details", {
      collocation_list: payload,
      generator: generator,
    });
    console.log("response gen", JSON.stringify(response));
    if (response.ok) {
      dispatch({
        type: "SET_GENERATED_CONTENT",
        payload: response.data.collocation_list,
      });
      dispatch(refreshMCWordList());
      dispatch(getMissingWordsList(selected_collection));
      dispatch(setCurrentWordIndex(0));
      dispatch(setIsProcessing(false));
      dispatch({
        type: "SET_API_PAYLOAD",
        payload: [],
      });
    } else {
      toast.error(response.message);
      dispatch(setIsProcessing(false));
    }
  };
};

export const updateExistingWords = (collection_name, word) => {
  return async (dispatch) => {
    const response = await APIClient.post("update_words", {
      collection_name: collection_name,
      word_list: [word],
    });
    console.log("response sub ex", response);
    if (response.ok && response.status === 200) {
      toast.success("Data Saved Successfully");
    } else {
      toast.error(response.message);
    }
  };
};

export const regenerate = (payload, generator, Content = []) => {
  return async (dispatch) => {
    dispatch(openGeneraterModal(false));
    dispatch(setIsProcessing(true));
    const response = await APIClient.post("generate_collocation_details", {
      collocation_list: [payload.word],
      generator: generator,
    });
    console.log("re-generated data", response.data);
    if (response.ok && response.status === 200) {
      let updatedContent = Content.map((item) => {
        if (item.word === payload.word) {
          return response.data.collocation_list[0];
        }
        return item;
      });
      dispatch({
        type: "SET_GENERATED_CONTENT",
        payload: updatedContent,
      });
    } else {
      toast.error(response.message);
    }

    dispatch(setIsProcessing(false));
  };
};

function collocationsReducer(state = initialState, action) {
  switch (action.type) {
    case "SET_MISSING_WORDS":
      return { ...state, missing_collocations: action.payload };
    case "SET_LOADING_WORD_LIST":
      return { ...state, Loading: action.payload };
    case "SET_API_PAYLOAD":
      return { ...state, api_payload: action.payload };
    case "OPEN_FORM":
      return { ...state, openForm: action.payload };
    case "OPEN_COMFIRM_MODAL":
      return { ...state, openConfirmModal: action.payload };
    case "MC_PAGE_NUMBER":
      return { ...state, MC_pageNumber: action.payload };

    case "UPDATE_CONTENT_WORD":
      let WordValue = action.payload.value;
      var MainIndex = action.payload.index;
      return {
        ...state,
        Content: state.Content.map((c, i) => {
          if (i === MainIndex) {
            return {
              ...c,
              word: WordValue,
            };
          }
          return c;
        }),
      };
    case "UPDATE_CONTENT_PART_OF_SPEECH":
      let POPValue = action.payload.value;
      var MainIndex = action.payload.index;
      return {
        ...state,
        Content: state.Content.map((c, i) => {
          if (i === MainIndex) {
            return {
              ...c,
              partOfSpeech: POPValue,
            };
          }
          return c;
        }),
      };
    case "UPDATE_CONTENT_MEANING":
      let MeaningValue = action.payload.value;
      var MainIndex = action.payload.index;
      return {
        ...state,
        Content: state.Content.map((c, i) => {
          if (i === MainIndex) {
            return {
              ...c,
              meaning: MeaningValue,
            };
          }
          return c;
        }),
      };
    case "UPDATE_CONTENT_CC":
      let CCValue = action.payload.value;
      var MainIndex = action.payload.index;
      var SubIndex = action.payload.subIndex;

      return {
        ...state,
        Content: state.Content.map((c, i) => {
          if (i === MainIndex) {
            return {
              ...c,
              collocations: c.collocations.map((cc, si) => {
                if (si === SubIndex) {
                  return CCValue;
                }
                return cc;
              }),
            };
          }
          return c;
        }),
      };
    case "UPDATE_CONTENT_EXAMPLES":
      let ExmValue = action.payload.value;
      var MainIndex = action.payload.index;
      var SubIndex = action.payload.subIndex;
      if (SubIndex === "E") {
        return {
          ...state,
          Content: state.Content.map((c, i) => {
            if (i === MainIndex) {
              return {
                ...c,
                example: ExmValue,
              };
            }
            return c;
          }),
        };
      } else {
        return {
          ...state,
          Content: state.Content.map((c, i) => {
            if (i === MainIndex) {
              return {
                ...c,
                examples: c.examples.map((Ex, Exi) => {
                  if (Exi === SubIndex) {
                    return ExmValue;
                  }
                  return Ex;
                }),
              };
            }
            return c;
          }),
        };
      }
    case "UPDATE_CONTENT_SYNONYMS":
      let SynValue = action.payload.value;
      var MainIndex = action.payload.index;
      var SubIndex = action.payload.subIndex;
      return {
        ...state,
        Content: state.Content.map((c, i) => {
          if (i === MainIndex) {
            return {
              ...c,
              synonyms: c.synonyms.map((sy, si) => {
                if (si === SubIndex) {
                  return SynValue;
                }
                return sy;
              }),
            };
          }
          return c;
        }),
      };
    case "UPDATE_CONTENT_SYNONYMS_EX":
      let SynExValue = action.payload.value;
      var MainIndex = action.payload.index;
      var SubIndex = action.payload.subIndex;
      var key = action.payload.key;

      if (key === "synonym") {
        return {
          ...state,
          Content: state.Content.map((c, i) => {
            if (i === MainIndex) {
              return {
                ...c,
                synonymExamples: c.synonymExamples.map((SnEx, sEi) => {
                  if (sEi === SubIndex) {
                    return { ...SnEx, synonym: SynExValue };
                  }
                  return SnEx;
                }),
              };
            }
            return c;
          }),
        };
      } else {
        return {
          ...state,
          Content: state.Content.map((c, i) => {
            if (i === MainIndex) {
              return {
                ...c,
                synonymExamples: c.synonymExamples.map((SnEx, sEi) => {
                  if (sEi === SubIndex) {
                    return { ...SnEx, example: SynExValue };
                  }
                  return SnEx;
                }),
              };
            }
            return c;
          }),
        };
      }
    case "UPDATE_CONTENT_IWT":
      let IWTValue = action.payload.value;
      var MainIndex = action.payload.index;
      var SubIndex = action.payload.subIndex;
      var key = action.payload.key;
      if (key === "topic") {
        return {
          ...state,
          Content: state.Content.map((c, i) => {
            if (i === MainIndex) {
              return {
                ...c,
                ieltsWritingTopics: c.ieltsWritingTopics.map((IWT, Iwti) => {
                  if (Iwti === SubIndex) {
                    return { ...IWT, topic: IWTValue };
                  }
                  return IWT;
                }),
              };
            }
            return c;
          }),
        };
      } else {
        return {
          ...state,
          Content: state.Content.map((c, i) => {
            if (i === MainIndex) {
              return {
                ...c,
                ieltsWritingTopics: c.ieltsWritingTopics.map((IWT, Iwti) => {
                  if (Iwti === SubIndex) {
                    return { ...IWT, example: IWTValue };
                  }
                  return IWT;
                }),
              };
            }
            return c;
          }),
        };
      }
    case "UPDATE_CONTENT_SPEAKING_EXAMPLE":
      let SPEXValue = action.payload.value;
      var MainIndex = action.payload.index;
      var SubIndex = action.payload.subIndex;
      var key = action.payload.key;

      if (key === "question") {
        return {
          ...state,
          Content: state.Content.map((c, i) => {
            if (i === MainIndex) {
              return {
                ...c,
                speakingExamples: c.speakingExamples.map((spex, sxi) => {
                  if (sxi === SubIndex) {
                    return { ...spex, question: SPEXValue };
                  }
                  return spex;
                }),
              };
            }
            return c;
          }),
        };
      } else {
        return {
          ...state,
          Content: state.Content.map((c, i) => {
            if (i === MainIndex) {
              return {
                ...c,
                speakingExamples: c.speakingExamples.map((spex, sxi) => {
                  if (sxi === SubIndex) {
                    return { ...spex, answer: SPEXValue };
                  }
                  return spex;
                }),
              };
            }
            return c;
          }),
        };
      }
    case "UPDATE_CONTENT_COMMAN_ERRORS":
      let CEValue = action.payload.value;
      var MainIndex = action.payload.index;
      var SubIndex = action.payload.subIndex;
      var key = action.payload.key;
      if (key === "error") {
        return {
          ...state,
          Content: state.Content.map((c, i) => {
            if (i === MainIndex) {
              return {
                ...c,
                commonErrors: c.commonErrors.map((CE, cEi) => {
                  if (cEi === SubIndex) {
                    return { ...CE, error: CEValue };
                  }
                  return CE;
                }),
              };
            }
            return c;
          }),
        };
      } else {
        return {
          ...state,
          Content: state.Content.map((c, i) => {
            if (i === MainIndex) {
              return {
                ...c,
                commonErrors: c.commonErrors.map((CE, cEi) => {
                  if (cEi === SubIndex) {
                    return { ...CE, correction: CEValue };
                  }
                  return CE;
                }),
              };
            }
            return c;
          }),
        };
      }
    case "UPDATE_CONTENT_USAGE_TIPS":
      let UTValue = action.payload.value;
      var MainIndex = action.payload.index;
      var SubIndex = action.payload.subIndex;
      return {
        ...state,
        Content: state.Content.map((c, i) => {
          if (i === MainIndex) {
            return {
              ...c,
              usageTips: c.usageTips.map((UT, Uti) => {
                if (Uti === SubIndex) {
                  return UTValue;
                }
                return UT;
              }),
            };
          }
          return c;
        }),
      };
    case "SET_AI_GENERATER":
      return { ...state, Generator: action.payload };
    case "OPEN_GENERATE_MODAL":
      return { ...state, GeneratorModal: action.payload };
    case "SET_PROCESSING":
      return { ...state, IsProcessing: action.payload };
    case "SET_GENERATED_CONTENT":
      return { ...state, Content: action.payload };
    case "SET_CURRENT_WORD_INDEX":
      return { ...state, CurrentWordIndex: action.payload };
    case "SET_COLLECTION_NAMES":
      return { ...state, collection_names: action.payload };
    case "SET_SELECTED_COLLECTION":
      return { ...state, selected_collection: action.payload };
    case "SET_OPENED_COLLECTION":
      return { ...state, opened_collection: action.payload };
    case "SET_LOADING_WORDS_SETS":
      return { ...state, LoadingWordSets: action.payload };
    case "SET_WORDS_SETS":
      return { ...state, word_sets: action.payload };
    case "SET_SELECTED_WORDSET":
      return { ...state, selected_wordset: action.payload };
    case "SET_SELECTED_LIST_TYPE":
      return { ...state, selected_list_type: action.payload };
    case "SET_LOADING_COLLECTIONS":
      return { ...state, LoadingCollections: action.payload };
    case "SET_VOCABULARY_LIST":
      const ListType = action.payload.ListType;
      if (ListType === "existing") {
        return {
          ...state,
          vocabularyList: {
            ...state.vocabularyList,
            existing: action.payload.data,
          },
        };
      } else {
        return {
          ...state,
          vocabularyList: {
            ...state.vocabularyList,
            missing: action.payload.data,
          },
        };
      }

    default:
      return state;
  }
}

export default collocationsReducer;
