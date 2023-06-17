function showFriendRequestsPopup() {
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('friendRequestsPopup').style.display = 'block';
  }
  
  function hideFriendRequestsPopup() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('friendRequestsPopup').style.display = 'none';
  }
  // Assuming you have a variable `friendRequestsCount` representing the number of friend requests
  var friendRequestsCount = 2; // Replace with your actual friend requests count

  // Update the friend requests count in the HTML
  document.querySelector('.friend-requests-count').textContent = friendRequestsCount;

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
  
  // Add event listener to the search input
  document.getElementById('friendSearchInput').addEventListener('input', searchFriendRequests);
  
  