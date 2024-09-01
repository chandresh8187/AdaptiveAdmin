import { Grid } from "@mui/material";
import { Button } from "antd";
import React, { useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { ThreeDots } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { IconsAI } from "../../assets/Icons";
import CheckBox from "../../component/AICheckBox/CheckBox";
import GenerateModal from "../../component/AIModal/GenerateModal";
import Modal from "../../component/AIModal/Modal";
import {
  addWordsInMissingList,
  ConfirmModal,
  getCollocationMissingWordsList,
  removeWordFromMissingList,
  setSelectedMissingWords,
} from "../../Redux/Reducers/CollocationReducer";
import TextareaAutosize from "react-textarea-autosize";

function MissingWords() {
  const dispatch = useDispatch();
  const missing_list = useSelector(
    (state) => state.Collocations.missing_collocations
  );
  const api_payload = useSelector((state) => state.Collocations.api_payload);
  const ModalContentRef = useRef(null);
  const pageNumber = useSelector((state) => state.Collocations.MC_pageNumber);
  const Loading = useSelector((state) => state.Collocations.Loading);
  const navigate = useNavigate();
  const openConfirmModal = useSelector(
    (state) => state.Collocations.openConfirmModal
  );
  const [WordInput, setWordInput] = useState([{ word: "" }]);
  // it will halde word selection with check box in word tabel
  const onSelectWord = (word) => {
    dispatch(setSelectedMissingWords(word, missing_list));
  };

  // it will call the api with next page number for word list
  const onEndReach = () => {
    dispatch(getCollocationMissingWordsList(pageNumber + 1, missing_list));
  };

  // it will handle add words input incriment (ex:add another input below prev input) in input list
  const handleAddInput = () => {
    setWordInput([...WordInput, { word: "" }]);
    setTimeout(() => {
      ModalContentRef.current.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // it will handle add words input removel from its index from inputs list
  const handleRemoveInput = (index) => {
    if (index >= 1) {
      let updatedInputList = WordInput.filter((itm, idx) => idx !== index);
      setWordInput(updatedInputList);
    } else {
      toast.error("You Can't remove all inputs");
    }
  };

  //it will save all words and move it in to missing list
  const handleAddWordsInMissingList = () => {
    dispatch(addWordsInMissingList(WordInput));
    setWordInput([{ word: "" }]);
  };

  // it will handle add words inputs value from its index and set value to state
  const handleInputChange = (e, i) => {
    const inputValue = e.target.value;
    let onChangeVal = [...WordInput];
    onChangeVal[i]["word"] = inputValue;
    setWordInput(onChangeVal);
  };

  return (
    <div className="bg-container  h-screen w-full pb-16">
      <div className="w-full flex p-3">
        <div className="w-2/4 bg-white h-screen p-5 rounded-md shadow-md">
          <div className="text-xl font-USBold text-TextPrimary">Words List</div>
          <div className="flex border-b  items-center h-12">
            {api_payload.length > 0 && (
              <>
                <div className="flex h-7 items-center px-2 py-1 rounded-md cursor-pointer hover:bg-gray-100">
                  <img src={IconsAI.Generate} className="h-5 w-5" alt="" />
                  <div className="text-sm sm:text-xs select-none ml-2 mr-2 font-USSemiBold text-TextPrimary">
                    Generate
                  </div>
                </div>
                <div className="flex h-7 items-center px-2 py-1 rounded-md cursor-pointer hover:bg-gray-100">
                  <img src={IconsAI.Edit} className="h-5 w-5" alt="" />
                  <div className="text-sm sm:text-xs select-none ml-2 mr-2 font-USSemiBold text-TextPrimary">
                    Edit
                  </div>
                </div>
                <div
                  onClick={() => {
                    dispatch(ConfirmModal(true));
                  }}
                  className="flex h-7 items-center px-2 py-1 rounded-md cursor-pointer hover:bg-gray-100"
                >
                  <img src={IconsAI.Trash} className="h-5 w-5" alt="" />
                  <div className="text-sm sm:text-xs select-none ml-2 mr-2 font-USSemiBold text-TextPrimary">
                    Remove
                  </div>
                </div>
              </>
            )}
          </div>

          <div
            id="scrollableDiv"
            style={{
              marginTop: 10,
            }}
            className="flex flex-col overflow-auto h-4/5"
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
              style={{ display: "flex", flexDirection: "column" }} //To put endMessage and loader to the top.
              inverse={false} //
              hasMore={true}
              scrollableTarget="scrollableDiv"
              className="pb-10"
            >
              {missing_list.map((item, index) => {
                return (
                  <div
                    key={index}
                    className={`px-3 ${
                      index !== 0 ? "py-3" : "pb-3 pt-2"
                    } w-full flex items-center border-b`}
                  >
                    <div className="flex justify-center mr-3 font-USSemiBold bg-">
                      <CheckBox
                        Checked={item.isSelected}
                        word={item}
                        onClick={onSelectWord}
                      />
                    </div>
                    <div className="text-center ml-5 font-USSemiBold text-sm sm:text-xs text-TextPrimary">
                      {item.word}
                    </div>
                  </div>
                );
              })}
            </InfiniteScroll>
          </div>
        </div>
        <div className="bg-white w-full h-screen  mx-2 p-5 rounded-md shadow-md">
          <div className="flex items-center">
            <div className="text-xl flex items-center font-USBold text-TextPrimary">
              Lexicore
            </div>
            <div className="font-USMedium text-sm pl-1">
              (Essential vocabulary tool)
            </div>
          </div>
          <div className="flex flex-wrap border-b  items-center h-12">
            <div className="flex h-7 items-center px-2 py-1 rounded-md cursor-pointer hover:bg-gray-100">
              <img src={IconsAI.Edit} className="h-5 w-5" alt="" />
              <div className="text-sm sm:text-xs ml-2 mr-2 select-none font-USSemiBold text-TextPrimary">
                Edit
              </div>
            </div>
            <div className="flex items-center px-2 py-1 rounded-md cursor-pointer hover:bg-gray-100">
              <img src={IconsAI.Save} className="h-5 w-5" alt="" />
              <div className="text-sm sm:text-xs select-none ml-2 mr-2 font-USSemiBold text-TextPrimary">
                Save
              </div>
            </div>
          </div>
          <div
            id="scrollableDiv"
            style={{
              // height: window.innerHeight * 0.7,
              overflow: "scroll",
              display: "flex",
              flexDirection: "column",
              marginTop: 5,
            }}
            className="h-4/5"
          >
            <InfiniteScroll
              dataLength={WordInput.length}
              scrollableTarget="scrollableDiv"
              className="pt-1 pb-3"
            >
              <div className="py-2 flex flex-col items-start">
                <div className="font-USBold text-lg sm:text-xs text-TextPrimary">
                  Word
                </div>
                <TextareaAutosize
                  cols={50}
                  style={{
                    verticalAlign: "center",
                  }}
                  value={"educational reform ( Noun phrase )"}
                  className="rounded-lg p-2 ml-5 mt-1 text-TextPrimary sm:text-xs font-USMedium   bg-[#f2f2f2] outline-none border-none resize-none"
                />
              </div>
              <div className="py-2 flex flex-col items-start">
                <div className="font-USBold text-lg sm:text-xs text-TextPrimary">
                  Meaning
                </div>
                <TextareaAutosize
                  cols={50}
                  style={{
                    verticalAlign: "center",
                  }}
                  value={
                    "Changes made to an education system with the aim of improving it. Educational reform typically involves updating teaching methods, curriculum, administration, funding or governance."
                  }
                  className="rounded-lg ml-5 mt-1 p-2 w-fit sm:text-xs text-TextPrimary font-USMedium   bg-[#f2f2f2] outline-none border-none resize-none"
                />
              </div>
              <div className="py-2 flex flex-col items-start">
                <div className="font-USBold text-lg sm:text-xs text-TextPrimary">
                  Common Collocations
                </div>
                <div className="pl-5 pt-1">
                  <TextareaAutosize
                    cols={50}
                    style={{
                      verticalAlign: "center",
                    }}
                    value={"Implement educational reforms"}
                    className="rounded-lg w-fit p-2 my-1 sm:text-xs text-TextPrimary font-USMedium  bg-[#f2f2f2] outline-none border-none resize-none"
                  />
                  <TextareaAutosize
                    cols={50}
                    style={{
                      verticalAlign: "center",
                    }}
                    value={"Debate educational reforms"}
                    className="rounded-lg w-fit p-2 my-1 sm:text-xs text-TextPrimary font-USMedium  bg-[#f2f2f2] outline-none border-none resize-none"
                  />
                  <TextareaAutosize
                    cols={50}
                    style={{
                      verticalAlign: "center",
                    }}
                    value={"Debate educational reforms"}
                    className=" rounded-lg p-2 w-fit my-1 sm:text-xs text-TextPrimary font-USMedium  bg-[#f2f2f2] outline-none border-none resize-none"
                  />
                </div>
              </div>
              <div className="py-2 flex flex-col items-start">
                <div className="font-USBold  text-lg sm:text-xs text-TextPrimary">
                  Examples
                </div>
                <div className="pl-5 pt-1">
                  <TextareaAutosize
                    cols={50}
                    style={{
                      verticalAlign: "center",
                    }}
                    value={
                      "Many countries are debating educational reform to better prepare students for the future."
                    }
                    className="rounded-lg p-2 w-fit my-1 sm:text-xs text-TextPrimary font-USMedium  bg-[#f2f2f2] outline-none border-none resize-none"
                  />
                  <TextareaAutosize
                    cols={50}
                    style={{
                      verticalAlign: "center",
                    }}
                    value={
                      "The new government has proposed sweeping educational reforms to address inequality in the school system."
                    }
                    className="rounded-lg w-fit p-2 my-1 sm:text-xs text-TextPrimary font-USMedium  bg-[#f2f2f2] outline-none border-none resize-none"
                  />
                  <TextareaAutosize
                    cols={50}
                    style={{
                      verticalAlign: "center",
                    }}
                    value={
                      "Critics argue that the proposed reforms do not go far enough to improve standards."
                    }
                    className="rounded-lg w-fit p-2 my-1 sm:text-xs text-TextPrimary font-USMedium  bg-[#f2f2f2] outline-none border-none resize-none"
                  />
                  <TextareaAutosize
                    cols={50}
                    style={{
                      verticalAlign: "center",
                    }}
                    value={
                      "Teachers' unions have opposed some of the reforms, saying they will increase workload without sufficient support."
                    }
                    className="rounded-lg w-fit p-2 my-1 sm:text-xs text-TextPrimary font-USMedium  bg-[#f2f2f2] outline-none border-none resize-none"
                  />
                </div>
              </div>
              <div className="py-2 flex flex-col items-start">
                <div className="font-USBold  sm:text-xs text-lg text-TextPrimary">
                  Synonyms
                </div>
                <div className="pl-5 pt-1">
                  <TextareaAutosize
                    cols={50}
                    style={{
                      verticalAlign: "center",
                    }}
                    value={"Education overhaul"}
                    className="rounded-lg p-2 my-1 w-fit sm:text-xs text-TextPrimary font-USMedium  bg-[#f2f2f2] outline-none border-none resize-none"
                  />
                  <TextareaAutosize
                    cols={50}
                    style={{
                      verticalAlign: "center",
                    }}
                    value={"Education revamp"}
                    className="rounded-lg p-2 my-1 w-fit sm:text-xs text-TextPrimary font-USMedium  bg-[#f2f2f2] outline-none border-none resize-none"
                  />
                  <TextareaAutosize
                    cols={50}
                    style={{
                      verticalAlign: "center",
                    }}
                    value={"School system changes"}
                    className="rounded-lg p-2 my-1 w-fit sm:text-xs text-TextPrimary font-USMedium   bg-[#f2f2f2] outline-none border-none resize-none"
                  />
                </div>
              </div>
              <div className="py-2 flex flex-col items-start">
                <div className="font-USBold sm:text-xs text-lg text-TextPrimary">
                  Synonyms Examples
                </div>
                <div className="pl-5 pt-1">
                  <TextareaAutosize
                    cols={50}
                    style={{
                      verticalAlign: "center",
                    }}
                    value={
                      "The education minister announced plans for an education overhaul to make the system more relevant for the 21st century."
                    }
                    className="rounded-lg p-2 my-1 w-fit sm:text-xs text-TextPrimary font-USMedium  bg-[#f2f2f2] outline-none border-none resize-none"
                  />
                  <TextareaAutosize
                    cols={50}
                    style={{
                      verticalAlign: "center",
                    }}
                    value={
                      "After a decade of underfunding, the education department is in desperate need of a revamp to address declining results."
                    }
                    className="rounded-lg p-2 my-1 w-fit sm:text-xs text-TextPrimary font-USMedium  bg-[#f2f2f2] outline-none border-none resize-none"
                  />
                </div>
              </div>
              <div className="py-2 flex flex-col items-start">
                <div className="font-USBold sm:text-xs text-lg text-TextPrimary">
                  Ielts Writing Topics
                </div>
                <div className="pl-5 pt-1">
                  <TextareaAutosize
                    cols={50}
                    style={{
                      verticalAlign: "center",
                    }}
                    value={"Education systems - problems and solutions"}
                    className="rounded-lg p-2 my-1 w-fit sm:text-xs text-TextPrimary font-USMedium  bg-[#f2f2f2] outline-none border-none resize-none"
                  />
                  <TextareaAutosize
                    cols={50}
                    style={{
                      verticalAlign: "center",
                    }}
                    value={"Improving education standards"}
                    className="rounded-lg p-2 my-1 w-fit sm:text-xs text-TextPrimary font-USMedium  bg-[#f2f2f2] outline-none border-none resize-none"
                  />
                </div>
              </div>
              <div className="py-2 flex flex-col items-start">
                <div className="font-USBold sm:text-xs text-lg text-TextPrimary">
                  Speaking Examples
                </div>
                <div className="pl-5 pt-1">
                  <TextareaAutosize
                    cols={50}
                    style={{
                      verticalAlign: "center",
                    }}
                    value={
                      "Discuss the need for educational reform in your country and possible changes that could be made."
                    }
                    className="rounded-lg p-2 my-1 w-fit sm:text-xs text-TextPrimary font-USMedium  bg-[#f2f2f2] outline-none border-none resize-none"
                  />
                  <TextareaAutosize
                    cols={50}
                    style={{
                      verticalAlign: "center",
                    }}
                    value={
                      "Explain the arguments for and against recent educational reforms in your area."
                    }
                    className="rounded-lg p-2 my-1 w-fit sm:text-xs text-TextPrimary font-USMedium  bg-[#f2f2f2] outline-none border-none resize-none"
                  />
                </div>
              </div>
              <div className="py-2 flex flex-col items-start">
                <div className="font-USBold sm:text-xs text-lg  text-TextPrimary">
                  Common Errors
                </div>
                <div className="pl-5 pt-1">
                  <div className="flex items-center bg-[#f2f2f2] rounded-lg overflow-hidden px-2">
                    <div className="sm:text-xs w-11 border-r text-TextPrimary font-USMedium">
                      Error :
                    </div>
                    <TextareaAutosize
                      cols={50}
                      style={{
                        verticalAlign: "center",
                      }}
                      value={"Mixing up 'reform' and 'reforms'"}
                      className=" p-2 w-full  sm:text-xs text-TextPrimary font-USMedium  bg-[#f2f2f2] outline-none border-none resize-none"
                    />
                  </div>
                  <div className="flex items-center mt-3 bg-[#f2f2f2] rounded-lg overflow-hidden px-2">
                    <div className="sm:text-xs w-20 border-r text-TextPrimary font-USMedium">
                      Correction :
                    </div>
                    <TextareaAutosize
                      cols={50}
                      style={{
                        verticalAlign: "center",
                      }}
                      value={
                        "Remember that 'reform' is usually used as a mass noun (like 'progress'), while 'reforms' refers to specific changes or proposed changes."
                      }
                      className=" p-2 w-full  sm:text-xs text-TextPrimary font-USMedium  bg-[#f2f2f2] outline-none border-none resize-none"
                    />
                  </div>
                </div>
              </div>
              <div className="py-2 flex flex-col items-start">
                <div className="font-USBold sm:text-xs text-lg text-TextPrimary">
                  Usage Tips
                </div>
                <div className="pl-5 pt-1">
                  <TextareaAutosize
                    cols={50}
                    style={{
                      verticalAlign: "center",
                    }}
                    value={
                      "Consider different stakeholders' perspectives when discussing educational reform"
                    }
                    className="rounded-lg p-2 my-1 w-fit sm:text-xs text-TextPrimary font-USMedium  bg-[#f2f2f2] outline-none border-none resize-none"
                  />
                  <TextareaAutosize
                    cols={50}
                    style={{
                      verticalAlign: "center",
                    }}
                    value={
                      "Provide clear examples to illustrate any proposed reforms"
                    }
                    className="rounded-lg p-2 my-1 w-fit sm:text-xs text-TextPrimary font-USMedium  bg-[#f2f2f2] outline-none border-none resize-none"
                  />
                </div>
              </div>
            </InfiniteScroll>
          </div>
        </div>
        <div className="w-2/4  bg-white p-5 h-screen rounded-md shadow-md">
          <div className="text-xl font-USBold text-TextPrimary">
            Add New Words
          </div>
          <div className="flex flex-wrap border-b  items-center h-12">
            <div
              onClick={() => {
                handleAddInput();
              }}
              className="flex h-7 items-center px-2 py-1 rounded-md cursor-pointer hover:bg-gray-100"
            >
              <img src={IconsAI.Plus} className="h-4 w-4" alt="" />
              <div className="text-sm sm:text-xs ml-2 mr-2 h-4 select-none font-USSemiBold text-TextPrimary">
                Add Field
              </div>
            </div>
            <div
              onClick={() => {
                handleAddWordsInMissingList();
              }}
              className="flex items-center px-2 py-1 rounded-md cursor-pointer hover:bg-gray-100"
            >
              <img src={IconsAI.Save} className="h-5 w-5" alt="" />
              <div className="text-sm sm:text-xs select-none ml-2 mr-2 font-USSemiBold text-TextPrimary">
                Save Words
              </div>
            </div>
          </div>
          <div
            id="scrollableDiv"
            style={{
              overflow: "auto",
              display: "flex",
              flexDirection: "column",
              paddingTop: 5,
            }}
            className="h-4/5"
          >
            <InfiniteScroll
              dataLength={WordInput.length}
              scrollableTarget="scrollableDiv"
            >
              {WordInput.map((val, i) => {
                return (
                  <div className="flex items-center py-1">
                    <input
                      value={val.word}
                      className="border  font-USRegular text-sm py-2 pl-3 outline-none rounded-md focus:border-Primary"
                      type="text"
                      placeholder="Enter Word"
                      onChange={(e) => {
                        handleInputChange(e, i);
                      }}
                    />
                    {i > 0 && (
                      <Button
                        onClick={() => {
                          handleRemoveInput(i);
                        }}
                        type="text"
                        size="small"
                        style={{
                          height: 40,
                          width: 40,
                          marginLeft: 5,
                        }}
                        icon={
                          <img
                            src={IconsAI.Trash}
                            alt="Remove"
                            height={25}
                            width={25}
                          />
                        }
                      />
                    )}
                  </div>
                );
              })}
            </InfiniteScroll>
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
    </div>
  );
}

export default MissingWords;
