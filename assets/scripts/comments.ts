export function initializeComments() {
    const comments = [
        {
            avatar: "avatar1.jpg",
            name: "Student Name Goes Here",
            date: "Oct 1, 2021",
            text: "Lorem Aime set Emet, erehtae Adecture Adfkjdddfjdkj ajdf j jka jdf jka jdfkj kjfkjadfkjdksf jajk jdlk jalkdfd",
        },
        {
            avatar: "avatar1.jpg",
            name: "Student Name Goes Here",
            date: "Oct 1, 2021",
            text: "Lorem Aime set Emet, erehtae Adecture Adfkjdddfjdkj ajdf j jka jdf jka jdfkj kjfkjadfkjdksf jajk jdlk jalkdfd",
        },
        {
            avatar: "avatar1.jpg",
            name: "Student Name Goes Here",
            date: "Oct 1, 2021",
            text: "Lorem Aime set Emet, erehtae Adecture Adfkjdddfjdkj ajdf j jka jdf jka jdfkj kjfkjadfkjdksf jajk jdlk jalkdfd",
        },
    ];

    const commentsContainer = document.querySelector(".comments");

    if (commentsContainer) {
        comments.forEach((comment) => {
            const commentItem = document.createElement("div");
            commentItem.className = "comment";

            commentItem.innerHTML = `
                <div class="avatar">
                    <img src="/assets/images/avatars/${comment.avatar}" alt="user avatar">
                </div>
                <div class="content">
                    <div class="name">${comment.name}</div>
                    <span class="date">${comment.date}</span>
                    <p>${comment.text}</p>
                </div>
            `;

            commentsContainer.appendChild(commentItem);
        });
    }
}