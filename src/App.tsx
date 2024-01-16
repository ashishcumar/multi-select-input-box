import React, { useEffect, useRef, useState } from "react";

import "./App.css";
import { IUserData, IUserObject } from "./helper/interface";

function App() {
  const searchValueRef = useRef<string>("");
  const [userData, setUserData] = useState<IUserData[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<IUserData[]>([]);
  const [backSpaceSelectedUser, setBackSpaceSelectedUser] =
    useState<IUserData>();

  const objectCheck = (object1: object, object2: object) => {
    return JSON.stringify(object1) === JSON.stringify(object2);
  };

  const fetchUsers = async () => {
    const res = await fetch("https://dummyjson.com/users");
    const data = await res.json();
    if (data.users.length) {
      setUserData(
        data.users.map((user: IUserObject) => {
          return {
            name: user.firstName + user.lastName,
            email: user.email,
            isSelected: false,
          };
        })
      );
    }
  };

  const updateSelectedUser = (userToAdd: IUserData) => {
    if (selectedUser.some((userObj) => objectCheck(userObj, userToAdd))) {
      setSelectedUser(
        selectedUser.filter((userObj) => !objectCheck(userObj, userToAdd))
      );
    } else {
      setSelectedUser([...selectedUser, userToAdd]);
    }
  };

  const backKeyFunction = (e: any) => {
    if (e.code === "Backspace" && backSpaceSelectedUser?.name) {
      updateSelectedUser(backSpaceSelectedUser);
      setBackSpaceSelectedUser(undefined);
    }
    if (
      e.code === "Backspace" &&
      searchValueRef.current == "" &&
      !backSpaceSelectedUser?.name
    ) {
      setBackSpaceSelectedUser(selectedUser[selectedUser.length - 1]);
    } else {
      searchValueRef.current = e.target.value;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "grid",
        placeContent: "center",
      }}
    >
      <p
        style={{
          textAlign: "center",
          fontSize: "48px",
          fontWeight: 700,
          color: "#76453B",
        }}
      >
        Pick Users
      </p>
      <div
        style={{
          minHeight: "80vh",
          width: "80vw",
          borderRadius: "8px",
          padding: "16px",
          overflow: "hidden",
          margin: "24px 0",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: "8px",
            flexWrap: "wrap",
            borderBottom: "3px solid #638889",
            padding: "8px 0",
          }}
        >
          {selectedUser?.map((userObj) => {
            return (
              <div
                key={userObj.name}
                style={{
                  display: "flex",
                  justifyContent: "flexp-start",
                  alignItems: "center",
                  border: `2px solid ${
                    backSpaceSelectedUser?.name == userObj.name
                      ? "#3468C0"
                      : "#638889"
                  }`,
                  padding: "4px 8px",
                  borderRadius: "4px",
                  width: "fit-content",
                  color:
                    backSpaceSelectedUser?.name == userObj.name
                      ? "#3468C0"
                      : "#638889",
                }}
              >
                <p
                  style={{
                    fontSize: "14px",
                    padding: "0",
                    fontWeight: "600",
                  }}
                  key={userObj.email}
                >
                  {userObj.name}
                </p>
                <div
                  style={{ marginLeft: "8px", cursor: "pointer" }}
                  onClick={() => updateSelectedUser(userObj)}
                >
                  ⛌
                </div>
              </div>
            );
          })}

          <input
            style={{
              width: selectedUser.length
                ? "fit-content"
                : "-webkit-fill-available",
              height: "32px",
              padding: "8px 12px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 500,
              border: "none",
              outline: "none",
              color: "#76453B",
            }}
            value={searchValue}
            placeholder="Enter user name"
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyUp={(e) => backKeyFunction(e)}
          />
        </div>

        {searchValue.length ? (
          <div style={{ height: "70vh", margin: "8px 0" }}>
            <p style={{ margin: "8px 0", fontSize: "16px" }}>
              search for :-
              <span style={{ fontWeight: 600 }}>{searchValue}</span>
            </p>
            <div
              style={{
                height: "100%",
                overflow: "scroll",
              }}
            >
              {userData.map((userObj) => {
                if (
                  userObj.name.includes(searchValue) &&
                  !selectedUser.some((obj) => obj.name === userObj.name)
                ) {
                  return (
                    <div
                      key={userObj.email}
                      style={{
                        cursor: "pointer",
                        fontSize: "14px",
                        border: "1px solid black",
                        borderRadius: "4px",
                        padding: "8px 12px",
                        width: "fit-content",
                        margin: "8px 0",
                      }}
                      onClick={() =>
                        updateSelectedUser({
                          ...userObj,
                          isSelected: true,
                        })
                      }
                    >
                      {userObj.name}
                    </div>
                  );
                }
              })}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default App;
