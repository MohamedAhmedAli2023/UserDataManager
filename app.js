// DOM Elements
const form = document.getElementById("myForm");
const imgInput = document.querySelector(".img");
const fileInput = document.getElementById("imgInput");
const userName = document.getElementById("name");
const age = document.getElementById("age");
const city = document.getElementById("city");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const post = document.getElementById("post");
const sDate = document.getElementById("sDate");
const submitBtn = document.querySelector(".submit");
const userInfo = document.getElementById("data");
const modal = document.getElementById("userForm");
const modalTitle = document.querySelector("#userForm .modal-title");
const newUserBtn = document.querySelector(".newUser");

// Local Storage
let getData = JSON.parse(localStorage.getItem('userProfile')) || [];
let isEdit = false;
let editId;

// Event Listeners
newUserBtn.addEventListener('click', () => {
    submitBtn.innerText = 'Submit';
    modalTitle.innerText = "Fill the Form";
    isEdit = false;
    imgInput.src = "./image/Profile Icon.webp";
    form.reset();
});

fileInput.addEventListener('change', handleFileChange);

form.addEventListener('submit', handleSubmit);

// Functions
function handleFileChange() {
    const file = fileInput.files[0];
    if (file && file.size < 1000000) {
        const fileReader = new FileReader();
        fileReader.onload = function (e) {
            imgInput.src = e.target.result;
        };
        fileReader.readAsDataURL(file);
    
    }
    else if(!isValidImage(file)) {
        alert("Invalid file type! Please select an image file (JPEG, PNG, etc.)");
        return;
      }
    
    else {
        alert("This file is too large!");
    }
}
// Function to validate image file type
function isValidImage(file) {
    const supportedTypes = ["image/jpeg", "image/png", "image/gif"];
    return supportedTypes.includes(file.type);
  }

function handleSubmit(e) {
    e.preventDefault();

    const information = {
        picture: imgInput.src || "./image/Profile Icon.webp",
        employeeName: userName.value,
        employeeAge: age.value,
        employeeCity: city.value,
        employeeEmail: email.value,
        employeePhone: phone.value,
        employeePost: post.value ||"",
        startDate: sDate.value
    };
    //  Validation 
  let isValid = true;
  let errorMessage = "";

  // Check field values and build error messages
  if (!information.employeeName) {
    isValid = false;
    errorMessage += "Employee name is required.\n";
  }

  if (!information.employeeAge || isNaN(information.employeeAge) || information.employeeAge < 0) {
    isValid = false;
    errorMessage += "Please enter a valid age (positive number).\n";
  }

  if (!information.employeeCity) {
    isValid = false;
    errorMessage += "Employee city is required.\n";
  }
  if (!information.employeeEmail || !isValidEmail(information.employeeEmail)) {
    isValid = false;
    errorMessage += "Please enter a valid email address.\n";
  }

  if (!information.employeePhone) {
    isValid = false;
    errorMessage += "Employee phone number is required.\n";
  }
  if (!information.startDate) {
    isValid = false;
    errorMessage+="Start date is required.\n";
  }

  // Display error message and prevent submission if invalid
  if (!isValid) {
    alert(errorMessage);
    return;
  }
    if (!isEdit) {
        getData.push(information);
    } else {
        getData[editId] = information;
        isEdit = false;
    }

    localStorage.setItem('userProfile', JSON.stringify(getData));

    submitBtn.innerText = "Submit";
    modalTitle.innerText = "Fill The Form";

    showInfo();

    form.reset();
    imgInput.src = "./image/Profile Icon.webp";
}
function isValidEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

function showInfo() {
    userInfo.innerHTML = getData.map((element, index) => {
        return `<tr class="employeeDetails">
                    <td>${index + 1}</td>
                    <td><img src="${element.picture}" alt="" width="50" height="50"></td>
                    <td>${element.employeeName}</td>
                    <td>${element.employeeAge}</td>
                    <td>${element.employeeCity}</td>
                    <td>${element.employeeEmail}</td>
                    <td>${element.employeePhone}</td>
                    <td>${element.employeePost}</td>
                    <td>${element.startDate}</td>
                    <td>
                        <button class="btn btn-success" onclick="readInfo(${index})" data-bs-toggle="modal" data-bs-target="#readData"><i class="bi bi-eye"></i></button>
                        <button class="btn btn-primary" onclick="editInfo(${index})" data-bs-toggle="modal" data-bs-target="#userForm"><i class="bi bi-pencil-square"></i></button>
                        <button class="btn btn-danger" onclick="deleteInfo(${index})"><i class="bi bi-trash"></i></button>
                    </td>
                </tr>`;
    }).join('');
}

function readInfo(index) {
    const element = getData[index];
    document.querySelector('.showImg').src = element.picture;
    document.querySelector('#showName').value = element.employeeName;
    document.querySelector("#showAge").value = element.employeeAge;
    document.querySelector("#showCity").value = element.employeeCity;
    document.querySelector("#showEmail").value = element.employeeEmail;
    document.querySelector("#showPhone").value = element.employeePhone;
    document.querySelector("#showPost").value = element.employeePost;
    document.querySelector("#showsDate").value = element.startDate;
}

function editInfo(index) {
    const element = getData[index];
    isEdit = true;
    editId = index;
    imgInput.src = element.picture;
    userName.value = element.employeeName;
    age.value = element.employeeAge;
    city.value = element.employeeCity;
    email.value = element.employeeEmail;
    phone.value = element.employeePhone;
    post.value = element.employeePost;
    sDate.value = element.startDate;
    submitBtn.innerText = "Update";
    modalTitle.innerText = "Update The Form";
}

function deleteInfo(index) {
    if (confirm("Are you sure want to delete?")) {
        getData.splice(index, 1);
        localStorage.setItem("userProfile", JSON.stringify(getData));
        showInfo();
    }
}

// Initial Load
showInfo();
