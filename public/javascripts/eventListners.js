// Variable to track if the group click event is enabled
let groupClickEvent = true;
let imageData = null;

// DOM elements
const msgbox = document.querySelector(".msg");
const menuButton = document.getElementById('menu-button');
const dropdownMenu = document.querySelector('.dropdown');
const newGroup = document.querySelector("#menu-item-0");
const openProfile = document.querySelector("#openProfile");
const logoutUser = document.querySelector("#menu-item-2");
const overlay = document.getElementById('overlay');
const addUserToGroup = document.querySelector('.addUser');
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
  overlay.classList.remove('left-[-100%]');
  var template = `<header class="w-full h-1/6 bg-[#202C33] flex items-center justify-start gap-8 text-slate-300 px-5 pt-10 text-xl font-medium">
  <i class="cursor-pointer ri-arrow-left-line"></i>
  <p>New Group</p>
</header>
<div class="h-5/6 w-full flex flex-col items-center justify-start bg-[#111B21]">
  <div id="imagePreview" class="h-[33%] cursor-pointer w-[45%] bg-[url(../images/group.png)] bg-center bg-cover rounded-full mt-7" onclick="selectFile()"></div>
  <form action="/create/groupId" method="post" enctype="multipart/form-data">
    <input hidden id="chooseImage" name="groupImage" type="file" onchange="getImage(this)">
  <div class="w-full flex flex-col items-center justify-start h-[25%] mt-14 px-8">
    <div class="w-full text-slate-400 flex items-center justify-between text-lg">
      <input id="groupName" type="text" placeholder="Group Name" onclick="groupHover()" class="group bg-transparent outline-none">
      <i class="ri-emoji-sticker-line"></i>
    </div>
    </form>
    <div id="groupBorder" class="w-full border-t-2 mt-1 border-slate-400"></div>
    <div id="groupConfirm" class="bg-[#00A884] text-3xl font-medium text-slate-200 rounded-full mt-10 items-center justify-center flex h-12 w-12">
      <i class="ri-check-line cursor-pointer"></i>
    </div>
  </div>`
  overlay.innerHTML = template;

  document.querySelector('.ri-arrow-left-line').addEventListener("click", () => {
    overlay.classList.add('left-[-100%]');
  })

  const groupConfirm = document.getElementById('groupConfirm');
  let groupName = document.getElementById('groupName');
  
  groupConfirm.addEventListener("click", () => {
    const groupObject = {
      groupName: groupName.value,
      groupCreator: loggedInUser,
    } 

    const formData = new FormData();
    if (imageData) formData.append('groupImage', imageData);
    // console.log(imageData)
    formData.append('groupObject', JSON.stringify(groupObject)); // Convert object to string

    // Send group creation request to the server
    axios.post('http://localhost:3000/create/groupId', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(response => {
        appendChat(response.data._id,response.data.groupProfileImage,
          response.data.groupName,"");
        overlay.classList.add('left-[-100%]');
      })
  const imagePreview = document.getElementById("imagePreview");

  groupName.value = "";
  imagePreview.classList.add("bg-[url(../images/group.png)]");
  imagePreview.style.backgroundImage = ``;
  imageData = null;
  })
});

openProfile.addEventListener('click', () => {
  overlay.classList.remove('left-[-100%]');
  var template = `<header class="w-full h-1/6 bg-[#202C33] flex items-center justify-start gap-8 text-slate-300 px-5 pt-10 text-xl font-medium">
  <i class="cursor-pointer ri-arrow-left-line"></i>
  <p>Profile</p>
</header> 
<div class="h-5/6 w-full flex flex-col items-center justify-start bg-[#111B21]">
  <div id="imagePreview" class="h-[33%] cursor-pointer w-[45%] bg-[url(${loggedInUserImage})] bg-center bg-cover rounded-full mt-7" onclick="selectFile()"></div>
  <form action="/change/profile" class="w-full -mt-4" method="post" enctype="multipart/form-data">
    <input hidden id="chooseImage" name="userImage" type="file" onchange="getImage(this)">
    <div class="w-full flex flex-col items-start justify-start h-[25%] mt-14 px-8">
    <p class="text-xs text-green-500 mb-3">Your Name</p>
    <div class="w-full text-slate-400 flex items-center justify-between text-lg">
      <input id="userName" type="text" readonly="true" placeholder="${loggedInUserAlias}" onclick="groupHover()" class="group bg-transparent outline-none">
      <i onclick="document.querySelector('#groupBorder').classList.toggle('hidden'); document.getElementById('userName').toggleAttribute('readonly')" class="ri-pencil-line"></i>
    </div>
  </form>
  <div id="groupBorder" class="w-full border-t-2 hidden mt-1 border-slate-400"></div>
  <p class="text-[#8696A0] text-sm mt-6">This is not your username or pin. This name will be visible to your Whatsapp contacts.</p>
  <div class="w-full flex flex-col items-start justify-start h-[25%] mt-10 ">
    <p class="text-xs text-green-500 mb-5">About</p>
    <div class="w-full text-slate-400 flex items-center justify-between text-lg">
      <input id="userBio" type="text" readonly="true" placeholder="${loggedInUsername}" onclick="groupHover()" class="group bg-transparent outline-none">
      <i onclick="document.querySelector('#groupBorder2').classList.toggle('hidden'); document.getElementById('userBio').toggleAttribute('readonly')" class="ri-pencil-line"></i>
    </div>
    <div id="groupBorder2" class="w-full border-t-2 hidden mt-1 border-slate-400"></div>
  </div>
  <div id="userConfirm" class="hidden bg-[#00A884] text-3xl font-medium text-slate-200 rounded-full mt-10 items-center justify-center h-12 w-12">
      <i class="ri-check-line cursor-pointer"></i>
    </div>
  </div>`
  overlay.addEventListener("keydown", (event) => {if (event.key == 'Enter') userConfirm.click();})
  overlay.innerHTML = template;

  document.querySelector('.ri-arrow-left-line').addEventListener("click", () => {
    overlay.classList.add('left-[-100%]');
  })

  const userConfirm = document.getElementById('userConfirm');

  userConfirm.addEventListener("click", () => {
    const formData = new FormData();
    const userDets = { }
    let userName = document.getElementById('userName');
    let userBio = document.getElementById('userBio');

  
    if (userName.value) {
      userDets.displayName = userName.value;
      userDets.loggedInUser = loggedInUser;
      userDets.about = userBio ? userBio.value : '';

      formData.append('userDets', JSON.stringify(userDets));
    }
  
    if (imageData) {
      formData.append('userImage', imageData);
    }
  
    axios.post('http://localhost:3000/change/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
    })
    .then(response => {
      if (response.status === 200) {
        window.location.href = response.request.responseURL;
      }
      overlay.classList.add('left-[-100%]');
    })
    .catch(error => {
      console.error('Error:', error);
    });
    const imagePreview = document.getElementById("imagePreview");
  
    userName.value = "";
    imagePreview.style.backgroundImage = ``;
  });  
});

// Event listener for file reader load
reader.onload = (e) => {
  const imagePreview = document.getElementById("imagePreview");
  imagePreview.classList.remove("bg-[url(../images/group.png)]");
  imagePreview.style.backgroundImage = `url(${e.target.result})`;
}; 

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

document.querySelector('.status').addEventListener('click', function(){
  overlay.classList.toggle('left-[-100%]');
  // overlay.innerHTML = 
});