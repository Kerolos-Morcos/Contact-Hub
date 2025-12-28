// Selecting Modal For Styling
const addModal = document.getElementById("addModal");
const addBtn = document.getElementById("addBtn");
// Selecting Contacts Card Container
const contactCardsRow = document.getElementById("contactCardsRow");
//  Modal Inputs
const contactFullName = document.getElementById("contactFullName");
const contactPhoneNumber = document.getElementById("contactPhoneNumber");
const contactEmail = document.getElementById("contactEmail");
const contactAddress = document.getElementById("contactAddress");
const groupSelect = document.getElementById("groupSelect");
const contactNotes = document.getElementById("contactNotes");
const contactFavorite = document.getElementById("contactFavorite");
const contactEmergency = document.getElementById("contactEmergency");
// Modal Title
const modalTitle = document.querySelector(".modal-title");
// Modal Save Button
const saveContactBtn = document.getElementById("saveContactBtn");
// Image Handler
const avatarInput = document.getElementById("contactAvatar");
const avatarImg = document.getElementById("avatarImg");
const avatarIcon = document.querySelector(".fa-user");
// const avatarPreviewContainer = document.querySelector(".avatar-preview");
const avatarInitials = document.getElementById("avatarInitials");
// Handle no-contacts
const noContacts = document.querySelector(".no-contacts");
// All Contacts Length
const allContactsLength = document.querySelector(".all-contacts p span");
// Total, Favorite & Emergency Stats
const totalStats = document.querySelector(".totalStats");
const favoriteStats = document.querySelector(".favoriteStats");
const emergencyStats = document.querySelector(".emergencyStats");
// Favorite & Emergency Buttons & Contacts
const emergencyIcon = document.getElementById("emergencyIcon");
const favIcon = document.getElementById("favIcon");
// Aside List
const favoritesContainer = document.querySelector(".contacts-list");
const emergencyContainer = document.querySelector(".emergency-container");
const noFavorites = document.querySelector(".favorites-card-body");
const noEmergency = document.getElementById("noEmergency");
// Search Input
const searchInput = document.getElementById("searchInput");

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
function handleAvatar(file, callback) {
  const reader = new FileReader();
  reader.onload = function (e) {
    callback(e.target.result);
  };
  reader.readAsDataURL(file);
}
let avatarURL = null;
avatarInput.addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;
  handleAvatar(file, function (dataURL) {
    avatarURL = dataURL;
    avatarImg.src = avatarURL;
    avatarImg.classList.remove("d-none");
    avatarInitials.classList.add("d-none");
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
  if (updateId === null) {
    validateInputs();
    addContactFun();
  } else {
    saveUpdatedContact();
  }
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
  // inputs
  contactFullName.value = "";
  contactPhoneNumber.value = "";
  contactEmail.value = "";
  contactAddress.value = "";
  groupSelect.value = "";
  contactNotes.value = "";
  contactFavorite.checked = false;
  contactEmergency.checked = false;
  // avatar
  avatarImg.src = "";
  avatarImg.classList.add("d-none");
  //  name
  avatarInitials.textContent = "";
  avatarInitials.classList.add("d-none");
  avatarURL = null;
  avatarInput.value = "";
  // icon
  avatarIcon.style.display = "block";
}

// Add Contact Function
addBtn.addEventListener("click", () => {
  modalTitle.textContent = "Add Contact";
  clearModalInputs();
});
let contacts = [];
let contactInfo = {};
function addContactFun() {
  updateId = null;
  contactInfo = {
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
  // console.log(contactInfo);
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
  getItemsLength();
  displayContactFun();
  displayFavoriteContacts();
  displayEmergencyContacts();
}
handleDisplayLocalStorage();

// Items Length
function getItemsLength() {
  let favoriteContacts = contacts.filter((c) => c.isFavorite);
  let emergencyContacts = contacts.filter((c) => c.isEmergency);
  allContactsLength.innerHTML = contacts.length;
  totalStats.innerHTML = contacts.length;
  favoriteStats.innerHTML = favoriteContacts.length;
  emergencyStats.innerHTML = emergencyContacts.length;
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

// Update Contact By Id Fun
let updateId = null;
function updateContactFun(id) {
  updateId = id;
  clearModalInputs();
  modalTitle.textContent = "Edit Contact";
  updateContactInputs(id);
  const modalInstance = new bootstrap.Modal(addModal);
  modalInstance.show();
}

// Update Contact Inputs
function updateContactInputs(id) {
  for (let i = 0; i < contacts.length; i++) {
    if (contacts[i].id === id) {
      contactFullName.value = contacts[i].name;
      contactPhoneNumber.value = contacts[i].phone;
      contactEmail.value = contacts[i].email;
      contactAddress.value = contacts[i].address;
      groupSelect.value = contacts[i].group;
      contactNotes.value = contacts[i].notes;
      contactFavorite.checked = contacts[i].isFavorite;
      contactEmergency.checked = contacts[i].isEmergency;

      if (contacts[i].avatar.startsWith("data:")) {
        avatarURL = contacts[i].avatar;
        avatarImg.src = avatarURL;
        avatarImg.classList.remove("d-none");
        avatarInitials.classList.add("d-none");
        avatarIcon.style.display = "none";
      } else {
        // initials
        avatarInitials.textContent = contacts[i].avatar;
        avatarInitials.classList.remove("d-none");
        avatarImg.classList.add("d-none");
        avatarIcon.style.display = "none";
        avatarURL = null;
      }
      break;
    }
  }
}

// Save Updated Contact Button Function
function saveUpdatedContact() {
  for (let i = 0; i < contacts.length; i++) {
    if (contacts[i].id === updateId) {
      contacts[i].name = contactFullName.value.trim();
      contacts[i].phone = contactPhoneNumber.value.trim();
      contacts[i].email = contactEmail.value.trim();
      contacts[i].address = contactAddress.value.trim();
      contacts[i].group = groupSelect.value;
      contacts[i].notes = contactNotes.value.trim();
      contacts[i].isFavorite = contactFavorite.checked;
      contacts[i].isEmergency = contactEmergency.checked;
      contacts[i].avatar = avatarURL
        ? avatarURL
        : getInitials(contactFullName.value);
      break;
    }
  }
  localStorage.setItem("contacts", JSON.stringify(contacts));
  handleDisplayLocalStorage();
  Swal.fire({
    title: "Updated!",
    text: "Contact updated successfully.",
    icon: "success",
    confirmButtonText: "Ok",
  });
  closeModal();
  clearModalInputs();
  editId = null;
}

// HTML Structure Display
function displayContactFun(list = contacts) {
  let box = "";
  for (let i = 0; i < list.length; i++) {
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
                              list[i].avatar.startsWith("data:")
                                ? `<img src="${list[i].avatar}" class="avatar-img" />`
                                : `<div class="avatar-initials ${getAvatarColorByName(
                                    list[i].name
                                  )}">${list[i].avatar}</div>`
                            }
                           </div>
                              <!-- Emergency -->
                              ${
                                list[i].isEmergency
                                  ? `<span class="avatar-badge badge-danger">
                                    <i class="fa-solid fa-heart-pulse"></i>
                                  </span>`
                                  : ""
                              }
                              
                              <!-- Favorite -->
                              ${
                                list[i].isFavorite
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
                                ${list[i].name}
                              </h6>
                              <div class="d-flex align-items-center gap-2">
                                <span
                                  class="icon-box d-flex align-items-center justify-content-center phone"
                                >
                                  <i class="fa-solid fa-phone"></i>
                                </span>
                                <span class="text-muted small text-truncate">
                                  ${list[i].phone}
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
                                ${list[i].email}
                              </span>
                            </div>
                            <!-- Location -->
                            ${
                              list[i].address
                                ? `<div class="d-flex align-items-center gap-2">
                                <span class="icon-box location">
                                  <i class="fa-solid fa-location-dot"></i>
                                </span>
                                <span class="text-muted small text-truncate">
                                  ${list[i].address}
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
                            }[list[i].group] || ""
                          }
                            ${
                              list[i].isEmergency
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
                              href="tel:${list[i].phone}"
                              class="icon-btn icon-emerald"
                              title="Call"
                            >
                              <i class="fa-solid fa-phone"></i>
                            </a>
                            <button
                              onclick="window.location.href='mailto:${
                                list[i].email
                              }'"
                              class="icon-btn icon-violet"
                              title="Email"
                            >
                              <i class="fa-solid fa-envelope"></i>
                            </button>
                          </div>
                          <!-- Right actions -->
                          <div
                            class="d-flex align-items-center gap-custom padding-all"
                          >
                            <button
                              onclick="toggleFavorite(${list[i].id})"
                              class="icon-btn icon-amber"
                              title="Favorite"
                              id="favBtn"
                            >
                            ${
                              list[i].isFavorite
                                ? `<i class="fa-solid icon-amber fa-star"></i>`
                                : `<i class="fa-regular icon-gray fa-star"></i>`
                            }
                            </button>

                            <button
                              onclick="toggleEmergency(${list[i].id})"
                              class="icon-btn icon-rose"
                              title="Emergency"
                              id="emergencyIcon"
                            >
                            ${
                              list[i].isEmergency
                                ? `<i class="fa-solid icon-rose fa-heart-pulse"></i>`
                                : `<i class="fa-regular icon-gray fa-heart"></i>`
                            }
                            </button>

                            <button
                              onclick="updateContactFun(${list[i].id})"
                              class="icon-btn icon-gray hover-indigo"
                              title="Edit"
                            >
                              <i class="fa-solid fa-pen" id="editIcon"></i>
                            </button>

                            <button
                              onclick="deleteContactFun(${list[i].id})"
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

// Toggle Favorite
function toggleFavorite(id) {
  for (let i = 0; i < contacts.length; i++) {
    if (contacts[i].id === id) {
      contacts[i].isFavorite = !contacts[i].isFavorite;
      localStorage.setItem("contacts", JSON.stringify(contacts));
      handleDisplayLocalStorage();
      break;
    }
  }
}
// Display Favorite Contacts
function displayFavoriteContacts() {
  const favoriteContacts = contacts.filter((c) => c.isFavorite);
  if (favoriteContacts.length === 0) {
    favoritesContainer.classList.add("d-none");
    noFavorites.classList.remove("d-none");
    return;
  }
  favoritesContainer.classList.remove("d-none");
  noFavorites.classList.add("d-none");
  let box = "";
  for (let i = 0; i < favoriteContacts.length; i++) {
    box += `
      <div class="contact-item">
        <div class="contact-avatar">
          ${
            favoriteContacts[i].avatar.startsWith("data:")
              ? `<img src="${favoriteContacts[i].avatar}" />`
              : `<div style="width:40px; height:40px;" class="avatar-initials rounded-3 ${getAvatarColorByName(
                  favoriteContacts[i].name
                )}">${favoriteContacts[i].avatar}</div>`
          }
        </div>
        <div class="contact-info mt-2">
          <h4 class="contact-name">${favoriteContacts[i].name}</h4>
          <p class="contact-phone">${favoriteContacts[i].phone}</p>
        </div>
        <a href="tel:${favoriteContacts[i].phone}" class="call-btn">
          <i class="fa-solid fa-phone"></i>
        </a>
      </div>
    `;
  }
  favoritesContainer.innerHTML = box;
}

// Toggle Emergency
function toggleEmergency(id) {
  for (let i = 0; i < contacts.length; i++) {
    if (contacts[i].id === id) {
      contacts[i].isEmergency = !contacts[i].isEmergency;
      localStorage.setItem("contacts", JSON.stringify(contacts));
      handleDisplayLocalStorage();
      break;
    }
  }
}
// Display Emergency Contacts
function displayEmergencyContacts() {
  const emergencyContacts = contacts.filter((c) => c.isEmergency);
  if (emergencyContacts.length === 0) {
    emergencyContainer.classList.add("d-none");
    noEmergency.classList.remove("d-none");
    return;
  }
  emergencyContainer.classList.remove("d-none");
  noEmergency.classList.add("d-none");
  let box = "";
  for (let i = 0; i < emergencyContacts.length; i++) {
    box += `
      <div class="contact-item">
        <div class="contact-avatar">
          ${
            emergencyContacts[i].avatar.startsWith("data:")
              ? `<img src="${emergencyContacts[i].avatar}" />`
              : `<div style="width:40px; height:40px;" class="avatar-initials rounded-3 ${getAvatarColorByName(
                  emergencyContacts[i].name
                )}">${emergencyContacts[i].avatar}</div>`
          }
        </div>
        <div class="contact-info mt-2">
          <h4 class="contact-name">${emergencyContacts[i].name}</h4>
          <p class="contact-phone">${emergencyContacts[i].phone}</p>
        </div>
        <a href="tel:${
          emergencyContacts[i].phone
        }" class="call-btn emergency-call-btn">
          <i class="fa-solid fa-phone"></i>
        </a>
      </div>
    `;
  }
  emergencyContainer.innerHTML = box;
}

// Search Function
function searchFun() {
  let searchValue = searchInput.value.trim().toLowerCase();
  if (searchValue === "") {
    displayContactFun(contacts);
    return;
  }
  let searchedContacts = [];
  for (let i = 0; i < contacts.length; i++) {
    if (
      contacts[i].name.toLowerCase().includes(searchValue) ||
      contacts[i].email.toLowerCase().includes(searchValue) ||
      contacts[i].phone.includes(searchValue)
    ) {
      noContacts.classList.replace("d-block", "d-none");
      searchedContacts.push(contacts[i]);
    } else {
      noContacts.classList.replace("d-none", "d-block");
    }
  }

  displayContactFun(searchedContacts);
}

// Changing Initial Text Avatar Bg-Color By First Char of Name
function getAvatarColorByName(name) {
  if (!name) return "avatar-blue";

  const firstChar = name.trim()[0].toUpperCase();

  if (firstChar >= "A" && firstChar <= "F") {
    return "avatar-blue";
  }

  if (firstChar >= "G" && firstChar <= "L") {
    return "avatar-rose";
  }

  if (firstChar >= "M" && firstChar <= "R") {
    return "avatar-amber";
  } else return "avatar-violet";
}
