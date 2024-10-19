import React, { useRef, useState } from "react";
import { MdPlaylistAddCheck, MdPlaylistRemove } from "react-icons/md";
import InfiniteScroll from "react-infinite-scroll-component";
import { ThreeDots } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import TextareaAutosize from "react-textarea-autosize";
import {
  AddWordContent,
  addWordsInMissingList,
  ConfirmModal,
  GenerateConntentFromWords,
  getMissingWordsList,
  getVocabulary,
  getWordSetsByCollection,
  openGeneraterModal,
  regenerate,
  RemoveExistingWords,
  removeWordFromMissingList,
  setCurrentWordIndex,
  setGenerater,
  setLoadingWordSets,
  setSelectedListType,
  setSelectedMissingWords,
  setSelectedWordset,
  updateContentCC,
  updateContentCommanErrors,
  updateContentExamples,
  updateContentIWT,
  updateContentMeaning,
  updateContentPOP,
  updateContentSpEx,
  updateContentSynonyms,
  updateContentSynonymsEx,
  updateContentUsageTips,
  updateContentWord,
  updateExistingWords,
} from "../../Redux/Reducers/CollocationReducer";
import { IconsAI } from "../../assets/Icons";
import CheckBox from "../../component/AICheckBox/CheckBox";
import ExpandableItem from "../../component/AIExpandableItem/ExpandableItem";
import Modal from "../../component/AIModal/Modal";

