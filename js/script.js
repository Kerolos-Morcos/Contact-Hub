// Selecting Modal For Styling
const addModal = document.getElementById("addModal");
// Selecting Contacts Card Container
const contactCardsRow = document.getElementById("contactCardsRow");
//  Modal Inputs
const contactAvatar = document.getElementById("contactAvatar");
const contactFullName = document.getElementById("contactFullName");
const contactPhoneNumber = document.getElementById("contactPhoneNumber");
const contactEmail = document.getElementById("contactEmail");
const contactAddress = document.getElementById("contactAddress");
const groupSelect = document.getElementById("groupSelect");
const contactNotes = document.getElementById("contactNotes");
const contactFavorite = document.getElementById("contactFavorite");
const contactEmergency = document.getElementById("contactEmergency");
// Modal Save Button
const saveContactBtn = document.getElementById("saveContactBtn");
// Image Handler
const avatarInput = document.getElementById("contactAvatar");
const avatarPreview = document.getElementById("avatarPreview");
const avatarIcon = document.querySelector(".fa-user");
// Handle no-contacts
const noContacts = document.querySelector(".no-contacts");
// All Contacts Length
const allContactsLength = document.querySelector(".all-contacts p span");
// Total, Favorite & Emergency Stats
const totalStats = document.querySelector(".totalStats");
const favoriteStats = document.querySelector(".favoriteStats");
const emergencyStats = document.querySelector(".emergencyStats");

// Regular Expressions For Validation
const regex = {
  contactFullName: /^[a-zA-Z ]{2,50}$/,
  contactPhoneNumber: /^(010|011|012|015)[0-9]{8}$/,
  contactEmail: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
};

// Validation checker function
function validation(input) {
  const isValid = regex[input.id].test(input.value.trim());
  if (isValid) {
    input.classList.remove("is-invalid");
    input.nextElementSibling.classList.replace("d-block", "d-none");
  } else {
    input.classList.add("is-invalid");
    input.nextElementSibling.classList.replace("d-none", "d-block");
  }
  return isValid;
}

// Image Handler
let avatarURL = null;
function handleAvatar(file, callback) {
  const reader = new FileReader();
  reader.onload = function (e) {
    callback(e.target.result);
  };
  reader.readAsDataURL(file);
}
avatarInput.addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;
  handleAvatar(file, function (dataURL) {
    avatarURL = dataURL;
    avatarPreview.src = avatarURL;
    avatarPreview.classList.remove("d-none");
    avatarIcon.style.display = "none";
  });
});

// Handle no image selection
function getInitials(name) {
  const words = name.trim().split(" ");
  let fName = words[0][0].toUpperCase();
  let lName = words[words.length - 1][0].toUpperCase();
  let fullName = fName + lName;
  if (words.length === 1) {
    return fName;
  } else {
    return fullName;
  }
}

// validate inputs function
function validateInputs() {
  if (!validation(contactFullName)) {
    Swal.fire({
      title: "Invalid Name!",
      text: "Name must be 2-50 letters only.",
      icon: "error",
      confirmButtonText: "Ok",
    });
    return;
  } else if (!validation(contactPhoneNumber)) {
    Swal.fire({
      title: "Invalid Phone!",
      text: "Phone must be 11 digits (start: 010, 011, 012, or 015).",
      icon: "error",
      confirmButtonText: "Ok",
    });
    return;
  } else if (!validation(contactEmail)) {
    Swal.fire({
      title: "Invalid Email!",
      text: "Please enter a valid email address.",
      icon: "error",
      confirmButtonText: "Ok",
    });
    return;
  }
}

// Save Contact
saveContactBtn.addEventListener("click", saveContact);
function saveContact() {
  validateInputs();
  addContactFun();
}

// Cancel Button
cancelBtn.addEventListener("click", clearModalInputs);

// Close Modal
function closeModal() {
  const modalInstance = bootstrap.Modal.getInstance(addModal);
  modalInstance.hide();
  //   addModal.style.display = "none";
  //   addModal.classList.remove("show");
  //   document.body.classList.remove("modal-open");
  // document.body.style.overflow = "auto";
  // document.body.style.paddingRight = "";
  //   const backdrop = document.querySelector(".modal-backdrop");
  //   if (backdrop) backdrop.remove();
}

