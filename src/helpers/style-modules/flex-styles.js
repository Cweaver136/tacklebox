  
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="flex-styles">
  <template>
    <style>
        .flex-row-center {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .flex-col-center-h {
          display: flex;
          align-items: center;
          flex-direction: column;
        }
        .flex-col-center-v {
          display: flex;
          align-items: center;
          flex-direction: column;
        }
        .flex-col-center-vh {
          display: flex;
          align-items: center;
          flex-direction: column;
          justify-content: center;
        }
        .flex-col {
          display: flex;
          flex-direction: column
        }
    </style>
  </template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);
