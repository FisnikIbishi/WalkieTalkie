let groupList = [
	{
		id: 1,
		name: "Programmers",
		members: [0, 1, 3],
		pic: "/home/images/0923102932_aPRkoW.jpg"
	},
	{
		id: 2,
		name: "Web Developers",
		members: [0, 2],
		pic: "home/images/1921231232_Ag1asE.png"
	},
	{
		id: 3,
		name: "notes",
		members: [0],
		pic: "home/images/8230192232_asdEWq2.png"
	}
];

let MessageUtils = {
	getByGroupId: (groupId) => {
		return messages.filter(msg => msg.recvIsGroup && msg.recvId === groupId);
	},
	getByContactId: (contactId) => {
		return messages.filter(msg => {
			return !msg.recvIsGroup && ((msg.sender === user.id && msg.recvId === contactId) || (msg.sender === contactId && msg.recvId === user.id));
		});
	},
	getMessages: () => {
		return messages;
	},
	changeStatusById: (options) => {
		messages = messages.map((msg) => {
			if (options.isGroup) {
				if (msg.recvIsGroup && msg.recvId === options.id) msg.status = 2;
			} else {
				if (!msg.recvIsGroup && msg.sender === options.id && msg.recvId === user.id) msg.status = 2;
			}
			return msg;
		});
	},
	addMessage: (msg) => {
		msg.id = messages.length + 1;
		messages.push(msg);
	}
};


let getById = (id, parent) => parent ? parent.getElementById(id) : getById(id, document);
let getByClass = (className, parent) => parent ? parent.getElementsByClassName(className) : getByClass(className, document);

const DOM = {
	chatListArea: getById("chat-list-area"),
	messageArea: getById("message-area"),
	inputArea: getById("input-area"),
	input: getById("input"),
	chatList: getById("chat-list"),
	messages: getById("messages"),
	chatListItem: getByClass("chat-list-item"),
	messageAreaName: getById("name", this.messageArea),
	messageAreaPic: getById("pic", this.messageArea),
	messageAreaNavbar: getById("navbar", this.messageArea),
	messageAreaDetails: getById("details", this.messageAreaNavbar),
	messageAreaOverlay: getByClass("overlay", this.messageArea)[0],
	messageInput: getById("input"),
	profileSettings: getById("profile-settings"),
	profilePic: getById("profile-pic"),
	profilePicInput: getById("profile-pic-input"),
	inputName: getById("input-name"),
	username: getById("username"),
	userIdLabel: getById("userIdLabel"),
	displayPic: getById("display-pic"),
	userNameInput: getById("user_name"),
	btnSend: getById("btn-send"),
};


let mClassList = (element) => {
	return {
		add: (className) => {
			element.classList.add(className);
			return mClassList(element);
		},
		remove: (className) => {
			element.classList.remove(className);
			return mClassList(element);
		},
		contains: (className, callback) => {
			if (element.classList.contains(className))
				callback(mClassList(element));
		}
	};
};

// 'areaSwapped' is used to keep track of the swapping
// of the main area between chatListArea and messageArea
// in mobile-view
let areaSwapped = false;

// 'chat' is used to store the current chat
// which is being opened in the message area
let chat = null;

// this will contain all the chats that is to be viewed
// in the chatListArea
let chatList = [];

// this will be used to store the date of the last message
// in the message area
let lastDate = "";

