import React, { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import CheckBox from "../../component/AICheckBox/CheckBox";
import {
  addWordsInMissingList,
  ConfirmModal,
  getCollocationMissingWordsList,
  refreshMCWordList,
  setSelectedMissingWords,
} from "../../Redux/Reducers/CollocationReducer";
import { IconsAI } from "../../assets/Icons";
import { RotatingLines, ThreeDots } from "react-loader-spinner";
import { Grid } from "@mui/material";
import { toast } from "react-toastify";
import { Button, Flex, Tag } from "antd";
import Modal from "../../component/AIModal/Modal";

function MissingWords() {
  const dispatch = useDispatch();
  const missing_list = useSelector(
    (state) => state.Collocations.missing_collocations
  );
  const api_payload = useSelector((state) => state.Collocations.api_payload);
  const ModalContentRef = useRef(null);
  const pageNumber = useSelector((state) => state.Collocations.MC_pageNumber);
  const Loading = useSelector((state) => state.Collocations.Loading);
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
    <div className="bg-container h-screen w-full">
      <div className="w-full p-5 flex">
        <div className="w-1/2 bg-white p-5 rounded-md shadow-md">
          <div className="flex flex-wrap border-b pb-3 items-center justify-between">
            <div className="text-xl font-USBold text-TextPrimary">
              Words List
            </div>
            {api_payload.length > 0 && (
              <div className="flex flex-wrap ">
                <div className="flex items-center px-2 py-1 rounded-md cursor-pointer hover:bg-gray-100">
                  <img src={IconsAI.Generate} className="h-5 w-5" alt="" />
                  <div className="text-xs select-none ml-2 mr-2 font-USSemiBold text-TextPrimary">
                    Generate
                  </div>
                </div>
                <div className="flex items-center px-2 py-1 rounded-md cursor-pointer hover:bg-gray-100">
                  <img src={IconsAI.Edit} className="h-5 w-5" alt="" />
                  <div className="text-xs select-none ml-2 mr-2 font-USSemiBold text-TextPrimary">
                    Edit
                  </div>
                </div>
                <div
                  onClick={() => {
                    dispatch(ConfirmModal(true));
                  }}
                  className="flex items-center px-2 py-1 rounded-md cursor-pointer hover:bg-gray-100"
                >
                  <img src={IconsAI.Trash} className="h-5 w-5" alt="" />
                  <div className="text-xs select-none ml-2 mr-2 font-USSemiBold text-TextPrimary">
                    Remove
                  </div>
                </div>
              </div>
            )}
          </div>
          <div>
            <div
              id="scrollableDiv"
              style={{
                height: window.innerHeight * 0.65,
              }}
              className="flex flex-col overflow-auto "
            >
              {/*Put the scroll bar always on the bottom*/}
              <InfiniteScroll
                loader={
                  <div className="h-full flex justify-center items-center">
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
              >
                {missing_list.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="px-3 py-3 w-full flex items-center border-b"
                    >
                      <div className="flex justify-center mr-3 font-USSemiBold bg-">
                        <CheckBox
                          Checked={item.isSelected}
                          word={item}
                          onClick={onSelectWord}
                        />
                      </div>
                      <div className="text-center ml-5 font-USSemiBold text-xs text-TextPrimary">
                        {item.word}
                      </div>
                    </div>
                  );
                })}
              </InfiniteScroll>
            </div>
          </div>
        </div>
        <div className="w-2/3 ml-5  bg-white p-5 rounded-md shadow-md">
          <div className="flex flex-wrap border-b pb-3 items-center justify-between">
            <div className="text-xl font-USBold text-TextPrimary">
              Add New Words
            </div>
            <div className="flex flex-wrap ">
              <div
                onClick={() => {
                  handleAddInput();
                }}
                className="flex items-center px-2 py-1 rounded-md cursor-pointer hover:bg-gray-100"
              >
                <img src={IconsAI.Plus} className="h-4 w-4" alt="" />
                <div className="text-xs ml-2 mr-2 select-none font-USSemiBold text-TextPrimary">
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
                <div className="text-xs select-none ml-2 mr-2 font-USSemiBold text-TextPrimary">
                  Save Words
                </div>
              </div>
            </div>
          </div>
          <div
            id="scrollableDiv"
            style={{
              height: window.innerHeight * 0.65,
              overflow: "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <InfiniteScroll
              dataLength={WordInput.length}
              scrollableTarget="scrollableDiv"
            >
              <Grid
                className="p-3"
                container
                columnGap={5}
                rowSpacing={2}
                columnSpacing={0}
                justifyContent={"center"}
              >
                {WordInput.map((val, i) => {
                  return (
                    <Grid
                      key={i}
                      display={"flex"}
                      item
                      xs={6}
                      md={5}
                      flexDirection={"row"}
                    >
                      <input
                        value={val.word}
                        className="border w-full font-USRegular text-sm py-2 pl-3 outline-none rounded-md focus:border-Primary"
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
                    </Grid>
                  );
                })}
              </Grid>
            </InfiniteScroll>
          </div>
        </div>
      </div>
      <Modal visible={openConfirmModal}>
        <div className="pt-5 pb-1 pl-5 font-USMedium text-TextPrimary text-base">
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
          <div className="bg-Primary ml-3 select-none cursor-pointer text-white font-USSemiBold text-sm px-7 py-1 rounded-md">
            Yes
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default MissingWords;
