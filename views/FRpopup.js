function showFriendRequestsPopup() {
    document.getElementById('friendRequestsOverlay').style.display = 'block';
    document.getElementById('friendRequestsPopup').style.display = 'block';
  }
  
  function hideFriendRequestsPopup() {
    document.getElementById('friendRequestsOverlay').style.display = 'none';
    document.getElementById('friendRequestsPopup').style.display = 'none';
  }
  // Assuming you have a variable `friendRequestsCount` representing the number of friend requests
  var friendRequestsCount = 2; // Replace with your actual friend requests count

  // Update the friend requests count in the HTML
  document.querySelector('.friend-requests-count').textContent = friendRequestsCount;
  