// 'populateChatList' will generate the chat list
// based on the 'messages' in the datastore
let populateChatList = () => {
	chatList = [];

	// 'present' will keep track of the chats
	// that are already included in chatList
	// in short, 'present' is a Map DS
	let present = {};

	MessageUtils.getMessages()
		.sort((a, b) => mDate(a.time).subtract(b.time))
		.forEach((msg) => {
			let chat = {};
			chat.isGroup = msg.recvIsGroup;
			chat.msg = msg;

			if (msg.recvIsGroup) {
				chat.group = groupList.find((group) => (group.id === msg.recvId));
				chat.name = chat.group.name;
			} else {
				chat.contact = contactList.find((contact) => (msg.sender !== user.id) ? (contact.id === msg.sender) : (contact.id === msg.recvId));
				chat.name = chat.contact.name;
			}

			chat.unread = (msg.sender !== user.id && msg.status < 2) ? 1 : 0;

			if (present[chat.name] !== undefined) {
				chatList[present[chat.name]].msg = msg;
				chatList[present[chat.name]].unread += chat.unread;
			} else {
				present[chat.name] = chatList.length;
				chatList.push(chat);
			}
		});
};

let viewChatList = () => {
	DOM.chatList.innerHTML = "";
	chatList
		.sort((a, b) => mDate(b.msg.time).subtract(a.msg.time))
		.forEach((elem, index) => {
			let statusClass = elem.msg.status < 2 ? "far" : "fas";
			let unreadClass = elem.unread ? "unread" : "";

			DOM.chatList.innerHTML += `
		<div class="chat-list-item d-flex flex-row w-100 p-2 border-bottom ${unreadClass}" onclick="generateMessageArea(this, ${index})">
			<img src="${elem.isGroup ? elem.group.pic : elem.contact.pic}" alt="Profile Photo" class="img-fluid rounded-circle mr-2" style="height:50px;">
			<div class="w-50">
				<div class="name">${elem.name}</div>
				<div class="small last-message">${elem.isGroup ? contactList.find(contact => contact.id === elem.msg.sender).number + ": " : ""}${elem.msg.sender === user.id ? "<i class=\"" + statusClass + " fa-check-circle mr-1\"></i>" : ""} ${elem.msg.body}</div>
			</div>
			<div class="flex-grow-1 text-right">
				<div class="small time">${mDate(elem.msg.time).chatListFormat()}</div>
				${elem.unread ? "<div class=\"badge badge-success badge-pill small\" id=\"unread-count\">" + elem.unread + "</div>" : ""}
			</div>
		</div>
		`;
		});
};

let generateChatList = () => {
	populateChatList();
	viewChatList();
};

let addDateToMessageArea = (date) => {
	DOM.messages.innerHTML += `
	<div class="mx-auto my-2 bg-primary text-white small py-1 px-2 rounded">
		${date}
	</div>
	`;
};

let addMessageToMessageArea = (msg) => {
	let msgDate = mDate(msg.time).getDate();
	const inputDate = new Date(msg.time);

	const parsedDate = inputDate.toLocaleDateString("en-GB", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric"
	});


	if (lastDate != msgDate) {
		addDateToMessageArea(parsedDate);
		lastDate = msgDate;
	}

	let htmlForGroup = `
	<div class="small font-weight-bold text-primary">
		0
	</div>
	`;

	let sendStatus = `<i class="${msg.status < 2 ? "far" : "fas"} fa-check-circle"></i>`;

	DOM.messages.innerHTML += `
	<div class="align-self-${msg.sender === user.id ? "end self" : "start"} p-1 my-1 mx-3 rounded bg-white shadow-sm message-item">
		<div class="options">
			<a href="#"><i class="fas fa-angle-down text-muted px-2"></i></a>
		</div>
		${chat.isGroup ? htmlForGroup : ""}
		<div class="d-flex flex-row">
			<div class="body m-1 mr-2">${msg.body}</div>
			<div class="time ml-auto small text-right flex-shrink-0 align-self-end text-muted" style="width:75px;">
				${mDate(msg.time).getTime()}
				${(msg.sender === user.id) ? sendStatus : ""}
			</div>
		</div>
	</div>
	`;

	DOM.messages.scrollTo(0, DOM.messages.scrollHeight);
};

