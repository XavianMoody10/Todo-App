"use strict";
const tagsArray = new Set();
const elementData = [];

// Allow the user to toggle between the start and create displays in the create container.
const changeDisplays = () => {
  const startDisplay = document.querySelector("#start");
  const createDisplay = document.querySelector("#create");
  const startBtn = document.querySelector("#start button");
  const cancelBtn = document.querySelector("#btns button:last-child");

  startBtn.addEventListener("click", () => {
    startDisplay.classList.replace("start-display", "hidden");
    createDisplay.classList.replace("hidden", "create-display");
  });

  cancelBtn.addEventListener("click", () => {
    startDisplay.classList.replace("hidden", "start-display");
    createDisplay.classList.replace("create-display", "hidden");
  });
};

// Checking if the user inputs a valid title.
const titleInputValidation = () => {
  const titleInput = document.querySelector("#title-input");
  const titleError = document.querySelector("#title-error");

  const checkTitle = (e) => {
    const errorMessages = {
      invalidTitle: {
        message: "Please enter a valid title",
        color: "red",
      },

      validTitle: {
        message: "Your good to go",
        color: "green",
      },
    };

    if (e.target.value.length > 0) {
      titleError.style.opacity = 1;
      titleError.textContent = errorMessages.validTitle.message;
      titleError.style.color = errorMessages.validTitle.color;
    } else if (e.target.value.length == 0) {
      titleError.style.opacity = 1;
      titleError.textContent = errorMessages.invalidTitle.message;
      titleError.style.color = errorMessages.invalidTitle.color;
    }
  };

  titleInput.addEventListener("input", checkTitle);
};

const getItemTitle = () => {
  const titleInput = document.querySelector("#title-input");
  const title = titleInput.value;

  return title;
};

const getItemDetails = () => {
  const detailsInput = document.querySelector("#details-input");
  const details = detailsInput.value;

  return details;
};

// Get tags will go here
const getItemTags = () => {
  const tags = document.querySelectorAll(".tags");

  [...tags].forEach((tag) => {
    tag.addEventListener("click", () => {
      if (tagsArray.has(tag.textContent)) {
        tagsArray.delete(tag.textContent);
      } else {
        tagsArray.add(tag.textContent);
      }

      console.log(tagsArray);
    });
  });

  return tagsArray;
};

const createItem = () => {
  const createBtn = document.querySelector("#btns button:first-child");
  const titleError = document.querySelector("#title-error");

  createBtn.addEventListener("click", () => {
    const itemInfo = {
      title: getItemTitle(),
      details: getItemDetails(),
      tags: Array.from(tagsArray),
    };

    // Check if title is not empty
    if (itemInfo.title.length > 0) {
      createItemElement(itemInfo);
    } else {
      titleError.style.opacity = 1;
      titleError.textContent = "Please enter a title before proceeding";
      titleError.style.color = "red";
    }
  });

  function createItemElement(data) {
    const dropzone = document.querySelector("#new-container .dropzones");

    // Create new elements
    const newItem = document.createElement("div");
    const newUl = document.createElement("ul");
    const newPara = document.createElement("p");

    // Add the classes to the elements
    newItem.classList.add("item");
    newUl.classList.add("item-tags");
    newPara.classList.add("item-title");

    // Create elements for tags and append to the unorder list element
    data.tags.forEach((tag) => {
      const newLI = document.createElement("li");
      newLI.textContent = tag;
      newUl.appendChild(newLI);
    });

    // Add title text toe newPara element
    newPara.textContent = data.title;

    // Appen items orderly
    newItem.append(newUl);
    newItem.append(newPara);
    dropzone.append(newItem);

    // Append to array to save data
    elementData.push([data, newItem]);
    console.log(elementData);

    // Reset all inputs and selected tags
    const ResetEverything = () => {
      const titleInput = document.querySelector("#title-input");
      const detailsInput = document.querySelector("#details-input");

      // Reset tags Set
      tagsArray.clear();

      // Reset all inputs
      titleInput.value = "";
      detailsInput.value = "";
    };

    ResetEverything();
  }
};

changeDisplays();
titleInputValidation();
createItem();
getItemTags();
