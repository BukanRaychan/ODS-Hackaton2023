"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var dropArea = document.querySelector('.drop-area');
var defaultView = document.getElementById("default");
var hoverView = document.getElementById("hover");
var uploadingView = document.getElementById("uploading");
var uploadedView = document.getElementById("uploaded");
var fileName = document.getElementById("file-name");
var fileSize = document.getElementById("file-size");
var partitionView = document.getElementById("partition");
var databaseView = document.getElementById("database");
var button = document.querySelector('.button');
var input = document.getElementById('browse-input');
var database_button = document.getElementById('database-button');
var file;
var file_shard;
var file_database; //when file is inside the drop area

dropArea.addEventListener('dragover', function (event) {
  event.preventDefault();
  console.log("inside");
  hoverView.style.display = "block ";
  defaultView.style.display = "none";
  dropArea.classList.add('active');
}); //when file outside the drop area

dropArea.addEventListener('dragleave', function () {
  console.log("outside");
  dropArea.classList.remove('active');
  defaultView.style.display = "block";
  hoverView.style.display = "none";
}); //when file is dropped in the drag area

dropArea.addEventListener('drop', function (event) {
  event.preventDefault();
  dropArea.classList.remove('active');
  file = event.dataTransfer.files[0];
  selectPartion();
}); //input will get clicked if button get clicked

button.onclick = function () {
  input.click();
}; //Action if input got clicked


input.addEventListener('change', function () {
  file = this.files[0];
  selectPartion();
});

function selectPartion() {
  var horizontal = document.getElementById("horizontal");
  var vertical = document.getElementById("vertical");
  dropArea.style.pointerEvents = 'none';
  defaultView.style.display = "none";
  hoverView.style.display = "none";
  partitionView.style.display = "block";
  partitionView.style.pointerEvents = 'auto';
  horizontal.addEventListener('click', function () {
    file_shard = horizontal.textContent;
    selectDatabase();
  });
  vertical.addEventListener('click', function () {
    file_shard = vertical.textContent;
    selectDatabase();
  });
}

function selectDatabase() {
  partitionView.style.display = "none";
  databaseView.style.display = "block";
  databaseView.style.pointerEvents = "auto";
  var tidb = document.getElementById("tidb");
  var redis = document.getElementById("redis");
  var mongodb = document.getElementById("mongodb");
  tidb.addEventListener('click', function () {
    tidb.classList.toggle('database-option-clicked');
    updateDatabaseButton();
  });
  redis.addEventListener('click', function () {
    redis.classList.toggle('database-option-clicked');
    updateDatabaseButton();
  });
  mongodb.addEventListener('click', function () {
    mongodb.classList.toggle('database-option-clicked');
    updateDatabaseButton();
  });
  database_button.addEventListener('click', function () {
    var choosen_database = document.querySelectorAll('.database-option-clicked');
    file_database = _toConsumableArray(choosen_database).map(function (element) {
      return element.textContent;
    });
    choosen_database.forEach(function (element) {
      element.classList.remove('database-option-clicked');
    });
    updateDatabaseButton();
    uploading();
  });
}

function updateDatabaseButton() {
  var total_clicked = document.querySelectorAll('.database-option-clicked').length;

  if (total_clicked > 1) {
    database_button.textContent = "Upload Your File";
    database_button.classList.add("database-button-link");
  } else {
    database_button.classList.remove("database-button-link");
    database_button.textContent = "Select " + (-total_clicked + 2) + " Or More:";
  }
}

function uploading() {
  var formData, response, data;
  return regeneratorRuntime.async(function uploading$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          databaseView.style.display = "none";
          uploadingView.style.display = "block";
          fileName.textContent = file.name;
          size = file.size;

          if (size < 1024) {
            fileSize.textContent = size + 'b';
          } else if (size < 1048576) {
            fileSize.textContent = (size / 1024).toFixed(2) + 'kb';
          } else if (size < 1073741824) {
            fileSize.textContent = (size / 1048576).toFixed(2) + 'mb';
          } else {
            fileSize.textContent = (size / 1073741824).toFixed(2) + 'gb';
          }

          formData = new FormData();
          formData.append('partitionType', file_shard);
          formData.append('shardingKey', "Age");
          file_database.forEach(function (element) {
            formData.append('database', element);
          });
          formData.append('data', file, file.name);
          _context.prev = 10;
          _context.next = 13;
          return regeneratorRuntime.awrap(fetch('http://127.0.0.1:8000/v1/api/transaction', {
            method: 'POST',
            body: formData
          }));

        case 13:
          response = _context.sent;
          _context.next = 16;
          return regeneratorRuntime.awrap(response.json());

        case 16:
          data = _context.sent;

          if (data.status != 200) {
            console.log(data.message);
          } else {
            console.log(data.message);
          }

          _context.next = 23;
          break;

        case 20:
          _context.prev = 20;
          _context.t0 = _context["catch"](10);
          console.log('Error uploading file');

        case 23:
          // console.log(file_shard);
          console.log(file_database); // console.log(file);
          // console.log(file.name);

          setTimeout(function () {
            uploadingView.style.display = "none";
            uploadedView.style.display = "block";
            setTimeout(function () {
              uploadedView.style.display = "none";
              defaultView.style.display = "block";
              dropArea.style.pointerEvents = '';
            }, 2000);
          }, 2000);
          input.value = '';

        case 26:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[10, 20]]);
}

;