// Clear Modal Inputs
function clearModalInputs() {
  contactFullName.value = "";
  contactPhoneNumber.value = "";
  contactEmail.value = "";
  contactAddress.value = "";
  groupSelect.value = "";
  contactNotes.value = "";
  contactFavorite.checked = false;
  contactEmergency.checked = false;
  avatarPreview.classList.add("d-none");
  avatarPreview.src = "";
  avatarIcon.style.display = "block";
}

// Add Contact Function
let contacts = [];
function addContactFun() {
  let contactInfo = {
    id: Date.now(),
    name: contactFullName.value.trim(),
    phone: contactPhoneNumber.value.trim(),
    email: contactEmail.value.trim(),
    address: contactAddress.value.trim(),
    group: groupSelect.value,
    notes: contactNotes.value.trim(),
    isFavorite: contactFavorite.checked,
    isEmergency: contactEmergency.checked,
    avatar: avatarURL ? avatarURL : getInitials(contactFullName.value),
  };
  let existingPN = contacts.find((c) => c.phone === contactInfo.phone);
  if (existingPN) {
    Swal.fire({
      title: "Error!",
      text: `Contact with this phone number already exists with name: ${existingPN.name}`,
      icon: "error",
      confirmButtonText: "Ok",
    });
    return;
  }
  contacts.push(contactInfo);
  //   LocalStorage
  localStorage.setItem("contacts", JSON.stringify(contacts));
  console.log(contactInfo);
  handleDisplayLocalStorage();
  Swal.fire({
    title: "Success!",
    text: "Contact added successfully.",
    icon: "success",
    confirmButtonText: "Ok",
  });
  closeModal();
  clearModalInputs();
}

// Display Contact Function
function handleDisplayLocalStorage() {
  let contactsLocalStorage = JSON.parse(localStorage.getItem("contacts"));
  contacts = contactsLocalStorage ? contactsLocalStorage : [];
  if (contacts.length === 0) {
    noContacts.classList.replace("d-none", "d-block");
  } else {
    noContacts.classList.replace("d-block", "d-none");
  }
  getItemsLength(contacts);
  displayContactFun();
}
handleDisplayLocalStorage();

// Items Length 
function getItemsLength(items) {
  allContactsLength.innerHTML = items.length;
  totalStats.innerHTML = items.length;
  favoriteStats.innerHTML = Array(items.isFavorite).length;
  emergencyStats.innerHTML = Array(items.isEmergency).length;
}

