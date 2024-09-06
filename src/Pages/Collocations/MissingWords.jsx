import { Button } from "antd";
import React, { useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { ThreeDots } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import TextareaAutosize from "react-textarea-autosize";
import { toast } from "react-toastify";
import { IconsAI } from "../../assets/Icons";
import CheckBox from "../../component/AICheckBox/CheckBox";
import Modal from "../../component/AIModal/Modal";
import FlatList from "flatlist-react";
import {
  addWordsInMissingList,
  ConfirmModal,
  GenerateConntentFromWords,
  getCollocationMissingWordsList,
  openGeneraterModal,
  removeWordFromMissingList,
  setCurrentWordIndex,
  setGenerater,
  setSelectedMissingWords,
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
} from "../../Redux/Reducers/CollocationReducer";
import Header from "../../component/AIHeader/Header";

function MissingWords() {
  const dispatch = useDispatch();
  const missing_list = useSelector(
    (state) => state.Collocations.missing_collocations
  );
  const api_payload = useSelector((state) => state.Collocations.api_payload);
  const ModalContentRef = useRef(null);
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
  const [IsEdit, setIsEdit] = useState(false);
  const [WordInput, setWordInput] = useState("");
  // it will halde word selection with check box in word tabel
  const onSelectWord = (word) => {
    dispatch(setSelectedMissingWords(word, missing_list));
  };

  // it will call the api with next page number for word list
  const onEndReach = () => {
    dispatch(getCollocationMissingWordsList(pageNumber + 1, missing_list));
  };

  //it will save all words and move it in to missing list
  const handleAddWordsInMissingList = () => {
    dispatch(addWordsInMissingList([WordInput]));
    setWordInput("");
  };

  // it will hanlde next word content navigation
  const handleNextWord = () => {
    if (CurrentWordIndex < Content.length - 1) {
      dispatch(setCurrentWordIndex(CurrentWordIndex + 1));
    } else {
      dispatch(setCurrentWordIndex(CurrentWordIndex));
    }
  };

  // it will handle prev word content navigation
  const handlePrevWord = () => {
    if (CurrentWordIndex > 0) {
      dispatch(setCurrentWordIndex(CurrentWordIndex - 1));
    } else {
      dispatch(setCurrentWordIndex(CurrentWordIndex));
    }
  };

  return (
    <div className="h-screen w-full">
      <Header title={location.pathname} />
      <div className="p-4 flex">
        <div
          style={{
            width: "30%",
          }}
          className="bg-white rounded-lg shadow-md p-2 "
        >
          <div className="text-xl font-USBold text-TextPrimary pl-2">
            Words List
          </div>
          <div className="flex items-center justify-end">
            <input
              value={WordInput}
              className="border-b w-1/2 font-USRegular text-sm pt-2 pb-1 pl-3 outline-none  focus:border-Primary"
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
          <div className="flex h-10 border-t mt-2 items-center justify-end">
            <div
              onClick={() => {
                if (api_payload.length > 0) {
                  dispatch(openGeneraterModal(true));
                }
              }}
              className="flex h-7 items-center px-2 py-1 rounded-md cursor-pointer hover:bg-gray-100"
            >
              <img src={IconsAI.Generate} className="h-5 w-5" alt="" />
              <div className="text-sm sm:text-xs select-none ml-2 mr-2 font-USSemiBold text-TextPrimary">
                Generate
              </div>
            </div>
            <div className="flex h-7 items-center px-2  rounded-md cursor-pointer hover:bg-gray-100">
              <img src={IconsAI.Edit} className="h-5 w-5" alt="" />
              <div className="text-sm sm:text-xs select-none ml-2 mr-2 font-USSemiBold text-TextPrimary">
                Edit
              </div>
            </div>
            <div
              onClick={() => {
                if (api_payload.length > 0) {
                  dispatch(ConfirmModal(true));
                }
              }}
              className="flex h-7 items-center px-2 py-1 rounded-md cursor-pointer hover:bg-gray-100"
            >
              <img src={IconsAI.Trash} className="h-5 w-5" alt="" />
              <div className="text-sm sm:text-xs select-none ml-2 mr-2 font-USSemiBold text-TextPrimary">
                Remove
              </div>
            </div>
          </div>
          <div
            style={{
              marginTop: 10,
            }}
            id="scrollableDiv"
            className="bg-white w-full  overflow-scroll"
          >
            {/*Put the scroll bar always on the bottom*/}
            <InfiniteScroll
              loader={
                <div className="flex justify-center items-center ">
                  {Loading && (
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
              dataLength={missing_list.length}
              next={() => {
                onEndReach();
              }}
              style={{
                display: "flex",
                flexDirection: "column",
                height: window.innerHeight - 210,
              }} //To put endMessage and loader to the top.
              inverse={false} //
              hasMore={true}
              scrollableTarget="scrollableDiv"
            >
              {missing_list.map((item, index) => {
                return (
                  <div key={index} className="w-full flex items-center p-2">
                    <div className="flex justify-center mr-3 font-USSemiBold bg-white">
                      <CheckBox
                        Checked={item.isSelected}
                        word={item}
                        onClick={onSelectWord}
                      />
                    </div>
                    <div className="text-center ml-5 font-USSemiBold text-sm sm:text-sm text-TextPrimary">
                      {item.word}
                    </div>
                  </div>
                );
              })}
            </InfiniteScroll>
          </div>
        </div>
        <div
          style={{
            width: "70%",
          }}
          className="bg-white rounded-lg ml-4 shadow-md p-2 overflow-hidden"
        >
          <div className="text-xl flex items-center font-USBold text-TextPrimary pl-2">
            Lexicore
          </div>

          <div className="flex justify-between border-b  items-center h-10">
            {Content.length > 0 && (
              <div className="flex items-center">
                <div
                  onClick={() => {
                    setIsEdit(!IsEdit);
                  }}
                  className="flex h-7 items-center px-2 py-1 rounded-md cursor-pointer hover:bg-gray-100"
                >
                  <img
                    src={IsEdit ? IconsAI.Check : IconsAI.Edit}
                    className="h-5 w-5"
                    alt=""
                  />
                  <div className="text-sm sm:text-xs ml-2 mr-2 select-none font-USSemiBold text-TextPrimary">
                    {IsEdit ? "Done" : "Edit"}
                  </div>
                </div>
                {!IsEdit && (
                  <div className="flex items-center px-2 py-1 rounded-md cursor-pointer hover:bg-gray-100">
                    <img src={IconsAI.Save} className="h-5 w-5" alt="" />
                    <div className="text-sm sm:text-xs select-none ml-2 mr-2 font-USSemiBold text-TextPrimary">
                      Save
                    </div>
                  </div>
                )}
              </div>
            )}

            {Content.length > 1 && (
              <div className="flex items-center">
                <div
                  onClick={() => {
                    handlePrevWord();
                  }}
                  className="flex  items-center justify-center px-2 py-1 rounded-md cursor-pointer hover:bg-gray-100"
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
                  className="flex  items-center px-2 py-1 rounded-md cursor-pointer hover:bg-gray-100"
                >
                  <div className="text-sm sm:text-xs ml-2 select-none justify-center font-USSemiBold text-TextPrimary">
                    Next
                  </div>
                  <img src={IconsAI.Next} className="h-5 w-5" alt="" />
                </div>
              </div>
            )}
          </div>

          <div
            id="scrollableDiv"
            style={{
              height: window.innerHeight - 160,
              overflow: "scroll",
              display: "flex",
              flexDirection: "column",
            }}
            // className="h-full"
          >
            {Content.length > 0 ? (
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
                      value={Content[CurrentWordIndex].word}
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
                      value={Content[CurrentWordIndex].partOfSpeech}
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
                    value={Content[CurrentWordIndex].meaning}
                    className="rounded-lg ml-5 mt-1 p-4 w-4/5 sm:text-sm text-TextPrimary font-USMedium   bg-[#f2f2f2] outline-none border-none resize-none"
                  />
                </div>
                <div className="py-2 flex flex-nowrap  flex-col items-start">
                  <div className="font-USBold text-lg sm:text-sm text-TextPrimary">
                    Common Collocations
                  </div>
                  <div className="pl-5 pt-1 flex flex-col">
                    {Content[CurrentWordIndex].commonCollocations.map(
                      (cc, i) => {
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
                      }
                    )}
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
                      value={Content[CurrentWordIndex].example}
                      className="rounded-lg w-fit p-4 my-1 sm:text-sm text-TextPrimary font-USMedium  bg-[#f2f2f2] outline-none border-none resize-none"
                    />
                    {Content[CurrentWordIndex].examples.map((ex, i) => {
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
                    {Content[CurrentWordIndex].synonyms.map((syn, i) => {
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
                    {Content[CurrentWordIndex].synonymExamples.map(
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
                  <div className="pl-5 pt-1 flex flex-col">
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
                  </div>
                </div>
                <div className="py-2 flex flex-col items-start">
                  <div className="font-USBold sm:text-sm text-lg text-TextPrimary">
                    Speaking Examples
                  </div>
                  <div className="pl-5 pt-1 flex flex-col">
                    {Content[CurrentWordIndex].speakingExamples.map(
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
                  </div>
                </div>
                <div className="py-2 flex flex-col items-start">
                  <div className="font-USBold sm:text-sm text-lg  text-TextPrimary">
                    Common Errors
                  </div>
                  <div className="pl-5 pt-1 flex flex-col">
                    {Content[CurrentWordIndex].commonErrors.map((cEr, i) => {
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
                    })}
                  </div>
                </div>
                <div className="py-2 flex flex-col items-start">
                  <div className="font-USBold sm:text-sm text-lg text-TextPrimary">
                    Usage Tips
                  </div>
                  <div className="pl-5 pt-1 flex flex-col">
                    {Content[CurrentWordIndex].usageTips.map((usgtp, i) => {
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
            ) : IsProcessing ? (
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
            ) : (
              <div className="h-full w-full flex items-center justify-center flex-col font-USBold">
                <div>No Data Found</div>
                <div>Please Generate Some Content</div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Modal visible={openConfirmModal}>
        <div className="pt-5 pb-1 px-5 font-USMedium text-TextPrimary text-base">
          Are you sure you want to Remove words :
        </div>
        <div className="p-2 flex items-center justify-center flex-wrap">
          {api_payload.map((word) => {
            return (
              <div className="m-1 text-sm font-USMedium py-1 shadow-sm rounded-md bg-gray-200 px-5">
                {word}
              </div>
            );
          })}
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
              dispatch(removeWordFromMissingList(api_payload));
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
              dispatch(GenerateConntentFromWords(api_payload, Generator));
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

export default MissingWords;