function WordsList() {
  const dispatch = useDispatch();
  const selected_list_type = useSelector(
    (state) => state.Collocations.selected_list_type
  );

  const wordlist = useSelector(
    (state) => state.Collocations.vocabularyList[selected_list_type]
  );
  const wordlistState = useSelector(
    (state) => state.Collocations.vocabularyList
  );

  const word_sets = useSelector((state) => state.Collocations.word_sets);
  const collections = useSelector(
    (state) => state.Collocations.collection_names
  );
  const WordListRef = useRef(null);
  const api_payload = useSelector((state) => state.Collocations.api_payload);
  const selected_collection = useSelector(
    (state) => state.Collocations.selected_collection
  );
  const pageNumber = useSelector((state) => state.Collocations.MC_pageNumber);
  const Loading = useSelector((state) => state.Collocations.Loading);
  const Content = useSelector((state) => state.Collocations.Content);
  const GeneratorModal = useSelector(
    (state) => state.Collocations.GeneratorModal
  );
  const Generator = useSelector((state) => state.Collocations.Generator);
  const IsProcessing = useSelector((state) => state.Collocations.IsProcessing);
  const CurrentWordIndex = useSelector(
    (state) => state.Collocations.CurrentWordIndex
  );

  const openConfirmModal = useSelector(
    (state) => state.Collocations.openConfirmModal
  );

  const LoadingCollections = useSelector(
    (state) => state.Collocations.LoadingCollections
  );

  const selected_wordset = useSelector(
    (state) => state.Collocations.selected_wordset
  );

  const scrollToWord = (index) => {
    if (WordListRef.current) {
      const scrollableDiv = WordListRef.current;
      const wordElement = scrollableDiv.querySelector(
        `[data-word-id="${wordlist[index].id}"]`
      );

      if (wordElement) {
        const scrollableRect = scrollableDiv.getBoundingClientRect();
        const wordRect = wordElement.getBoundingClientRect();

        if (
          wordRect.bottom > scrollableRect.bottom ||
          wordRect.top < scrollableRect.top
        ) {
          wordElement.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }
      }
    }
  };

  const [IsEdit, setIsEdit] = useState(false);
  const [WordInput, setWordInput] = useState("");
  // it will halde word selection with check box in word tabel
  const onSelectWord = (word) => {
    dispatch(setSelectedMissingWords(word, wordlist));
  };

  // it will call the api with next page number for word list
  const onEndReach = () => {
    dispatch(
      getMissingWordsList(
        selected_collection,
        pageNumber + 1,
        wordlistState["missing"]
      )
    );
  };

  //it will save all words and move it in to missing list
  const handleAddWordsInMissingList = () => {
    dispatch(addWordsInMissingList([WordInput]));
    setWordInput("");
  };

  // it will hanlde next word content navigation
  const handleNextWord = () => {
    if (CurrentWordIndex < Content?.length - 1) {
      scrollToWord(CurrentWordIndex + 1);
      dispatch(setCurrentWordIndex(CurrentWordIndex + 1));
    } else {
      dispatch(setCurrentWordIndex(CurrentWordIndex));
    }
  };

  // it will handle prev word content navigation
  const handlePrevWord = () => {
    if (CurrentWordIndex > 0) {
      scrollToWord(CurrentWordIndex - 1);

      dispatch(setCurrentWordIndex(CurrentWordIndex - 1));
    } else {
      dispatch(setCurrentWordIndex(CurrentWordIndex));
    }
  };

  return (
    <div className="h-screen w-full">
      <div className="flex items-center">
        <div
          style={{
            width: "20%",
          }}
          className="text-TextPrimary py-2 text-lg font-USBold pl-4"
        >
          Collocations
        </div>
        <div className="flex justify-center ">
          <div
            onClick={() => {
              dispatch(setCurrentWordIndex(0));
              dispatch(setSelectedListType("existing"));
              if (
                selected_collection !== "" &&
                selected_list_type !== "existing"
              ) {
                if (selected_wordset === "") {
                  dispatch(setLoadingWordSets(true));
                  dispatch(getWordSetsByCollection(selected_collection, 1));
                } else {
                  dispatch({
                    type: "SET_GENERATED_CONTENT",
                    payload: [],
                  });
                  dispatch(
                    getVocabulary(
                      "existing",
                      selected_collection,
                      selected_wordset
                    )
                  );
                }
              }
            }}
            className={`${
              selected_list_type === "existing" && "bg-gray-300"
            } flex h-7 items-center px-2 py-1 rounded-md cursor-pointer border border-gray-300 mr-1`}
          >
            <MdPlaylistAddCheck
              style={{
                height: 18,
                width: 18,
              }}
            />
            <div className="text-sm sm:text-xs select-none ml-2 mr-2 font-USSemiBold text-TextPrimary">
              Existing List
            </div>
          </div>
          <div
            onClick={() => {
              dispatch(setSelectedListType("missing"));
              dispatch(setCurrentWordIndex(0));
              if (
                selected_collection !== "" &&
                selected_list_type !== "missing"
              ) {
                dispatch(
                  getMissingWordsList(
                    selected_collection,
                    1,
                    wordlistState["missing"]
                  )
                );
                dispatch({
                  type: "SET_GENERATED_CONTENT",
                  payload: [],
                });
              }
            }}
            className={`${
              selected_list_type === "missing" && "bg-gray-300"
            } flex h-7 items-center px-2 py-1 rounded-md cursor-pointer border border-gray-300 mr-1`}
          >
            <MdPlaylistRemove
              style={{
                height: 18,
                width: 18,
              }}
            />
            <div className="text-sm sm:text-xs select-none ml-2 mr-2 font-USSemiBold text-TextPrimary">
              Missing List
            </div>
          </div>
        </div>
      </div>
      <div className="py-2 pr-4 flex ">
        <div
          style={{
            width: "20%",
          }}
          className="rounded-l-md px-2 pt-2 border-r"
        >
          <div id="scrollableDiv" className=" w-full overflow-scroll ">
            <InfiniteScroll
              loader={
                <div className="flex justify-center items-center ">
                  {LoadingCollections && (
                    <ThreeDots
                      visible={true}
                      height="40"
                      width="40"
                      color="#1F2225"
                      radius="9"
                      ariaLabel="three-dots-loading"
                      wrapperStyle={{}}
                      wrapperClass=""
                    />
                  )}
                </div>
              }
              dataLength={collections.length}
              style={{
                display: "flex",
                flexDirection: "column",
                height: window.innerHeight - 80,
              }} //To put endMessage and loader to the top.
              inverse={false} //
              hasMore={true}
              scrollableTarget="scrollableDiv"
            >
              {collections.map((item, index) => {
                return (
                  <ExpandableItem
                    collection={item}
                    key={index}
                    wordSets={word_sets}
                  />
                );
              })}
            </InfiniteScroll>
          </div>
        </div>
        <div className="shadow-md w-full flex overflow-hidden">
          <div
            style={{
              width: "30%",
            }}
            className="bg-white rounded-l-md  p-2 border-r"
          >
            <div className="h-16 border-b flex flex-col justify-between">
              <div className="text-xl font-USBold text-TextPrimary pl-2">
                Words List
              </div>
              <div className="flex h-10 items-center ">
                {wordlist.length > 0 && (
                  <>
                    {selected_list_type === "missing" && (
                      <div
                        onClick={() => {
                          if (api_payload.length > 0) {
                            dispatch(openGeneraterModal(true));
                          }
                        }}
                        className="flex h-7 items-center px-2 py-1 rounded-md cursor-pointer hover:bg-gray-100"
                      >
                        <img
                          src={IconsAI.Generate}
                          className="h-5 w-5"
                          alt=""
                        />
                        <div className="text-sm sm:text-xs select-none ml-2 mr-2 font-USSemiBold text-TextPrimary">
                          Generate
                        </div>
                      </div>
                    )}
                    {selected_list_type === "missing" && (
                      <div
                        onClick={() => {
                          if (api_payload.length > 0) {
                            dispatch(ConfirmModal(true));
                          }
                        }}
                        className="flex h-7 items-center select-none px-2 py-1 rounded-md cursor-pointer hover:bg-gray-100"
                      >
                        <img src={IconsAI.Trash} className="h-5 w-5" alt="" />
                        <div className="text-sm sm:text-xs  ml-2 mr-2 font-USSemiBold text-TextPrimary">
                          Remove
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div
              style={{}}
              id="scrollableDiv"
              ref={WordListRef}
              className="bg-white w-full  overflow-scroll "
            >
              {Loading ? (
                <div
                  style={{
                    height:
                      selected_list_type === "missing"
                        ? window.innerHeight - 200
                        : window.innerHeight - 150,
                  }}
                  className="flex justify-center items-center "
                >
                  <ThreeDots
                    visible={true}
                    height="40"
                    width="40"
                    color="#1F2225"
                    radius="9"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                  />
                </div>
              ) : wordlist.length <= 0 ? (
                <div
                  style={{
                    height:
                      selected_list_type === "missing"
                        ? window.innerHeight - 200
                        : window.innerHeight - 150,
                  }}
                  className="w-full flex items-center justify-center"
                >
                  <div className="font-USMedium text-sm">No Records Found</div>
                </div>
              ) : (
                <InfiniteScroll
                  dataLength={wordlistState["missing"].length}
                  next={() => {
                    onEndReach();
                  }}
                  scrollThreshold={0.9}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    height:
                      selected_list_type === "missing"
                        ? window.innerHeight - 200
                        : window.innerHeight - 150,
                  }}
                  inverse={false}
                  hasMore={true}
                  scrollableTarget="scrollableDiv"
                >
                  {wordlist.map((item, index) => {
                    return (
                      <div
                        key={index}
                        onClick={() => {
                          dispatch(setCurrentWordIndex(index));
                        }}
                        data-word-id={item.id}
                        className={`${
                          selected_list_type === "existing" &&
                          `cursor-pointer select-none hover:bg-gray-200 rounded-md ${
                            CurrentWordIndex === index && "bg-gray-200"
                          }`
                        } w-full flex py-1 px-2 mt-1.5`}
                      >
                        {selected_list_type === "missing" && (
                          <div className="flex items-center justify-center mr-3 font-USSemiBold bg-white">
                            <CheckBox
                              Checked={item.isSelected}
                              word={item}
                              onClick={onSelectWord}
                            />
                          </div>
                        )}

                        <div className="text-left font-USSemiBold text-sm sm:text-sm text-TextPrimary">
                          {item.word}
                        </div>
                      </div>
                    );
                  })}
                </InfiniteScroll>
              )}
            </div>
            {selected_list_type === "missing" && (
              <div className="flex items-center justify-end h-10">
                <input
                  value={WordInput}
                  className="border-b w-full font-USRegular text-sm pt-2 pb-1 pl-3 outline-none  focus:border-Primary"
                  type="text"
                  placeholder="Enter Word"
                  onChange={(e) => {
                    setWordInput(e.target.value);
                  }}
                />
                <div
                  onClick={() => {
                    handleAddWordsInMissingList();
                  }}
                  className="flex items-center ml-1.5 px-2 py-1 rounded-md cursor-pointer hover:bg-gray-100"
                >
                  <img src={IconsAI.Plus} className="h-5 w-4" alt="" />
                  <div className="text-sm sm:text-xs select-none ml-2 mr-2 font-USSemiBold text-TextPrimary">
                    Add
                  </div>
                </div>
              </div>
            )}
          </div>
          <div
            style={{
              width: "75%",
            }}
            className="bg-white rounded-r-md p-2 overflow-hidden"
          >
            <div className="h-16 border-b flex flex-col justify-between">
              <div className="text-xl flex items-center font-USBold text-TextPrimary pl-2">
                Lexicore
              </div>

              <div className="flex justify-between   items-center h-10">
                {Content?.length > 0 && (
                  <div className="flex items-cente">
                    <div
                      onClick={() => {
                        setIsEdit(!IsEdit);
                      }}
                      className="flex h-7 items-center px-2 py-1 select-none rounded-md cursor-pointer hover:bg-gray-100"
                    >
                      <img
                        src={IsEdit ? IconsAI.Check : IconsAI.Edit}
                        className="h-5 w-5"
                        alt=""
                      />
                      <div className="text-sm sm:text-xs ml-2 mr-2  font-USSemiBold text-TextPrimary">
                        {IsEdit ? "Done" : "Edit"}
                      </div>
                    </div>
                    {!IsEdit && (
                      <>
                        {selected_list_type === "existing" && (
                          <div
                            onClick={() => {
                              dispatch(ConfirmModal(true));
                            }}
                            className="flex h-7 items-center select-none px-2 py-1 rounded-md cursor-pointer hover:bg-gray-100"
                          >
                            <img
                              src={IconsAI.Trash}
                              className="h-5 w-5"
                              alt=""
                            />
                            <div className="text-sm sm:text-xs  ml-2 mr-2 font-USSemiBold text-TextPrimary">
                              Remove
                            </div>
                          </div>
                        )}
                        {selected_list_type === "existing" && (
                          <div
                            onClick={() => {
                              dispatch(openGeneraterModal(true));
                            }}
                            className="flex h-7 items-center px-2 py-1 rounded-md cursor-pointer hover:bg-gray-100"
                          >
                            <img
                              src={IconsAI.Generate}
                              className="h-5 w-5"
                              alt=""
                            />
                            <div className="text-sm sm:text-xs select-none ml-2 mr-2 font-USSemiBold text-TextPrimary">
                              Re-Generate
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

                {Content?.length > 1 && !IsEdit && (
                  <div className="flex items-center">
                    <div
                      onClick={() => {
                        handlePrevWord();
                      }}
                      className={`flex select-none items-center justify-center px-2 py-1 rounded-md  ${
                        CurrentWordIndex > 0
                          ? "opacity-100 hover:bg-gray-100 cursor-pointer"
                          : "opacity-50 cursor-not-allowed"
                      }`}
                    >
                      <img src={IconsAI.Prev} className="h-5 w-5" alt="" />
                      <div className="text-sm sm:text-xs mr-2 select-none font-USSemiBold text-TextPrimary">
                        Prev
                      </div>
                    </div>
                    <div
                      onClick={() => {
                        handleNextWord();
                      }}
                      className={`flex select-none items-center px-2 py-1 rounded-md  ${
                        CurrentWordIndex < Content?.length - 1
                          ? "opacity-100 hover:bg-gray-100 cursor-pointer"
                          : "opacity-50 cursor-not-allowed"
                      }`}
                    >
                      <div className="text-sm sm:text-xs ml-2 select-none justify-center font-USSemiBold text-TextPrimary">
                        Next
                      </div>
                      <img src={IconsAI.Next} className="h-5 w-5" alt="" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div
              id="scrollableDiv"
              style={{
                height: window.innerHeight - 180,
                overflow: "scroll",
                display: "flex",
                flexDirection: "column",
              }}
              // className="h-full"
            >
              {IsProcessing ? (
                <div className="h-full w-full flex items-center justify-center">
                  <ThreeDots
                    visible={true}
                    height="50"
                    width="50"
                    color="#1F2225"
                    radius="9"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                  />
                </div>
              ) : Content?.length > 0 ? (
                <div className="h-screen px-3">
                  <div className="py-2 flex  items-start">
                    <div className="">
                      <div className="font-USBold text-lg sm:text-sm text-TextPrimary">
                        Word
                      </div>
                      <TextareaAutosize
                        cols={25}
                        style={{
                          verticalAlign: "center",
                        }}
                        readOnly={!IsEdit}
                        value={Content[CurrentWordIndex]?.word}
                        onChange={(e) =>
                          dispatch(
                            updateContentWord(e.target.value, CurrentWordIndex)
                          )
                        }
                        className="rounded-lg p-4 ml-5 mt-1 text-TextPrimary sm:text-sm font-USMedium   bg-[#f2f2f2] outline-none border-none resize-none"
                      />
                    </div>
                    <div>
                      <div className="font-USBold ml-3 text-lg sm:text-sm text-TextPrimary">
                        Part Of Speech
                      </div>
                      <TextareaAutosize
                        cols={25}
                        style={{
                          verticalAlign: "center",
                        }}
                        readOnly={!IsEdit}
                        value={Content[CurrentWordIndex]?.partOfSpeech}
                        onChange={(e) =>
                          dispatch(
                            updateContentPOP(e.target.value, CurrentWordIndex)
                          )
                        }
                        className="rounded-lg p-4 ml-5 mt-1 text-TextPrimary sm:text-sm font-USMedium   bg-[#f2f2f2] outline-none border-none resize-none"
                      />
                    </div>
                  </div>
                  <div className="py-2 flex flex-col items-start">
                    <div className="font-USBold text-lg sm:text-sm text-TextPrimary">
                      Meaning
                    </div>
                    <TextareaAutosize
                      style={{
                        verticalAlign: "center",
                      }}
                      readOnly={!IsEdit}
                      onChange={(e) =>
                        dispatch(
                          updateContentMeaning(e.target.value, CurrentWordIndex)
                        )
                      }
                      value={Content[CurrentWordIndex]?.meaning}
                      className="rounded-lg ml-5 mt-1 p-4 w-4/5 sm:text-sm text-TextPrimary font-USMedium   bg-[#f2f2f2] outline-none border-none resize-none"
                    />
                  </div>
                  <div className="py-2 flex flex-nowrap  flex-col items-start">
                    <div className="font-USBold text-lg sm:text-sm text-TextPrimary">
                      Common Collocations
                    </div>
                    <div className="pl-5 pt-1 flex flex-col">
                      {Content[CurrentWordIndex]?.collocations?.map((cc, i) => {
                        return (
                          <TextareaAutosize
                            key={i}
                            cols={50}
                            style={{
                              verticalAlign: "center",
                            }}
                            readOnly={!IsEdit}
                            onChange={(e) =>
                              dispatch(
                                updateContentCC(
                                  e.target.value,
                                  CurrentWordIndex,
                                  i
                                )
                              )
                            }
                            value={cc}
                            className="rounded-lg w-fit p-4 my-1 sm:text-sm text-TextPrimary font-USMedium  bg-[#f2f2f2] outline-none border-none resize-none"
                          />
                        );
                      })}
                    </div>
                  </div>
                  <div className="py-2 flex flex-col items-start">
                    <div className="font-USBold  text-lg sm:text-sm text-TextPrimary">
                      Examples
                    </div>
                    <div className="pl-5 pt-1 flex flex-col">
                      <TextareaAutosize
                        cols={50}
                        readOnly={!IsEdit}
                        style={{
                          verticalAlign: "center",
                        }}
                        onChange={(e) =>
                          dispatch(
                            updateContentExamples(
                              e.target.value,
                              CurrentWordIndex,
                              "E"
                            )
                          )
                        }
                        value={Content[CurrentWordIndex]?.example}
                        className="rounded-lg w-fit p-4 my-1 sm:text-sm text-TextPrimary font-USMedium  bg-[#f2f2f2] outline-none border-none resize-none"
                      />
                      {Content[CurrentWordIndex]?.examples?.map((ex, i) => {
                        return (
                          <TextareaAutosize
                            key={i}
                            cols={50}
                            style={{
                              verticalAlign: "center",
                            }}
                            readOnly={!IsEdit}
                            onChange={(e) =>
                              dispatch(
                                updateContentExamples(
                                  e.target.value,
                                  CurrentWordIndex,
                                  i
                                )
                              )
                            }
                            value={ex}
                            className="rounded-lg w-fit p-4 my-1 sm:text-sm text-TextPrimary font-USMedium  bg-[#f2f2f2] outline-none border-none resize-none"
                          />
                        );
                      })}
                    </div>
                  </div>
                  <div className="py-2 flex flex-col items-start">
                    <div className="font-USBold  sm:text-sm text-lg text-TextPrimary">
                      Synonyms
                    </div>
                    <div className="pl-5 pt-1 flex flex-col">
                      {Content[CurrentWordIndex]?.synonyms?.map((syn, i) => {
                        return (
                          <TextareaAutosize
                            key={i}
                            readOnly={!IsEdit}
                            cols={50}
                            style={{
                              verticalAlign: "center",
                            }}
                            onChange={(e) =>
                              dispatch(
                                updateContentSynonyms(
                                  e.target.value,
                                  CurrentWordIndex,
                                  i
                                )
                              )
                            }
                            value={syn}
                            className="rounded-lg p-4 my-1 w-fit sm:text-sm text-TextPrimary font-USMedium  bg-[#f2f2f2] outline-none border-none resize-none"
                          />
                        );
                      })}
                    </div>
                  </div>
                  <div className="py-2 flex flex-col items-start">
                    <div className="font-USBold sm:text-sm text-lg  text-TextPrimary">
                      Synonym Examples
                    </div>
                    <div className="pl-5 pt-1 flex flex-col">
                      {Content[CurrentWordIndex]?.synonymExamples?.map(
                        (synex, i) => {
                          return (
                            <div
                              key={i}
                              className="flex mt-2 flex-col items-center  bg-[#f2f2f2]  rounded-lg overflow-hidden p-4"
                            >
                              <div className="bg-transparent flex items-center ">
                                <div className="sm:text-sm w-20 text-end pr-2 border-r text-TextPrimary font-USMedium">
                                  Synonym
                                </div>
                                <TextareaAutosize
                                  readOnly={!IsEdit}
                                  cols={50}
                                  onChange={(e) =>
                                    dispatch(
                                      updateContentSynonymsEx(
                                        e.target.value,
                                        CurrentWordIndex,
                                        i,
                                        "synonym"
                                      )
                                    )
                                  }
                                  style={{
                                    verticalAlign: "center",
                                  }}
                                  value={synex.synonym}
                                  className="pl-2 w-full  sm:text-sm text-TextPrimary bg-transparent font-USMedium  outline-none border-none resize-none"
                                />
                              </div>
                              <div className="bg-transparent pt-2 flex items-center ">
                                <div className="sm:text-sm w-20 text-end pr-2  border-r text-TextPrimary font-USMedium">
                                  Example
                                </div>
                                <TextareaAutosize
                                  cols={50}
                                  readOnly={!IsEdit}
                                  onChange={(e) =>
                                    dispatch(
                                      updateContentSynonymsEx(
                                        e.target.value,
                                        CurrentWordIndex,
                                        i,
                                        "example"
                                      )
                                    )
                                  }
                                  style={{
                                    verticalAlign: "center",
                                  }}
                                  value={synex.example}
                                  className="pl-2 w-full  sm:text-sm text-TextPrimary font-USMedium  bg-transparent outline-none border-none resize-none"
                                />
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                  <div className="py-2 flex flex-col items-start">
                    <div className="font-USBold sm:text-sm text-lg text-TextPrimary">
                      Ielts Writing Topics
                    </div>
                    {/* <div className="pl-5 pt-1 flex flex-col">
                      {Content[CurrentWordIndex].ieltsWritingTopics.map(
                        (iwt, i) => {
                          return (
                            <TextareaAutosize
                              readOnly={!IsEdit}
                              key={i}
                              cols={50}
                              style={{
                                verticalAlign: "center",
                              }}
                              onChange={(e) =>
                                dispatch(
                                  updateContentIWT(
                                    e.target.value,
                                    CurrentWordIndex,
                                    i
                                  )
                                )
                              }
                              value={iwt}
                              className="rounded-lg p-4 my-1 w-fit sm:text-sm text-TextPrimary font-USMedium  bg-[#f2f2f2] outline-none border-none resize-none"
                            />
                          );
                        }
                      )}
                    </div> */}
                    <div className="pl-5 pt-1 flex flex-col">
                      {Content[CurrentWordIndex]?.ieltsWritingTopics?.map(
                        (iwt, i) => {
                          return (
                            <div
                              key={i}
                              className="flex mt-2 flex-col items-center  bg-[#f2f2f2]  rounded-lg overflow-hidden p-4"
                            >
                              <div className="bg-transparent flex items-center ">
                                <div className="sm:text-sm w-24 text-end pr-2  border-r text-TextPrimary font-USMedium">
                                  Topic
                                </div>
                                <TextareaAutosize
                                  cols={50}
                                  readOnly={!IsEdit}
                                  onChange={(e) =>
                                    dispatch(
                                      updateContentIWT(
                                        e.target.value,
                                        CurrentWordIndex,
                                        i,
                                        "topic"
                                      )
                                    )
                                  }
                                  style={{
                                    verticalAlign: "center",
                                  }}
                                  value={iwt.topic}
                                  className="pl-2 w-full  sm:text-sm text-TextPrimary bg-transparent font-USMedium  outline-none border-none resize-none"
                                />
                              </div>
                              <div className="bg-transparent  flex items-center pt-2">
                                <div className="sm:text-sm w-24 text-end pr-2 border-r text-TextPrimary font-USMedium">
                                  Example
                                </div>
                                <TextareaAutosize
                                  cols={50}
                                  style={{
                                    verticalAlign: "center",
                                  }}
                                  readOnly={!IsEdit}
                                  onChange={(e) =>
                                    dispatch(
                                      updateContentIWT(
                                        e.target.value,
                                        CurrentWordIndex,
                                        i,
                                        "example"
                                      )
                                    )
                                  }
                                  value={iwt.example}
                                  className="pl-2 w-full  sm:text-sm text-TextPrimary font-USMedium  bg-transparent outline-none border-none resize-none"
                                />
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                  <div className="py-2 flex flex-col items-start">
                    <div className="font-USBold sm:text-sm text-lg text-TextPrimary">
                      Speaking Examples
                    </div>
                    {/* <div className="pl-5 pt-1 flex flex-col">
                      {Content[CurrentWordIndex].speakingExamples?.map(
                        (spex, i) => {
                          return (
                            <TextareaAutosize
                              key={i}
                              cols={50}
                              readOnly={!IsEdit}
                              onChange={(e) =>
                                dispatch(
                                  updateContentSpEx(
                                    e.target.value,
                                    CurrentWordIndex,
                                    i
                                  )
                                )
                              }
                              style={{
                                verticalAlign: "center",
                              }}
                              value={spex}
                              className="rounded-lg p-4 my-1 w-fit sm:text-sm text-TextPrimary font-USMedium  bg-[#f2f2f2] outline-none border-none resize-none"
                            />
                          );
                        }
                      )}
                    </div> */}
                    <div className="pl-5 pt-1 flex flex-col">
                      {Content[CurrentWordIndex]?.speakingExamples?.map(
                        (spex, i) => {
                          return (
                            <div
                              key={i}
                              className="flex mt-2 flex-col items-center  bg-[#f2f2f2]  rounded-lg overflow-hidden p-4"
                            >
                              <div className="bg-transparent flex items-center ">
                                <div className="sm:text-sm w-24 text-end pr-2  border-r text-TextPrimary font-USMedium">
                                  Question
                                </div>
                                <TextareaAutosize
                                  cols={50}
                                  readOnly={!IsEdit}
                                  onChange={(e) =>
                                    dispatch(
                                      updateContentSpEx(
                                        e.target.value,
                                        CurrentWordIndex,
                                        i,
                                        "question"
                                      )
                                    )
                                  }
                                  style={{
                                    verticalAlign: "center",
                                  }}
                                  value={spex.question}
                                  className="pl-2 w-full  sm:text-sm text-TextPrimary bg-transparent font-USMedium  outline-none border-none resize-none"
                                />
                              </div>
                              <div className="bg-transparent  flex items-center pt-2">
                                <div className="sm:text-sm w-24 text-end pr-2 border-r text-TextPrimary font-USMedium">
                                  Answer
                                </div>
                                <TextareaAutosize
                                  cols={50}
                                  style={{
                                    verticalAlign: "center",
                                  }}
                                  readOnly={!IsEdit}
                                  onChange={(e) =>
                                    dispatch(
                                      updateContentSpEx(
                                        e.target.value,
                                        CurrentWordIndex,
                                        i,
                                        "answer"
                                      )
                                    )
                                  }
                                  value={spex.answer}
                                  className="pl-2 w-full  sm:text-sm text-TextPrimary font-USMedium  bg-transparent outline-none border-none resize-none"
                                />
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                  <div className="py-2 flex flex-col items-start">
                    <div className="font-USBold sm:text-sm text-lg  text-TextPrimary">
                      Common Errors
                    </div>
                    <div className="pl-5 pt-1 flex flex-col">
                      {Content[CurrentWordIndex]?.commonErrors?.map(
                        (cEr, i) => {
                          return (
                            <div
                              key={i}
                              className="flex mt-2 flex-col items-center  bg-[#f2f2f2]  rounded-lg overflow-hidden p-4"
                            >
                              <div className="bg-transparent flex items-center ">
                                <div className="sm:text-sm w-24 text-end pr-2  border-r text-TextPrimary font-USMedium">
                                  Error
                                </div>
                                <TextareaAutosize
                                  cols={50}
                                  readOnly={!IsEdit}
                                  onChange={(e) =>
                                    dispatch(
                                      updateContentCommanErrors(
                                        e.target.value,
                                        CurrentWordIndex,
                                        i,
                                        "error"
                                      )
                                    )
                                  }
                                  style={{
                                    verticalAlign: "center",
                                  }}
                                  value={cEr.error}
                                  className="pl-2 w-full  sm:text-sm text-TextPrimary bg-transparent font-USMedium  outline-none border-none resize-none"
                                />
                              </div>
                              <div className="bg-transparent  flex items-center pt-2">
                                <div className="sm:text-sm w-24 text-end pr-2 border-r text-TextPrimary font-USMedium">
                                  Correction
                                </div>
                                <TextareaAutosize
                                  cols={50}
                                  style={{
                                    verticalAlign: "center",
                                  }}
                                  readOnly={!IsEdit}
                                  onChange={(e) =>
                                    dispatch(
                                      updateContentCommanErrors(
                                        e.target.value,
                                        CurrentWordIndex,
                                        i,
                                        "correction"
                                      )
                                    )
                                  }
                                  value={cEr.correction}
                                  className="pl-2 w-full  sm:text-sm text-TextPrimary font-USMedium  bg-transparent outline-none border-none resize-none"
                                />
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                  <div className="py-2 flex flex-col items-start">
                    <div className="font-USBold sm:text-sm text-lg text-TextPrimary">
                      Usage Tips
                    </div>
                    <div className="pl-5 pt-1 flex flex-col">
                      {Content[CurrentWordIndex]?.usageTips?.map((usgtp, i) => {
                        return (
                          <TextareaAutosize
                            key={i}
                            cols={50}
                            onChange={(e) =>
                              dispatch(
                                updateContentUsageTips(
                                  e.target.value,
                                  CurrentWordIndex,
                                  i
                                )
                              )
                            }
                            readOnly={!IsEdit}
                            style={{
                              verticalAlign: "center",
                            }}
                            value={usgtp}
                            className="rounded-lg p-4 my-1 w-fit sm:text-sm text-TextPrimary font-USMedium  bg-[#f2f2f2] outline-none border-none resize-none"
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full w-full flex items-center justify-center flex-col font-USBold">
                  <div>No Records Found</div>
                </div>
              )}
            </div>
            <div className="w-full flex items-center justify-end pr-5">
              {Content.length > 0 && !IsEdit && (
                <div
                  onClick={() => {
                    if (selected_list_type === "missing") {
                      dispatch(
                        AddWordContent(
                          selected_collection,
                          Content[CurrentWordIndex],
                          Content
                        )
                      );
                    } else {
                      dispatch(
                        updateExistingWords(
                          selected_collection,
                          Content[CurrentWordIndex]
                        )
                      );
                    }
                  }}
                  className="flex items-center px-2 select-none py-1 rounded-md cursor-pointer hover:bg-gray-100"
                >
                  <img src={IconsAI.Save} className="h-5 w-5" alt="" />
                  <div className="text-sm sm:text-xs  ml-2 mr-2 font-USSemiBold text-TextPrimary">
                    Save
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal visible={openConfirmModal}>
        <div className="pt-5 pb-1 px-5 font-USMedium text-TextPrimary text-base">
          Are you sure you want to Remove words :
        </div>
        <div className="p-2 flex items-center justify-center flex-wrap">
          {selected_list_type === "missing" ? (
            api_payload.map((word, idx) => {
              return (
                <div
                  key={idx}
                  className="m-1 text-sm font-USMedium py-1 shadow-sm rounded-md bg-gray-200 px-5"
                >
                  {word}
                </div>
              );
            })
          ) : (
            <div className="m-1 text-sm font-USMedium py-1 shadow-sm rounded-md bg-gray-200 px-5">
              {Content[CurrentWordIndex]?.word}
            </div>
          )}
        </div>
        <div className="p-3 border-t font-USMedium text-TextPrimary text-base flex items-center justify-center">
          <div
            onClick={() => {
              dispatch(ConfirmModal(false));
            }}
            className="bg-Primary select-none cursor-pointer text-white font-USSemiBold text-sm px-7 py-1 rounded-md"
          >
            No
          </div>
          <div
            onClick={() => {
              if (selected_list_type === "missing") {
                dispatch(removeWordFromMissingList(api_payload));
              } else {
                dispatch(
                  RemoveExistingWords(
                    selected_collection,
                    Content[CurrentWordIndex].word,
                    selected_wordset
                  )
                );
              }
            }}
            className="bg-Primary ml-3 select-none cursor-pointer text-white font-USSemiBold text-sm px-7 py-1 rounded-md"
          >
            Yes
          </div>
        </div>
      </Modal>
      <Modal visible={GeneratorModal}>
        <div className="font-USBold text-sm w-full text-center pb-2 pt-4">
          Choose Generator
        </div>
        <div className="py-2">
          <div className="flex items-center justify-center">
            <div
              onClick={() => {
                dispatch(setGenerater("chatgpt"));
              }}
              className={`${
                Generator === "chatgpt"
                  ? "border-b-2 border-b-green-500 "
                  : "hover:bg-gray-100"
              } flex h-7 border mr-1 items-center px-2 py-1 rounded-md cursor-pointer hover:bg-gray-100`}
            >
              <img src={IconsAI.Action} className="h-5 w-5" alt="" />
              <div className="text-sm sm:text-xs ml-2 mr-2 h-4 select-none font-USSemiBold text-TextPrimary">
                Chat-GPT
              </div>
            </div>
            <div
              onClick={() => {
                dispatch(setGenerater("claude"));
              }}
              className={`${
                Generator === "claude"
                  ? "border-b-2 border-b-green-500 "
                  : "hover:bg-gray-100"
              } flex h-7 ml-1 border items-center px-2 py-1 rounded-md cursor-pointer `}
            >
              <img src={IconsAI.Action} className="h-5 w-5" alt="" />
              <div className="text-sm sm:text-xs ml-2 mr-2 h-4 select-none font-USSemiBold text-TextPrimary">
                Claude
              </div>
            </div>
          </div>
        </div>
        <div className="flex p-2 items-center justify-end border-t">
          <div
            onClick={() => {
              dispatch(openGeneraterModal(false));
            }}
            className="flex border mr-1 h-7 items-center px-2 py-1 rounded-md cursor-pointer hover:bg-gray-100"
          >
            <div className="text-sm sm:text-xs ml-2 mr-2 h-4 select-none font-USSemiBold text-TextPrimary">
              Cancel
            </div>
          </div>
          <div
            onClick={() => {
              if (selected_list_type === "missing") {
                dispatch(
                  GenerateConntentFromWords(
                    selected_collection,
                    api_payload,
                    Generator
                  )
                );
              } else {
                dispatch(
                  regenerate(Content[CurrentWordIndex], Generator, Content)
                );
              }
            }}
            className="flex border bg-Primary ml-1 h-7 items-center px-2 py-1 rounded-md cursor-pointer"
          >
            <div className="text-sm sm:text-xs ml-2 mr-2 h-4 select-none font-USSemiBold text-white">
              Generate
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default WordsList;