// Deleting Contact By Id Fun
function deleteContactFun(id) {
  for (let i = 0; i < contacts.length; i++) {
    if (contacts[i].id === id) {
      Swal.fire({
        title: "Delete Contact?",
        text: `Are you sure you want to delete ${contacts[i].name}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Yes, delete it!",
      }).then((choice) => {
        if (choice.isConfirmed) {
          contacts.splice(i, 1);
          localStorage.setItem("contacts", JSON.stringify(contacts));
          handleDisplayLocalStorage();
          Swal.fire({
            title: "Deleted!",
            text: "Contact has been deleted.",
            icon: "success",
            showConfirmButton: false,
          });
        }
      });
      break;
    }
  }
}

// HTML Structure Display
function displayContactFun() {
  let box = "";
  for (let i = 0; i < contacts.length; i++) {
    box += `
    <div class="col-12 col-sm-6 col-xl-6">
        <!-- card -->
        <div class="card custom-card h-100 d-flex flex-column pt-3 fixed-card-contact">
            <div class="card-body-custom flex-grow-1">
                <!-- card header -->
                <div class="d-flex align-items-start gap-3 padding-all">
                    <!-- Avatar -->
                    <div class="position-relative flex-shrink-0">
                        <div class="avatar-wrapper">
                            ${
                              contacts[i].avatar.startsWith("data:")
                                ? `<img src="${contacts[i].avatar}" class="avatar-img" />`
                                : `<div class="avatar-initials">${contacts[i].avatar}</div>`
                            }
                           </div>

                              <!-- Emergency -->
                              ${
                                contacts[i].isEmergency
                                  ? `<span class="avatar-badge badge-danger">
                                    <i class="fa-solid fa-heart-pulse"></i>
                                  </span>`
                                  : ""
                              }
                              
                              <!-- Favorite -->
                              ${
                                contacts[i].isFavorite
                                  ? `<span class="avatar-badge badge-warning">
                                <i class="fa-solid fa-star"></i>
                              </span>`
                                  : ""
                              }
                            </div>
                            <!-- Content -->
                            <div class="flex-grow-1 pt-1 text-truncate">
                              <h6
                                class="mb-1 fw-semibold text-dark text-truncate"
                              >
                                ${contacts[i].name}
                              </h6>

                              <div class="d-flex align-items-center gap-2">
                                <span
                                  class="icon-box d-flex align-items-center justify-content-center phone"
                                >
                                  <i class="fa-solid fa-phone"></i>
                                </span>
                                <span class="text-muted small text-truncate">
                                  ${contacts[i].phone}
                                </span>
                              </div>
                            </div>
                          </div>

                          <!-- card contact mail & location -->
                          <div class="mt-3 info-list padding-all">
                            <!-- Email -->
                            <div class="d-flex align-items-center gap-2">
                              <span class="icon-box email">
                                <i class="fa-solid fa-envelope"></i>
                              </span>
                              <span class="text-muted small text-truncate">
                                ${contacts[i].email}
                              </span>
                            </div>
                            <!-- Location -->
                            ${
                              contacts[i].address
                                ? `<div class="d-flex align-items-center gap-2">
                                <span class="icon-box location">
                                  <i class="fa-solid fa-location-dot"></i>
                                </span>
                                <span class="text-muted small text-truncate">
                                  ${contacts[i].address}
                                </span>
                              </div>`
                                : ``
                            }
                          </div>
                          <!-- card group -->
                          <div
                            class="d-flex flex-wrap gap-custom mt-3 padding-all mb-1"
                          >
                          ${
                            {
                              Family: `<span class="badge-custom badge-family">
                              Family
                            </span>`,
                              Friends: `<span class="badge-custom badge-friends">
                              Friends
                            </span>`,
                              Work: `<span class="badge-custom badge-work">
                              Work
                            </span>`,
                              School: `<span class="badge-custom badge-school">
                              School
                            </span>`,
                              Other: `<span class="badge-custom badge-other">
                              Other
                            </span>`,
                            }[contacts[i].group] || ""
                          }
                            ${
                              contacts[i].isEmergency
                                ? `<span class="badge-custom badge-emergency">
                                  <i class="badge-icon fa-solid fa-heart-pulse"></i>
                                  Emergency
                                </span>`
                                : ""
                            }
                          </div>
                        </div>
                        <!-- card footer -->
                        <div
                          class="card-footer-custom mt-2"
                        >
                          <!-- Left actions -->
                          <div
                            class="d-flex align-items-center gap-custom padding-all"
                          >
                            <a
                              href="tel:${contacts[i].phone}"
                              class="icon-btn icon-emerald"
                              title="Call"
                            >
                              <i class="fa-solid fa-phone"></i>
                            </a>

                            <button
                              onclick="window.location.href='mailto:${
                                contacts[i].email
                              }'"
                              class="icon-btn icon-violet"
                              title="Email"
                              href="mailto:${contacts[i].email}"
                            >
                              <i class="fa-solid fa-envelope"></i>
                            </button>
                          </div>
                          <!-- Right actions -->
                          <div
                            class="d-flex align-items-center gap-custom padding-all"
                          >
                            <button
                              onclick="toggleFavorite('contact_1765991405056_914')"
                              class="icon-btn icon-amber"
                              title="Favorite"
                            >
                              <i class="fa-solid fa-star"></i>
                            </button>

                            <button
                              onclick="toggleEmergency('contact_1765991405056_914')"
                              class="icon-btn icon-rose"
                              title="Emergency"
                            >
                              <i class="fa-solid fa-heart-pulse"></i>
                            </button>

                            <button
                              onclick="editContactHandler('contact_1765991405056_914')"
                              class="icon-btn icon-gray hover-indigo"
                              title="Edit"
                            >
                              <i class="fa-solid fa-pen"></i>
                            </button>

                            <button
                              onclick="deleteContactFun(${contacts[i].id})"
                              class="icon-btn icon-gray hover-rose"
                              title="Delete"
                            >
                              <i class="fa-solid fa-trash"></i>
                            </button>
                          </div>
                        </div>
                        <!-- card footer -->
                      </div>
                      <!-- card -->
                    </div>
    `;
  }

  contactCardsRow.innerHTML = box;
}