let generateMessageArea = (elem, chatIndex) => {
	chat = chatList[chatIndex];

	mClassList(DOM.inputArea).contains("d-none", (elem) => elem.remove("d-none").add("d-flex"));
	mClassList(DOM.messageAreaOverlay).add("d-none");

	[...DOM.chatListItem].forEach((elem) => mClassList(elem).remove("active"));

	mClassList(elem).contains("unread", () => {
		MessageUtils.changeStatusById({
			isGroup: chat.isGroup,
			id: chat.isGroup ? chat.group.id : chat.contact.id
		});
		mClassList(elem).remove("unread");
		mClassList(elem.querySelector("#unread-count")).add("d-none");
	});

	if (window.innerWidth <= 575) {
		mClassList(DOM.chatListArea).remove("d-flex").add("d-none");
		mClassList(DOM.messageArea).remove("d-none").add("d-flex");
		areaSwapped = true;
	} else {
		mClassList(elem).add("active");
	}

	DOM.messageAreaName.innerHTML = chat.name; // put here
	DOM.userIdLabel.innerHTML = chat.contact.id;
	DOM.messageAreaPic.src = chat.isGroup ? chat.group.pic : chat.contact.pic;

	// Message Area details ("last seen ..." for contacts / "..names.." for groups)
	if (chat.isGroup) {
		let groupMembers = groupList.find(group => group.id === chat.group.id).members;
		let memberNames = contactList
			.filter(contact => groupMembers.indexOf(contact.id) !== -1)
			.map(contact => contact.id === user.id ? "You" : contact.name)
			.join(", ");

		DOM.messageAreaDetails.innerHTML = `${memberNames}`;
	} else {
		DOM.messageAreaDetails.innerHTML = `last seen ${mDate(chat.contact.lastSeen).lastSeenFormat()}`;
	}

	let msgs = chat.isGroup ? MessageUtils.getByGroupId(chat.group.id) : MessageUtils.getByContactId(chat.contact.id);

	DOM.messages.innerHTML = "";

	lastDate = "";
	msgs
		.sort((a, b) => mDate(a.time).subtract(b.time))
		.forEach((msg) => addMessageToMessageArea(msg));

	document.getElementById('btn-call').style.display = "inline-block";
};

let showChatList = () => {
	if (areaSwapped) {
		mClassList(DOM.chatListArea).remove("d-none").add("d-flex");
		mClassList(DOM.messageArea).remove("d-flex").add("d-none");
		areaSwapped = false;
	}
};

//send button check and read color
function checkInput() {
	var input = document.getElementById('input');
	var sendButton = document.querySelector('.send-button');

	if (input.value.trim() !== '') {
		sendButton.classList.add('active');
	} else {
		sendButton.classList.remove('active');
	}
}
function resetInput() {
	var sendButton = document.querySelector('.send-button');
	sendButton.classList.remove('active'); // Remove the 'active' class
}


let sendMessage = (msg) => {
	addMessageToMessageArea(msg);
	MessageUtils.addMessage(msg);
	generateChatList();
	resetInput()
};


let showProfileSettings = () => {
	DOM.profileSettings.style.left = 0;
	DOM.profilePic.src = user.pic;
	//DOM.inputName.value = user.name;
};

let hideProfileSettings = () => {
	DOM.profileSettings.style.left = "-110%";
	DOM.username.innerHTML = user.name;
};

window.addEventListener("resize", e => {
	if (window.innerWidth > 575) showChatList();
});

function createMessageAndSend(socket) {
	let value = DOM.messageInput.value;
	DOM.messageInput.value = "";
	if (value === "") return;

	let msg = {
		sender: user.id,
		body: value,
		time: mDate().toString(),
		status: 1,
		recvId: chat.isGroup ? chat.group.id : chat.contact.id,
		recvIsGroup: chat.isGroup
	};

	sendMessage(msg);
	socket.emit('new_message', msg);
}

