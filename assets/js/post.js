const API_URL = "http://localhost:8080/posts";

    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        const list = document.getElementById("postList");
        data.forEach(post => {
          const item = document.createElement("li");
          item.className = "plaza-list-list__item plaza-list-list__item--new";
          item.innerHTML = `
            <div class="plaza-list-list__header">
              <h4 class="plaza-list-list__title">${post.title}</h4>
              <p class="plaza-list-list__category">NEW</p>
            </div>
            <p class="plaza-list-list__text">${post.text}</p>
            <p class="plaza-list-list__name">${post.name}님</p>
            <div class="plaza-list-list__container">
              <button class="plaza-list-like__button">👍</button>
              <span class="plaza-list-like__text">추천</span>
            </div>
          `;
          list.appendChild(item);
        });
      })
      .catch(err => {
        console.error("게시글 불러오기 실패:", err);
      });