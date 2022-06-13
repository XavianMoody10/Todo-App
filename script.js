"use strict";
const allElementsData = [];
const tagsArray = new Set();
const elementInfoData = [];
let itemCounter = 0;

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

// Get title from title input
const getItemTitle = () => {
  const titleInput = document.querySelector("#title-input");
  const title = titleInput.value;

  return title;
};

// Get details from detail input
const getItemDetails = () => {
  const detailsInput = document.querySelector("#details-input");
  const details = detailsInput.value;

  return details;
};

// Selecting tags for items
const getItemTags = () => {
  const tags = document.querySelectorAll(".tags");

  [...tags].forEach((tag) => {
    tag.addEventListener("click", () => {
      if (tagsArray.has(tag.textContent)) {
        tagsArray.delete(tag.textContent);
        tag.classList.toggle("selected");
      } else {
        tagsArray.add(tag.textContent);
        tag.classList.toggle("selected");
      }
    });
  });

  return tagsArray;
};

// Store list items info into an object;
const createItem = () => {
  const createBtn = document.querySelector("#btns button:first-child");
  const titleError = document.querySelector("#title-error");
  const tagSelection = document.querySelectorAll(".tags");
  const dropzones = document.querySelectorAll(".dropzones");

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

    DropzonesElementStorage(
      dropzones[0].children,
      dropzones[1].children,
      dropzones[2].children
    );
  });

  // Add new list Item into the DOM
  function createItemElement(data) {
    const dropzone = document.querySelector("#new-container .dropzones");
    const titleError = document.querySelector("#title-error");

    // Create new elements
    const newItem = document.createElement("div");
    const newUl = document.createElement("ul");
    const newPara = document.createElement("p");
    const trashIcon = `<i class="fa-solid fa-trash delete-icon"></i>`;

    // Add the classes to the elements
    newItem.classList.add("item");
    newItem.draggable = true;
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
    newItem.insertAdjacentHTML("beforeend", trashIcon);
    dropzone.append(newItem);

    // Append to array to save data
    allElementsData.push([data, newItem]);

    // Reset all inputs and selected tags
    const ResetEverything = () => {
      const titleInput = document.querySelector("#title-input");
      const detailsInput = document.querySelector("#details-input");

      // Reset tags Set
      tagsArray.clear();
      tagSelection.forEach((tag) => {
        tag.classList.remove("selected");
      });

      // Reset all inputs
      titleInput.value = "";
      detailsInput.value = "";

      // DEFAULT error
      titleError.style.opacity = 0;
    };

    elementInfoStorage(data);
    ResetEverything();
  }
};

// ------------------------------------------------------------------------

// DRAGN AND DROP FUNCTIONALITY (WITH SORTING)
const dragndrop = () => {
  const dropzones = document.querySelectorAll(".dropzones");

  document.addEventListener("dragstart", (e) => {
    if (e.target.closest(".item")) {
      e.target.classList.add("draggable");
    }
  });

  document.addEventListener("dragend", (e) => {
    if (e.target.closest(".item")) {
      e.target.classList.remove("draggable");
    }
  });

  [...dropzones].forEach((dropzone) => {
    dropzone.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    // Pass values to localstorage
    dropzone.addEventListener("drop", () => {
      // I used setTimeout because when I dropped a list item into a dropzone, the item would save in the localstorage, but the "draggable" class would not remove before being added. Adding setTimeout allows the item to be saved in local storage after the draggable event is removed.
      setTimeout(() => {
        DropzonesElementStorage(
          dropzones[0].children,
          dropzones[1].children,
          dropzones[2].children
        );
      }, 100);
    });
  });

  // SORTING FUNCTIONALITY
  document.querySelectorAll("*").forEach((el) => {
    el.addEventListener("dragover", (e) => {
      const draggable = document.querySelector(".draggable");
      const dragoverEl = e.target;
      const closestDropzone = draggable.cloneNode(".dropzones");

      // Append item to dropzone at the end
      if (dragoverEl.classList.contains("dropzones")) {
        dragoverEl.appendChild(draggable);
      }

      // When draggable item hovers over another a undraggable item, append the draggable item after the undraggable
      if (
        dragoverEl.classList.contains("item") &&
        !dragoverEl.classList.contains("draggable")
      ) {
        const dropzone = draggable.closest(".dropzones");
        dropzone.insertBefore(draggable, dragoverEl);
      }

      // When dragging over th first child in the dropzone, insert draggable before the first child
      closestDropzone.firstChild.addEventListener("dragover", () => {
        closestDropzone.insertBefore(draggable, dragoverEl);
      });
    });
  });
};