async function uploadAvatar(file) {
	const formData = new FormData();
	formData.append("image", file);

	const response = await fetch('http://localhost:3000/api/uploadAvatar', {
		method: 'POST',
		body: formData
	});

	if (response.ok) {
		const savedFile = await response.json();
		DOM.displayPic.src = '/public/images/' + savedFile.filename;
		DOM.profilePic.stc = '/public/images/' + savedFile.filename;
	}
}

let init = () => {
	DOM.username.innerHTML = user.name;
	DOM.profilePic.addEventListener("click", () => DOM.profilePicInput.click());
	DOM.profilePicInput.addEventListener("change", () => {
		const file = DOM.profilePicInput.files[0];
		uploadAvatar(file);
	});
	DOM.inputName.addEventListener("blur", (e) => user.name = e.target.value);
	generateChatList();
	getFriendRequests();

	const socket = io();

	socket.on(user.id + '_new_message', (msg) => {
		sendMessage(msg);
	});

	socket.on(user.id + '_add-friend', (friendId) => {
		const requestsCount = document.querySelector('.friend-requests-count');
		const count = parseInt(requestsCount.textContent)
		requestsCount.textContent = count + 1;
		document.getElementById("friend-request-icon").style.display = "inline-block";
		getFriendRequests();
	});

	document.getElementById('input').addEventListener('keypress', function (e) {
		if (e.key === 'Enter') {
			e.preventDefault();
			createMessageAndSend(socket);
		}
	});

	DOM.btnSend.addEventListener("click", (e) => {
		e.preventDefault();
		createMessageAndSend(socket);
	});
};

function showPopup() {
	document.getElementById('overlay').style.display = 'block';
	document.getElementById('popup').style.display = 'block';
}

function hidePopup() {
	document.getElementById('overlay').style.display = 'none';
	document.getElementById('popup').style.display = 'none';
}

function showVideoPopup() {
	document.getElementById('overlay').style.display = 'block';
	document.getElementById('video-popup').style.display = 'block';
}

function hideVideoPopup() {
	document.getElementById('overlay').style.display = 'none';
	document.getElementById('video-popup').style.display = 'none';
}

const search = async (username) => {
	const response = await fetch('http://localhost:3000/api/users/' + username);
	const users = await response.json(); //extract JSON from the http response
	const list = document.getElementById('user_list');

	list.innerHTML = "";
	users.forEach(user => {
		const listItem = document.createElement("li");

		// Create an <img> element for the avatar
		const avatarImg = document.createElement("img");
		avatarImg.src = user.avatar;
		listItem.appendChild(avatarImg);

		// Create a <span> element for the name
		const nameSpan = document.createElement("span");
		nameSpan.textContent = user.username;
		listItem.appendChild(nameSpan);

		// Create a <button> element
		const button = document.createElement("input");
		button.type = "submit";
		button.value = "Add Friend";
		button.addEventListener("click", function (event) {
			event.preventDefault();
			addFriend(button, user._id)
		});
		listItem.appendChild(button);

		// Add the <li> element to the <ul>
		list.appendChild(listItem);
	});
}

const getFriendRequests = async (username) => {
	const response = await fetch('http://localhost:3000/api/friendRequests');
	const friendRequests = await response.json(); //extract JSON from the http response

	const count = friendRequests.length;
	if (count > 0) {
		document.querySelector('.friend-requests-count').textContent = count;
		document.getElementById("friend-request-icon").style.display = "inline-block";
	}

	friendRequests.forEach(request => {
		var node = document.createElement("li"); // Create a <li> node
		node.id = "li_" + request._id
		node.innerHTML = `
			<div class="friend-request">
				<img src="friend_avatar.jpg" alt="Friend Avatar">
				<div class="friend-details">
					<p class="friend-name">	${request.sender.username}</p>
					<p class="friend-message">Would you like to be friends?</p>
					<button class="accept-button" onclick="acceptRequest('${request.sender._id}', '${node.id}')">Accept</button>
					<button class="reject-button" onclick="rejectRequest('${request.sender._id}', '${node.id}')">Reject</button>
				</div>
			</div>
			`;
		document.getElementById("friendRequestsList").appendChild(node);
	});
}

