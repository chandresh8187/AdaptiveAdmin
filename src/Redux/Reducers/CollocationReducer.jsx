import { APIClient } from "../../API/ApiClient";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
const initialState = {
  missing_collocations: [],
  Loading: false,
  api_payload: [],
  openForm: false,
  openConfirmModal: false,
  MC_pageNumber: 1,
};
// WordInput
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

export const openForm = (value) => ({
  type: "OPEN_FORM",
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

// for add new words
export const addWordsInMissingList = (NewWordsList) => {
  return async (dispatch) => {
    let ApiPayload = NewWordsList.map((it) => it.word);
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
        dispatch(getCollocationMissingWordsList());
      } else {
        toast.error(response.message);
      }
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
    if (response.ok) {
      dispatch(refreshMCWordList());
      dispatch(getCollocationMissingWordsList());
      dispatch(ConfirmModal(false));
      dispatch({
        type: "SET_API_PAYLOAD",
        payload: [],
      });
    }
  };
};

// for selection of words
export const setSelectedMissingWords = (NewWord, list = []) => {
  return async (dispatch) => {
    let updatedList = [];
    if (NewWord.isSelected) {
      updatedList = list.map((word, index) => {
        if (word.word === NewWord.word) {
          return { ...word, isSelected: false };
        }
        return word;
      });
    } else {
      updatedList = list.map((word, index) => {
        if (word.word === NewWord.word) {
          return { ...word, isSelected: true };
        }
        return word;
      });
    }

    const ApiPayload = updatedList
      .filter((item) => item.isSelected === true)
      .map((item) => item.word);

    dispatch({
      type: "SET_API_PAYLOAD",
      payload: ApiPayload,
    });
    dispatch({
      type: "SET_MISSING_WORDS",
      payload: updatedList,
    });
  };
};

//for refreshing word list
export const refreshMCWordList = () => ({
  type: "SET_MISSING_WORDS",
  payload: [],
});

// for getting all word list
export const getCollocationMissingWordsList = (
  pageNumber = 1,
  prevList = []
) => {
  return async (dispatch) => {
    dispatch(setLoadingWordList(true));
    let pageSize = 10;
    const response = await APIClient.get(
      `missing_collocations?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );

    if (response.ok) {
      let allList = [
        ...prevList,
        ...CreateWordListJson(response.data.collocation_list),
      ];
      dispatch({
        type: "SET_MISSING_WORDS",
        payload: allList,
      });
      dispatch({
        type: "MC_PAGE_NUMBER",
        payload: pageNumber,
      });
      dispatch(setLoadingWordList(false));
    } else {
      toast.error(response.message);
      dispatch(setLoadingWordList(false));
    }
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
    default:
      return state;
  }
}

export default collocationsReducer;
