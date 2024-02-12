// Variable to track if the group click event is enabled
let groupClickEvent = true;

// DOM elements
const msgbox = document.querySelector(".msg");
const menuButton = document.getElementById('menu-button');
const dropdownMenu = document.querySelector('.dropdown');
const newGroup = document.querySelector("#menu-item-0");
const openProfile = document.querySelector("#menu-item-1");
const logoutUser = document.querySelector("#menu-item-2");
const groupOverlay = document.getElementById('groupOverlay');
const imagePreview = document.getElementById("imagePreview");
const inputFile = document.getElementById('chooseImage');
let groupName = document.getElementById('groupName');
const groupConfirm = document.getElementById('groupConfirm');
const addUserToGroup = document.querySelector('.addUser');
let imageData = null; 
const reader = new FileReader();
const searchOverlay = document.querySelector('.addUserOverlay');
const addMemberBtn = document.querySelector('#addMembers');
const addMemInput = document.querySelector('#addMemInput');
const clearSearch = document.querySelector('clear-search');

// Event listener for sending messages on Enter key press
msgbox.addEventListener("keypress", (event)=>{
  if (event.key === "Enter" && msgbox.value !== "") {
    sender(msgbox.value);

    // Emit private message event to the server
    const msgObject = {
      Message: msgbox.value,
      toUserId: currentChattingUser,
      fromUser: loggedInUser
    }
    socket.emit('privateMessage', msgObject);
    msgbox.value = ""
  }
});  

// Event listener for menu button click
document.addEventListener('DOMContentLoaded', () => {
  menuButton.setAttribute('aria-expanded', 'false');
  dropdownMenu.classList.add('hidden');
  
  menuButton.addEventListener('click', function () {
    const expanded = menuButton.getAttribute('aria-expanded') === 'true' || false;
    menuButton.setAttribute('aria-expanded', !expanded);
    dropdownMenu.classList.toggle('hidden');
  });

  // Close the dropdown menu when clicking outside of it
  document.addEventListener('click', function (event) {
    if (!menuButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
      menuButton.setAttribute('aria-expanded', 'false');
      dropdownMenu.classList.add('hidden');
    }
    // Hide user search overlay when clicking outside of it
    if (!searchOverlay.contains(event.target)  && event.target != addUserToGroup){
      searchOverlay.classList.add('hidden');
      selectedUsers = [];
      addMemberBtn.classList.add('opacity-70');
    }
  });
});

// Event listener for new group button click
newGroup.addEventListener('click', () => {
  groupOverlay.classList.remove('left-[-100%]');
});

// Event listener for image preview click
imagePreview.addEventListener("click", ()=>{
  inputFile.click();
});

// Event listener for file input change
inputFile.addEventListener("change", (event) => {
  imageData = event.target.files[0]; 
  if (imageData) {
    reader.readAsDataURL(imageData);
  }
});

// Event listener for file reader load
reader.onload = (e) => {
  imagePreview.classList.remove("bg-[url(../images/group.png)]");
  imagePreview.style.backgroundImage = `url(${e.target.result})`;
}; 

// Event listener for group confirmation button click
groupConfirm.addEventListener("click", () => {
    const groupObject = {
      groupName: groupName.value,
      groupCreator: loggedInUser,
    } 

    const formData = new FormData();
    formData.append('groupImage', imageData);
    formData.append('groupObject', JSON.stringify(groupObject)); // Convert object to string

    // Send group creation request to the server
    axios.post('http://localhost:3000/create/groupId', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'groupObject': groupObject
      },
    })
      .then(response => {
        appendChat(response.data._id,response.data.groupProfileImage,
          response.data.groupName,"");
        groupOverlay.classList.add('left-[-100%]');
      })

  groupName.value = "";
  imagePreview.classList.add("bg-[url(../images/group.png)]");
  imagePreview.style.backgroundImage = ``;
})

// Function to handle group hover effect
function groupHover() {
  document.querySelector("#groupBorder").classList.remove("border-slate-400")
  document.querySelector("#groupBorder").classList.add("border-[#00A884]")
}

// Event listener for add user to group button click
addUserToGroup.addEventListener("click", () => {
    searchOverlay.classList.remove("hidden");
})

// Event listener for user search input change
addMemInput.addEventListener("change", ()=> {
  let searchDetails = {
    loggedInUsername,
    query: addMemInput.value
  }
  socket.emit( "getUserInfo" , searchDetails)
  addMemInput.value = '';
});

// Event listener for add member button click
addMemberBtn.addEventListener("click", () => {
  if (selectedUsers.length > 0) {
    const addUsers = {
      users: selectedUsers,
      group:  currentChattingUser
    }
    // Send request to add users to the group
    socket.emit('addUsers', addUsers);
    searchOverlay.classList.toggle("hidden");
    selectedUsers = [];
    addMemberBtn.classList.add('opacity-70');
  }
})

// Event listener for clear search button click
// clearSearch.addEventListener("click", () => {
//   addMemInput.value = "";
// })