async function acceptRequest(senderId, nodeId) {
	const response = await fetch('http://localhost:3000/api/friendRequests/accept', {
		method: 'POST',
		body: JSON.stringify({
			senderId: senderId
		}),
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (response.ok) {
		const data = await response.json();

		contactList.push(
			{
				id: data.newFriend._id,
				name: data.newFriend.username,
				number: "+91 91231 40293",
				pic: '/images/' + data.newFriend.avatar,
				lastSeen: ""
			}
		)

		messages.push(
			{
				id: data.newMessage1._id,
				sender: data.newMessage1.sender,
				body: data.newMessage1.message,
				time: data.newMessage1.created_at,
				status: 2,
				recvId: data.newMessage1.recipient,
				recvIsGroup: false
			})

		messages.push(
			{
				id: data.newMessage2._id,
				sender: data.newMessage2.sender,
				body: data.newMessage2.message,
				time: data.newMessage2.created_at,
				status: 2,
				recvId: data.newMessage2.recipient,
				recvIsGroup: false
			})


		document.getElementById(nodeId).remove();
		const friendRequests = document.querySelector('.friend-requests-count')
		const count = parseInt(friendRequests.textContent)
		if (count > 1) {
			friendRequests.textContent = count - 1;
		}
		else {
			document.getElementById("friend-request-icon").style.display = "none";
		}

		generateChatList();
	}
}

async function rejectRequest(senderId, nodeId) {
	const response = await fetch('http://localhost:3000/api/friendRequests/reject', {
		method: 'POST',
		body: JSON.stringify({
			senderId: senderId
		}),
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (response.ok) {
		document.getElementById(nodeId).remove();
		const friendRequests = document.querySelector('.friend-requests-count')
		const count = parseInt(friendRequests.textContent)
		if (count > 1) {
			friendRequests.textContent = count - 1;
		}
		else {
			document.getElementById("friend-request-icon").style.display = "none";
		}
	}
}

function searchUsers(event) {
	event.preventDefault();
	const username = document.getElementById('user_name').value;
	// Perform the logic to add a friend based on the entered username
	search(username);
	// Reset the form
	document.getElementById('addFriendForm').reset();
}

async function addFriend(button, id) {
	const response = await fetch('http://localhost:3000/api/users', {
		method: 'POST',
		body: JSON.stringify({
			userId: id
		}),
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (response.ok) {
		const data = await response.json(); //extract JSON from the http response
		button.style.display = "none";
		socket.emit('add-friend', id);
	}
}

function showFriendRequestsPopup() {
	document.getElementById('overlay').style.display = 'block';
	document.getElementById('friendRequestsPopup').style.display = 'block';
}

function hideFriendRequestsPopup() {
	document.getElementById('overlay').style.display = 'none';
	document.getElementById('friendRequestsPopup').style.display = 'none';
}

function searchFriendRequests() {
	const input = document.getElementById('friendSearchInput');
	const filter = input.value.toLowerCase();
	const friendRequests = document.querySelectorAll('.friend-request');

	friendRequests.forEach((request) => {
		const name = request.querySelector('.friend-name').innerText.toLowerCase();
		if (name.includes(filter)) {
			request.style.display = 'flex';
		} else {
			request.style.display = 'none';
		}
	});

}
function showUserListPopup() {
	document.getElementById('overlay').style.display = 'block';
	document.getElementById("userListPopup").style.display = "block";
}

function hideUserListPopup() {
	document.getElementById('overlay').style.display = 'none';
	document.getElementById("userListPopup").style.display = "none";
}


// Add event listener to the search input
document.getElementById('friendSearchInput').addEventListener('input', searchFriendRequests);

window.addEventListener("load", (event) => {
	init();
});