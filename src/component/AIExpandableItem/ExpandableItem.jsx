import { ChevronRight } from "@mui/icons-material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getExistingVocabulary,
  getWordSetsByCollection,
  setLoadingWordSets,
  setOpenedCollection,
  setSelectedCollection,
  setSelectedWordset,
} from "../../Redux/Reducers/CollocationReducer";
import { ThreeDots } from "react-loader-spinner";

function ExpandableItem({ collection, wordSets = [] }) {
  const [Open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const selected_collection = useSelector(
    (state) => state.Collocations.selected_collection
  );
  const LoadingWordSets = useSelector(
    (state) => state.Collocations.LoadingWordSets
  );
  const selected_list_type = useSelector(
    (state) => state.Collocations.selected_list_type
  );
  const selected_wordset = useSelector(
    (state) => state.Collocations.selected_wordset
  );
  const opened_collection = useSelector(
    (state) => state.Collocations.opened_collection
  );

  return (
    <div>
      <div
        onClick={() => {
          setOpen(!Open);
          if (Open) {
            if (opened_collection === collection.collection_name) {
              dispatch(setOpenedCollection(""));
            } else {
              dispatch(setLoadingWordSets(true));
              dispatch(setOpenedCollection(collection.collection_name));
              dispatch(getWordSetsByCollection(collection.collection_name));
            }
          } else {
            if (opened_collection === collection.collection_name) {
              dispatch(setOpenedCollection(""));
            } else {
              dispatch(setLoadingWordSets(true));
              dispatch(setOpenedCollection(collection.collection_name));
              dispatch(getWordSetsByCollection(collection.collection_name));
            }
          }
        }}
        className={` w-full flex items-center justify-between select-none cursor-pointer pl-2 py-1  my-1 text-left font-USMedium text-sm text-TextPrimary`}
      >
        {collection.title}
        <div className="w-8 flex items-center justify-end">
          {selected_collection === collection.collection_name && (
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
          )}
          <ChevronRight
            className={
              opened_collection === collection.collection_name
                ? "rotate-90"
                : ""
            }
          />
        </div>
      </div>
      <div>
        {opened_collection === collection.collection_name && (
          <div
            className={`${
              LoadingWordSets
                ? "flex items-center justify-center bg-white p-3 rounded-md"
                : "bg-white p-3 rounded-md"
            }`}
          >
            {LoadingWordSets ? (
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
            ) : (
              wordSets.map((wordset, idx) => {
                return (
                  <div
                    onClick={() => {
                      dispatch(
                        setSelectedCollection(collection.collection_name)
                      );
                      dispatch(setSelectedWordset(wordset.word_set_name));
                      dispatch(
                        getExistingVocabulary(
                          selected_list_type,
                          collection.collection_name,
                          wordset.word_set_name
                        )
                      );
                    }}
                    key={idx}
                    className={`${
                      selected_wordset === wordset.word_set_name &&
                      selected_collection === collection.collection_name &&
                      "bg-gray-100"
                    } text-left select-none flex flex-row items-center justify-between cursor-pointer pl-2 py-1 my-2 hover:bg-gray-100 rounded-md font-USRegular text-sm text-TextPrimary`}
                  >
                    {wordset.title}
                    <ChevronRight
                      style={{
                        height: 20,
                        width: 20,
                      }}
                    />
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ExpandableItem;
