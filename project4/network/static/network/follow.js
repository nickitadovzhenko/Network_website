document.addEventListener("DOMContentLoaded", function () {
  const followButton = document.getElementById("follow");
  const followsCount = document.getElementById('followsCount');
  let initialCount = parseInt(followsCount.dataset.initialCount, 10);
    followButton.addEventListener("click", function () { 
      const userId = followButton.dataset.userId;
      const action = followButton.innerHTML.toLowerCase() === "follow" ? "follow" : "unfollow";
      updateSubscription(userId, action);
  });

  function updateSubscription(userId, action) {
    const url =
      action === "follow"
        ? `/follow_user/${userId}`
        : `/unfollow_user/${userId}`;
    const csrf_token = window.csrf_token;
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Requested-With": "XMLHttpRequest",
      "X-CSRFToken": csrf_token,
    };

    const options = {
      method: "POST",
      headers: headers,
    };

    fetch(url, options)
      .then((response) => response.json())
      .then((data) => {
          if (data.success) {
          
            if (action === "follow") {
              followButton.innerHTML = "Unfollow";
              followButton.className = "btn btn-danger btn-sm";
              updateFollowedCount(1);
              initialCount++;
              
            }
            if (action === 'unfollow') {
              followButton.innerHTML = "Follow";
              followButton.className = 'btn btn-primary btn-sm'
              updateFollowedCount(-1);
              initialCount--;
            } 
        
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  }

  function updateFollowedCount(change) {
    const newCount = initialCount + change;
    followsCount.innerHTML = `<strong>Followed Users:</strong> ${newCount}`;
  }
});