// ---------------------------------------------------------------------------

// ELEMENT INFO LOCALSTORAGE
const elementInfoStorage = (itemdata) => {
  elementInfoData.push(itemdata);
  localStorage.setItem("Items Data", JSON.stringify(elementInfoData));
};

// ----------------------------------------------------------------------

// SEARCHING Items
const searchItems = () => {
  const searchInput = document.querySelector("#search-input");
  const resultContainer = document.querySelector("#results-container");
  const loading = document.querySelector("#loading");
  const noResults = document.querySelector("#failed");
  const resultsArray = [];

  searchInput.addEventListener("input", (e) => {
    const getData = JSON.parse(localStorage.getItem("Items Data"));

    const addLoadingScreen = () => {
      loading.classList.add("loading");
      loading.classList.remove("hidden");
    };

    const removeLoadingScreen = () => {
      loading.classList.add("hidden");
      loading.classList.remove("loading");
    };

    const addNoResults = () => {
      noResults.classList.replace("hidden", "failed");
    };

    const removeNoResults = () => {
      noResults.classList.replace("failed", "hidden");
    };

    const resetContainerChildren = () => {
      [...resultContainer.children].forEach((child) => {
        if (child.classList.contains("item")) {
          resultContainer.removeChild(child);
        }
      });
    };

    const resetResult = () => {
      [...resultsArray].forEach((data) => {
        resultsArray.pop(data);
      });

      resetContainerChildren();
    };

    removeNoResults();
    addLoadingScreen();
    resetResult();

    const test = new Promise((respond, reject) => {
      resetResult();

      [...getData].forEach((data) => {
        if (
          data.title.includes(e.target.value) ||
          data.details.includes(e.target.value)
        ) {
          resultsArray.push(data);
        }
      });

      if (e.target.value == "" || resultsArray.length == 0) {
        console.log(resultsArray);
        reject();
      } else {
        console.log(resultsArray);
        respond();
      }
    });

    test
      .then(() => {
        removeNoResults();

        setTimeout(() => {
          resetContainerChildren();
          removeLoadingScreen();

          [...resultsArray].forEach((result) => {
            // Create Elements
            const newItem = document.createElement("div");
            const newUl = document.createElement("ul");
            const newPara = document.createElement("p");
            const trashIcon = `<i class="fa-solid fa-trash delete-icon"></i>`;

            // Add the classes to the elements
            newItem.classList.add("item");
            newUl.classList.add("item-tags");
            newPara.classList.add("item-title");

            // Create elements for tags and append to the unorder list element
            result.tags.forEach((tag) => {
              const newLI = document.createElement("li");
              newLI.textContent = tag;
              newUl.appendChild(newLI);
            });

            // Add title text to newPara element
            newPara.textContent = result.title;

            // Append items orderly
            newItem.append(newUl);
            newItem.append(newPara);
            newItem.insertAdjacentHTML("beforeend", trashIcon);

            resultContainer.appendChild(newItem);
          });
        }, 500);
      })
      .catch(() => {
        resetResult();

        setTimeout(() => {
          addNoResults();
          removeLoadingScreen();
        }, 300);
      });
  });
};

searchItems();

