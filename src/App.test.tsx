import { fireEvent, render, cleanup, screen } from "@testing-library/react";
import App from "./App";

type SecondMostContents = {
  [key: string]: Array<string>;
};

type JSON = {
  [key: string]: string;
};

let globalTopMostContents: Array<string> = [];

const validJson: JSON = {
  "tagTable.columns.createdBy": "Created by",
  "tagTable.columns.createdOn": "Created on",
  "tagTable.columns.name": "Name",
  "tagTable.columns.tickets": "Tickets",
  "tagTable.createRow.btn.cancel": "Cancel",
  "tagTable.createRow.btn.save": "Save",
  "tagDropdown.createNewTag.btn.cancel": "Cancel",
  "tagDropdown.createNewTag.btn.save": "Save",
  "tagDropdown.createNewTag.nameField.label": "Name",
  "tagDropdown.createNewTag.nameField.placeholder": "Enter tag name",
  "tagDropdown.createNewTag.title": "Add new tag",
  "tagDropdown.empty": "No tags",
  "tagDropdown.error.maxTagsPerTicket": "Can't add more than 20 tags.",
  "tagDropdown.searchInputPlaceholder": "Search",
  tagFile: "Can't",
};

const prepareTopMostContents = async () => {
  const handleClick = jest.fn();
  const file = new File([JSON.stringify(validJson)], "file.json", {
    type: "application/json",
  });
  const importButtonText = "Import";
  const importErrorText = "Import Error";
  const topMostContents = new Set(
    Object.keys(validJson).map((key) => key.split(".")[0])
  );
  const app = render(<App />);
  const fileUploader = app.container.querySelector('input[type="file"]');

  if (!file.text) {
    file.text = () => {
      return new Promise((resolve, reject) => {
        resolve(JSON.stringify(validJson));
      });
    };
  }

  fileUploader?.addEventListener("click", handleClick);

  expect(
    screen.queryByText(importErrorText, {
      selector: "p",
      exact: true,
    })
  ).not.toBeInTheDocument();

  expect(
    screen.getByText(importButtonText, {
      selector: "button",
      exact: true,
    })
  ).toBeInTheDocument();

  fireEvent.click(
    screen.getByText(importButtonText, {
      selector: "button",
      exact: true,
    })
  );

  expect(handleClick).toHaveBeenCalledTimes(1);

  fireEvent.change(fileUploader || document.createElement("div"), {
    target: { files: [file] },
  });

  expect(
    screen.queryByText(importErrorText, {
      selector: "p",
      exact: true,
    })
  ).not.toBeInTheDocument();

  globalTopMostContents = Array.from(topMostContents);
};

describe("App", () => {
  test("when an invalid file is imported, it shows an error dialog.", () => {
    const handleClick = jest.fn();
    const file = new File(["Halo"], "file.xml", { type: "application/xml" });
    const importButtonText = "Import";
    const importErrorText = "Import Error";
    const app = render(<App />);
    const fileUploader = app.container.querySelector('input[type="file"]');

    fileUploader?.addEventListener("click", handleClick);

    expect(
      screen.queryByText(importErrorText, {
        selector: "p",
        exact: true,
      })
    ).not.toBeInTheDocument();

    expect(
      screen.getByText(importButtonText, {
        selector: "button",
        exact: true,
      })
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByText(importButtonText, {
        selector: "button",
        exact: true,
      })
    );

    expect(handleClick).toHaveBeenCalledTimes(1);

    fireEvent.change(fileUploader || document.createElement("div"), {
      target: { files: [file] },
    });

    expect(
      screen.queryByText(importErrorText, {
        selector: "p",
        exact: true,
      })
    ).toBeInTheDocument();
  });
});

describe("App", () => {
  beforeEach(prepareTopMostContents);

  test("when a valid JSON file is imported, top-most folders and files from the file are listed.", async () => {
    for (let i = 0; i < globalTopMostContents.length; i++) {
      const topMostContent = await screen.findByText(globalTopMostContents[i]);
      expect(topMostContent).toBeInTheDocument();
    }
  });
});

describe("App", () => {
  const arrowIconClassName = "directory-item-arrow-icon";
  let topMostElements: Array<HTMLElement> = [];
  let fileNames: Array<string> = [];
  let fileContents: Array<string> = [];
  let filePaths: Array<string> = [];
  let secondMostContents: SecondMostContents = {};

  const prepareSecondMostContents = async () => {
    for (let i = 0; i < globalTopMostContents.length; i++) {
      const topMostContent = await screen.findByText(globalTopMostContents[i]);
      expect(topMostContent).toBeInTheDocument();
      topMostElements.push(topMostContent);
    }

    for (let i = 0; i < globalTopMostContents.length; i++) {
      const target = globalTopMostContents[i];
      Object.keys(validJson).forEach((key) => {
        if (
          key.indexOf(target) >= 0 &&
          key.indexOf(target) + target.length + 1 < key.length
        ) {
          const [secondMostContent, thirdMostContent] = key
            .slice(key.indexOf(target) + target.length + 1)
            .split(".");

          if (!thirdMostContent) {
            fileNames.push(secondMostContent);
            fileContents.push(validJson[key]);
            filePaths.push(key);
          }

          if (globalTopMostContents[i] in secondMostContents) {
            secondMostContents[globalTopMostContents[i]].push(
              secondMostContent
            );
          } else {
            secondMostContents[globalTopMostContents[i]] = [secondMostContent];
          }
        }
      });
    }
  };

  beforeEach(prepareTopMostContents);
  beforeEach(prepareSecondMostContents);
  afterEach(() => {
    topMostElements = [];
    fileNames = [];
    fileContents = [];
    filePaths = [];
    secondMostContents = {};
  });

  test("when a folder is clicked, the children of the folder are listed.", async () => {
    for (let i = 0; i < topMostElements.length; i++) {
      const topMostElement = topMostElements[i];
      const topMostElementText = globalTopMostContents[i];

      if (
        topMostElement.nextElementSibling?.classList.contains(
          arrowIconClassName
        )
      ) {
        const parent = topMostElement.parentElement;
        const children = Array.from(
          new Set(secondMostContents[topMostElementText])
        );

        fireEvent.click(parent || document.createElement("div"));

        for (let j = 0; j < children.length; j++) {
          const secondMostContentElement = await screen.findByText(children[j]);
          expect(secondMostContentElement).toBeInTheDocument();
        }
      }
    }
  });

  test("When a file is clicked, its dot-separated path and content are displayed.", async () => {
    for (let i = 0; i < topMostElements.length; i++) {
      const topMostElement = topMostElements[i];
      const topMostElementText = globalTopMostContents[i];

      if (
        topMostElement.nextElementSibling?.classList.contains(
          arrowIconClassName
        )
      ) {
        const parent = topMostElement.parentElement;
        const children = Array.from(
          new Set(secondMostContents[topMostElementText])
        );

        fireEvent.click(parent || document.createElement("div"));

        for (let j = 0; j < children.length; j++) {
          const secondMostContentElement = await screen.findByText(children[j]);
          expect(secondMostContentElement).toBeInTheDocument();

          if (fileNames.includes(secondMostContentElement.innerHTML)) {
            const index = fileNames.indexOf(secondMostContentElement.innerHTML);
            const fileContent = fileContents[index];
            const filePath = filePaths[index];

            fireEvent.click(
              secondMostContentElement.parentElement ||
                document.createElement("div")
            );

            expect(screen.getByText(fileContent)).toBeInTheDocument();

            expect(screen.getByText(filePath)).toBeInTheDocument();
          }
        }
      }
    }
  });
});