// -----------------------------------------------------------------------

// THE FUNCTIONS EXECUTES WHEN THE PAGE LOADS
// LOADING ELEMENT INFO LOCALSTORAGE
const loadingElementInfoData = () => {
  const getLocalElements = JSON.parse(localStorage.getItem("Items Data"));

  if (getLocalElements == null) {
    console.log("NO ITEMS STORED IN LOCALSTORAGE");
  } else {
    [...getLocalElements].forEach((el) => {
      elementInfoData.push(el);
    });
  }
};

// DROPZONES LOCAL STORAGE
function DropzonesElementStorage(
  newChildren,
  activeChildren,
  completeChildren
) {
  const newArray = [];
  const activeArray = [];
  const completeArray = [];

  [...newChildren].forEach((child) => {
    newArray.push(child.outerHTML);
  });

  [...activeChildren].forEach((child) => {
    activeArray.push(child.outerHTML);
  });

  [...completeChildren].forEach((child) => {
    completeArray.push(child.outerHTML);
  });

  localStorage.removeItem("newitems");
  localStorage.removeItem("activeitems");
  localStorage.removeItem("completeitems");

  localStorage.setItem("newitems", JSON.stringify(newArray));
  localStorage.setItem("activeitems", JSON.stringify(activeArray));
  localStorage.setItem("completeitems", JSON.stringify(completeArray));
}

window.addEventListener("DOMContentLoaded", () => {
  const dropzones = document.querySelectorAll(".dropzones");
  const getNewItems = JSON.parse(localStorage.getItem("newitems"));
  const getActiveItems = JSON.parse(localStorage.getItem("activeitems"));
  const getCompleteItems = JSON.parse(localStorage.getItem("completeitems"));

  // If locally stored array is null, then return. Else, append array element
  if (getNewItems == null) {
    return;
  } else {
    [...getNewItems].forEach((child) => {
      const childEl = child;
      dropzones[0].insertAdjacentHTML("beforeend", childEl);
    });
  }

  if (getActiveItems == null) {
    return;
  } else {
    [...getActiveItems].forEach((child) => {
      const childEl = child;
      dropzones[1].insertAdjacentHTML("beforeend", childEl);
    });
  }

  if (getCompleteItems == null) {
    return;
  } else {
    [...getCompleteItems].forEach((child) => {
      const childEl = child;
      dropzones[2].insertAdjacentHTML("beforeend", childEl);
    });
  }
});

// DELETE ITEMS
const deleteItem = (et) => {
  const dropzones = document.querySelectorAll(".dropzones");
  const resultContainer = document.querySelector("#results-container");

  function deleteOperation(target, parent) {
    const item = target.closest(".item");
    const itemTitle = item.querySelector(".item-title").innerHTML;

    localStorage.removeItem("Items Data");

    [...elementInfoData].forEach((data) => {
      if (data.title == itemTitle) {
        const index = elementInfoData.indexOf(data);
        elementInfoData.splice(index, index + 1);
      }
    });

    parent.removeChild(item);

    localStorage.setItem("Items Data", JSON.stringify(elementInfoData));

    DropzonesElementStorage(
      dropzones[0].children,
      dropzones[1].children,
      dropzones[2].children
    );
  }

  document.addEventListener("click", (e) => {
    if (
      e.target.classList.contains("delete-icon") &&
      e.target.closest(".dropzones")
    ) {
      const dropzone = e.target.closest(".dropzones");
      deleteOperation(e.target, dropzone);
    }

    if (
      e.target.classList.contains("delete-icon") &&
      e.target.closest("#results-container")
    ) {
      const container = e.target.closest("#results-container");
      deleteOperation(e.target, container);
    }
  });

  // USE EqualToclone method to delete the items that similar to the item deleted from the results container.
};

changeDisplays();
titleInputValidation();
createItem();
getItemTags();
dragndrop();
loadingElementInfoData();
deleteItem();
